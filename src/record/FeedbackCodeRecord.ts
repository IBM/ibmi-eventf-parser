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
 * This class represents a Feedback Code record in an events file.
 */
export class FeedbackCodeRecord implements IRecord {
	constructor(private returnCode: string, private reasonCode: string) { }

	public getRecordType(): IRecordT {
		return IRecordT.FEEDBACK_CODE;
	}

	/**
	 * Get the return code.
	 * 
	 * @return The return code.
	 */
	public getReturnCode(): string {
		return this.returnCode;
	}

	/**
	 * Set the return code.
	 * 
	 * @param returnCode The return code.
	 */
	public setReturnCode(returnCode: string) {
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