/*
 * (c) Copyright IBM Corp. 2023
 */

import { ErrorInformationRecord } from "./record/ErrorInformationRecord";
import { ExpansionRecord } from "./record/ExpansionRecord";
import { FeedbackCodeRecord } from "./record/FeedbackCodeRecord";
import { FileEndRecord } from "./record/FileEndRecord";
import { FileIDRecord } from "./record/FileIDRecord";
import { MapDefineRecord } from "./record/MapDefineRecord";
import { MapEndRecord } from "./record/MapEndRecord";
import { MapStartRecord } from "./record/MapStartRecord";
import { ProcessorRecord } from "./record/ProcessorRecord";
import { ProgramRecord } from "./record/ProgramRecord";
import { TimestampRecord } from "./record/TimestampRecord";

/**
 * This interface defines a backbone for processing Events File Records.
 * 
 * As the Events File Format gets more complex and more used, the parsing logic
 * should be seperated from the processing logic. A different processor could
 * potentially be associated with Events Files generated for different purposes.
 * 
 * For instance, an SQL compile might need a different processor to make use of the
 * Expansion record.
 */
export interface IProcessor {
	/**
	 * Processes a File ID record object.
	 * @param record The File ID record.
	 */
	processFileIDRecord(record: FileIDRecord): void;

	/**
	 * Processes a File End record object.
	 * @param record The File End record.
	 */
	processFileEndRecord(record: FileEndRecord): void;

	/**
	 * Processes a Processor record object.
	 * @param record The Processor record.
	 */
	processProcessorRecord(record: ProcessorRecord): void;

	/**
	 * Processes a Timestamp record object.
	 * @param record The Timestamp record.
	 */
	processTimestampRecord(record: TimestampRecord): void;

	/**
	 * Processes an Error record object.
	 * @param record The Error record.
	 */
	processErrorRecord(record: ErrorInformationRecord): void;

	/**
	 * Processes a Program record object.
	 * @param record The Program record.
	 */
	processProgramRecord(record: ProgramRecord): void;

	/**
	 * Processes a Feedback Code record object.
	 * @param record The Feedback Code record.
	 */
	processFeedbackCodeRecord(record: FeedbackCodeRecord): void;

	/**
	 * Processes a Map Define record object.
	 * @param record The Map Define record.
	 */
	processMapDefineRecord(record: MapDefineRecord): void;

	/**
	 * Processes a Map Start record object.
	 * @param record The Map Start record.
	 */
	processMapStartRecord(record: MapStartRecord): void;

	/**
	 * Processes a Map End record object.
	 * @param record The Map End record.
	 */
	processMapEndRecord(record: MapEndRecord): void;

	/**
	 * Processes an Expansion record object.
	 * @param record The Expansion record.
	 */
	processExpansionRecord(record: ExpansionRecord): void;

	/**
	 * After parsing all records in the Events File, this method will be called to
	 * process the records.
	 * 
	 * @return True if post-processing was succesful or false otherwise.
	 */
	doPostProcessing(): boolean;

	/**
	 * Before parsing all records in the Events File, this method will be called to
	 * allow the processor to perform initialization.
	 * 
	 * @return True if pre-processing was succesful or false otherwise.
	 */
	doPreProcessing(): boolean;

	/**
	 * After all records in the Events File are processed, this method is called to
	 * return all the errors from all the processor blocks (ProcessorBlock) of the
	 * Events File. Since each ProcessorBlock contains an array of errors, the result
	 * will be returned as a array of those arrays.
	 * 
	 * @return An array of arrays of all parsed errors from all processor blocks of
	 * the Events File (one list for each processor block).
	 */
	getAllErrors(): ErrorInformationRecord[][];

	/**
	 * Return all file ID records.
	 * 
	 * @return An array of all file ID records.
	 */
	getAllFileIDRecords(): FileIDRecord[];
}
