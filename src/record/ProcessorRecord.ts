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
	 * Get the output id.
	 * 
	 * @return The output id.
	 */
	public getOutputId(): number {
		return this.outputId;
	}

	/**
	 * Set the output id.
	 * 
	 * @param outputId The output id.
	 */
	public setOutputId(outputId: number) {
		this.outputId = outputId;
	}

	/**
	 * Get the line class.
	 * 
	 * @return The line class.
	 */
	public getLineClass(): number {
		return this.lineClass;
	}

	/**
	 * Set the line class.
	 * 
	 * @param lineClass The line class.
	 */
	public setLineClass(lineClass: number) {
		this.lineClass = lineClass;
	}
}