/*
 * (c) Copyright IBM Corp. 2023
 */

import { IRecordT } from './IRecordT';
import { IRecord } from './IRecord';

/**
 * This class represents a Timestamp record in an events file.
 */
export class TimestampRecord implements IRecord {
	constructor(private version: string, private timestamp: string) { }

	public getRecordType(): IRecordT {
		return IRecordT.TIMESTAMP;
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
	 * Get the timestamp.
	 * 
	 * @return The timestamp.
	 */
	public getTimestamp(): string {
		return this.timestamp;
	}

	/**
	 * Set the timestamp.
	 * 
	 * @param timestamp The timestamp.
	 */
	public setTimestamp(timestamp: string) {
		this.timestamp = timestamp;
	}
}