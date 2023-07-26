import { assert, describe, expect, it } from 'vitest'
import {EventsFileParserCore} from '../src/evfeventParserCore';
import TestDataReader from './TestDataReader';


describe('Tests',() =>{
    it('test file', () => {
        console.log('test running');
        const parser = new EventsFileParserCore();
        const fileReader = new TestDataReader();
    
        parser.parse(fileReader, 37, null);
        const errors = parser.getAllErrors();
    })
})