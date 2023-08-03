/*
 * (c) Copyright IBM Corp. 2023
 */

/**
 * Iterates through a sequential file and provides one line at a time.
 */
export interface ISequentialFileReader {
	/**
	 * Get the next line.
	 * 
	 * @return The next line.
	 **/
	readNextLine(): string | undefined;
}