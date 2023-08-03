/*
 * (c) Copyright IBM Corp. 2023
 */

// import { IMarkerCreator } from "../src/IMarkerCreator";

// class MarkerCreator implements IMarkerCreator {
//     List<Error> _errors = new ArrayList<Error>();
//     public void createMarker(QSYSEventsFileErrorInformationRecord record, String fileLocation, String isReadOnly)
//             throws Exception {
//         _errors.add( new Error(fileLocation, record.getMsg(), Integer.parseInt(record.getStmtLine())) );
        
//     }

//     public void updateConnectionName(String location, int indexEndBracket) {
        
//     }

//     public int getErrorCount() {
//         return _errors.size();
//     }

//     public boolean equals(int errorIndex, String path, String msg, int line) {
//         if (errorIndex >= _errors.size()) return false; // error not there
//         Error err = _errors.get(errorIndex);
//         return err.equals(new Error(path, msg, line));
//     }
// }


// public class Error {
//     String _file;
//     String _message;
//     int    _startLine;
//     Error(String file, String message, int stmtLine) {
//         _file = file;
//         _message = message;
//         _startLine = stmtLine;
//     }
    
//     public int hashCode() {
//         final int prime = 31;
//         int result = 1;
//         result = prime * result + Objects.hash(_file, _message, _startLine);
//         return result;
//     }

//     public boolean equals(Object obj) {
//         if (this == obj)
//             return true;
//         if (obj == null)
//             return false;
//         if (getClass() != obj.getClass())
//             return false;
//         Error other = (Error) obj;
//         if (!Objects.equals(_file, other._file)) {
//             System.err.println("expected: " + other._file + " got " + _file);
//             return false;
//         }
//         if (!Objects.equals(_message, other._message)) {
//             System.err.println("expected: " + other._message + " got " + _message);
//             return false;
//         }
//         if (_startLine != other._startLine) {
//             System.err.println("expected: " + other._startLine + " got " + _startLine);
//             return false;
//         }
//         return true;
//     }
// }