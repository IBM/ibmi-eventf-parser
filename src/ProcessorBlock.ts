/*
 * (c) Copyright IBM Corp. 2023
 */

import { ErrorInformationRecord } from "./record/ErrorInformationRecord";
import { FileEndRecord } from "./record/FileEndRecord";
import { FileIDRecord } from "./record/FileIDRecord";
import { MapTable } from "./MapTable";
import { ProcessorRecord } from "./record/ProcessorRecord";

export class ProcessorBlock {
  // Default File ID for the input file of the processor block
  readonly INPUT_FILE_ID: string = '001';

  // Queue of all errors in this processor block
  private errors: ErrorInformationRecord[];

  // Input to the processor block
  private inputFile: FileIDRecord | undefined;

  // Output of the processor block
  private outputFile: FileIDRecord | undefined;

  // The PROCESSOR record
  private currentProcessor: ProcessorRecord;

  // The mapping table that keeps track of all copybooks and EXPANSIONs
  private mappingTable: MapTable;

  // Link to the previous processor block in the events File
  private previousProcessorBlock: ProcessorBlock | undefined;

  // Flags if the current processor block contains any EXPANSION events or not
  private containsExpansionEvents: boolean = false;

  // Needed for events files that contain multiple events files that have been combined into one (as done in iProjects).
  // Should get set to true for each first PROCESSOR in each "sub" events file.
  // The scope of this variable is only the current "sub" events file.
  private isFirstInEventsFile: boolean = false;

  // Set to true if current events file requires and supports mappings.
  // See ExpansionProcessor.isMappingSupportedByAnyEventsFiles() for more details.
  private mappingSupported: boolean = false;

  // Keep track of the number of lines in the output file
  private totalNumberOfLinesInOutputFile: number = 0;

  // Keep track of the total number of lines in all the input files
  private totalNumberOfLinesInInputFiles: number = 0;

  constructor(record: ProcessorRecord) {
    this.currentProcessor = record;
    this.mappingTable = new MapTable();
    this.errors = [];
  }

  public getInputFile(): FileIDRecord | undefined {
    return this.inputFile;
  }

  /**
   * Get the input file of the first processor block of the current events file.
   * 
   * @return the input file of the first processor block of the current events file.
   */
  getInitialInputFile(): FileIDRecord | undefined {
    if (this.previousProcessorBlock && !this.getIsFirstInEventsFile()) {
      return this.previousProcessorBlock.getInitialInputFile();
    }
    return this.getInputFile();
  }

  public setInputFile(file: FileIDRecord) {
    this.inputFile = file;
  }

  public addFile(file: FileIDRecord) {
    this.mappingTable.addFileInformation(file);
  }

  public closeFile(file: FileEndRecord) {
    if (this.outputFile) {
      // Keep track of the total number of lines in all the input files
      if (!(file.getFileId() === (this.outputFile.getSourceId()))) {
        this.increaseTotalNumberOfLinesInInputFiles(parseInt(file.getExpansion()));
      } else {
        // Keep track of the number of lines in the output file
        this.setTotalNumberOfLinesInOutputFile(parseInt(file.getExpansion()));
        return;
      }

      this.mappingTable.closeFile(file);
    }
  }

  public getOutputFile(): FileIDRecord | undefined {
    return this.outputFile;
  }

  public setOutputFile(file: FileIDRecord) {
    this.outputFile = file;
  }

  public getMappingTable(): MapTable {
    return this.mappingTable;
  }

  public isProcessorIDZero() {
    const procID = parseInt(this.currentProcessor.getOutputId());
    return procID === 0;
  }

  public addErrorInformation(record: ErrorInformationRecord) {
    this.errors.push(record);
  }

  public processorEnded() {
    this.mappingTable.finalizeMap();
  }
  public setPreviousProcessor(previous: ProcessorBlock) {
    this.previousProcessorBlock = previous;
  }

  public setContainsExpansionEvents(containsExpansionEvents: boolean) {
    this.containsExpansionEvents = containsExpansionEvents;
  }

  public getContainsExpansionEvents(): boolean {
    return this.containsExpansionEvents;
  }

  public increaseTotalNumberOfLinesInInputFiles(numberOfLines: number) {
    this.totalNumberOfLinesInInputFiles += numberOfLines;
  }

  public getTotalNumberOfLinesInInputFiles(): number {
    return this.totalNumberOfLinesInInputFiles;
  }

  public setTotalNumberOfLinesInOutputFile(numberOfLines: number) {
    this.totalNumberOfLinesInOutputFile = numberOfLines;
  }

  public getTotalNumberOfLinesInOutputFile(): number {
    return this.totalNumberOfLinesInOutputFile;
  }

  public getPreviousProcessorBlock(): ProcessorBlock | undefined {
    return this.previousProcessorBlock;
  }

