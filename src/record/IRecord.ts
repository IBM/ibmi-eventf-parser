/*
 * (c) Copyright IBM Corp. 2023
 */

import { IRecordT } from "./IRecordT";

export interface IRecord {
    /**
     * Get the record type.
     * 
     * @return The record type.
     */
    getRecordType(): IRecordT;

    /**
     * Get the version.
     * 
     * @return The version.
     */
    getVersion(): number;

    /**
     * Get the string representation of the record.
     */
    toString(): string;
}