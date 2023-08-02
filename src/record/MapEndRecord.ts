/**
 * IBM Confidential
 * OCO Source Materials
 * 5900-AN9
 * (c) Copyright IBM Corp. 2003, 2021
 * The source code for this program is not published or otherwise divested of its trade secrets,
 * irrespective of what has been deposited with the U.S. Copyright Office.
 */

import { IRecordT } from "./IRecordT";
import { IRecord } from "./IRecord";

/**
 * This class represents a Map End record in an events file.
 */
export class MapEndRecord implements IRecord {
	constructor(private version: string, private macroId: string, private line: string,
		private expansion: string) { }

	public getRecordType(): IRecordT {
		return IRecordT.MAP_END;
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
	 * Get the expansion.
	 * 
	 * @return The expansion.
	 */
	public getExpansion(): string {
		return this.expansion;
	}

	/**
	 * Set the expansion.
	 * 
	 * @param expansion The expansion.
	 */
	public setExpansion(expansion: string) {
		this.expansion = expansion;
	}
}
