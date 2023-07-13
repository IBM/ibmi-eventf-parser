        dcl-s x char(10);             
        x = %subst(x : 'a very long literal that is likely to overflow the error record and cause an extension line to be generated'); 
        //  Msg id  Sv Number Seq     Message text                                        
        // *RNF0362 20      2 000200  The second parameter 'abcdefghij' for %SUBST is not valid;
        //                            built-in function is ignored.       