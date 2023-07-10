        dcl-s x char(10);             
        x = %subst(x : 'abcdefghij'); 
        //  Msg id  Sv Number Seq     Message text                                        
        // *RNF0362 20      2 000200  The second parameter 'abcdefghij' for %SUBST is not valid;
        //                            built-in function is ignored.       