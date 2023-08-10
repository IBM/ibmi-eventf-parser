/*
 * (c) Copyright IBM Corp. 2023
 */
import { IRecordT } from "./IRecordT";
import { IRecord } from "./IRecord";

/**
 * This class represents a Map End record in an events file.
 */
export class MapEndRecord implements IRecord {
	constructor(private version: number, private macroId: number, private line: number,
		private expansion: number) { }

	public getRecordType(): IRecordT {
		return IRecordT.MAP_END;
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
	 * Get the expansion.
	 * 
	 * @return The expansion.
	 */
	public getExpansion(): number {
		return this.expansion;
	}

	public toString(): string {
		return `${IRecordT.MAP_END}\t`
			+ `${this.version} ${this.macroId} ${this.line} ${this.expansion}`;
	}
}
