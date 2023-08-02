/**
 * IBM Confidential
 * OCO Source Materials
 * 5900-AN9
 * (c) Copyright IBM Corp. 2021
 * The source code for this program is not published or otherwise divested of its trade secrets,
 * irrespective of what has been deposited with the U.S. Copyright Office.
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