  public modifyErrorInformation(error: ErrorInformationRecord) {
    // Map the error lines and location to the input file of this current PROCESSOR
    this.mappingTable.modifyErrorInformation(error);

    // If another processor was invoked, map the errors back to its input file.
    // Only modify error information if there was a previous processor and the error 
    // points to the current input file. The FileId of the error was changed in 
    // modifyErrorInformation, so need to compare with location rather than ID.
    // Since this method is only called on a _previousProcessorBlock, this is not
    // the compiler processor block and getInputFile() should not return null.
    let inputFileLocation = '';
    let inputFileId = '';

    const inputFile = this.getInputFile();
    if (inputFile) {
      inputFileLocation = inputFile.getFilename();
      inputFileId = inputFile.getSourceId();
    }

    if (this.previousProcessorBlock && !this.getIsFirstInEventsFile() && this.isMappingSupported()
      && (error.getFileId() === (inputFileId) || error.getFileId() === (inputFileLocation))) {
      this.previousProcessorBlock.modifyErrorInformation(error);
    }
  }

  /**
   * Sets whether the current processor block is the first one in the current "sub" events file
   * (needed for events file that contains multiple events files that have been combined into one).
   * 
   * @param isFirstInEventsFile
   */
  public setFirstInEventsFile(isFirstInEventsFile: boolean) {
    this.isFirstInEventsFile = isFirstInEventsFile;
  }

  /**
   * Returns whether the current processor block is the first one in the current "sub" events file
   * (needed for events file that contains multiple events files that have been combined into one).
   * 
   * @return True if the current processor block is the first one in the current "sub" events file, false otherwise.
   */
  public getIsFirstInEventsFile(): boolean {
    return this.isFirstInEventsFile;
  }

  public setMappingSupported(mappingSupported: boolean) {
    this.mappingSupported = mappingSupported;
  }

  public isMappingSupported(): boolean {
    return this.mappingSupported;
  }

  /**
   * Determines whether a file in the current processor block is read-only or not.
   * A file is considered read-only if it is a temporary file created by an SQL pre-compiler.
   * 
   * @param fileRecord The FileIDRecord of the file to check.
   * @return True if the file is read-only, false otherwise.
   */
  public isFileReadOnly(fileIDRecord: FileIDRecord): boolean {
    // True if the temporary flag of the file is 1 (indicating temp member)
    // or the file is the same as the output file of the current or previous processor block
    return fileIDRecord.getFlag() === ('1')
      || ((this.previousProcessorBlock && !this.getIsFirstInEventsFile())
        && this.previousProcessorBlock.getOutputFile() !== undefined
        && fileIDRecord.getFilename() === (this.previousProcessorBlock.getOutputFile()!.getFilename()))
      || (this.getOutputFile() !== undefined && fileIDRecord.getFilename() === (this.getOutputFile()!.getFilename()));
  }

  /**
   * This method is used by the test for event file processing.
   * 
   * This method returns all errors in this and all previous processor blocks. 
   * Since each ProcessorBlock contains an array of errors, the result will be 
   * returned as an array of those arrays.
   * 
   * This method is called by ExpansionProcessor.getAllErrors().
   * 
   * @return An array of arrays of all parsed errors from the current and all
   * previous processor blocks (one list for each processor block).
   */
  public getAllProcessorErrors(): ErrorInformationRecord[][] {
    let allPrevErrs: ErrorInformationRecord[][] = [];

    if (this.previousProcessorBlock) {
      allPrevErrs = this.previousProcessorBlock.getAllProcessorErrors();
    }

    allPrevErrs.push(this.errors);
    return allPrevErrs;
  }

  public resolveFileNamesForAllErrors() {
    if (this.previousProcessorBlock) {
      this.previousProcessorBlock.resolveFileNamesForAllErrors();
    }

    this.errors.forEach(error => {
      this.resolveFileNameAndDetermineIfReadOnly(error);
    });
  }

  /**
   * Maps the error back to the original input member and resolves the 
   * filename of that member. If mappings are not supported, checks and 
   * returns whether that member is read-only.
   * 
   * @param error The ErrorInformationRecord to resolve.
   * @return True if mappings are not supported and the member that the
   * error points to is read-only, false otherwise.
   */
  public resolveFileNameAndDetermineIfReadOnly(error: ErrorInformationRecord): boolean {
    let readOnly = false;

    if (this.previousProcessorBlock && !this.getIsFirstInEventsFile() && this.isMappingSupported() && error.getFileId() === (this.INPUT_FILE_ID)) {
      this.previousProcessorBlock.modifyErrorInformation(error);
    } else {
      const fileLocation = this.mappingTable.getFileLocationForFileID(error.getFileId());

      if (fileLocation) {
        const fileIDRecord = this.mappingTable.getFileIDRecordForFileID(error.getFileId());
        readOnly = fileIDRecord ? this.isFileReadOnly(fileIDRecord) : false;
        error.setFileName(fileLocation);
      } else {
        const initialInputFile = this.getInitialInputFile();
        readOnly = initialInputFile ? this.isFileReadOnly(initialInputFile) : false;

        // If getFileLocationForFileID returns null, that means that the
        // file with fileId of the error is not in the fileTable, most
        // likely because it is an output file. Map this error to the
        // top of the input file of this processor.
        error.setFileName(initialInputFile?.getFilename() || '');
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