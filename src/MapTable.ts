/**
 * IBM Confidential
 * OCO Source Materials
 * 5900-AN9
 * (c) Copyright IBM Corp. 2003, 2021
 * The source code for this program is not published or otherwise divested of its trade secrets,
 * irrespective of what has been deposited with the U.S. Copyright Office.
 */

import { ErrorInformationRecord } from "./record/ErrorInformationRecord";
import { ExpansionRecord } from "./record/ExpansionRecord";
import { FileEndRecord } from "./record/FileEndRecord";
import { FileIDRecord } from "./record/FileIDRecord";

/**
 * Class used as a container of line numbers and file IDs for each range
 * of lines in the map.
 */
class SourceLineRange {
	// Input File Info
	private inputStartLine: number = 0;
	private inputEndLine: number = -1;
	private inputFileID: string;

	// Output File Info
	private outputStartLine: number = 0;
	private outputEndLine: number = -1;

	constructor(fileID?: string, copy?: SourceLineRange) {
		if (copy) {
			this.inputStartLine = copy.getInputStartLine();
			this.inputEndLine = copy.getInputEndLine();
			this.inputFileID = copy.getInputFileID();
			this.outputStartLine = copy.getOutputStartLine();
			this.outputEndLine = copy.getOutputEndLine();
		}

		if (fileID) {
			this.inputFileID = fileID;
		}
	}

	public getInputEndLine(): number {
		return this.inputEndLine;
	}

	public setInputEndLine(endLine: number) {
		this.inputEndLine = endLine;
	}

	public getInputFileID(): string {
		return this.inputFileID;
	}

	public setInputFileID(fileID: string) {
		this.inputFileID = fileID;
	}

	public getInputStartLine(): number {
		return this.inputStartLine;
	}

	public setInputStartLine(startLine: number) {
		this.inputStartLine = startLine;
	}

	public getOutputEndLine(): number {
		return this.outputEndLine;
	}

	public setOutputEndLine(endLine: number) {
		this.outputEndLine = endLine;
	}

	public getOutputStartLine(): number {
		return this.outputStartLine;
	}

	public setOutputStartLine(startLine: number) {
		this.outputStartLine = startLine;
	}

	/**
	 * Shifts the output file start and end lines by a certain amount.
	 * If the end line is -1, no need to change it.
	 * 
	 * @param amount Amount by which the line numbers need to be shifted.
	 */
	public shiftOutputLines(amount: number) {
		this.outputStartLine += amount;

		if (this.outputEndLine > 0) {
			this.outputEndLine += amount;
		}
	}

	/**
	 * Checks if the output file line number is present in this container.
	 * 
	 * @param line The line number to be checked.
	 * @return True if the line is present in the range or false otherwise.
	 */
	public containsOutputLine(line: number): boolean {
		if (this.outputEndLine === -1) {
			return line >= this.outputStartLine;
		}

		return line >= this.outputStartLine && line <= this.outputEndLine;
	}

	/**
	 * Checks if the input file line number is present in this container.
	 * 
	 * @param line The line number to be checked.
	 * @param ID ID of the input file that contains the line.
	 * @return True if the line is present in the range or false otherwise.
	 */
	public containsInputLine(line: number, ID: string): boolean {
		if (this.inputEndLine === -1) {
			return line >= this.inputStartLine && ID === (this.inputFileID);
		}

		return line >= this.inputStartLine && line <= this.inputEndLine && ID === (this.inputFileID);
	}

	/**
	 * A helper method to compute the input file end line number based on the other line numbers.
	 */
	public fixInputRangeBasedOnOutputRange() {
		this.inputEndLine = this.outputEndLine - this.outputStartLine + this.inputStartLine;
	}

	/**
	 * A helper method to compute the output file end line number based on the other line numbers.
	 */
	public fixOutputRangeBasedOnInputRange() {
		this.outputEndLine = this.inputEndLine - this.inputStartLine + this.outputStartLine;
	}
}

/**
 * Class used as a container of the file ID and the number of lines processed so far.
 */
class FileIDLinesPair {
	private lines: number;

	constructor(private ID: string) {
		this.lines = 0;
	}

	public getID(): string {
		return this.ID;
	}

	public getLinesProcessed(): number {
		return this.lines;
	}

	public increaseLinesProcessed(amount: number) {
		this.lines += amount;
	}
}

export class MapTable {
	// Map of SourceLineRanges
	private map: SourceLineRange[] = [];

