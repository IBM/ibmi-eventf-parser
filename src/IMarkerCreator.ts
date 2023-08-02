import { ErrorInformationRecord } from "./record/ErrorInformationRecord";

/**
 * A call back object implementing this interface is called by the Parser whenever 
 * an ErrorInformationRecord is encountered.
 * This should provide all the required information to open an editor on the original file
 * and position or highlight the error.
 */
export interface IMarkerCreator {
	createMarker(record: ErrorInformationRecord, fileLocation: string, isReadOnly: string): void;
}