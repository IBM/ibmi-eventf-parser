import { assert, describe, expect, it } from 'vitest'
import { Parser } from '../src/Parser';
import TestDataReader from './TestDataReader';
import { ErrorInformationRecord } from '../src/record/ErrorInformationRecord';
import { FileIDRecord } from '../src/record/FileIDRecord';

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
    });

    it('test SQLRPGLE', () => {
        const fileReader = new TestDataReader('SQLRPGLE.PGM.evfevent');
        parser.parse(fileReader, 37);

        //assert here
    });

    it('test TYPICAL', () => {
        const fileReader = new TestDataReader('TYPICAL.PGM.evfevent');
        parser.parse(fileReader, 37);

        //assert here
    });

    it('test TYPICAL2', () => {
        const fileReader = new TestDataReader('TYPICAL2.PGM.evfevent');
        parser.parse(fileReader, 37);

        //assert here
    });

    it('test LONG_SOURCE_FILE_PATH', () => {
        const fileReader = new TestDataReader('LONG_SOURCE_FILE_PATH.PGM.evfevent');
        parser.parse(fileReader, 37);

        //assert here
    });

    it('test NESTED_COPYBOOK', () => {
        const fileReader = new TestDataReader('NESTED_COPYBOOK.PGM.evfevent');
        parser.parse(fileReader, 37);

        //assert here
    });
});