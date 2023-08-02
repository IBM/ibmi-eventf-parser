/** 
 * IBM Confidential
 * OCO Source Materials
 * 5900-AN9
 * (c) Copyright IBM Corp. 2009, 2023
 * The source code for this program is not published or otherwise divested of its trade secrets,
 * irrespective of what has been deposited with the U.S. Copyright Office.
 */

import { IProcessor } from "./IProcessor";
import { ErrorInformationRecord } from "./record/ErrorInformationRecord";
import { ExpansionRecord } from "./record/ExpansionRecord";
import { FeedbackCodeRecord } from "./record/FeedbackCodeRecord";
import { FileEndRecord } from "./record/FileEndRecord";
import { FileIDRecord } from "./record/FileIDRecord";
import { MapDefineRecord } from "./record/MapDefineRecord";
import { MapEndRecord } from "./record/MapEndRecord";
import { MapStartRecord } from "./record/MapStartRecord";
import { ProcessorBlock } from "./ProcessorBlock";
import { ProcessorRecord } from "./record/ProcessorRecord";
import { ProgramRecord } from "./record/ProgramRecord";
import { TimestampRecord } from "./record/TimestampRecord";

export class ExpansionProcessor implements IProcessor {
	private PRE_COMPILE_PROCESSOR_ID = "999";

	protected currentProcessor: ProcessorBlock;

	// Flags any errors that occur during processing and disables the processor if needed
	protected postProcessingNeeded: boolean = true;

	// Flags if the Events File contains any EXPANSION Events or not
	// private containsExpansionEvents: boolean = false;

	// Needed for events files that contain multiple events files that have been combined into one (as done in iProjects).
	// Gets set to true at the beginning of each new "sub" events file (marked by a new TIMESTAMP record),
	// and to false after each first PROCESSOR event in the "sub" events file.
	// The scope of this variable is only the current "sub" events file.
	private _noProcessorEventsYet: boolean = true;

	// Needed to decide whether to do mappings of errors to input members
	// If true, temporary output members are involved, and mappings may be needed (unless not supported by pre-compilers)
	protected _containsPreCompileProcessorBlocks: boolean = false;

	constructor() {
		const record = new ProcessorRecord('', '', '');
		this.currentProcessor = new ProcessorBlock(record);
	}

	public processErrorRecord(record: ErrorInformationRecord) {
		this.currentProcessor.addErrorInformation(record);
	}

	public processExpansionRecord(record: ExpansionRecord) {
		// this.containsExpansionEvents = true;
		this.currentProcessor.setContainsExpansionEvents(true);
		this.currentProcessor.getMappingTable().addExpansionRecord(record);
	}

	public processFeedbackCodeRecord(record: FeedbackCodeRecord) { }

	public processFileEndRecord(record: FileEndRecord) {
		try {
			this.currentProcessor.closeFile(record);
		} catch (e: any) {
			this.postProcessingNeeded = false;
			throw new Error(e.message ? e.message : e);
		}
	}

	public processFileIDRecord(record: FileIDRecord) {
		// The try-catch block is there to flag any problems, disable processing and allow regular Events File processing to continue
		try {
			const fileID = parseInt(record.getSourceId());

			if (!this.currentProcessor.isProcessorIDZero()) {
				if (fileID > 1) {
					if (!this.currentProcessor.getOutputFile()) {
						this.currentProcessor.setOutputFile(record);
						return;
					}
				} else if (fileID === 1 && !this.currentProcessor.getInputFile()) {
					this.currentProcessor.setInputFile(record);
				}

				this.currentProcessor.addFile(record);
			} else {
				// We need to keep track of all files in the compiler processor block to be able to get the location for files
				if (fileID === 1 && !this.currentProcessor.getInputFile()) {
					this.currentProcessor.setInputFile(record);
				}

				this.currentProcessor.getMappingTable().addFileToFileTable(record);
			}
		} catch (e: any) {
			this.postProcessingNeeded = false;
			throw new Error(e.message ? e.message : e);
		}
	}

	public processMapDefineRecord(record: MapDefineRecord) { }

	public processMapEndRecord(record: MapEndRecord) { }

	public processMapStartRecord(record: MapStartRecord) { }

	public processProcessorRecord(record: ProcessorRecord) {
		if (!this._containsPreCompileProcessorBlocks && record.getOutputId() === this.PRE_COMPILE_PROCESSOR_ID) {
			this._containsPreCompileProcessorBlocks = true;
		}

		try {
			if (this.currentProcessor) {
				this.currentProcessor.processorEnded();
			}
		} catch (e: any) {
			this.postProcessingNeeded = false;
			throw new Error(e.message ? e.message : e);
		}

		const newProcessor = this.constructEventsFileProcessorBlock(record);

		// Set this processor block as the first one in the current "sub" events file
		// (needed for events file that contains multiple events files that have been combined into one)
		if (this._noProcessorEventsYet) {
			newProcessor.setFirstInEventsFile(true);
			this._noProcessorEventsYet = false;
		}

		newProcessor.setPreviousProcessor(this.currentProcessor);
		this.currentProcessor = newProcessor;
	}


	protected constructEventsFileProcessorBlock(record: ProcessorRecord): ProcessorBlock {
		return new ProcessorBlock(record);
	}

	public processProgramRecord(record: ProgramRecord) { }

