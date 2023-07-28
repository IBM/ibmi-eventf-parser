import { ISequentialFileReader } from '../src/ISequentialFileReader';
import { readFileSync } from 'fs';

const TEST_DIR = 'testfixtures/evf';

export default class TestDataReader implements ISequentialFileReader {
    file: string;
    linesArray: string[];
    currLineNum = 0;

    constructor(fileName: string) {
        this.file = readFileSync(`${TEST_DIR}/${fileName}`, 'utf-8');
        this.linesArray = this.file.split(/\r?\n/)
    }

    public readNextLine() {
        let line: string | undefined;
        if (this.currLineNum < this.linesArray.length) {
            line = this.linesArray[this.currLineNum];
            this.currLineNum++;
        } else {
            line = undefined;
        }
        return line;
    }
}