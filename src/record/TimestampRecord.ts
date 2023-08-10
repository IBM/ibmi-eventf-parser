/*
 * (c) Copyright IBM Corp. 2023
 */

import { IRecordT } from './IRecordT';
import { IRecord } from './IRecord';

/**
 * This class represents a Timestamp record in an events file.
 */
export class TimestampRecord implements IRecord {
	constructor(private version: number, private timestamp: string) { }

	public getRecordType(): IRecordT {
		return IRecordT.TIMESTAMP;
	}

	public getVersion(): number {
		return this.version;
	}

	/**
	 * Get the timestamp.
	 * 
	 * @return The timestamp.
	 */
	public getTimestamp(): string {
		return this.timestamp;
	}

	public toString(): string {
		return `${IRecordT.TIMESTAMP}\t`
			+ `${this.version} ${this.timestamp}`;
	}
}