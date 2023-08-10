/*
 * (c) Copyright IBM Corp. 2023
 */

import { IRecordT } from "./IRecordT";
import { IRecord } from "./IRecord";

/**
 * This class represents a Processor record in an events file.
 */
export class ProcessorRecord implements IRecord {
	constructor(private version: number, private outputId: number, private lineClass: number) { }

	public getRecordType(): IRecordT {
		return IRecordT.PROCESSOR;
	}

	public getVersion(): number {
		return this.version;
	}

	/**
	 * Get the output id.
	 * 
	 * @return The output id.
	 */
	public getOutputId(): number {
		return this.outputId;
	}

	/**
	 * Get the line class.
	 * 
	 * @return The line class.
	 */
	public getLineClass(): number {
		return this.lineClass;
	}
}