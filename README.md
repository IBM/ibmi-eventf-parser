# ibmi-eventf-parser
Parses the event files that are placed into the EVFEVENT PF by IBM i compilers.  Provides a call back interface to allow any other tools to process compiler errors.
The eventf format is described in this [IBM documentation](https://www.ibm.com/docs/en/rdfi/9.8.0?topic=reference-events-file-format)

## Installation
This parser is available as an NPM module and can be installed as a dependency using:

```bash
npm i @ibm/ibmi-eventf-parser
```

---

## Example
The API to use this parser is illustrated in the [vitest/files.test.ts](./vitest/files.test.ts) examples:

[`FileReader`](./vitest/FileReader.ts)  is an implementation of `ISequentialFileReader`. You can find it in the vitest directory in case you also want to read a local EVFEVENT file.

```typescript
const parser = new Parser();
const markers: MarkerCreator = new MarkerCreator();
const fileReader = new FileReader(`${TEST_DIR}/SQLRPGLE.PGM.evfevent`);
parser.parse(fileReader, markers);

assert.ok(markers.equals(0, '/home/REINHARD/builds/hll/sqlrpgle.pgm.sqlrpgle', 328, 'Precompile option COMMIT changed by SET OPTION statement.'));
assert.ok(markers.equals(1, '/home/REINHARD/builds/hll/includes/familly.rpgleinc', 23, 'The Definition-Type entry is not valid; defaults to parameter definition.'));
assert.ok(markers.equals(60, '/home/REINHARD/builds/hll/sqlrpgle.pgm.sqlrpgle', 0, 'Compilation stopped. Severity 30 errors found in program.'));
```

---

## Usage
In the simplest method, create a class that implements the `IMarkerCreator` interface and then pass an instance into the `parse` method on the `Parser` class.

For every error logged in the eventf, the following callback function will be called:

```typescript
public createMarker(record: ErrorInformationRecord, fileLocation: string, isReadOnly: string) {
    //...
}
```

where the `ErrorInformationRecord` has all the information about the error included the original line and column range in the original source that this error was encountered in.  The value is that the parser is able to interpret all of the expansion events from precompilers and includes to determine accurate token locations in the origination source file whose path is provided in the `fileLocation`.

All data is read using the `ISequentialFileReader` on the general `parser.parse(fileReader: ISequentialFileReader, markerCreator?: IMarkerCreator)` method. The `readNextLine()` method can use sockets, read from an array, read a local file, or use any other arbitrary mechanism to get the contents of the eventf.

```typescript
export interface ISequentialFileReader {
	readNextLine(): string | undefined;
}
```

For full access to every record that was parsed in the eventf, set an implementation of `IProcessor` on the parser using the  `parser.setProcessor()` method. 
