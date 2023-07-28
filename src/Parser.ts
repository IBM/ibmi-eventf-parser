
import * as path from "path";
import { IRecordType } from './record/IRecordType';
import { TimestampRecord } from './record/TimestampRecord';
import { ProcessorRecord } from './record/ProcessorRecord';
import { FileIDRecord } from './record/FileIDRecord';
import { IProcessor } from './IProcessor';
import { ISequentialFileReader } from './ISequentialFileReader';
import { IMarkerCreator } from './IMarkerCreator';
import { ErrorInformationRecord } from './record/ErrorInformationRecord';
import { FileEndRecord } from './record/FileEndRecord';
import { ExpansionRecord } from './record/ExpansionRecord';
import { ExpansionProcessor } from './ExpansionProcessor';

export class Parser {
  static LOGGER: any;

  private _exception: Error;
  private _processor: IProcessor;
  private _lastOutputFile: SourceFile | undefined;
  private _currentOutputFile: SourceFile;
  private _sourceTable: Map<String, SourceFile>;

  constructor() {
    this._sourceTable = new Map<String, SourceFile>();
  }
  private getUntilTheEndOfTheLine(startIndex: number, st: string[]): string {
    let message = st[startIndex++];
    while (startIndex < st.length) {
      message = message.concat(' ');
      let curr_msg = st[startIndex++];
      message = message.concat(curr_msg);
    }
    return message;
  }

  private getRemainderAfterToken(str: string, tokenIndex: number): string {
    const tokens = str.split(' ');
    const remainderTokens = tokens.slice(tokenIndex + 1);
    const remainder = remainderTokens.join(' ');
    return remainder;
  }

  private log(content: string) {
    if (process.env.DEBUG) {
      console.log(content);
    }
  }

  private logError(content: Error) {
    console.log(content);
  }

