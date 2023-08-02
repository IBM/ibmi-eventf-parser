/**
 * IBM Confidential
 * OCO Source Materials
 * 5900-AN9
 * (c) Copyright IBM Corp. 2021
 * The source code for this program is not published or otherwise divested of its trade secrets,
 * irrespective of what has been deposited with the U.S. Copyright Office.
 */

import { IRecord } from "./IRecord";
import { IRecordT } from "./IRecordT";

/**
 * This class represents a Program record in an events file.
 */
export class ProgramRecord implements IRecord {
	constructor(private version: string, private line: string) { }

	public getRecordType(): IRecordT {
		return;
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
