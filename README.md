# ibmi-eventf-parser
Parses the event files that are placed into the EVFEVENT SRC-PF by IBM i compilers.  Provides a call back interface to allow any other tools to process compiler errors.
The eventf format is described in this [IBM documentation](https://www.ibm.com/docs/en/rdfi/9.6.0?topic=reference-events-file-format)
This parser is available as an npm module using
```
npm i @ibm/ibmi-eventf-parser
```
The API to use this  parser is illustrated in the `vitest/files.test.ts` examples.
```
```
