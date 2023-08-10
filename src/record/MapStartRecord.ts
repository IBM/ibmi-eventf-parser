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

	public toString(): string {
		return `${IRecordT.MAP_START}\t`
			+ `${this.version} ${this.macroId} ${this.line}`;
	}
}