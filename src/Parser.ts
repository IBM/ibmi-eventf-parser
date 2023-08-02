/**
 * IBM Confidential
 * OCO Source Materials
 * 5900-AN9
 * (c) Copyright IBM Corp. 2021
 * The source code for this program is not published or otherwise divested of its trade secrets,
 * irrespective of what has been deposited with the U.S. Copyright Office.
 */

import * as path from "path";
import { IRecordT } from './record/IRecordT';
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

class SourceFile {
  constructor(private location: string, private browseMode: boolean) { }

  public getLocation(): string {
    return this.location;
  }

  public isReadOnly(): string {
    return this.browseMode.toString();
  }

  public setReadOnly(value: boolean) {
    // A member should be opened in browse mode
    this.browseMode = value;
  }
}

class LookAheadReader implements ISequentialFileReader {
  private iSequentialFileReader: ISequentialFileReader;
  private peakLine: string | undefined;

  constructor(iSequentialFileReader: ISequentialFileReader) {
    this.iSequentialFileReader = iSequentialFileReader;
  }

  readNextLine(): string | undefined {
    if (this.peakLine) {
      const nextLine = this.peakLine;
      this.peakLine = undefined;

      return nextLine;
    } else {
      return this.iSequentialFileReader.readNextLine();
    }
  }

  peakNextRecordType() {
    this.peakLine = this.iSequentialFileReader.readNextLine();
    return this.peakLine?.split(/\s+/).filter(token => token !== "")[0];
  }
}

export class Parser {
  static LOGGER: any;

  private exception: Error;
  private processor: IProcessor;
  private lastOutputFile: SourceFile | undefined;
  private currentOutputFile: SourceFile;

  // Map of File ID to SourceFile
  private sourceTable: Map<String, SourceFile>;

