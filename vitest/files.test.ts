import { assert, describe, expect, it } from 'vitest'
import { Parser } from '../src/Parser';
import TestDataReader from './TestDataReader';
import { ErrorInformationRecord } from '../src/record/ErrorInformationRecord';
import { FileIDRecord } from '../src/record/FileIDRecord';
import * as fs from 'fs';

describe('Tests', () => {
    const parser = new Parser();
    it('test LITINERR', () => {
        const fileReader = new TestDataReader('LITINERR.PGM.evfevent');
        parser.parse(fileReader, 37);

        const errors = parser.getAllErrors();
        const expectedError = new ErrorInformationRecord('0', '001', '0', '000000', '000000', '000', '000000', '000', 'RNS9308', 'T', '50', '057', 'Compilation stopped. Severity 20 errors found in program.');
        expectedError.setFileName('/home/REINHARD/builds/hll/literalInMessage.pgm.rpgle');
        assert.deepStrictEqual(errors, [expectedError]);

        const fileIDRecords = parser.getAllFileIDRecords();
        const expectedFileIDRecord = new FileIDRecord('0', '001', '000000', '52', '/home/REINHARD/builds/hll/literalInMessage.pgm.rpgle', '20230713185804', '0');
        assert.deepStrictEqual(fileIDRecords, [expectedFileIDRecord]);

        const exceptions = parser.getException();
        assert.strictEqual(exceptions, undefined);
    });

    it('test SQLCPP', () => {
        const fileReader = new TestDataReader('SQLCPP.PGM.evfevent');
        parser.parse(fileReader, 37);

        //assert here
        const errors = parser.getAllErrors();
        const expectedError = new ErrorInformationRecord('0', '001', '0', '000000', '000000', '000', '000000', '000', 'RNS9308', 'T', '50', '057', 'Compilation stopped. Severity 20 errors found in program.');
        expectedError.setFileName('/home/REINHARD/builds/hll/literalInMessage.pgm.rpgle');
        assert.deepStrictEqual(errors, [expectedError]);

        const fileIDRecords = parser.getAllFileIDRecords();
        const expectedFileIDRecord = new FileIDRecord('0', '001', '000000', '60', '/home/REINHARD/bob-recursive-example/QSQLCSRC/ANZ_FILE2.SQLC', '20230429010835', '0');
        assert.deepStrictEqual(fileIDRecords, [expectedFileIDRecord]);

        const exceptions = parser.getException();
        assert.strictEqual(exceptions.message, "Cannot read property 'getInputFileID' of undefined");
    });

    it('test SQLRPGLE', () => {
        const fileReader = new TestDataReader('SQLRPGLE.PGM.evfevent');
        parser.parse(fileReader, 37);

        //assert here
        const errors = parser.getAllErrors();
        const expectedErrors: ErrorInformationRecord[] = new Array<ErrorInformationRecord>();
        errors.forEach(element => {
            const currErrorInfo = new ErrorInformationRecord(element.getVersion(), element.getFileId(), element.getAnnotClass(), element.getStmtLine(), element.getStartErrLine(),
                element.getTokenStart(), element.getEndErrLine(), element.getTokenEnd(), element.getMsgId(), element.getSevChar(), element.getSevNum(), 
                element.getLength(), element.getMsg());
            currErrorInfo.setFileName(element.getFileName());
            expectedErrors.push(currErrorInfo);
        });
        assert.deepStrictEqual(errors, expectedErrors);

        const fileIDRecords = parser.getAllFileIDRecords();
        const expectedFileIDRecord: FileIDRecord[] = new Array<FileIDRecord>();
        fileIDRecords.forEach(file => {
            const currFile = new FileIDRecord(file.getVersion(), file.getSourceId(), file.getLine(), file.getLength(), file.getFilename(), file.getTimestamp(), file.getFlag());
            expectedFileIDRecord.push(currFile);
        })
        assert.deepStrictEqual(fileIDRecords, expectedFileIDRecord);

        const exceptions = parser.getException();
        assert.strictEqual(exceptions.message, "Cannot read property 'getInputFileID' of undefined");
    });

    it('test TYPICAL', () => {
        const fileReader = new TestDataReader('TYPICAL.PGM.evfevent');
        parser.parse(fileReader, 37);

        //assert here
        const errors = parser.getAllErrors();
        const expectedErrors: ErrorInformationRecord[] = new Array<ErrorInformationRecord>();
        errors.forEach(element => {
            const currErrorInfo = new ErrorInformationRecord(element.getVersion(), element.getFileId(), element.getAnnotClass(), element.getStmtLine(), element.getStartErrLine(),
                element.getTokenStart(), element.getEndErrLine(), element.getTokenEnd(), element.getMsgId(), element.getSevChar(), element.getSevNum(), 
                element.getLength(), element.getMsg());
            currErrorInfo.setFileName(element.getFileName());
            expectedErrors.push(currErrorInfo);
        });
        assert.deepStrictEqual(errors, expectedErrors);

        const fileIDRecords = parser.getAllFileIDRecords();
        const expectedFileIDRecord: FileIDRecord[] = new Array<FileIDRecord>();
        fileIDRecords.forEach(file => {
            const currFile = new FileIDRecord(file.getVersion(), file.getSourceId(), file.getLine(), file.getLength(), file.getFilename(), file.getTimestamp(), file.getFlag());
            expectedFileIDRecord.push(currFile);
        })
        assert.deepStrictEqual(fileIDRecords, expectedFileIDRecord);

        const exceptions = parser.getException();
        assert.strictEqual(exceptions.message, 'A FILEEND event does not have a matching FILEID.\nFaulty event: [object Object]');
    });

    it('test TYPICAL2', () => {
        const fileReader = new TestDataReader('TYPICAL2.PGM.evfevent');
        parser.parse(fileReader, 37);

        //assert here
        const errors = parser.getAllErrors();
        const expectedErrors: ErrorInformationRecord[] = new Array<ErrorInformationRecord>();
        errors.forEach(element => {
            const currErrorInfo = new ErrorInformationRecord(element.getVersion(), element.getFileId(), element.getAnnotClass(), element.getStmtLine(), element.getStartErrLine(),
                element.getTokenStart(), element.getEndErrLine(), element.getTokenEnd(), element.getMsgId(), element.getSevChar(), element.getSevNum(), 
                element.getLength(), element.getMsg());
            currErrorInfo.setFileName(element.getFileName());
            expectedErrors.push(currErrorInfo);
        });
        assert.deepStrictEqual(errors, expectedErrors);

        const fileIDRecords = parser.getAllFileIDRecords();
        const expectedFileIDRecord: FileIDRecord[] = new Array<FileIDRecord>();
        fileIDRecords.forEach(file => {
            const currFile = new FileIDRecord(file.getVersion(), file.getSourceId(), file.getLine(), file.getLength(), file.getFilename(), file.getTimestamp(), file.getFlag());
            expectedFileIDRecord.push(currFile);
        })
        assert.deepStrictEqual(fileIDRecords, expectedFileIDRecord);

        const exceptions = parser.getException();
        assert.strictEqual(exceptions.message, "Cannot read property 'getInputFileID' of undefined");
    });

    it('test LONG_SOURCE_FILE_PATH', () => {
        const fileReader = new TestDataReader('LONG_SOURCE_FILE_PATH.PGM.evfevent');
        parser.parse(fileReader, 37);

        //assert here
        const errors = parser.getAllErrors();
        const expectedErrors: ErrorInformationRecord[] = new Array<ErrorInformationRecord>();
        errors.forEach(element => {
            const currErrorInfo = new ErrorInformationRecord(element.getVersion(), element.getFileId(), element.getAnnotClass(), element.getStmtLine(), element.getStartErrLine(),
                element.getTokenStart(), element.getEndErrLine(), element.getTokenEnd(), element.getMsgId(), element.getSevChar(), element.getSevNum(), 
                element.getLength(), element.getMsg());
            currErrorInfo.setFileName(element.getFileName());
            expectedErrors.push(currErrorInfo);
        });
        assert.deepStrictEqual(errors, expectedErrors);

        const fileIDRecords = parser.getAllFileIDRecords();
        const expectedFileIDRecord: FileIDRecord[] = new Array<FileIDRecord>();
        fileIDRecords.forEach(file => {
            const currFile = new FileIDRecord(file.getVersion(), file.getSourceId(), file.getLine(), file.getLength(), file.getFilename(), file.getTimestamp(), file.getFlag());
            expectedFileIDRecord.push(currFile);
        })
        assert.deepStrictEqual(fileIDRecords, expectedFileIDRecord);

        const exceptions = parser.getException();
        assert.strictEqual(exceptions.message, "Cannot read property 'getInputFileID' of undefined");
    });

    it('test NESTED_COPYBOOK', () => {
        const fileReader = new TestDataReader('NESTED_COPYBOOK.PGM.evfevent');
        parser.parse(fileReader, 37);

        //assert here
        const errors = parser.getAllErrors();
        const expectedErrors: ErrorInformationRecord[] = new Array<ErrorInformationRecord>();
        errors.forEach(element => {
            const currErrorInfo = new ErrorInformationRecord(element.getVersion(), element.getFileId(), element.getAnnotClass(), element.getStmtLine(), element.getStartErrLine(),
                element.getTokenStart(), element.getEndErrLine(), element.getTokenEnd(), element.getMsgId(), element.getSevChar(), element.getSevNum(), 
                element.getLength(), element.getMsg());
            currErrorInfo.setFileName(element.getFileName());
            expectedErrors.push(currErrorInfo);
        });
        assert.deepStrictEqual(errors, expectedErrors);

        const fileIDRecords = parser.getAllFileIDRecords();
        const expectedFileIDRecord: FileIDRecord[] = new Array<FileIDRecord>();
        fileIDRecords.forEach(file => {
            const currFile = new FileIDRecord(file.getVersion(), file.getSourceId(), file.getLine(), file.getLength(), file.getFilename(), file.getTimestamp(), file.getFlag());
            expectedFileIDRecord.push(currFile);
        })
        assert.deepStrictEqual(fileIDRecords, expectedFileIDRecord);

        const exceptions = parser.getException();
        assert.strictEqual(exceptions.message, 'A FILEEND event does not have a matching FILEID.\nFaulty event: [object Object]');
    });
});