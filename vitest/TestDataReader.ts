import ISequentialFileReader from '../src/ISequentialFileReader';

export default class TestDataReader implements ISequentialFileReader{
    public readNextLine(){
        return "TIMESTAMP  0 20230713190126";
    }
}