	// Holds the EXPANSION records until processed
	private queueExpansion: ExpansionRecord[] = [];

	// Data needed to determine where copybook SourceLineRange should be inserted in the list
	private files: ArrayStack<FileIDLinesPair> = new ArrayStack<FileIDLinesPair>();
	private lookupIndex: number = 0;

	// Hashtable of File IDs and locations for fast lookup
	private fileTable: Map<String, FileIDRecord> = new Map<String, FileIDRecord>();

	constructor() { }

	/**
	 * Adds file information to the map.
	 * 
	 * @param Tecord The File ID record.
	 */
	public addFileInformation(record: FileIDRecord) {
		const range = this.createOpenEndedSourceLineRange(record);
		const file = new FileIDLinesPair(record.getSourceId());

		// This should mean that the new FILEID is a copy member
		if (!this.files.isEmpty()) {
			const parentFile = this.files.peek();

			const parentRange = this.map[this.map.length - 1];
			if (parentRange.getOutputStartLine() === range.getOutputStartLine()) {
				this.map.pop();
			} else {
				parentRange.setOutputEndLine(range.getOutputStartLine() - 1);
				parentRange.setInputEndLine(parentRange.getOutputEndLine() - parentRange.getOutputStartLine() + parentRange.getInputStartLine());

				// Add 2 to account for the /copy statement that was commented out
				parentFile?.increaseLinesProcessed(parentRange.getInputEndLine() - parentRange.getInputStartLine() + 1);
			}
		}

		this.map.push(range);
		this.files.push(file);
		this.fileTable.set(record.getSourceId(), record);
	}

	/**
	 * Adds file information only to the file table. This is useful for processing the
	 * compiler (000) processor block, since we don't need to keep track of line mappings
	 * and FileIDLinesPair pairings.
	 * 
	 * @param record The File ID record
	 */
	public addFileToFileTable(record: FileIDRecord) {
		this.fileTable.set(record.getSourceId(), record);
	}

	/**
	 * Sets the correct bounds for the files in the map that were added using `AddFileInformation()`.
	 * 
	 * @param record The File End record that contains the number of lines in the source.
	 */
	public closeFile(record: FileEndRecord) {
		// Make sure that the stack is not empty
		if (this.files.isEmpty()) {
			throw new Error(`A FILEEND event does not have a matching FILEID.\n`
				+ `Faulty event: ${record.toString()}`);
		}

		const file = this.files.pop();

		// Make sure that the FILEID matches the FILEEND on the stack
		if (file?.getID() !== (record.getFileId())) {
			throw new Error(`The ID field of the FILEEND event does not match the ID field of the last FILEID event.\n`
				+ `Mismatched IDs: \t FILEID: ${file?.getID()}\t FILEEND: ${record.toString()}`);
		}

		const last = this.map[this.map.length - 1];

		// Make sure that last retrieved node matches the ID of the FILEEND
		if (last.getInputFileID() !== (record.getFileId())) {
			throw new Error(`The ID field of the FILEEND event does not match the ID field of the last SourceLineRange.\n`
				+ `Mismatched IDs: \t FILEID: ${last.getInputFileID()}\t FILEEND: ${record.toString()}`);
		}

		let expansion = 0;
		try {
			expansion = parseInt(record.getExpansion());
		} catch (e: any) {
			throw new Error(`Unable to parse the expansion field of the FILEEND record to an integer\n`
				+ `Faulty record: ${record.toString()}`);
		}

		// If the expansion field of the FileEnd record is different than 0, use that information to set the bounds
		if (expansion !== 0) {
			last.setInputEndLine(last.getInputStartLine() + expansion - file.getLinesProcessed() - 1);
			last.setOutputEndLine(last.getOutputStartLine() + expansion - file.getLinesProcessed() - 1);

			// All files have been handled
			if (this.files.isEmpty()) {
				return;
			}

			const parent = this.files.peek()!;
			const range = new SourceLineRange(parent.getID());
			range.setInputStartLine(parent.getLinesProcessed() + 1);
			range.setOutputStartLine(last.getOutputEndLine() + 1);

			this.map.push(range);
		} else {
			// If the expansion field is 0, assume that the bounds go to the end of the file
			// defect 7526: according to Gina Whitney, the expansion field is only 0 if the copy file
			// is empty, or if we are working with 5.4 or 6.1 before the PTF that enabled expansion events
			// So we will handle this as if it were an empty include and that should work for both cases.
			last.setInputEndLine(last.getInputStartLine());
			last.setOutputStartLine(last.getOutputStartLine() - 1); // No output whatsoever, so point errors to commented out include
			last.setOutputEndLine(last.getOutputStartLine());

			// All files have been handled -i.e. this was the end of the containing file
			if (this.files.isEmpty()) {
				return;
			}

			// Otherwise this was the end of an included file
			// Now add an entry for the remainder of the containing file
			const parent = this.files.peek()!;
			const range = new SourceLineRange(parent.getID());
			range.setInputStartLine(parent.getLinesProcessed() + 1);
			range.setOutputStartLine(last.getOutputStartLine() + 1);
			this.map.push(range);
		}
	}

