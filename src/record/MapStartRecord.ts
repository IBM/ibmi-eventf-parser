/*
 * (c) Copyright IBM Corp. 2023
 */

import { IRecordT } from "./IRecordT";
import { IRecord } from "./IRecord";

/**
 * This class represents a Map Start record in an events file.
 */
export class MapStartRecord implements IRecord {
	constructor(private version: number, private macroId: number, private line: number) { }

	public getRecordType(): IRecordT {
		return IRecordT.MAP_START;
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
	 * Get the macro id.
	 * 
	 * @return The macro id.
	 */
	public getMacroId(): number {
		return this.macroId;
	}

	/**
	 * Set the macro id.
	 * 
	 * @param macroId The macro id.
	 */
	public setMacroId(macroId: number) {
		this.macroId = macroId;
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
	 * Set the line.
	 * 
	 * @param line The line.
	 */
	public setLine(line: number) {
		this.line = line;
	}
}