import { assert, describe, expect, it } from 'vitest'
import { Parser } from '../src/Parser';
import TestDataReader from './TestDataReader';
import { ErrorInformationRecord } from '../src/record/ErrorInformationRecord';
import { FileIDRecord } from '../src/record/FileIDRecord';

describe('Tests', () => {
    it('test file', () => {
        console.log('test running');
        const parser = new Parser();
        const fileReader = new TestDataReader();
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
    })
})