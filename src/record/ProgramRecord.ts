/*
 * (c) Copyright IBM Corp. 2023
 */

import { IRecord } from "./IRecord";
import { IRecordT } from "./IRecordT";

/**
 * This class represents a Program record in an events file.
 */
export class ProgramRecord implements IRecord {
	constructor(private version: string, private line: string) { }

	public getRecordType(): IRecordT {
		return IRecordT.PROGRAM;
	}

	/**
	 * Get the version.
	 * 
	 * @return The version.
	 */
	public getVersion(): string {
		return this.version;
	}

	/**
	 * Set the version.
	 * 
	 * @param version The version.
	 */
	public setVersion(version: string) {
		this.version = version;
	}

	/**
	 * Get the line.
	 * 
	 * @return The line.
	 */
	public getLine(): string {
		return this.line;
	}

	/**
	 * Set the line.
	 * 
	 * @param line The line.
	 */
	public setLine(line: string) {
		this.line = line;
	}
}
