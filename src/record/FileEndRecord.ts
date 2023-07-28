/* IBM Confidential
 * OCO Source Materials
 * 5900-AN9
 * (c) Copyright IBM Corp. 2003, 2023
 * The source code for this program is not published or otherwise divested of its trade secrets,
 * irrespective of what has been deposited with the U.S. Copyright Office.
 *
 */
import { IRecordType } from "./IRecordType";
import { IRecord } from "./IRecord";

/**
 * This class represents a File End record in an events file.
 */
export class FileEndRecord implements IRecord {
	constructor(private version: string, private fileId: string, private expansion: string) {
	}

	/**
	 * @see com.ibm.etools.iseries.core.evfparser.IISeriesEventsFileRecordType#getRecordType()
	 */
	public getRecordType(): string {
		return IRecordType.FILE_END;
	}

	/**
	 * Set the version.
	 * @param the version
	 */
	public setVersion(version: string) {
		this.version = version;
	}

	/**
	 * Get the version.
	 * @return the version
	 */
	public getVersion(): string {
		return this.version;
	}

	/**
	 * Set the file id.
	 * @param the file id
	 */
	public setFileId(fileId: string) {
		this.fileId = fileId;
	}

	/**
	 * Get the file id.
	 * @return the file id
	 */
	public getFileId(): string {
		return this.fileId;
	}

	/**
	 * Set the expansion.
	 * @param the expansion
	 */
	public setExpansion(expansion: string) {
		this.expansion = expansion;
	}

	/**
	 * Get the expansion.
	 * @return the expansion
	 */
	public getExpansion(): string {
		return this.expansion;
	}
}