/*
 * (c) Copyright IBM Corp. 2023
 */

import { IRecordT } from "./IRecordT";
import { IRecord } from "./IRecord";

/**
 * This class represents an Expansion record in an Events File.
 */
export class ExpansionRecord implements IRecord {
	constructor(private version: string, private inputFileID: string, private inputLineStart: string,
		private inputLineEnd: string, private outputFileID: string, private outputLineStart: string,
		private outputLineEnd: string) { }

	public getRecordType(): IRecordT {
		return IRecordT.EXPANSION;
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
	 * Get the input file ID.
	 * 
	 * @return The input file ID.
	 */
	public getInputFileID(): string {
		return this.inputFileID;
	}

	/**
	 * Set the input file ID.
	 * 
	 * @param fileID The input file ID.
	 */
	public setInputFileID(fileID: string) {
		this.inputFileID = fileID;
	}

	/**
	 * Get the input line start.
	 * 
	 * @return The input line start.
	 */
	public getInputLineStart(): string {
		return this.inputLineStart;
	}

	/**
	 * Set the input line start.
	 * 
	 * @param lineStart The input line start.
	 */
	public setInputLineStart(lineStart: string) {
		this.inputLineStart = lineStart;
	}

	/**
	 * Get the input line end.
	 * 
	 * @return The input line end.
	 */
	public getInputLineEnd(): string {
		return this.inputLineEnd;
	}

	/**
	 * Set the input line end.
	 * 
	 * @param lineEnd The input line end.
	 */
	public setInputLineEnd(lineEnd: string) {
		this.inputLineEnd = lineEnd;
	}

	/**
	 * Get the output file ID.
	 * 
	 * @return The output file ID.
	 */
	public getOutputFileID(): string {
		return this.outputFileID;
	}

	/**
	 * Set the output file ID.
	 * 
	 * @param fileID The output file ID.
	 */
	public setOutputFileID(fileID: string) {
		this.outputFileID = fileID;
	}

	/**
	 * Get the output line start.
	 * 
	 * @return The output line start.
	 */
	public getOutputLineStart(): string {
		return this.outputLineStart;
	}

	/**
	 * Set the output line start.
	 * 
	 * @param lineStart The output line start.
	 */
	public setOutputLineStart(lineStart: string) {
		this.outputLineStart = lineStart;
	}

	/**
	 * Get the output line end.
	 * 
	 * @return The output line end.
	 */
	public getOutputLineEnd(): string {
		return this.outputLineEnd;
	}

	/**
	 * Set the output line end.
	 * 
	 * @param lineEnd The output line end.
	 */
	public setOutputLineEnd(lineEnd: string) {
		this.outputLineEnd = lineEnd;
	}
}
