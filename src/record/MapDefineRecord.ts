/*
 * (c) Copyright IBM Corp. 2023
 */

import { IRecordT } from "./IRecordT";
import { IRecord } from "./IRecord";

/**
 * This class represents a Map Define record in an events file.
 */
export class MapDefineRecord implements IRecord {
	constructor(private version: number, private macroId: number, private line: number,
		private length: number, private macroName: string) { }

	public getRecordType(): IRecordT {
		return IRecordT.MAP_DEFINE;
	}

	public getVersion(): number {
		return this.version;
	}

	/**
	 * Get the macro id.
	 * 
	 * @return The macro id.
	 */
	public getMacroId(): number {
		return this.macroId;
	}

	/**
	 * Get the line.
	 * 
	 * @return The line.
	 */
	public getLine(): number {
		return this.line;
	}

	/**
	 * Get the length.
	 * 
	 * @return The length.
	 */
	public getLength(): number {
		return this.length;
	}

	/**
	 * Get the macro name.
	 * 
	 * @return The macro name.
	 */
	public getMacroName(): string {
		return this.macroName;
	}
}