	/**
	 * Create a `SourceLineRange` with open bounds. The bounds will be set once the FileEnd record is read.
	 * 
	 * @param record The FileID record that contains information about where the `SourceLineRange` should start.
	 */
	private createOpenEndedSourceLineRange(record: FileIDRecord): SourceLineRange {
		let line = 1;
		try {
			line = parseInt(record.getLine());
		} catch (e: any) {
			throw new Error(`Unable to parse the line field of the FILEID record to an integer\n`
				+ `Faulty record: ${record.toString()}`);
		}

		const range = new SourceLineRange(record.getSourceId());
		range.setInputStartLine(1);


		// We need to take into consideration lines that have already been mapped to the output file.
		// line - parentFile.getLinesProcessed() === lines between the new /copy and the old /copy
		if (!this.files.isEmpty()) {
			const parentRange = this.map[this.map.length - 1];
			const parentFile = this.files.peek();

			if (parentFile) {
				range.setOutputStartLine(parentRange.getOutputStartLine() + line - parentFile.getLinesProcessed());
			}
		} else {
			range.setOutputStartLine(1);
		}

		return range;
	}

	public addExpansionRecord(record: ExpansionRecord) {
		this.queueExpansion.push(record);
	}

	private getSourceLineRangeForOutputLine(line: number): SourceLineRange | undefined {
		for (const range of this.map) {
			if (range.containsOutputLine(line)) {
				return range;
			}
		}
	}

	private optimizedSourceLineRangeLookup(line: number): SourceLineRange | undefined {
		// Start searching from last known position
		for (let i = this.lookupIndex; i < this.map.length; i++) {
			const range = this.map[i];
			if (range.containsOutputLine(line)) {
				this.lookupIndex = i;
				return range;
			}
		}

		// If not found, wrap around and search from beginning
		for (let i = 0; i < this.lookupIndex && i < this.map.length; i++) {
			const range = this.map[i];
			if (range.containsOutputLine(line)) {
				this.lookupIndex = i;
				return range;
			}
		}
	}

	private getSourceLineRangeForInputLine(line: number, id: string): SourceLineRange | undefined {
		for (const range of this.map) {
			if (range.containsInputLine(line, id)) {
				return range;
			}
		}
	}

	private shiftRangesBy(amount: number, atIndex: number) {
		for (let i = atIndex; i < this.map.length; i++) {
			(this.map[i]).shiftOutputLines(amount);
		}
	}

	private handleExpansion(record: ExpansionRecord) {
		const expansionRange = this.createSourceLineRange(record);
		let expandedSource: SourceLineRange | undefined;

		// Handle the case where the expansion comes at the end of file (right after the last range)
		if (expansionRange.getOutputStartLine() - (this.map[this.map.length - 1]).getOutputEndLine() === 1) {
			if (expansionRange.getInputStartLine() === expansionRange.getInputEndLine()) {
				this.map.push(expansionRange);
				return;
			}
		}
		// 05/25/09: There are currently no regular expansion events where the input start and input end lines are different,
		// so there is currently no implementation to handle such events, 
		// and this code should only be reached by negative expansion events.
		else if (expansionRange.getInputStartLine() !== expansionRange.getInputEndLine() || (expansionRange.getOutputStartLine() === 0 && expansionRange.getOutputEndLine() === 0)) {
			expandedSource = this.getSourceLineRangeForInputLine(expansionRange.getInputStartLine(), expansionRange.getInputFileID());
		} else {
			expandedSource = this.getSourceLineRangeForOutputLine(expansionRange.getOutputStartLine());
		}

		this.splitExpandedSourceLineRange(expansionRange, expandedSource!);
	}

