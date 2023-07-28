import { ErrorInformationRecord } from "./record/ErrorInformationRecord";
import { FileEndRecord } from "./record/FileEndRecord";
import { FileIDRecord } from "./record/FileIDRecord";
import { MapTable } from "./MapTable";
import { ProcessorRecord } from "./record/ProcessorRecord";

export class ProcessorBlock {
  readonly INPUT_FILE_ID: string = '001';
  private _errors: ErrorInformationRecord[];
  private _inputFile: FileIDRecord;
  private _outputFile: FileIDRecord;
  private _currentProcessor: ProcessorRecord;
  private _mappingTable: MapTable;
  private _previousProcessorBlock: ProcessorBlock;
  private _containsExpansionEvents: boolean = false;
  private _isFirstInEventsFile: boolean = false;
  private _mappingSupported: boolean = false;
  private _totalNumberOfLinesInOutputFile: number = 0;
  private _totalNumberOfLinesInInputFiles: number = 0;

  constructor(record: ProcessorRecord) {
    this._currentProcessor = record;
    this._mappingTable = new MapTable();
    this._errors = [];
  }

  getInputFile(): FileIDRecord {
    return this._inputFile;
  }

  getInitialInputFile(): FileIDRecord {
    if (this._previousProcessorBlock && !this.isFirstInEventsFile()) {
      return this._previousProcessorBlock.getInitialInputFile();
    }
    return this.getInputFile();
  }

  setInputFile(file: FileIDRecord) {
    this._inputFile = file;
  }

  addFile(file: FileIDRecord) {
    this._mappingTable.addFileInformation(file);
  }

  closeFile(file: FileEndRecord) {
    if (!this._outputFile) {
      return undefined;
    }
    if (!(file.getFileId() === (this._outputFile.getSourceId()))) {
      this.increaseTotalNumberOfLinesInInputFiles(parseInt(file.getExpansion()));
    } else {
      this.setTotalNumberOfLinesInOutputFile(parseInt(file.getExpansion()));
      return undefined;
    }
    this._mappingTable.closeFile(file);
  }

  getOutputFile() {
    return this._outputFile;
  }

  setOutputFile(file: FileIDRecord) {
    this._outputFile = file;
  }

  getMappingTable() {
    return this._mappingTable;
  }

  isProcessorIDZero() {
    let procID = parseInt(this._currentProcessor.getOutputId());
    return procID === 0;
  }

  addErrorInformation(record: ErrorInformationRecord) {
    this._errors.push(record);
  }

  processorEnded() {
    this._mappingTable.finalizeMap();
  }
  setPreviousProcessor(previous: ProcessorBlock) {
    this._previousProcessorBlock = previous;
  }

  setContainsExpansionEvents(containsExpansionEvents: boolean) {
    this._containsExpansionEvents = containsExpansionEvents;
  }

  containsExpansionEvents() {
    return this._containsExpansionEvents;
  }

  increaseTotalNumberOfLinesInInputFiles(numberOfLines: number) {
    this._totalNumberOfLinesInInputFiles += numberOfLines;
  }

  getTotalNumberOfLinesInInputFiles() {
    return this._totalNumberOfLinesInInputFiles;
  }

  setTotalNumberOfLinesInOutputFile(numberOfLines: number) {
    this._totalNumberOfLinesInOutputFile = numberOfLines;
  }

  getTotalNumberOfLinesInOutputFile() {
    return this._totalNumberOfLinesInOutputFile;
  }

  getPreviousProcessorBlock(): ProcessorBlock {
    return this._previousProcessorBlock;
  }

  modifyErrorInformation(error: ErrorInformationRecord) {
    this._mappingTable.modifyErrorInformation(error);
    let inputFileLocation = '';
    let inputFileId = '';
    if (this.getInputFile()) {
      inputFileLocation = this.getInputFile().getFilename();
      inputFileId = this.getInputFile().getSourceId();
    }
    if (this._previousProcessorBlock && !this.isFirstInEventsFile() && this.isMappingSupported() && (error.getFileId() === (inputFileId) || error.getFileId() === (inputFileLocation))) {
      this._previousProcessorBlock.modifyErrorInformation(error);
    }
  }

  setFirstInEventsFile(isFirstInEventsFile: boolean) {
    this._isFirstInEventsFile = isFirstInEventsFile;
  }

  isFirstInEventsFile() {
    return this._isFirstInEventsFile;
  }

  setMappingSupported(mappingSupported: boolean) {
    this._mappingSupported = mappingSupported;
  }

  isMappingSupported() {
    return this._mappingSupported;
  }

  isFileReadOnly(fileIDRecord: FileIDRecord) {
    return fileIDRecord.getFlag() === ('1') || ((this._previousProcessorBlock && !this.isFirstInEventsFile()) && this._previousProcessorBlock.getOutputFile() && fileIDRecord.getFilename() === (this._previousProcessorBlock.getOutputFile().getFilename())) || (this.getOutputFile() && fileIDRecord.getFilename() === (this.getOutputFile().getFilename()));
  }

  getAllProcessorErrors() {
    let allPrevErrs:ErrorInformationRecord [][] = [];
    if (this._previousProcessorBlock) {
      allPrevErrs = this._previousProcessorBlock.getAllProcessorErrors();
    }
    allPrevErrs.push(this._errors);
    return allPrevErrs;
  }

  resolveFileNamesForAllErrors() {
    if (this._previousProcessorBlock) {
      this._previousProcessorBlock.resolveFileNamesForAllErrors();
    }
    this._errors.forEach(error => {
      this.resolveFileNameAndDetermineIfReadOnly(error);
    });
    // let errors = this._errors.iterator();
    // while (errors.hasNext()) {
    //   let error = errors.next();
    //   this.resolveFileNameAndDetermineIfReadOnly(error);
    // }
  }
  
  resolveFileNameAndDetermineIfReadOnly(error: ErrorInformationRecord) {
    let readOnly = false;
    if (this._previousProcessorBlock && !this.isFirstInEventsFile() && this.isMappingSupported() && error.getFileId() === (this.INPUT_FILE_ID)) {
      this._previousProcessorBlock.modifyErrorInformation(error);
    } else {
      let fileLocation = this._mappingTable.getFileLocationForFileID(error.getFileId());
      if (fileLocation) {
        const fileID = this._mappingTable.getFileIDRecordForFileID(error.getFileId());
        readOnly = fileID ? this.isFileReadOnly(fileID) : false;
        error.setFileName(fileLocation);
      } else {
        readOnly = this.isFileReadOnly(this.getInitialInputFile());
        error.setFileName(this.getInitialInputFile().getFilename());
        error.setStmtLine('0');
        error.setStartErrLine('0');
        error.setTokenStart('000');
        error.setEndErrLine('0');
        error.setTokenEnd('000');
      }
    }
    return readOnly;
  }
}