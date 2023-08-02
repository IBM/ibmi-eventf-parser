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
 * This class represents a Error Information record in an events file.
 */
export class ErrorInformationRecord implements IRecord {
	// Source file name corresponding to file id - is computed later
	private fileName: string = "";

	constructor(private version: string, private fileId: string, private annotClass: string,
		private stmtLine: string, private startErrLine: string, private tokenStart: string,
		private endErrLine: string, private tokenEnd: string, private msgId: string,
		private sevChar: string, private sevNum: string, private length: string, private msg: string) { }

	getRecordType(): IRecordT {
		return IRecordT.ERROR_INFORMATION;
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
	 * Get the file id.
	 * 
	 * @return The file id.
	 */
	public getFileId(): string {
		return this.fileId;
	}

	/**
	 * Set the file id.
	 * 
	 * @param fileId The file id.
	 */
	public setFileId(fileId: string) {
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
	public getAnnotClass(): string {
		return this.annotClass;
	}

	/**
	 * Set the annotation class.
	 * 
	 * @param annotClass The annotation class.
	 */
	public setAnnotClass(annotClass: string) {
		this.annotClass = annotClass;
	}

	/**
	 * Get the statement line.
	 * 
	 * @return The statement line.
	 */
	public getStmtLine(): string {
		return this.stmtLine;
	}

	/**
	 * Set the statement line.
	 * 
	 * @param stmtLine The statement line.
	 */
	public setStmtLine(stmtLine: string) {
		this.stmtLine = stmtLine;
	}

	/**
	 * Get the starting error line.
	 * 
	 * @return The starting error line.
	 */
	public getStartErrLine(): string {
		return this.startErrLine;
	}

	/**
	 * Set the starting error line.
	 * 
	 * @param startErrLine The starting error line.
	 */
	public setStartErrLine(startErrLine: string) {
		this.startErrLine = startErrLine;
	}

	/**
	 * Get the starting error column.
	 * 
	 * @return The starting error column.
	 */
	public getTokenStart(): string {
		return this.tokenStart;
	}

	/**
	 * Set the starting error column.
	 * 
	 * @param tokenStart The starting error column.
	 */
	public setTokenStart(tokenStart: string) {
		this.tokenStart = tokenStart;
	}

	/**
	 * Get the ending error line.
	 * 
	 * @return The ending error line.
	 */
	public getEndErrLine(): string {
		return this.endErrLine;
	}

	/**
	 * Set the ending error line.
	 * 
	 * @param endErrLine The ending error line.
	 */
	public setEndErrLine(endErrLine: string) {
		this.endErrLine = endErrLine;
	}

	/**
	 * Get the ending error column.
	 * 
	 * @return The ending error column.
	 */
	public getTokenEnd(): string {
		return this.tokenEnd;
	}

	/**
	 * Set the ending error column.
	 * 
	 * @param tokenEnd The ending error column.
	 */
	public setTokenEnd(tokenEnd: string) {
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
	public getSevNum(): string {
		return this.sevNum;
	}

	/**
	 * Get the length of the message.
	 * 
	 * @return The length of the message.
	 */
	public getLength(): string {
		return this.length;
	}

	/**
	 * Set the length of the message.
	 * 
	 * @param length The length of the message.
	 */
	public setLength(length: string) {
		this.length = length;
	}

	/**
	 * Get the message.
	 * 
	 * @return The message.
	 */
	public getMsg(): string {
		return this.msg;
	}
}