	private splitExpandedSourceLineRange(expansion: SourceLineRange, expanded: SourceLineRange) {
		const index = this.map.indexOf(expanded);
		const isExpansionNegative = expansion.getOutputStartLine() === 0 && expansion.getOutputEndLine() === 0;
		const expansionSize = (isExpansionNegative) ?
			expansion.getInputStartLine() - expansion.getInputEndLine() - 1 :
			expansion.getOutputEndLine() - expansion.getOutputStartLine() + 1;


		// Handle a negative expansion event
		if (isExpansionNegative) {
			if (expansion.getInputStartLine() === expanded.getInputStartLine() && expansion.getInputEndLine() === expanded.getInputEndLine()) {
				// Assume 1 to 1 mapping
				this.map.splice(index, 1);

				this.shiftRangesBy(expansionSize, index);
			} else if (expansion.getInputStartLine() === expanded.getInputStartLine()) {
				expanded.setInputStartLine(expansion.getInputEndLine() + 1);
				expanded.setOutputStartLine(expanded.getOutputStartLine() + Math.abs(expansionSize));

				this.shiftRangesBy(expansionSize, index);
			} else if (expansion.getInputEndLine() === expanded.getInputEndLine()) {
				//Assume 1 to 1 mapping
				expanded.setInputEndLine(expansion.getInputStartLine() - 1);
				expanded.setOutputEndLine(expanded.getOutputEndLine() - Math.abs(expansionSize));

				this.shiftRangesBy(expansionSize, index + 1);
			} else {
				const extraRange = new SourceLineRange(undefined, expanded);

				expanded.setInputEndLine(expansion.getInputStartLine() - 1);
				expanded.fixOutputRangeBasedOnInputRange();

				extraRange.setInputStartLine(expansion.getInputEndLine() + 1);
				extraRange.setOutputStartLine(expanded.getOutputEndLine() + Math.abs(expansionSize) + 1);

				this.map.splice(index + 1, 0, extraRange);

				this.shiftRangesBy(expansionSize, index + 1);
			}
		} else if (expanded.getOutputStartLine() === expansion.getOutputStartLine()) {
			// Only supports expansions where expansion.getInputStartLine() === expansion.getInputEndLine()

			// Insert the expansion before the current range
			// (to keep the output ranges sorted), and then
			// shift the output ranges by amount of expansion.
			if (expansion.getInputStartLine() === expansion.getInputEndLine()) {
				this.map.splice(index, 0, expansion);
				this.shiftRangesBy(expansionSize, index + 1);

			}
		}

		// Not necessary - handled the same way as generic case:
		// else if(expanded.getOutputEndLine() === expansion.getOutputEndLine()){
		// }

		// Handle generic case
		else {
			// Only supports expansions where expansion.getInputStartLine() === expansion.getInputEndLine()

			// Split the current range in half at the point of expansion's output start,
			// insert the expansion between the two halves, and shift the outputs of the
			// remaining ranges (starting with the second half) by the mount of the expansion.
			const extraRange = new SourceLineRange(undefined, expanded);

			expanded.setOutputEndLine(expansion.getOutputStartLine() - 1);
			expanded.fixInputRangeBasedOnOutputRange();

			this.map.splice(index + 1, 0, expansion);

			extraRange.setInputStartLine(expanded.getInputEndLine() + 1);
			extraRange.setOutputStartLine(expanded.getOutputEndLine() + 1);
			this.map.splice(index + 2, 0, extraRange);

			this.shiftRangesBy(expansionSize, index + 2);
		}
	}

	private createSourceLineRange(record: ExpansionRecord): SourceLineRange {
		const range = new SourceLineRange(record.getInputFileID());

		let iStart = 0, iEnd = 0, oStart = 0, oEnd = 0;
		try {
			iStart = parseInt(record.getInputLineStart());
			iEnd = parseInt(record.getInputLineEnd());
			oStart = parseInt(record.getOutputLineStart());
			oEnd = parseInt(record.getOutputLineEnd());
		} catch (e: any) {
			throw new Error(`Unable to parse the fields of the EXPANSION record to integers\n`
				+ `Faulty record: ${record.toString()}`);
		}

		range.setInputStartLine(iStart);
		range.setInputEndLine(iEnd);
		range.setOutputStartLine(oStart);
		range.setOutputEndLine(oEnd);

		return range;
	}

	/**
	 * Returns the QSYSEventsFileFileIDRecord corresponding to a file ID.
	 * 
	 * @param ID The ID of the file to look for.
	 * @return The FileIDRecord corresponding to the file ID if it exists in the table, `undefined` otherwise.
	 */
	public getFileIDRecordForFileID(ID: string): FileIDRecord | undefined {
		return this.fileTable.get(ID);
	}

