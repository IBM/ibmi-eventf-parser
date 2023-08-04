/*
 * (c) Copyright IBM Corp. 2023
 */

import { IMarkerCreator } from "../src/IMarkerCreator";
import { ErrorInformationRecord } from "../src/record/ErrorInformationRecord";

export class MarkerCreator implements IMarkerCreator {
    private errors: Error[] = [];

    public createMarker(record: ErrorInformationRecord, fileLocation: string, isReadOnly: string) {
        this.errors.push(new Error(fileLocation, parseInt(record.getStmtLine()), record.getMsg()));
    }

    public getErrorCount(): number {
        return this.errors.length;
    }

    public equals(index: number, fileName: string, startErrLine: number, msg: string): boolean {
        if (index >= this.errors.length) {
            return false;
        }

        const error: Error = this.errors[index];
        return error.equals(new Error(fileName, startErrLine, msg));
    }
}


class Error {
    constructor(private fileName: string, private startErrLine: number, private msg: string) { }

    public equals(expected: Error): boolean {
        if (this.fileName !== expected.fileName) {
            console.log(`Expected: ${expected.fileName} got ${this.fileName}`);
            return false;
        } else if (this.startErrLine !== expected.startErrLine) {
            console.log(`Expected: ${expected.startErrLine} got ${this.startErrLine}`);
            return false;
        } else if (this.msg !== expected.msg) {
            console.log(`Expected: ${expected.msg} got ${this.msg}`);
            return false;
        }

        return true;
    }
}