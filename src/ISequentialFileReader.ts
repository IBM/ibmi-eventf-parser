/*
 * (c) Copyright IBM Corp. 2023
 */

/**
 * Iterates through a sequential file or other source and provides one line at a time.
 * 
 * An example implementation to read a file from a filesystem:
 * 
 * @example
 * 	export default class FileReader implements ISequentialFileReader {
 * 		file: string;
 * 		linesArray: string[];
 * 		currLineNum = 0;
 *
 * 		constructor(fileName: string) {
 *   		this.file = readFileSync(fileName, 'utf-8');
 *   		this.linesArray = this.file.split(/\r?\n/)
 * 		}
 *
 * 		public readNextLine() {
 *			let line: string | undefined;
 *			if (this.currLineNum < this.linesArray.length) {
 *				line = this.linesArray[this.currLineNum];
 *				this.currLineNum++;
 *			} else {
 *				line = undefined;
 *			}
 *			return line;
 *		}
 *	}
 * 
 */
export interface ISequentialFileReader {
	/**
	 * Get the next line.
	 * 
	 * @return The next line.
	 **/
	readNextLine(): string | undefined;
}