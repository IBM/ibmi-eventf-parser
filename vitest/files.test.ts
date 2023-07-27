import { assert, describe, expect, it } from 'vitest'
import { Parser } from '../src/Parser';
import TestDataReader from './TestDataReader';


describe('Tests', () => {
    it('test file', () => {
        console.log('test running');
        const parser = new Parser();
        const fileReader = new TestDataReader();

        parser.parse(fileReader, 37);
        const errors = parser.getAllErrors();
    })
})