  parse(reader: ISequentialFileReader, ccsid: number, markerCreator?: IMarkerCreator) {
    let word: string;
    let fileId: string;
    if (!this._processor) {
      this._processor = new ExpansionProcessor();
    }
    this._processor?.doPreProcessing();
    let lineText = reader.readNextLine();
    while (lineText) {
      let st = lineText.split(/\s+/).filter(token => token !== "");
      let i = 0
      while (i < st.length) {
        word = st[i++];
        if (word === IRecordType.ERROR_INFORMATION) {
          let version = st[i++];
          fileId = st[i++];
          let fileProcessed = this._sourceTable[fileId];
          if (!fileProcessed) {
            if (fileId === ('000')) {
              let location001 = this._sourceTable['001'];
              if (location001) {
                fileProcessed = location001;
              } else {
                fileProcessed = new SourceFile('', false);
              }
            } else {
              fileProcessed = new SourceFile('', false);
            }
          }
          let annotationClass = st[i++];
          let line = st[i++];
          let lineStart = st[i++];
          let charStart = st[i++];
          let lineEnd = st[i++];
          let charEnd = st[i++];
          let id = st[i++];
          let severityText = st[i++];
          let severity = st[i++];
          let totalMessageLen = st[i++];
          // TODO: Handle continued message lines.
          let message = this.getUntilTheEndOfTheLine(i, st);

          // let msgToken = st.nextToken('\n\r\f');
          // let msgTokenNl = new StringNL(msgToken, ccsid, true);

          // msgTokenNl = msgTokenNl.trim();
          // message = msgTokenNl.convertFromVisualToLogical(true);
          // let messageLenCorrect = true;
          // if (msgTokenNl.getByteLength() > totalMessageLen) {
          //   message = msgTokenNl.substring(0, totalMessageLen).convertFromVisualToLogical(true);
          // } else {
          //   while ((msgTokenNl.getByteLength() < totalMessageLen) && messageLenCorrect) {
          //     lineText = reader.readNextLine();
          //     if (lineText === null) {
          //       let log = 'EventsFileParser: ' + MessageFormat.format(Messages.EventsFileParser_Incomplete_Msg, totalMessageLen, totalMessageLen, message);
          //       this.LOGGER.info(log);
          //       messageLenCorrect = false;
          //       msgToken = '';
          //       break;
          //     }
          //     let stcont = new StringTokenizer(lineText);
          //     msgToken = stcont.nextToken('\n\r\f');
          //     msgTokenNl = new StringNL(msgToken, ccsid, true);
          //     stcont = new StringTokenizer(msgToken);
          //     let lineType = stcont.get(i++);
          //     if (lineType === (RecordType.TIMESTAMP) || lineType === (RecordType.PROCESSOR) || lineType === (RecordType.FILE_ID) || lineType === (RecordType.FILE_CONT) || lineType === (RecordType.FILE_END) || lineType === (RecordType.ERROR_INFORMATION) || lineType === (RecordType.PROGRAM) || lineType === (RecordType.MAP_DEFINE) || lineType === (RecordType.MAP_END) || lineType === (RecordType.MAP_START) || lineType === (RecordType.FEEDBACK_CODE)) {
          //       messageLenCorrect = false;
          //       break;
          //     }
          //     readMsgLen += msgTokenNl.getByteLength();
          //     message += ' ' + msgTokenNl.trim().convertFromVisualToLogical(true);
          //   }
          // }
          let record = new ErrorInformationRecord(version, fileId, annotationClass, line, lineStart, charStart,
            lineEnd, charEnd, id, severityText, severity, totalMessageLen, message);
          record.setFileName(fileProcessed.getLocation());
          if (this._processor) {
            this._processor.processErrorRecord(record);
          }
          if (markerCreator) {
            markerCreator.createMarker(record, record.getFileName(), fileProcessed.isReadOnly());
          }
          // if (!messageLenCorrect) {
          //   st = new StringTokenizer(msgToken);
          //   st = msgToken.split(" ")
          //   continue;
          // }
          break;
        } else {
          if (word === (IRecordType.FILE_ID)) {
            let browseMode = false;
            let version = st[i++];
            fileId = st[i++];
            let lineNumber = st[i++];
            let locationLength = parseInt(st[i++]);
            // location = st.nextToken('\n\r\f').trim();
            let location = this.getUntilTheEndOfTheLine(i, st);
            let timestamp = location.substring(location.length - 16, location.length - 2);
            try {
              parseInt(timestamp);
            } catch (e) {
              timestamp = '';
            }
            let tempFlag = location.charAt(location.length - 1);
            let isSpaceBeforeTempFlag = location.charAt(location.length - 2) === ' ';
            if (tempFlag === '1' && isSpaceBeforeTempFlag) {
              browseMode = true;
            } else {
              browseMode = false;
            }
            if (location.length > locationLength) {
              location = location.substring(0, locationLength);
              location = this.resolveRelativePath(location);
            } else {
              if (location.length < locationLength) {
                location = location.trim();
                let log = 'EventsFileParser: location from line 1 = ' + location;
                this.log(log);
                while (location.length < locationLength) {
                  lineText = reader.readNextLine();
                  if (lineText) {
                    st = lineText.split(' ');
                    if (st[i++] === (IRecordType.FILE_CONT)) {
                      st[i++];
                      st[i++];
                      st[i++];
                      st[i++];
                      location += (this.getUntilTheEndOfTheLine(i, st));
                      if (location.length > locationLength) {
                        location = location.substring(0, locationLength);
                        location = this.resolveRelativePath(location);
                      }
                      log = 'EventsFileParser: location from line 1 = ' + location;
                      this.log(log);
                    } else {
                      throw new Error('Events file has incorrect format.');
                    }
                  } else {
                    throw new Error('Events file has incorrect format. End of file encountered before location length satisfied.');
                  }
                }
              }
            }
            let index = location.indexOf('>');
            if (index !== -1 && location.indexOf('<') === 0) {
              if (markerCreator) {
                markerCreator.updateConnectionName(location, index);
              }
              location = location.substring(index + 1);
            }
            let fileEntry = new SourceFile(location, browseMode);
            if ((this._lastOutputFile && location === (this._lastOutputFile.getLocation())) || this._currentOutputFile && location === (this._currentOutputFile.getLocation())) {
              fileEntry.setReadOnly(true);
            }
            if ('999' === fileId) {
              if (!this._lastOutputFile) {
                this._lastOutputFile = this._currentOutputFile = fileEntry;
              } else {
                this._lastOutputFile = this._currentOutputFile;
                this._currentOutputFile = fileEntry;
              }
            }
            this._sourceTable[fileId] = fileEntry;
            if (this._processor) {
              let record = new FileIDRecord(version, fileId, lineNumber, locationLength.toString(), location, timestamp.toString(), tempFlag);
              try {
                this._processor.processFileIDRecord(record);
              } catch (e) {
                this.logError(e);
                this._exception = e;
              }
            }
            break;
          } else {
            if (word === (IRecordType.FILE_END)) {
              if (this._processor) {
                let version = st[i++];
                let fileId = st[i++];
                let expansion = st[i++];
                let record = new FileEndRecord(version, fileId, expansion);
                try {
                  this._processor?.processFileEndRecord(record);
                } catch (e) {
                  this.logError(e);
                  this._exception = e;
                }
              }
              break;
            } else {
              if (word === (IRecordType.EXPANSION)) {
                if (this._processor) {
                  let record = new ExpansionRecord(st[i++], st[i++], st[i++], st[i++], st[i++], st[i++], st[i++]);
                  // record.setVersion(st[i++]); // use split
                  // record.setInputFileID(st[i++]);
                  // record.setInputLineStart(st[i++]);
                  // record.setInputLineEnd(st[i++]);
                  // record.setOutputFileID(st[i++]);
                  // record.setOutputLineStart(st[i++]);
                  // record.setOutputLineEnd(st[i++]);
                  this._processor?.processExpansionRecord(record);
                }
                break;
              } else {
                if (word === (IRecordType.TIMESTAMP)) {
                  if (this._processor) {
                    let record = new TimestampRecord(st[i++], st[i++]);
                    // record.setVersion(st[i++]);
                    // record.setTimestamp(st[i++]);
                    this._processor?.processTimestampRecord(record);
                  }
                  break;
                } else {
                  if (word === (IRecordType.PROCESSOR)) {
                    if (this._processor) {
                      let record = new ProcessorRecord(st[i++], st[i++], st[i++]);
                      // record.setVersion(st[i++]);
                      // record.setOutputId(st[i++]);
                      // record.setLineClass(st[i++]);
                      try {
                        this._processor?.processProcessorRecord(record);
                      } catch (e) {
                        this.logError(e);
                        this._exception = e;
                      }
                    }
                    break;
                  } else {
                    if (word === (IRecordType.PROGRAM) || word === (IRecordType.MAP_DEFINE) || word === (IRecordType.MAP_END) || word === (IRecordType.MAP_START) || word === (IRecordType.FEEDBACK_CODE) || word.trim().length === 0) {
                      break;
                    } else {
                      throw new Error('Events file has incorrect format. Unexpected line type. LT=' + lineText);
                    }
                  }
                }
              }
            }
          }
        }
      }
      if (lineText) {
        lineText = reader.readNextLine();
      }
    }
    if (this._processor) {
      try {
        this._processor?.doPostProcessing();
      } catch (ex) {
        this._exception = ex;
      }
    }
  }
  private resolveRelativePath(location: string) {
    // normalize the location in case the location is a relative path
    location = path.normalize(location).toString();

    // after normalization, / will be change to \ for windows path
    // have to change it back
    location = location.replace(/\\/g, '/');
    return location;
  }
  getException() {
    return this._exception;
  }
  setProcessor(processor: IProcessor) {
    this._processor = processor;
  }
  getAllErrors() {
    if (this._processor) {
      let nestedErrors = this._processor?.getAllErrors();
      let allErrors: ErrorInformationRecord[] = [];
      let index = 0;
      while (index + 1 < nestedErrors.length) {
        // let iter1 = nestedErrors[index];
        let curErrorList = nestedErrors[index + 1];
        let index1 = 0;
        while (index1 + 1 < curErrorList.length) {
          // let iter2 = curErrorList[index1];
          let next = curErrorList[index1 + 1];
          allErrors.push(next);
          index1++;
        }
        index++;
      }
      // for (let iter1 = nestedErrors?.iterator(); iter1.hasNext();) {
      //   let curErrorList = iter1.next();
      //   for (let iter2 = curErrorList.iterator(); iter2.hasNext();) {
      //     allErrors.push((iter2.next()));
      //   }
      // }
      return allErrors;
    } else {
      return [];
    }
  }
  getAllFileIDRecords() {
    if (this._processor) {
      return this._processor.getAllFileIDRecords();
    } else {
      return [];
    }
  }
}

class SourceFile {
  constructor(private location: string, private browseMode: boolean) {
  }

  public getLocation(): string {
    return this.location;
  }

  public isReadOnly(): string {
    return this.browseMode.toString();
  }
  // a member should be opened in Browse Mode
  public setReadOnly(value: boolean) {
    this.browseMode = value;
  }
}