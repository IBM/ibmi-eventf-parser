/**
 * IBM Confidential
 * OCO Source Materials
 * 5900-AN9
 * (c) Copyright IBM Corp. 2003, 2023
 * The source code for this program is not published or otherwise divested of its trade secrets,
 * irrespective of what has been deposited with the U.S. Copyright Office.
 */

import { IRecordT } from "./IRecordT";
import { IRecord } from "./IRecord";

/**
 * This class represents a File ID record in an events file.
 */
export class FileIDRecord implements IRecord {
	constructor(private version: string, private sourceId: string, private line: string,
		private length: string, private filename: string, private timestamp: string,
		private flag: string) { }

	public getRecordType(): IRecordT {
		return IRecordT.FILE_ID;
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
	 * Get the source id.
	 * 
	 * @return The source id.
	 */
	public getSourceId(): string {
		return this.sourceId;
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
	 * Get the length.
	 * 
	 * @return The length.
	 */
	public getLength(): string {
		return this.length;
	}

	/**
	 * Get the filename.
	 * 
	 * @return The filename.
	 */
	public getFilename(): string {
		return this.filename;
	}

	/**
	 * Get the timestamp.
	 * 
	 * @return The timestamp.
	 */
	public getTimestamp(): string {
		return this.timestamp;
	}

	/**
	 * Get the flag.
	 * 
	 * @return The flag.
	 */
	public getFlag(): string {
		return this.flag;
	}
}
