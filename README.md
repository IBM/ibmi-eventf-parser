# ibmi-eventf-parser
Parses the event files that are placed into the EVFEVENT SRC-PF by IBM i compilers.  Provides a call back interface to allow any other tools to process compiler errors.
The eventf format is described in this [IBM documentation](https://www.ibm.com/docs/en/rdfi/9.6.0?topic=reference-events-file-format)
This parser is available as an npm module using
```
npm i @ibm/ibmi-eventf-parser
```
The API to use this  parser is illustrated in the `vitest/files.test.ts` examples.
```
        const parser = new Parser();
        const markers: MarkerCreator = new MarkerCreator();
        parser.parseFile(`${TEST_DIR}/SQLRPGLE.PGM.evfevent`, markers);

        assert.strictEqual(markers.getErrorCount(), 61);
        assert.ok(markers.equals(0, '/home/REINHARD/builds/hll/sqlrpgle.pgm.sqlrpgle', 328, 'Precompile option COMMIT changed by SET OPTION statement.'));
        assert.ok(markers.equals(1, '/home/REINHARD/builds/hll/includes/familly.rpgleinc', 23, 'The Definition-Type entry is not valid; defaults to parameter definition.'));
        assert.ok(markers.equals(60, '/home/REINHARD/builds/hll/sqlrpgle.pgm.sqlrpgle', 0, 'Compilation stopped. Severity 30 errors found in program.'));
```
In the simplest method, implement the IMarketCreator interface and then pass that int to the parse method on the Parser class.  
For every error logged in the eventf this callback method will be called
```
    public createMarker(record: ErrorInformationRecord, fileLocation: string, isReadOnly: string) {
        //...
    }
```
Where the `ErrorInformationRecord` has all the information about the error included the original line and column range in the original source that this error was encountered in.  The value is that the parser is able to interpret all of the expansion events from precompilers and includes to determine accurate token locations in the origination source file whose path is provided in the `fileLocation`.
