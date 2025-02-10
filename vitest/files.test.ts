/*
 * (c) Copyright IBM Corp. 2023
 */

import { assert, describe, expect, it, vi } from 'vitest'
import { Parser } from '../src/Parser';
import { FileIDRecord } from '../src/record/FileIDRecord';
import { MarkerCreator } from './MarkerCreator';
import { FileReader } from './FileReader';

const TEST_DIR = 'testfixtures/evf';
describe('Tests', () => {

    it('test LITINERR', () => {
        const parser = new Parser();
        const markers: MarkerCreator = new MarkerCreator();
        const fileReader: FileReader = new FileReader(`${TEST_DIR}/LITINERR.PGM.evfevent`);
        parser.parse(fileReader, markers);

        const fileIDRecords = parser.getAllFileIDRecords();
        assert.strictEqual(fileIDRecords.length, 1);
        assertFileIDRecord(fileIDRecords[0], '/home/REINHARD/builds/hll/literalInMessage.pgm.rpgle', 1, 0)

        assert.strictEqual(markers.getErrorCount(), 2);
        assert.ok(markers.equals(0, '/home/REINHARD/builds/hll/literalInMessage.pgm.rpgle', 2, 'The second parameter \'a very long lite... for %SUBST is not valid; built-in function is ignored.'));
        assert.ok(markers.equals(1, '/home/REINHARD/builds/hll/literalInMessage.pgm.rpgle', 0, 'Compilation stopped. Severity 20 errors found in program.'));

        const exceptions = parser.getException();
        assert.strictEqual(exceptions, undefined);
    });

    it('test SQLRPGLE', () => {
        const parser = new Parser();
        const markers: MarkerCreator = new MarkerCreator();
        const fileReader: FileReader = new FileReader(`${TEST_DIR}/SQLRPGLE.PGM.evfevent`);
        parser.parse(fileReader, markers);

        const fileIDRecords = parser.getAllFileIDRecords();
        assert.strictEqual(fileIDRecords.length, 1);
        assertFileIDRecord(fileIDRecords[0], '/QSYS.LIB/QTEMP.LIB/QSQLTEMP1.FILE/SQLRPGLE.MBR', 1, 0);

        assert.strictEqual(markers.getErrorCount(), 61);
        assert.ok(markers.equals(0, '/home/REINHARD/builds/hll/sqlrpgle.pgm.sqlrpgle', 328, 'Precompile option COMMIT changed by SET OPTION statement.'));
        assert.ok(markers.equals(1, '/home/REINHARD/builds/hll/includes/familly.rpgleinc', 23, 'The Definition-Type entry is not valid; defaults to parameter definition.'));
        assert.ok(markers.equals(60, '/home/REINHARD/builds/hll/sqlrpgle.pgm.sqlrpgle', 0, 'Compilation stopped. Severity 30 errors found in program.'));

        const exceptions = parser.getException();
        assert.strictEqual(exceptions, undefined);
    });

    it('test SQLCMOD', () => {
        const parser = new Parser();
        const markers: MarkerCreator = new MarkerCreator();
        const fileReader: FileReader = new FileReader(`${TEST_DIR}/SQLCMOD.evfevent`);
        parser.parse(fileReader, markers);

        const fileIDRecords = parser.getAllFileIDRecords();
        assert.strictEqual(fileIDRecords.length, 1);
        assertFileIDRecord(fileIDRecords[0], '/QSYS.LIB/QTEMP.LIB/QSQLT00103.FILE/ANZ_FILE2.MBR', 1, 0);

        assert.strictEqual(markers.getErrorCount(), 1);
        assert.ok(markers.equals(0, '/QSYS.LIB/QTEMP.LIB/QSQLT00103.FILE/ANZ_FILE2.MBR', 1570, 'Undeclared identifier y.'));

        const exceptions = parser.getException();
        assert.strictEqual(exceptions!.message, 'One or more FILEID records do not have matching FILEEND records\nList of outstanding FILEID records: {"stack":[{"ID":1,"lines":0}]}');
    });

    it('test TYPICAL', () => {
        const parser = new Parser();
        const markers: MarkerCreator = new MarkerCreator();
        const fileReader: FileReader = new FileReader(`${TEST_DIR}/TYPICAL.PGM.evfevent`);
        parser.parse(fileReader, markers);

        const fileIDRecords = parser.getAllFileIDRecords();
        assert.strictEqual(fileIDRecords.length, 3);
        assertFileIDRecord(fileIDRecords[0], 'BARRY/EVFTEMPF01(VSCODE)', 1, 1);
        assertFileIDRecord(fileIDRecords[1], 'BARRY/QRPGLESRC(VSCODEINC)', 2, 0);
        assertFileIDRecord(fileIDRecords[2], 'BARRY/QRPGLESRC(VSCODEINC2)', 3, 0);

        assert.strictEqual(markers.getErrorCount(), 46);
        assert.ok(markers.equals(0, 'BARRY/QRPGLESRC(VSCODE)', 20, 'The name or indicator SQL_00001 is not referenced.'));
        assert.ok(markers.equals(1, 'BARRY/QRPGLESRC(VSCODE)', 20, 'The name or indicator SQL_00002 is not referenced.'));
        assert.ok(markers.equals(45, 'BARRY/QRPGLESRC(VSCODE)', 0, 'Compilation stopped. Severity 30 errors found in program.'));

        const exceptions = parser.getException();
        assert.strictEqual(exceptions, undefined);
    });

    it('test TYPICAL2', () => {
        const parser = new Parser();
        const markers: MarkerCreator = new MarkerCreator();
        const fileReader: FileReader = new FileReader(`${TEST_DIR}/TYPICAL2.PGM.evfevent`);
        parser.parse(fileReader, markers);

        const fileIDRecords = parser.getAllFileIDRecords();
        assert.strictEqual(fileIDRecords.length, 1);
        assertFileIDRecord(fileIDRecords[0], 'BARRY/EVFTEMPF01(VSCODE)', 1, 1);

        assert.strictEqual(markers.getErrorCount(), 44);
        assert.ok(markers.equals(0, 'BARRY/QRPGLESRC(VSCODE)', 19, 'The name or indicator SQL_00001 is not referenced.'));
        assert.ok(markers.equals(1, 'BARRY/QRPGLESRC(VSCODE)', 19, 'The name or indicator SQL_00002 is not referenced.'));
        assert.ok(markers.equals(43, 'BARRY/QRPGLESRC(VSCODE)', 0, 'Compilation stopped. Severity 30 errors found in program.'));

        const exceptions = parser.getException();
        assert.strictEqual(exceptions, undefined);
    });

    it('test LONG_SOURCE_FILE_PATH', () => {
        const parser = new Parser();
        const markers: MarkerCreator = new MarkerCreator();
        const fileReader: FileReader = new FileReader(`${TEST_DIR}/LONG_SOURCE_FILE_PATH.PGM.evfevent`);
        parser.parse(fileReader, markers);

        const fileIDRecords = parser.getAllFileIDRecords();
        assert.strictEqual(fileIDRecords.length, 1);
        assertFileIDRecord(fileIDRecords[0], '/QSYS.LIB/QTEMP.LIB/QSQLTEMP1.FILE/FIX1200.MBR', 1, 0);

        assert.strictEqual(markers.getErrorCount(), 38);
        const fileName = "/home/ANGELORPA/builds/sources/long-directory-name-for-testing-long-paths/subdirectory-"
            + "with-a-long-name-for-testing-long-paths/another-subdirectory-with-a-long-name-for-testing-long-pat"
            + "hs/one-more-subdirectory-this-is-the-last-one/01-long directory name with spaces in/02-long direct"
            + "ory with space in his name/03-long directory name with space in for testing prupouse/04-long direc"
            + "tory name with space in for testing event file parser/05-long directory name with space in for tes"
            + "ting event file parser/06-longdirectory name with space in for testing event file parser/sorce fil"
            + "e long name with space in for testing event file parser.pmg.sqlrpgle";
        assert.ok(markers.equals(0, fileName, 0, 'No SQL statements found.'));
        assert.ok(markers.equals(1, fileName, 7, 'The end of the expression is expected.'));
        assert.ok(markers.equals(37, fileName, 0, 'Compilation stopped. Severity 30 errors found in program.'));

        const exceptions = parser.getException();
        assert.strictEqual(exceptions, undefined);
    });

    it('test NESTED_COPYBOOK', () => {
        const parser = new Parser();
        const markers: MarkerCreator = new MarkerCreator();
        const fileReader: FileReader = new FileReader(`${TEST_DIR}/NESTED_COPYBOOK.PGM.evfevent`);
        parser.parse(fileReader, markers);

        const fileIDRecords = parser.getAllFileIDRecords();
        assert.strictEqual(fileIDRecords.length, 3);
        assertFileIDRecord(fileIDRecords[0], '/home/ANGELORPA/builds/fix1200/display/qrpglesrc/hello.rpgle', 1, 0);
        assertFileIDRecord(fileIDRecords[1], '/home/ANGELORPA/builds/fix1200/display/qprotsrc/constants.rpgle', 2, 0);
        assertFileIDRecord(fileIDRecords[2], '/home/ANGELORPA/builds/fix1200/display/qprotsrc/constLeve2.rpgle', 3, 0);

        assert.strictEqual(markers.getErrorCount(), 12);
        assert.ok(markers.equals(2, '/home/ANGELORPA/builds/fix1200/display/qrpglesrc/hello.rpgle', 6, 'A keyword is specified more than once for a definition; keyword is ignored.'));
        assert.ok(markers.equals(3, '/home/ANGELORPA/builds/fix1200/display/qrpglesrc/hello.rpgle', 6, 'A keyword is specified more than once for a definition; keyword is ignored.'));
        assert.ok(markers.equals(11, '/home/ANGELORPA/builds/fix1200/display/qrpglesrc/hello.rpgle', 0, 'Compilation stopped.Severity 30 errors found in program.'));
        assert.ok(markers.equals(8, '/home/ANGELORPA/builds/fix1200/display/qprotsrc/constants.rpgle', 3, 'The name or indicator FIRST_DAY is not referenced.'));
        assert.ok(markers.equals(10, '/home/ANGELORPA/builds/fix1200/display/qprotsrc/constants.rpgle', 4, 'The name or indicator SECOND_DAY is not referenced.'));
        assert.ok(markers.equals(0, '/home/ANGELORPA/builds/fix1200/display/qprotsrc/constLeve2.rpgle', 4, 'The statement must be complete before the file ends.'));
        assert.ok(markers.equals(1, '/home/ANGELORPA/builds/fix1200/display/qprotsrc/constLeve2.rpgle', 4, 'The statement must be complete before the file ends.'));
        assert.ok(markers.equals(7, '/home/ANGELORPA/builds/fix1200/display/qprotsrc/constLeve2.rpgle', 3, 'The name or indicator FILE is not referenced.'));

        const exceptions = parser.getException();
        assert.strictEqual(exceptions, undefined);
    });

    it('test SQLLVL1', () => {
        const parser = new Parser();
        const markers: MarkerCreator = new MarkerCreator();
        const fileReader: FileReader = new FileReader(`${TEST_DIR}/SQLLVL1.PGM.evfevent`);
        parser.parse(fileReader, markers);

        const fileIDRecords = parser.getAllFileIDRecords();
        assert.strictEqual(fileIDRecords.length, 3);
        assertFileIDRecord(fileIDRecords[0], 'BARRY/EVFTEMPF01(VSCODE)', 1, 1);
        assertFileIDRecord(fileIDRecords[1], 'BARRY/QRPGLESRC(VSCODEINC)', 2, 0);
        assertFileIDRecord(fileIDRecords[2], 'BARRY/QRPGLESRC(VSCODEINC2)', 3, 0);

        assert.strictEqual(markers.getErrorCount(), 46);
        assert.ok(markers.equals(0, 'BARRY/QRPGLESRC(VSCODE)', 20, 'The name or indicator SQL_00001 is not referenced.'));
        assert.ok(markers.equals(1, 'BARRY/QRPGLESRC(VSCODE)', 20, 'The name or indicator SQL_00002 is not referenced.'));
        assert.ok(markers.equals(45, 'BARRY/QRPGLESRC(VSCODE)', 0, 'Compilation stopped. Severity 30 errors found in program.'));
        assert.ok(markers.equals(43, 'BARRY/QRPGLESRC(VSCODEINC)', 9, 'The name or indicator VSCODE is not referenced.'));
        assert.ok(markers.equals(3, 'BARRY/QRPGLESRC(VSCODEINC2)', 8, 'The name or indicator FIE1D1 is not referenced.'));
        assert.ok(markers.equals(4, 'BARRY/QRPGLESRC(VSCODEINC2)', 9, 'The name or indicator FIE1D2 is not referenced.'));
        assert.ok(markers.equals(6, 'BARRY/QRPGLESRC(VSCODEINC2)', 11, 'The name or indicator FIE1D4 is not referenced.'));

        const exceptions = parser.getException();
        assert.strictEqual(exceptions, undefined);
    });

    it('test SQLLVL2', () => {
        const parser = new Parser();
        const markers: MarkerCreator = new MarkerCreator();
        const fileReader: FileReader = new FileReader(`${TEST_DIR}/SQLLVL2.PGM.evfevent`);
        parser.parse(fileReader, markers);

        const fileIDRecords = parser.getAllFileIDRecords();
        assert.strictEqual(fileIDRecords.length, 1);
        assertFileIDRecord(fileIDRecords[0], 'BARRY/EVFTEMPF01(VSCODE)', 1, 1);

        assert.strictEqual(markers.getErrorCount(), 44);
        assert.ok(markers.equals(0, 'BARRY/QRPGLESRC(VSCODE)', 19, 'The name or indicator SQL_00001 is not referenced.'));
        assert.ok(markers.equals(1, 'BARRY/QRPGLESRC(VSCODE)', 19, 'The name or indicator SQL_00002 is not referenced.'));
        assert.ok(markers.equals(43, 'BARRY/QRPGLESRC(VSCODE)', 0, 'Compilation stopped. Severity 30 errors found in program.'));
        assert.ok(markers.equals(41, 'BARRY/QRPGLESRC(VSCODEINC)', 9, 'The name or indicator VSCODE is not referenced.'));
        assert.ok(markers.equals(3, 'BARRY/QRPGLESRC(VSCODEINC2)', 8, 'The name or indicator FIE1D1 is not referenced.'));
        assert.ok(markers.equals(4, 'BARRY/QRPGLESRC(VSCODEINC2)', 9, 'The name or indicator FIE1D2 is not referenced.'));
        assert.ok(markers.equals(7, 'BARRY/QRPGLESRC(VSCODEINC2)', 7, 'The name or indicator MYDS_T is not referenced.'));

        const exceptions = parser.getException();
        assert.strictEqual(exceptions, undefined);
    });

    it('test EXPANDMAIN', () => {
        const parser = new Parser();
        const markers: MarkerCreator = new MarkerCreator();
        const fileReader: FileReader = new FileReader(`${TEST_DIR}/EXPANDMAIN.PGM.evfevent`);
        parser.parse(fileReader, markers);
        const fileIDRecords = parser.getAllFileIDRecords();
        assert.strictEqual(fileIDRecords.length, 2);
        assertFileIDRecord(fileIDRecords[0], '/home/REINHARD/builds/hll/expandmain.pgm.sqlrpgle', 1, 0);
        assertFileIDRecord(fileIDRecords[1], '/home/REINHARD/builds/hll/expandcpy1.rpgleinc', 2, 0);

        assert.strictEqual(markers.getErrorCount(), 2);
        assert.ok(markers.equals(0, '/home/REINHARD/builds/hll/expandcpy1.rpgleinc', 3, 'Character literal has missing trailing apostrophe; trailing apostrophe assumed.'));
        assert.ok(markers.equals(1, '/home/REINHARD/builds/hll/expandmain.pgm.sqlrpgle', 0, 'Compilation stopped. Severity 20 errors found in program.'));

        const exceptions = parser.getException();
        assert.strictEqual(exceptions, undefined);
    });

    it('test EXPAN2MAIN', () => {
        const parser = new Parser();
        const markers: MarkerCreator = new MarkerCreator();
        const fileReader: FileReader = new FileReader(`${TEST_DIR}/EXPAN2MAIN.PGM.evfevent`);
        parser.parse(fileReader, markers);

        const fileIDRecords = parser.getAllFileIDRecords();
        assert.strictEqual(fileIDRecords.length, 1);
        assertFileIDRecord(fileIDRecords[0], '/QSYS.LIB/QTEMP.LIB/QSQLTEMP1.FILE/EXPAN2MAIN.MBR', 1, 0);

        assert.strictEqual(markers.getErrorCount(), 39);
        assert.ok(markers.equals(1, '/home/REINHARD/builds/hll/expan2main.pgm.sqlrpgle', 5, 'The length of the hexadecimal literal is not a positive multiple of 2; literal truncated.'));
        assert.ok(markers.equals(3, '/home/REINHARD/builds/hll/expan2main.pgm.sqlrpgle', 0, 'The name or indicator SQFAPP is not referenced.'));
        assert.ok(markers.equals(38, '/home/REINHARD/builds/hll/expan2main.pgm.sqlrpgle', 0, 'Compilation stopped. Severity 20 errors found in program.'));
        assert.ok(markers.equals(2, '/home/REINHARD/builds/hll/expan2cpy1.rpgleinc', 3, 'The name or indicator CPY_Y is not referenced.'));
        assert.ok(markers.equals(0, '/home/REINHARD/builds/hll/expan2main.pgm.sqlrpgle', 0, 'No SQL statements found.'));

        const exceptions = parser.getException();
        assert.strictEqual(exceptions, undefined);
    });

    it('test Logging', () => {
        const consoleSpy = vi.spyOn(console, 'log');
        const parser = new Parser();
        const markerCreator = new MarkerCreator();

        // No logging
        parser.loggingEnabled(false);
        parser.parse(new FileReader(`${TEST_DIR}/TYPICAL.PGM.evfevent`), markerCreator);
        expect(consoleSpy).toHaveBeenCalledTimes(0);
        
        // Logging
        parser.loggingEnabled(true);
        parser.parse(new FileReader(`${TEST_DIR}/TYPICAL.PGM.evfevent`), markerCreator);
        expect(consoleSpy).toHaveBeenCalled();
    });
});

function assertFileIDRecord(record: FileIDRecord, fileName: string, fileID: number, flag: number) {
    assert.deepStrictEqual(
        {
            fileName: record.getFileName(),
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