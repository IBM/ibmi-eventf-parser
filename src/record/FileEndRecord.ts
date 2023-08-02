/*
 * (c) Copyright IBM Corp. 2023
 */

import { IRecordT } from "./IRecordT";
import { IRecord } from "./IRecord";

/**
 * This class represents a File End record in an events file.
 */
export class FileEndRecord implements IRecord {
	constructor(private version: string, private fileId: string, private expansion: string) { }

	public getRecordType(): IRecordT {
		return IRecordT.FILE_END;
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
	 * Get the file id.
	 * 
	 * @return The file id.
	 */
	public getFileId(): string {
		return this.fileId;
	}

	/**
	 * Set the file id.
	 * 
	 * @param fileId The file id.
	 */
	public setFileId(fileId: string) {
		this.fileId = fileId;
	}

	/**
	 * Get the expansion.
	 * 
	 * @return The expansion.
	 */
	public getExpansion(): string {
		return this.expansion;
	}

	/**
	 * Set the expansion.
	 * 
	 * @param expansion The expansion.
	 */
	public setExpansion(expansion: string) {
		this.expansion = expansion;
	}
}