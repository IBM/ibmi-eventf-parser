/*
 * (c) Copyright IBM Corp. 2023
 */

import { IRecordT } from "./IRecordT";
import { IRecord } from "./IRecord";

/**
 * This class represents a Error Information record in an events file.
 */
export class ErrorInformationRecord implements IRecord {
	// Source file name corresponding to file id - is computed later
	private fileName: string = "";

	constructor(private version: number, private fileId: number, private annotClass: number,
		private stmtLine: number, private startErrLine: number, private tokenStart: number,
		private endErrLine: number, private tokenEnd: number, private msgId: string,
		private sevChar: string, private sevNum: number, private length: number,
		private msg: string) { }

	getRecordType(): IRecordT {
		return IRecordT.ERROR_INFORMATION;
	}

	public getVersion(): number {
		return this.version;
	}

	/**
	 * Get the file id.
	 * 
	 * @return The file id.
	 */
	public getFileId(): number {
		return this.fileId;
	}

	/**
	 * Set the file id.
	 * 
	 * @param fileId The file id.
	 */
	public setFileId(fileId: number) {
		this.fileId = fileId;
	}

	/**
	 * Get the file name.
	 * 
	 * @return The file id.
	 */
	public getFileName(): string {
		return this.fileName;
	}

	/**
	 * Set the file name.
	 * 
	 * @param fileName The file id.
	 */
	public setFileName(fileName: string) {
		this.fileName = fileName;
	}

	/**
	 * Get the annotation class.
	 * 
	 * @return The annotation class.
	 */
	public getAnnotClass(): number {
		return this.annotClass;
	}

	/**
	 * Get the statement line.
	 * 
	 * @return The statement line.
	 */
	public getStmtLine(): number {
		return this.stmtLine;
	}

	/**
	 * Set the statement line.
	 * 
	 * @param stmtLine The statement line.
	 */
	public setStmtLine(stmtLine: number) {
		this.stmtLine = stmtLine;
	}

	/**
	 * Get the starting error line.
	 * 
	 * @return The starting error line.
	 */
	public getStartErrLine(): number {
		return this.startErrLine;
	}

	/**
	 * Set the starting error line.
	 * 
	 * @param startErrLine The starting error line.
	 */
	public setStartErrLine(startErrLine: number) {
		this.startErrLine = startErrLine;
	}

	/**
	 * Get the starting error column.
	 * 
	 * @return The starting error column.
	 */
	public getTokenStart(): number {
		return this.tokenStart;
	}

	/**
	 * Set the starting error column.
	 * 
	 * @param tokenStart The starting error column.
	 */
	public setTokenStart(tokenStart: number) {
		this.tokenStart = tokenStart;
	}

	/**
	 * Get the ending error line.
	 * 
	 * @return The ending error line.
	 */
	public getEndErrLine(): number {
		return this.endErrLine;
	}

	/**
	 * Set the ending error line.
	 * 
	 * @param endErrLine The ending error line.
	 */
	public setEndErrLine(endErrLine: number) {
		this.endErrLine = endErrLine;
	}

	/**
	 * Get the ending error column.
	 * 
	 * @return The ending error column.
	 */
	public getTokenEnd(): number {
		return this.tokenEnd;
	}

	/**
	 * Set the ending error column.
	 * 
	 * @param tokenEnd The ending error column.
	 */
	public setTokenEnd(tokenEnd: number) {
		this.tokenEnd = tokenEnd;
	}

	/**
	 * Get the message id.
	 * 
	 * @return The message id.
	 */
	public getMsgId(): string {
		return this.msgId;
	}

	/**
	 * Get the severity code.
	 * 
	 * @return The severity code.
	 */
	public getSevChar(): string {
		return this.sevChar;
	}

	/**
	 * Get the severity level number.
	 * 
	 * @return The severity level number.
	 */
	public getSevNum(): number {
		return this.sevNum;
	}

	/**
	 * Get the length of the message.
	 * 
	 * @return The length of the message.
	 */
	public getLength(): number {
		return this.length;
	}

	/**
	 * Get the message.
	 * 
	 * @return The message.
	 */
	public getMsg(): string {
		return this.msg;
	}

	public toString(): string {
		return `${IRecordT.ERROR_INFORMATION}\t`
			+ `${this.version} ${this.fileId} ${this.annotClass} ${this.stmtLine} ${this.startErrLine} `
			+ `${this.tokenStart} ${this.endErrLine} ${this.tokenEnd} ${this.msgId} ${this.sevChar} `
			+ `${this.sevNum} ${this.length} ${this.msg}`;
	}
}