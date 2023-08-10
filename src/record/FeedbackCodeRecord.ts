/*
 * (c) Copyright IBM Corp. 2023
 */

import { IRecordT } from "./IRecordT";
import { IRecord } from "./IRecord";

/**
 * This class represents a Feedback Code record in an events file.
 */
export class FeedbackCodeRecord implements IRecord {
	constructor(private version: number, private returnCode: number, private reasonCode: string) { }

	public getRecordType(): IRecordT {
		return IRecordT.FEEDBACK_CODE;
	}

	public getVersion(): number {
		return this.version;
	}

	/**
	 * Get the return code.
	 * 
	 * @return The return code.
	 */
	public getReturnCode(): number {
		return this.returnCode;
	}

	/**
	 * Get the reason code.
	 * 
	 * @return The reason code.
	 */
	public getReasonCode(): string {
		return this.reasonCode;
	}
}