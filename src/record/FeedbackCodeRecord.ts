/*
 * (c) Copyright IBM Corp. 2023
 */

import { IRecordT } from "./IRecordT";
import { IRecord } from "./IRecord";

/**
 * This class represents a Feedback Code record in an events file.
 */
export class FeedbackCodeRecord implements IRecord {
	constructor(private returnCode: number, private reasonCode: string) { }

	public getRecordType(): IRecordT {
		return IRecordT.FEEDBACK_CODE;
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
	 * Set the return code.
	 * 
	 * @param returnCode The return code.
	 */
	public setReturnCode(returnCode: number) {
		this.returnCode = returnCode;
	}

	/**
	 * Get the reason code.
	 * 
	 * @return The reason code.
	 */
	public getReasonCode(): string {
		return this.reasonCode;
	}

	/**
	 * Set the reason code.
	 * 
	 * @param reasonCode The reason code.
	 */
	public setReasonCode(reasonCode: string) {
		this.reasonCode = reasonCode;
	}
}