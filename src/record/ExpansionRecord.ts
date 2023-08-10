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
	 * Get the input file ID.
	 * 
	 * @return The input file ID.
	 */
	public getInputFileID(): number {
		return this.inputFileID;
	}

	/**
	 * Set the input file ID.
	 * 
	 * @param fileID The input file ID.
	 */
	public setInputFileID(fileID: number) {
		this.inputFileID = fileID;
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
	 * Set the input line start.
	 * 
	 * @param lineStart The input line start.
	 */
	public setInputLineStart(lineStart: number) {
		this.inputLineStart = lineStart;
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
	 * Set the input line end.
	 * 
	 * @param lineEnd The input line end.
	 */
	public setInputLineEnd(lineEnd: number) {
		this.inputLineEnd = lineEnd;
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
	 * Set the output file ID.
	 * 
	 * @param fileID The output file ID.
	 */
	public setOutputFileID(fileID: number) {
		this.outputFileID = fileID;
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
	 * Set the output line start.
	 * 
	 * @param lineStart The output line start.
	 */
	public setOutputLineStart(lineStart: number) {
		this.outputLineStart = lineStart;
	}

	/**
	 * Get the output line end.
	 * 
	 * @return The output line end.
	 */
	public getOutputLineEnd(): number {
		return this.outputLineEnd;
	}

	/**
	 * Set the output line end.
	 * 
	 * @param lineEnd The output line end.
	 */
	public setOutputLineEnd(lineEnd: number) {
		this.outputLineEnd = lineEnd;
	}
}
