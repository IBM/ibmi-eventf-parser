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
}