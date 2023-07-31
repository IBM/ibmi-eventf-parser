import { assert, describe, expect, it } from 'vitest'
import { Parser } from '../src/Parser';
import TestDataReader from './TestDataReader';
import { ErrorInformationRecord } from '../src/record/ErrorInformationRecord';
import { FileIDRecord } from '../src/record/FileIDRecord';

describe('Tests', () => {
    it('test LITINERR', () => {
        const parser = new Parser();
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
        const parser = new Parser();
        const fileReader = new TestDataReader('SQLCPP.PGM.evfevent');
        parser.parse(fileReader, 37);

        //assert here
    });

    it('test SQLRPGLE', () => {
        const parser = new Parser();
        const fileReader = new TestDataReader('SQLRPGLE.PGM.evfevent');
        parser.parse(fileReader, 37);

        //assert here
    });

    it('test TYPICAL', () => {
        const parser = new Parser();
        const fileReader = new TestDataReader('TYPICAL.PGM.evfevent');
        parser.parse(fileReader, 37);

        //assert here
    });

    it('test TYPICAL2', () => {
        const parser = new Parser();
        const fileReader = new TestDataReader('TYPICAL2.PGM.evfevent');
        parser.parse(fileReader, 37);

        //assert here
    });

    it('test LONG_SOURCE_FILE_PATH', () => {
        const parser = new Parser();
        const fileReader = new TestDataReader('LONG_SOURCE_FILE_PATH.PGM.evfevent');
        parser.parse(fileReader, 37);

        //assert here
    });

    it('test NESTED_COPYBOOK', () => {
        const parser = new Parser();
        const fileReader = new TestDataReader('NESTED_COPYBOOK.PGM.evfevent');
        parser.parse(fileReader, 37);

        //assert here
    });

    it('test SQLLVL1', () => {
        const parser = new Parser();
        const fileReader = new TestDataReader('SQLLVL1.PGM.evfevent');
        parser.parse(fileReader, 37);
    });

    it('test SQLLVL2', () => {
        const parser = new Parser();
        const fileReader = new TestDataReader('SQLLVL2.PGM.evfevent');
        parser.parse(fileReader, 37);

        const errors = parser.getAllErrors();
        assert.strictEqual(errors.length, 43);
        assertErrorInformationRecord(errors[0], 'BARRY/QRPGLESRC(VSCODE)', '19', 'The name or indicator SQL_00002 is not referenced.');
        assertErrorInformationRecord(errors[1], 'BARRY/QRPGLESRC(VSCODE)', '19', 'The name or indicator SQL_00004 is not referenced.');
        assertErrorInformationRecord(errors[2], 'BARRY/QRPGLESRC(VSCODEINC2)', '8', 'The name or indicator FIE1D1 is not referenced.');
        assertErrorInformationRecord(errors[3], 'BARRY/QRPGLESRC(VSCODEINC2)', '9', 'The name or indicator FIE1D2 is not referenced.');
        assertErrorInformationRecord(errors[4], 'BARRY/QRPGLESRC(VSCODEINC2)', '10', 'The name or indicator FIE1D3 is not referenced.');
        assertErrorInformationRecord(errors[5], 'BARRY/QRPGLESRC(VSCODEINC2)', '11', 'The name or indicator FIE1D4 is not referenced.');
        assertErrorInformationRecord(errors[6], 'BARRY/QRPGLESRC(VSCODEINC2)', '7', 'The name or indicator MYDS_T is not referenced.');
        assertErrorInformationRecord(errors[39], 'BARRY/QRPGLESRC(VSCODE)', '21', 'The name or indicator TEST is not defined.');
        assertErrorInformationRecord(errors[40], 'BARRY/QRPGLESRC(VSCODEINC)', '9', 'The name or indicator VSCODE is not referenced.');
        assertErrorInformationRecord(errors[41], 'BARRY/QRPGLESRC(VSCODE)', '21', 'Expression contains an operand that is not defined.');
    });
});

function assertErrorInformationRecord(error: ErrorInformationRecord, fileName: string, startErrLine: string, msg: string) {
    assert.deepStrictEqual(
        {
            fileName: error.getFileName(),
            startErrLine: error.getStartErrLine(),
            msg: error.getMsg()
        },
        {
            fileName: fileName,
            startErrLine: startErrLine,
            msg: msg
        }
    );
}