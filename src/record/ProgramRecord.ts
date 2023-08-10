/*
 * (c) Copyright IBM Corp. 2023
 */

import { IRecord } from "./IRecord";
import { IRecordT } from "./IRecordT";

/**
 * This class represents a Program record in an events file.
 */
export class ProgramRecord implements IRecord {
	constructor(private version: number, private line: number) { }

	public getRecordType(): IRecordT {
		return IRecordT.PROGRAM;
	}

	public getVersion(): number {
		return this.version;
	}

	/**
	 * Get the line.
	 * 
	 * @return The line.
	 */
	public getLine(): number {
		return this.line;
	}
}
