import { ISequentialFileReader } from '../src/ISequentialFileReader';
import { readFileSync } from 'fs';

export default class TestDataReader implements ISequentialFileReader {
    file = readFileSync('testfixtures/evf/LITINERR.PGM.evfevent', 'utf-8');
    linesArray = this.file.split('\n');
    currLineNum = 0;

    public readNextLine() {
        let line: string | null;
        if (this.currLineNum < this.linesArray.length) {
            line = this.linesArray[this.currLineNum];
            this.currLineNum++;
        } else {
            line = null;
        }
        return line;
    }
}