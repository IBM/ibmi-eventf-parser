/*
 * (c) Copyright IBM Corp. 2023
 */

import { IRecordT } from "./IRecordT";
import { IRecord } from "./IRecord";

/**
 * This class represents a File End record in an events file.
 */
export class FileEndRecord implements IRecord {
	constructor(private version: number, private fileId: number, private expansion: number) { }

	public getRecordType(): IRecordT {
		return IRecordT.FILE_END;
	}

	public getVersion(): number {
		return this.version;
	}

	/**
	 * Get the file id.
	 * 
	 * @return The file id.
	 */
	public getFileId(): number {
		return this.fileId;
	}

	/**
	 * Get the expansion.
	 * 
	 * @return The expansion.
	 */
	public getExpansion(): number {
		return this.expansion;
	}

	public toString(): string {
		return `${IRecordT.FILE_END}\t`
			+ `${this.version} ${this.fileId} ${this.expansion}`;
	}
}