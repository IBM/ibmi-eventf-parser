/*
 * (c) Copyright IBM Corp. 2023
 */

import { IRecordT } from "./IRecordT";
import { IRecord } from "./IRecord";

/**
 * This class represents a Map Define record in an events file.
 */
export class MapDefineRecord implements IRecord {
	constructor(private version: string, private macroId: string, private line: string,
		private length: string, private macroName: string) { }

	public getRecordType(): IRecordT {
		return IRecordT.MAP_DEFINE;
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
	 * Get the macro id.
	 * 
	 * @return The macro id.
	 */
	public getMacroId(): string {
		return this.macroId;
	}

	/**
	 * Set the macro id.
	 * 
	 * @param macroId The macro id.
	 */
	public setMacroId(macroId: string) {
		this.macroId = macroId;
	}

	/**
	 * Get the line.
	 * 
	 * @return The line.
	 */
	public getLine(): string {
		return this.line;
	}

	/**
	 * Set the line.
	 * 
	 * @param line The line.
	 */
	public setLine(line: string) {
		this.line = line;
	}

	/**
	 * Get the length.
	 * 
	 * @return The length.
	 */
	public getLength(): string {
		return this.length;
	}

	/**
	 * Set the length.
	 * 
	 * @param length The length.
	 */
	public setLength(length: string) {
		this.length = length;
	}

	/**
	 * Get the macro name.
	 * 
	 * @return The macro name.
	 */
	public getMacroName(): string {
		return this.macroName;
	}

	/**
	 * Set the macro name.
	 * 
	 * @param macroName The macro name.
	 */
	public setMacroName(macroName: string) {
		this.macroName = macroName;
	}
}