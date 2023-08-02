import { ErrorInformationRecord } from "./record/ErrorInformationRecord";

export interface IMarkerCreator {
	createMarker(record: ErrorInformationRecord, fileLocation: string, isReadOnly: string): void;

	/**
	 * If we encounter a connection name on the FILE.
	 * Keeps track of whether this check has already been done in the field.
	 */
	updateConnectionName(location: string, indexEndBracket: number): void;
}