	public getFileLocationForFileID(ID: string): string | undefined {
		const fileRecord = this.getFileIDRecordForFileID(ID);

		if (fileRecord) {
			return fileRecord.getFilename();
		}
	}

	/**
	 * Modifies the information contained in the Error record based on the available map.
	 * 
	 * @param record The Error record to be modified.
	 */
	public modifyErrorInformation(record: ErrorInformationRecord) {
		const statementLine = parseInt(record.getStmtLine());
		const range = this.optimizedSourceLineRangeLookup(statementLine);

		if (!range) {
			throw new Error(`The line number on which ERROR occurs could not be found in the map.\n`
				+ `Faulty event: ${record.toString()}`);
		} else {
			try {
				record.setStmtLine(this.getLineFromSourceLineRange(range, statementLine).toString());
				record.setFileId(range.getInputFileID());

				const startLineNumber = parseInt(record.getStartErrLine());
				record.setStartErrLine(this.getLineFromSourceLineRange(range, startLineNumber).toString());

				const endLineNumber = parseInt(record.getEndErrLine());
				record.setEndErrLine(this.getLineFromSourceLineRange(range, endLineNumber).toString());

				record.setFileName((this.fileTable.get(range.getInputFileID())!).getFilename());
			} catch (e: any) {
				throw new Error(`Unable to parse the line fields of the ERROR record to integers\n`
					+ `Faulty record: ${record.toString()}`);
			}

		}
	}

	/**
	 * Calculates the line number based on the initial number and how many lines where 
	 * shifted in the expansion process.
	 * 
	 * @param range `SourceLineRange` that contains mapping information.
	 * @param initial The line number.
	 * @return The new line number.
	 */
	private getLineFromSourceLineRange(range: SourceLineRange, initial: number): number {
		if (!range) {
			return initial;
		}

		if (range.getInputEndLine() - range.getInputStartLine() === range.getOutputEndLine() - range.getOutputStartLine()) {
			return initial - range.getOutputStartLine() + range.getInputStartLine();
		}
		// Temporary fix for the problem where all errors in the last range get mapped to getInputStartLine
		// when the last range has open bounds
		else if (range.getInputEndLine() === -1 && range.getOutputEndLine() === -1) {
			return initial - range.getOutputStartLine() + range.getInputStartLine();
		} else {
			return range.getInputStartLine();
		}
	}

	public finalizeMap() {
		if (!this.files.isEmpty()) {
			throw new Error(
				`One or more FILEID records do not have matching FILEEND records\n`
				+ `List of outstanding FILEID records: ${JSON.stringify(this.files)}`);
		}

		this.queueExpansion.forEach(expansion => {
			this.handleExpansion(expansion);
		});

		// This handles errors at line 0 of the main source file.
		// Those are usually sev 40 errors.
		const header = new SourceLineRange("001");
		header.setInputStartLine(0);
		header.setInputEndLine(0);
		header.setOutputStartLine(0);
		header.setOutputEndLine(0);

		this.map.unshift(header);
	}

	/**
	 * Prints the map.
	 */
	public toString(): string {
		let buffer = '';

		this.map.forEach(range => {
			buffer += `${range.getInputFileID()}: [${range.getInputStartLine()},${range.getInputEndLine()}]`
				+ `-->[${range.getOutputStartLine()},${range.getOutputEndLine()}]\n`;
		});

		return buffer;
	}

	/**
	 * Get all file locations.
	 */
	public getAllFileIDRecords(): FileIDRecord[] {
		if (!this.fileTable || this.fileTable.size === 0) {
			return [];
		}

		const fileIDRecords = new Set<FileIDRecord>();

		for (let key of this.fileTable.keys()) {
			const fileIDRecord = this.fileTable.get(key)!;
			fileIDRecords.add(fileIDRecord);
		}

		return Array.from(fileIDRecords.values());
	}
}

interface Stack<T> {
	push(item: T): void;
	pop(): T | undefined;
	peek(): T | undefined;
	isEmpty(): boolean;
	size(): number;
}

class ArrayStack<T> implements Stack<T> {
	private stack: T[] = [];

	push(item: T): void {
		this.stack.push(item);
	}

	pop(): T | undefined {
		return this.stack.pop();
	}

	peek(): T | undefined {
		return this.stack[this.stack.length - 1];
	}

	isEmpty(): boolean {
		return this.stack.length === 0;
	}

	size(): number {
		return this.stack.length;
	}
}