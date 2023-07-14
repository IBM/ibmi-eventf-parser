import {test} from 'vitest';
import {EventsFileParserCore} from '../src/evfeventParserCore';
import TestDataReader from './TestDataReader';


test('test file', () => {
    const parser = new EventsFileParserCore();
    const fileReader = new TestDataReader();

    parser.parse(fileReader, 37, null);
})