/*
 * (c) Copyright IBM Corp. 2023
 */

import { IRecordT } from "./IRecordT";
import { IRecord } from "./IRecord";

/**
 * This class represents a File ID record in an events file.
 */
export class FileIDRecord implements IRecord {
	constructor(private version: number, private sourceId: number, private line: number,
		private length: number, private filename: string, private timestamp: string,
		private flag: number) { }

	public getRecordType(): IRecordT {
		return IRecordT.FILE_ID;
	}

	public getVersion(): number {
		return this.version;
	}

	/**
	 * Get the source id.
	 * 
	 * @return The source id.
	 */
	public getSourceId(): number {
		return this.sourceId;
	}

	/**
	 * Get the line.
	 * 
	 * @return The line.
	 */
	public getLine(): number {
		return this.line;
	}

	/**
	 * Get the length.
	 * 
	 * @return The length.
	 */
	public getLength(): number {
		return this.length;
	}

	/**
	 * Get the filename.
	 * 
	 * @return The filename.
	 */
	public getFileName(): string {
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
	public getFlag(): number {
		return this.flag;
	}
}
