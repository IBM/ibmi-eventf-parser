import { assert, describe, it } from 'vitest'
import { Parser } from '../src/Parser';
import TestDataReader from './TestDataReader';
import { ErrorInformationRecord } from '../src/record/ErrorInformationRecord';
import { FileIDRecord } from '../src/record/FileIDRecord';

describe('Tests', () => {
    it('test LITINERR', () => {
        const parser = new Parser();
        const fileReader = new TestDataReader('LITINERR.PGM.evfevent');
        parser.parse(fileReader, 37);

        const fileIDRecords = parser.getAllFileIDRecords();
        assert.strictEqual(fileIDRecords.length, 1);
        assertFileIDRecord(fileIDRecords[0], '/home/REINHARD/builds/hll/literalInMessage.pgm.rpgle', '001', '0')

        const errors = parser.getAllErrors();
        assert.strictEqual(errors.length, 2);
        assertErrorInformationRecord(errors[0], '/home/REINHARD/builds/hll/literalInMessage.pgm.rpgle', '000002', 'The second parameter \'a very long lite... for %SUBST is not valid; built-in function is ignored.');
        assertErrorInformationRecord(errors[1], '/home/REINHARD/builds/hll/literalInMessage.pgm.rpgle', '000000', 'Compilation stopped. Severity 20 errors found in program.');

        const exceptions = parser.getException();
        assert.strictEqual(exceptions, undefined);
    });

    it('test SQLRPGLE', () => {
        const parser = new Parser();
        const fileReader = new TestDataReader('SQLRPGLE.PGM.evfevent');
        parser.parse(fileReader, 37);

        const fileIDRecords = parser.getAllFileIDRecords();
        assert.strictEqual(fileIDRecords.length, 1);
        assertFileIDRecord(fileIDRecords[0], '/QSYS.LIB/QTEMP.LIB/QSQLTEMP1.FILE/SQLRPGLE.MBR', '001', '0');

        const errors = parser.getAllErrors();
        assert.strictEqual(errors.length, 61);
        assertErrorInformationRecord(errors[0], '/home/REINHARD/builds/hll/sqlrpgle.pgm.sqlrpgle', '328', 'Precompile option COMMIT changed by SET OPTION statement.');
        assertErrorInformationRecord(errors[1], '/home/REINHARD/builds/hll/includes/familly.rpgleinc', '23', 'The Definition-Type entry is not valid; defaults to parameter definition.');
        assertErrorInformationRecord(errors[60], '/home/REINHARD/builds/hll/sqlrpgle.pgm.sqlrpgle', '0', 'Compilation stopped. Severity 30 errors found in program.');

        const exceptions = parser.getException();
        assert.strictEqual(exceptions, undefined);
    });

    it('test TYPICAL', () => {
        const parser = new Parser();
        const fileReader = new TestDataReader('TYPICAL.PGM.evfevent');
        parser.parse(fileReader, 37);

        const fileIDRecords = parser.getAllFileIDRecords();
        assert.strictEqual(fileIDRecords.length, 3);
        assertFileIDRecord(fileIDRecords[0], 'BARRY/EVFTEMPF01(VSCODE)', '001', '1');
        assertFileIDRecord(fileIDRecords[1], 'BARRY/QRPGLESRC(VSCODEINC)', '002', '0');
        assertFileIDRecord(fileIDRecords[2], 'BARRY/QRPGLESRC(VSCODEINC2)', '003', '0');

        const errors = parser.getAllErrors();
        assert.strictEqual(errors.length, 46);
        assertErrorInformationRecord(errors[0], 'BARRY/QRPGLESRC(VSCODE)', '20', 'The name or indicator SQL_00001 is not referenced.');
        assertErrorInformationRecord(errors[1], 'BARRY/QRPGLESRC(VSCODE)', '20', 'The name or indicator SQL_00002 is not referenced.');
        assertErrorInformationRecord(errors[45], 'BARRY/QRPGLESRC(VSCODE)', '0', 'Compilation stopped. Severity 30 errors found in program.');

        const exceptions = parser.getException();
        assert.strictEqual(exceptions, undefined);
    });

    it('test TYPICAL2', () => {
        const parser = new Parser();
        const fileReader = new TestDataReader('TYPICAL2.PGM.evfevent');
        parser.parse(fileReader, 37);

        const fileIDRecords = parser.getAllFileIDRecords();
        assert.strictEqual(fileIDRecords.length, 1);
        assertFileIDRecord(fileIDRecords[0], 'BARRY/EVFTEMPF01(VSCODE)', '001', '1');

        const errors = parser.getAllErrors();
        assert.strictEqual(errors.length, 44);
        assertErrorInformationRecord(errors[0], 'BARRY/QRPGLESRC(VSCODE)', '19', 'The name or indicator SQL_00001 is not referenced.');
        assertErrorInformationRecord(errors[1], 'BARRY/QRPGLESRC(VSCODE)', '19', 'The name or indicator SQL_00002 is not referenced.');
        assertErrorInformationRecord(errors[43], 'BARRY/QRPGLESRC(VSCODE)', '0', 'Compilation stopped. Severity 30 errors found in program.');

        const exceptions = parser.getException();
        assert.strictEqual(exceptions, undefined);
    });

    it('test LONG_SOURCE_FILE_PATH', () => {
        const parser = new Parser();
        const fileReader = new TestDataReader('LONG_SOURCE_FILE_PATH.PGM.evfevent');
        parser.parse(fileReader, 37);

        const fileIDRecords = parser.getAllFileIDRecords();
        assert.strictEqual(fileIDRecords.length, 1);
        assertFileIDRecord(fileIDRecords[0], '/QSYS.LIB/QTEMP.LIB/QSQLTEMP1.FILE/FIX1200.MBR', '001', '0');

        const errors = parser.getAllErrors();
        assert.strictEqual(errors.length, 38);
        const fileName = "/home/ANGELORPA/builds/sources/long-directory-name-for-testing-long-paths/subdirectory-"
            + "with-a-long-name-for-testing-long-paths/another-subdirectory-with-a-long-name-for-testing-long-pat"
            + "hs/one-more-subdirectory-this-is-the-last-one/01-long directory name with spaces in/02-long direct"
            + "ory with space in his name/03-long directory name with space in for testing prupouse/04-long direc"
            + "tory name with space in for testing event file parser/05-long directory name with space in for tes"
            + "ting event file parser/06-longdirectory name with space in for testing event file parser/sorce fil"
            + "e long name with space in for testing event file parser.pmg.sqlrpgle";
        assertErrorInformationRecord(errors[0], fileName, '0', 'No SQL statements found.');
        assertErrorInformationRecord(errors[1], fileName, '7', 'The end of the expression is expected.');
        assertErrorInformationRecord(errors[37], fileName, '0', 'Compilation stopped. Severity 30 errors found in program.');

        const exceptions = parser.getException();
        assert.strictEqual(exceptions, undefined);
    });

    it('test NESTED_COPYBOOK', () => {
        const parser = new Parser();
        const fileReader = new TestDataReader('NESTED_COPYBOOK.PGM.evfevent');
        parser.parse(fileReader, 37);

        const fileIDRecords = parser.getAllFileIDRecords();
        assert.strictEqual(fileIDRecords.length, 3);
        assertFileIDRecord(fileIDRecords[0], '/home/ANGELORPA/builds/fix1200/display/qrpglesrc/hello.rpgle', '001', '0');
        assertFileIDRecord(fileIDRecords[1], '/home/ANGELORPA/builds/fix1200/display/qprotsrc/constants.rpgle', '002', '0');
        assertFileIDRecord(fileIDRecords[2], '/home/ANGELORPA/builds/fix1200/display/qprotsrc/constLeve2.rpgle', '003', '0');

        const errors = parser.getAllErrors();
        assert.strictEqual(errors.length, 12);
        assertErrorInformationRecord(errors[2], '/home/ANGELORPA/builds/fix1200/display/qrpglesrc/hello.rpgle', '000006', 'A keyword is specified more than once for a definition; keyword is ignored.');
        assertErrorInformationRecord(errors[3], '/home/ANGELORPA/builds/fix1200/display/qrpglesrc/hello.rpgle', '000006', 'A keyword is specified more than once for a definition; keyword is ignored.');
        assertErrorInformationRecord(errors[11], '/home/ANGELORPA/builds/fix1200/display/qrpglesrc/hello.rpgle', '000000', 'Compilation stopped.Severity 30 errors found in program.');
        assertErrorInformationRecord(errors[8], '/home/ANGELORPA/builds/fix1200/display/qprotsrc/constants.rpgle', '000003', 'The name or indicator FIRST_DAY is not referenced.');
        assertErrorInformationRecord(errors[10], '/home/ANGELORPA/builds/fix1200/display/qprotsrc/constants.rpgle', '000004', 'The name or indicator SECOND_DAY is not referenced.');
        assertErrorInformationRecord(errors[0], '/home/ANGELORPA/builds/fix1200/display/qprotsrc/constLeve2.rpgle', '000004', 'The statement must be complete before the file ends.');
        assertErrorInformationRecord(errors[1], '/home/ANGELORPA/builds/fix1200/display/qprotsrc/constLeve2.rpgle', '000004', 'The statement must be complete before the file ends.');
        assertErrorInformationRecord(errors[7], '/home/ANGELORPA/builds/fix1200/display/qprotsrc/constLeve2.rpgle', '000003', 'The name or indicator FILE is not referenced.');

        const exceptions = parser.getException();
        assert.strictEqual(exceptions, undefined);
    });

    it('test SQLLVL1', () => {
        const parser = new Parser();
        const fileReader = new TestDataReader('SQLLVL1.PGM.evfevent');
        parser.parse(fileReader, 37);

        const fileIDRecords = parser.getAllFileIDRecords();
        assert.strictEqual(fileIDRecords.length, 3);
        assertFileIDRecord(fileIDRecords[0], 'BARRY/EVFTEMPF01(VSCODE)', '001', '1');
        assertFileIDRecord(fileIDRecords[1], 'BARRY/QRPGLESRC(VSCODEINC)', '002', '0');
        assertFileIDRecord(fileIDRecords[2], 'BARRY/QRPGLESRC(VSCODEINC2)', '003', '0');

        const errors = parser.getAllErrors();
        assert.strictEqual(errors.length, 46);
        assertErrorInformationRecord(errors[0], 'BARRY/QRPGLESRC(VSCODE)', '20', 'The name or indicator SQL_00001 is not referenced.');
        assertErrorInformationRecord(errors[1], 'BARRY/QRPGLESRC(VSCODE)', '20', 'The name or indicator SQL_00002 is not referenced.');
        assertErrorInformationRecord(errors[45], 'BARRY/QRPGLESRC(VSCODE)', '0', 'Compilation stopped. Severity 30 errors found in program.');
        assertErrorInformationRecord(errors[43], 'BARRY/QRPGLESRC(VSCODEINC)', '000009', 'The name or indicator VSCODE is not referenced.');
        assertErrorInformationRecord(errors[3], 'BARRY/QRPGLESRC(VSCODEINC2)', '000008', 'The name or indicator FIE1D1 is not referenced.');
        assertErrorInformationRecord(errors[4], 'BARRY/QRPGLESRC(VSCODEINC2)', '000009', 'The name or indicator FIE1D2 is not referenced.');
        assertErrorInformationRecord(errors[6], 'BARRY/QRPGLESRC(VSCODEINC2)', '000011', 'The name or indicator FIE1D4 is not referenced.');

        const exceptions = parser.getException();
        assert.strictEqual(exceptions, undefined);
    });

    it('test SQLLVL2', () => {
        const parser = new Parser();
        const fileReader = new TestDataReader('SQLLVL2.PGM.evfevent');
        parser.parse(fileReader, 37);

        const fileIDRecords = parser.getAllFileIDRecords();
        assert.strictEqual(fileIDRecords.length, 1);
        assertFileIDRecord(fileIDRecords[0], 'BARRY/EVFTEMPF01(VSCODE)', '001', '1');

        const errors = parser.getAllErrors();
        assert.strictEqual(errors.length, 44);
        assertErrorInformationRecord(errors[0], 'BARRY/QRPGLESRC(VSCODE)', '19', 'The name or indicator SQL_00001 is not referenced.');
        assertErrorInformationRecord(errors[1], 'BARRY/QRPGLESRC(VSCODE)', '19', 'The name or indicator SQL_00002 is not referenced.');
        assertErrorInformationRecord(errors[43], 'BARRY/QRPGLESRC(VSCODE)', '0', 'Compilation stopped. Severity 30 errors found in program.');
        assertErrorInformationRecord(errors[41], 'BARRY/QRPGLESRC(VSCODEINC)', '9', 'The name or indicator VSCODE is not referenced.');
        assertErrorInformationRecord(errors[3], 'BARRY/QRPGLESRC(VSCODEINC2)', '8', 'The name or indicator FIE1D1 is not referenced.');
        assertErrorInformationRecord(errors[4], 'BARRY/QRPGLESRC(VSCODEINC2)', '9', 'The name or indicator FIE1D2 is not referenced.');
        assertErrorInformationRecord(errors[7], 'BARRY/QRPGLESRC(VSCODEINC2)', '7', 'The name or indicator MYDS_T is not referenced.');

        const exceptions = parser.getException();
        assert.strictEqual(exceptions, undefined);
    });
});

function assertFileIDRecord(record: FileIDRecord, fileName: string, fileID: string, flag: string) {
    assert.deepStrictEqual(
        {
            fileName: record.getFilename(),
            fileID: record.getSourceId(),
            flag: record.getFlag()
        },
        {
            fileName: fileName,
            fileID: fileID,
            flag: flag
        }
    );
}

function assertErrorInformationRecord(record: ErrorInformationRecord, fileName: string, startErrLine: string, msg: string) {
    assert.deepStrictEqual(
        {
            fileName: record.getFileName(),
            startErrLine: record.getStartErrLine(),
            msg: record.getMsg()
        },
        {
            fileName: fileName,
            startErrLine: startErrLine,
            msg: msg
        }
    );
}