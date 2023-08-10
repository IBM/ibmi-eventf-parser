/*
 * (c) Copyright IBM Corp. 2023
 */

import { IRecordT } from "./IRecordT";
import { IRecord } from "./IRecord";

/**
 * This class represents an Expansion record in an Events File.
 */
export class ExpansionRecord implements IRecord {
	constructor(private version: number, private inputFileID: number, private inputLineStart: number,
		private inputLineEnd: number, private outputFileID: number, private outputLineStart: number,
		private outputLineEnd: number) { }

	public getRecordType(): IRecordT {
		return IRecordT.EXPANSION;
	}

	public getVersion(): number {
		return this.version;
	}

	/**
	 * Get the input file ID.
	 * 
	 * @return The input file ID.
	 */
	public getInputFileID(): number {
		return this.inputFileID;
	}

	/**
	 * Get the input line start.
	 * 
	 * @return The input line start.
	 */
	public getInputLineStart(): number {
		return this.inputLineStart;
	}

	/**
	 * Get the input line end.
	 * 
	 * @return The input line end.
	 */
	public getInputLineEnd(): number {
		return this.inputLineEnd;
	}

	/**
	 * Get the output file ID.
	 * 
	 * @return The output file ID.
	 */
	public getOutputFileID(): number {
		return this.outputFileID;
	}

	/**
	 * Get the output line start.
	 * 
	 * @return The output line start.
	 */
	public getOutputLineStart(): number {
		return this.outputLineStart;
	}

	/**
	 * Get the output line end.
	 * 
	 * @return The output line end.
	 */
	public getOutputLineEnd(): number {
		return this.outputLineEnd;
	}

	public toString(): string {
		return `${IRecordT.EXPANSION}\t`
			+ `${this.version} ${this.inputFileID} ${this.inputLineStart} ${this.inputLineEnd} ${this.outputFileID} `
			+ `${this.outputLineStart} ${this.outputLineEnd}`;
	}
}