  constructor() {
    this.sourceTable = new Map<String, SourceFile>();
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

  private log(content: string) {
    if (process.env.DEBUG) {
      console.log(content);
    }
  }

  private logError(content: Error) {
    console.log(content);
  }

  parse(fileReader: ISequentialFileReader, ccsid: number, markerCreator?: IMarkerCreator) {
    let word: string;
    let fileId: string;

    if (!this.processor) {
      this.processor = new ExpansionProcessor();
    }
    // Allows processor to initialize prior to parsing
    this.processor?.doPreProcessing();

    const reader = new LookAheadReader(fileReader);
    let lineText = reader.readNextLine();

    while (lineText) {
      let st = lineText.split(/\s+/).filter(token => token !== "");
      let i = 0

      while (i < st.length) {
        word = st[i++];

        if (word === IRecordT.ERROR_INFORMATION) {
          const version = st[i++];
          fileId = st[i++];

          let fileProcessed = this.sourceTable[fileId];
          if (!fileProcessed) {
            if (fileId === ('000')) {
              let location001 = this.sourceTable['001'];
              if (location001) {
                fileProcessed = location001;
              } else {
                fileProcessed = new SourceFile('', false);
              }
            } else {
              fileProcessed = new SourceFile('', false);
            }
          }

          const annotationClass = st[i++];
          const line = st[i++];
          const lineStart = st[i++];
          const charStart = st[i++];
          const lineEnd = st[i++];
          const charEnd = st[i++];
          const id = st[i++];
          const severityText = st[i++];
          const severity = st[i++];

          const totalMessageLen = st[i++];
          const message = this.getUntilTheEndOfTheLine(i, st);

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

          const record = new ErrorInformationRecord(version, fileId, annotationClass, line, lineStart, charStart,
            lineEnd, charEnd, id, severityText, severity, totalMessageLen, message);
          record.setFileName(fileProcessed.getLocation());

          if (this.processor) {
            this.processor.processErrorRecord(record);
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
        } else if (word === (IRecordT.FILE_ID)) {
          let browseMode = false;
          const version = st[i++];
          fileId = st[i++];
          const lineNumber = st[i++];
          const locationLength = parseInt(st[i++]);
          let location = lineText.substring(28);

          this.log(`EventsFileParser: location from line 1 = ${location}`);
          let nextRecordType = reader.peakNextRecordType();
          while (nextRecordType === IRecordT.FILE_CONT) {
            lineText = reader.readNextLine();
            if (lineText) {
              st = lineText.split(' ');
              location += (lineText.substring(28));
              this.log(`EventsFileParser: location from line 1 = ${location}`);
              nextRecordType = reader.peakNextRecordType();
            } else {
              throw new Error('Events file has incorrect format. End of file encountered before location length satisfied.');
            }
          }

          // Attempt to parse the FILEID string backwards in order to find the timestamp and temp flag
          // Timestamp should only be made of digits if it was parsed correctly. Otherwise, just ignore it.
          let timestamp = location.substring(location.length - 16, location.length - 2);
          try {
            parseInt(timestamp);
          } catch (e: any) {
            timestamp = '';
          }
          const tempFlag = location.charAt(location.length - 1);

          // Makes sure that the Temp Flag is the last character in the FILEID event and that it is preceded by a space
          const isSpaceBeforeTempFlag = location.charAt(location.length - 2) === ' ';
          if (tempFlag === '1' && isSpaceBeforeTempFlag) {
            browseMode = true;
          } else {
            browseMode = false;
          }

          location = location.substring(0, location.length - 17);
          location = this.resolveRelativePath(location);

          // If <servername> is included as part of the name, get rid of it
          const index = location.indexOf('>');
          if (index !== -1 && location.indexOf('<') === 0) {
            // If on local connection, try to use the servername on the FILEID line to get the actual remote connection
            if (markerCreator) {
              markerCreator.updateConnectionName(location, index);
            }

            location = location.substring(index + 1);
          }

          // If this file was the output file of the previous block, then it should be opened in Browse Mode
          const fileEntry = new SourceFile(location, browseMode);
          if ((this.lastOutputFile && location === (this.lastOutputFile.getLocation()))
            || this.currentOutputFile && location === (this.currentOutputFile.getLocation())) {
            fileEntry.setReadOnly(true);
          }

          // If the file ID is 999, then this is the new output file
          if ('999' === fileId) {
            if (!this.lastOutputFile) {
              this.lastOutputFile = this.currentOutputFile = fileEntry;
            } else {
              this.lastOutputFile = this.currentOutputFile;
              this.currentOutputFile = fileEntry;
            }
          }

          this.sourceTable[fileId] = fileEntry;

          if (this.processor) {
            // Pass FILEID information to processor
            const record = new FileIDRecord(version, fileId, lineNumber, locationLength.toString(), location, timestamp.toString(), tempFlag);
            try {
              this.processor.processFileIDRecord(record);
            } catch (e: any) {
              this.logError(e.message ? e.message : e);
              this.exception = e.message ? e.message : e;
            }
          }

          break;
        } else if (word === (IRecordT.FILE_END)) {
          // Pass FILEEND information to processor
          if (this.processor) {
            const version = st[i++];
            const fileId = st[i++];
            const expansion = st[i++];
            const record = new FileEndRecord(version, fileId, expansion);

            try {
              this.processor?.processFileEndRecord(record);
            } catch (e: any) {
              this.logError(e.message ? e.message : e);
              this.exception = e.message ? e.message : e;
            }
          }

          break;
        } else if (word === (IRecordT.EXPANSION)) {
          // Pass EXPANSION information to processor
          if (this.processor) {
            const record = new ExpansionRecord(st[i++], st[i++], st[i++], st[i++], st[i++], st[i++], st[i++]);
            this.processor?.processExpansionRecord(record);
          }

          break;
        } else if (word === (IRecordT.TIMESTAMP)) {
          // Pass TIMESTAMP information to processor
          if (this.processor) {
            let record = new TimestampRecord(st[i++], st[i++]);
            this.processor?.processTimestampRecord(record);
          }

          break;
        } else if (word === (IRecordT.PROCESSOR)) {
          // Pass PROCESSOR information to processor
          if (this.processor) {
            let record = new ProcessorRecord(st[i++], st[i++], st[i++]);

            try {
              this.processor?.processProcessorRecord(record);
            } catch (e: any) {
              this.logError(e.message ? e.message : e);
              this.exception = e.message ? e.message : e;
            }
          }

          break;
        } else {
          // The following Events are being ignored since they are not used.
          // If needed, we could parse those Events and pass them to an IISeriesEventsFileProcessor.
          if (word === (IRecordT.PROGRAM) || word === (IRecordT.MAP_DEFINE) || word === (IRecordT.MAP_END)
            || word === (IRecordT.MAP_START) || word === (IRecordT.FEEDBACK_CODE) || word.trim().length === 0) {
            break;
          } else {
            throw new Error(`Events file has incorrect format. Unexpected line type. LT=${lineText}`);
          }
        }
      }

      if (lineText) {
        lineText = reader.readNextLine();
      }
    }

    if (this.processor) {
      // Allows processor to consume the information after completion of parsing and writing of markers
      try {
        this.processor?.doPostProcessing();
      } catch (ex) {
        this.exception = ex;
      }
    }
  }

  private resolveRelativePath(location: string) {
    // Normalize the location in case the location is a relative path
    location = path.normalize(location).toString();

    // After normalization, / will be change to \ for windows path,
    // so have to change it back.
    location = location.replace(/\\/g, '/');
    return location;
  }

  public getException(): Error {
    return this.exception;
  }

  public setProcessor(processor: IProcessor) {
    this.processor = processor;
  }

  /**
   * After all records in the Events File are processed, this method is called to
   * return all the errors from all the processor blocks (ProcessorBlock) of the
   * Events File. Since each ProcessorBlock contains an array of errors, the result
   * will be flattened to an array.
   * 
   * @return An array of all parsed errors from all processor blocks of the Events File.
   */
  public getAllErrors(): ErrorInformationRecord[] {
    if (this.processor) {
      const nestedErrors = this.processor?.getAllErrors();
      const allErrors: ErrorInformationRecord[] = [].concat(...nestedErrors);

      return allErrors;
    } else {
      return [];
    }
  }

  /**
   * Get all file ID records.
   * 
   * @return An array of all file ID records.
   */
  public getAllFileIDRecords(): FileIDRecord[] {
    if (this.processor) {
      return this.processor.getAllFileIDRecords();
    } else {
      return [];
    }
  }
}