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

	/**
	 * Get the version.
	 * 
	 * @return The version.
	 */
	public getVersion(): number {
		return this.version;
	}

	/**
	 * Set the version.
	 * 
	 * @param version The version.
	 */
	public setVersion(version: number) {
		this.version = version;
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
	 * Set the file id.
	 * 
	 * @param fileId The file id.
	 */
	public setFileId(fileId: number) {
		this.fileId = fileId;
	}

	/**
	 * Get the expansion.
	 * 
	 * @return The expansion.
	 */
	public getExpansion(): number {
		return this.expansion;
	}

	/**
	 * Set the expansion.
	 * 
	 * @param expansion The expansion.
	 */
	public setExpansion(expansion: number) {
		this.expansion = expansion;
	}
}