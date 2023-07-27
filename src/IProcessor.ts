/* IBM Confidential
 * OCO Source Materials
 * 5900-AN9
 * (c) Copyright IBM Corp. 2003, 2021
 * The source code for this program is not published or otherwise divested of its trade secrets,
 * irrespective of what has been deposited with the U.S. Copyright Office.
 *
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
 * This interface defines a backbone for processing Events File Records.<br>
 * 
 * As the Events File Format gets more complex and more used, the parsing logic
 * should be seperated from the processing logic. A different processor could
 * potentially be associated with Events Files generated for different purposes.
 * 
 * <br>
 * For instance, an SQL compile might need a different processor to make use of the
 * Expansion record.
 */
export interface IProcessor {
	/**
	 * Processes a File ID record object.
	 * @param record
	 * @throws SecondLevelHelpException 
	 */
	processFileIDRecord(record: FileIDRecord): void;

	/**
	 * Processes a File End record object.
	 * @param record
	 * @throws SecondLevelHelpException 
	 */
	processFileEndRecord(record: FileEndRecord): void;

	/**
	 * Processes a Processor record object.
	 * @param record
	 * @throws SecondLevelHelpException 
	 */
	processProcessorRecord(record: ProcessorRecord): void;

	/**
	 * Processes a Timestamp record object.
	 * @param record
	 */
	processTimestampRecord(record: TimestampRecord): void;

	/**
	 * Processes an Error record object.
	 * @param record
	 */
	processErrorRecord(record: ErrorInformationRecord): void;

	/**
	 * Processes a Program record object.
	 * @param record
	 */
	processProgramRecord(record: ProgramRecord): void;

	/**
	 * Processes a Feedback Code record object.
	 * @param record
	 */
	processFeedbackCodeRecord(record: FeedbackCodeRecord): void;

	/**
	 * Processes a Map Define record object.
	 * @param record
	 */
	processMapDefineRecord(record: MapDefineRecord): void;

	/**
	 * Processes a Map Start record object.
	 * @param record
	 */
	processMapStartRecord(record: MapStartRecord): void;

	/**
	 * Processes a Map End record object.
	 * @param record
	 */
	processMapEndRecord(record: MapEndRecord): void;

	/**
	 * Processes an Expansion record object.
	 * @param record
	 */
	processExpansionRecord(record: ExpansionRecord): void;

	/**
	 * After parsing all records in the Events File, this method will be called to
	 * process the records.
	 * @return <code>true</code> if post-processing was succesful. <code>false</code> otherwise.
	 * @throws SecondLevelHelpException 
	 */
	doPostProcessing(): boolean;

	/**
	 * Before parsing all records in the Events File, this method will be called to
	 * allow the processor to perform initialization.
	 * @return <code>true</code> if pre-processing was succesful. <code>false</code> otherwise.
	 */
	doPreProcessing(): boolean;

	/**
	 * After all records in the Events File are processed, this method is called to
	 * return all the errors from all the processor blocks (QSYSEventsFileProcessorBlock)
	 * of the Events File. Since each QSYSEventsFileProcessorBlock contains a LinkedList
	 * of errors, the result will be returned as a LinkedList of those linked lists.
	 * 
	 * This method is called by EventsFileParser.printEventFileErrors(), which in turn is
	 * called by the JUnit test for event file processing.
	 * @return a list of lists of all parsed errors from all processor blocks of the Events File
	 * (one list for each processor block).
	 */
	getAllErrors(): ErrorInformationRecord[][];

	/**
	 * Return all file names. 
	 */
	getAllFileIDRecords(): FileIDRecord[];
}