	public processTimestampRecord(record: TimestampRecord) {
		this._noProcessorEventsYet = true;
	}

	public doPreProcessing(): boolean {
		return false;
	}

	public doPostProcessing(): boolean {
		if (!this.postProcessingNeeded || !this._containsPreCompileProcessorBlocks || !this.determineAndSetMappingSupport(this.currentProcessor)) {
			return true;
		}

		this.currentProcessor.resolveFileNamesForAllErrors();
		return false;
	}

	/** 
	 * Recursively determines whether the events file (or any of the "sub" events files
	 * when multiple have been combined into one) supports mapping of errors from the 
	 * final temporary output member to the original input members.
	 * Also sets a property of each processor block for whether it supports mappings.
	 * Mapping is supported for an events file if all its processor blocks support error mapping.
	 * IMPORTANT: When called at the top level, this method should only be called on the 
	 * very last processor block of the [combined] events file.
	 * 
	 * @param lastProcessorBlock The first processor block to check. When called at the top
	 * level, this should be the very last processor block of the [combined] events file.
	 * @return True if any of the events files support mapping of errors, false otherwise.
	 */
	protected determineAndSetMappingSupport(lastProcessorBlock: ProcessorBlock): boolean {
		let isMappingSupportedByAny = false;
		let curProc: ProcessorBlock = lastProcessorBlock;

		while (curProc) {
			const curSupport = this.isMappingSupportedByCurrentEventsFile(curProc);
			this.setMappingSupportForCurrentEventsFile(curProc, curSupport);

			if (!isMappingSupportedByAny && curSupport) {
				isMappingSupportedByAny = true;
			}

			// Iterate to the first processor block in the current "sub" events file,
			while (curProc && !curProc.getIsFirstInEventsFile()) {
				curProc = curProc.getPreviousProcessorBlock();
			}

			// Use it to get the previous "sub" events file's last processor block			
			if (curProc) {
				curProc = curProc.getPreviousProcessorBlock();
			}
		}

		return isMappingSupportedByAny;
	}

	/**
	 * Sets the supportsMappings property for each processor block in the current events file
	 * to the value provided.
	 * IMPORTANT: This method should only be called on the last processor block
	 * of the current events file.
	 * 
	 * @param lastProcessorBlock The last processor block of the current events file.
	 * @param support Boolean value corresponding to whether the current events file requires 
	 * and supports mappings.
	 */
	private setMappingSupportForCurrentEventsFile(lastProcessorBlock: ProcessorBlock, support: boolean) {
		let curProc: ProcessorBlock | undefined = lastProcessorBlock;

		while (curProc) {
			curProc.setMappingSupported(support);

			if (curProc.getIsFirstInEventsFile()) {
				curProc = undefined;
			} else {
				curProc = curProc.getPreviousProcessorBlock();
			}
		}
	}

	/**
	 * Recursively determines whether the current events file (or "sub" events file in the case of
	 * multiple events files combined into one) requires and supports mapping of errors
	 * from its output file to its input files. An ["sub"] events file supports mapping of
	 * errors if all of its processor blocks support error mappings.
	 * For individual processor blocks in the events file:
	 * For compile processor blocks, when they come after pre-compile processor blocks(s),
	 * mapping is considered to be supported. If they do not come after pre-compile
	 * block(s), there is no need to do mappings, so mapping is not considered supported.
	 * For pre-compile processor blocks (which will have temporary output members),
	 * mapping is supported if there are expansion events, or if there are no
	 * expansion events but the total number of lines written to the output
	 * file equals the total number of lines read from the input files, and is not zero.
	 * IMPORTANT: When called at the top level, this method should only be called on 
	 * the last processor block of the current events file.
	 * 
	 * @param lastProcessorBlock The last processor block of the current events file. 
	 * @return True if the current events file supports mapping of errors, false otherwise.
	 */
	private isMappingSupportedByCurrentEventsFile(lastProcessorBlock: ProcessorBlock): boolean {
		let supported: boolean;

		if (!lastProcessorBlock.getOutputFile()) {
			// Compile processor block case
			if (!lastProcessorBlock.getPreviousProcessorBlock() || lastProcessorBlock.getIsFirstInEventsFile()) {
				supported = false;
			} else {
				supported = true;
			}
		} else if (lastProcessorBlock.getContainsExpansionEvents()) {
			supported = true;
		} else if (lastProcessorBlock.getTotalNumberOfLinesInOutputFile() === 0) {
			supported = false;
		} else {
			supported = lastProcessorBlock.getTotalNumberOfLinesInOutputFile() === lastProcessorBlock.getTotalNumberOfLinesInInputFiles();
		}

		if (lastProcessorBlock.getPreviousProcessorBlock() && !lastProcessorBlock.getIsFirstInEventsFile()) {
			supported = supported && this.isMappingSupportedByCurrentEventsFile(lastProcessorBlock.getPreviousProcessorBlock());
		}

		return supported;
	}

	public getAllErrors(): ErrorInformationRecord[][] {
		if (this.currentProcessor) {
			return this.currentProcessor.getAllProcessorErrors();
		}

		return [];
	}

	public getAllFileIDRecords(): FileIDRecord[] {
		if (this.currentProcessor) {
			return this.currentProcessor.getMappingTable().getAllFileIDRecords();
		} else {
			return [];
		}
	}
}