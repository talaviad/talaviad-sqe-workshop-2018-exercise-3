import assert from 'assert';
import {parseSymbolic, parseCode} from '../src/js/tal';

let vectorInput = '{ "x" : 1 , "y" : 2 , "z" : 3 }';
let vectorInput2 = '{ "x" : 5 , "y" : 2 , "z" : 3 }';
let vectorInputWithArray = '{ "x" : { "x" : 6 , "y" : 9 , "z" : 20 } , "y" : 9 , "z" : 20 }';
let emptyVector = '';
let inputTest1 = 'function foo(x, y, z){\n' +
    '    y = 22;\n' +
    '    let a = x + 1;\n' +
    '    let b = a + y;\n' +
    '    let c = 0;\n' +
    '    \n' +
    '    if (b < z) {\n' +
    '        c = c + 5;\n' +
    '    } else if (b < z * 2) {\n' +
    '        c = c + x + 5;\n' +
    '    } else {\n' +
    '        c = c + z + 5;\n' +
    '    }\n' +
    '    \n' +
    '    return c;\n' +
    '}\n';

let inputTest2 = 'function foo(x, y, z){\n' +
    '    let a = x + 1;\n' +
    '    let b = a + y;\n' +
    '    let c = 0;\n' +
    '    \n' +
    '    if (b < z) {\n' +
    '        c = c + 5;\n' +
    '    } else {\n' +
    '        c = c + z + 5;\n' +
    '    }\n' +
    '    \n' +
    '    return c;\n' +
    '}';

let inputTest3 = 'function foo(x, y, z){\n' +
    '    let a = x + 1;\n' +
    '    let b = a + y;\n' +
    '    let c = 0;\n' +
    '    \n' +
    '    if (b < z) {\n' +
    '        c = c + 5;\n' +
    '    } \n' +
    '    \n' +
    '    return c;\n' +
    '}';

let inputTest4 = 'function foo(x, y, z){\n' +
    '   let a = x + 1;\n' +
    '   let b = a + y;\n' +
    '   let c = 0;\n' +
    '   \n' +
    '   while (a < z) {\n' +
    '       c = a + b;\n' +
    '       z = c * 2;\n' +
    '       a++;\n' +
    '   }\n' +
    '   \n' +
    '   return z;\n' +
    '}\n';

let inputTest5 = 'function foo(x, y, z){\n' +
    '    let a = x + 1;\n' +
    '    let b = a + y;\n' +
    '    let c = 0;\n' +
    '    \n' +
    '    if (b < z) {\n' +
    '        c = c + 5;\n' +
    '    } else if (b < z * 2) {\n' +
    '        c = c + x + 5;\n' +
    '    } else if (b < 15) {\n' +
    '        c = c + x + 5;\n' +
    '        c++;\n' +
    '    } else {\n' +
    '        c = c + z + 5;\n' +
    '    }\n' +
    '    \n' +
    '    return c;\n' +
    '}';

let inputTest6 = 'function foo(x, y, z){\n' +
    '    let a = y + 1;\n' +
    '    let b = a + y;\n' +
    '    let c = 0;\n' +
    '    \n' +
    '    if (b < z) {\n' +
    '        c = c + 5;\n' +
    '        let n =10;\n' +
    '    } else if (b < z * 2) {\n' +
    '        c = c + x[0] + 5;\n' +
    '    } else if (b < 15) {\n' +
    '        c = c + x[1] + 5;\n' +
    '        c++;\n' +
    '    } else {\n' +
    '        c = c + z + 5;\n' +
    '    }\n' +
    '    \n' +
    '    return c;\n' +
    '}';

let inputTest7 = 'function foo(x, y, z){\n' +
    '    let a = y + 1;\n' +
    '    let b = a + y;\n' +
    '    let c = 0;\n' +
    '    c++;\n' +
    '    \n' +
    '    if (b < z) {\n' +
    '        c = c + 5;\n' +
    '        let n =10;\n' +
    '    } else if (b < z * 2) {\n' +
    '        c = c + x[0] + 5;\n' +
    '    } else if (b < 15) {\n' +
    '        c = c + x[1] + 5;\n' +
    '        c++;\n' +
    '    } else {\n' +
    '        c = c + z + 5;\n' +
    '    }\n' +
    '    \n' +
    '    return c;\n' +
    '}';

let inputTest8 = 'function foo(x, y, z){\n' +
    '    let a = x + 1;\n' +
    '    let b = a + y;\n' +
    '    let c = 0;\n' +
    '    let d = [ 2 , 5 , 8 ];\n' +
    '    b = 22;\n' +
    '    z++;\n' +
    '    \n' +
    '    if (b < z) {\n' +
    '        c = c + 5;\n' +
    '    } else if (b < z * 2) {\n' +
    '        c = c + x + 5;\n' +
    '    } else {\n' +
    '        c = c + z + 5;\n' +
    '    }\n' +
    '    \n' +
    '    return c;\n' +
    '}';

let inputTest9 = 'function foo(x, y, z){\n' +
    '   function goo() {\n' +
    '   }\n' +
    '   \n' +
    '   return z;\n' +
    '}';

let inputTest10 = 'function foo(x, y, z){\n' +
    '   while (x < z) {\n' +
    '      x = 19;\n' +
    '   }\n' +
    '   \n' +
    '   return z;\n' +
    '}';

let inputTest11 = 'function foo(x, y, z){\n' +
    '    let a = x + 1;\n' +
    '    let b = a + y;\n' +
    '    let c = 0;\n' +
    '    \n' +
    '    if (b < z) {\n' +
    '        c = c + 5;\n' +
    '    } else if (b < z * 2) {\n' +
    '        c = c + x + 5;\n' +
    '}\n' +
    '    \n' +
    '    return c;\n' +
    '}';

let inputTest12 = 'function foo(x, y, z){\n' +
    '    if (x < z) {\n' +
    '    }\n' +
    '    \n' +
    '    return x;\n' +
    '}';

let inputTest13 = 'function foo(x, y, z){\n' +
    '     \n' +
    '    if (x < z) {\n' +
    '    }\n' +
    '    else if (x>z) {\n' +
    '    }\n' +
    '    x[0] = 6;\n' +
    '    return x;\n' +
    '}';

let inputTest14 = 'function foo(x, y, z){\n' +
    '     x--;\n' +
    '     x+= 6;\n' +
    '    return x;\n' +
    '}';

describe('The javascript parser', () => {
    it('test1', () => {
        assert.equal(parseSymbolic(parseCode(inputTest1)['body'][0],vectorInput).length,776);
    });
    it('test2', () => {
        assert.equal(parseSymbolic(parseCode(inputTest2)['body'][0],vectorInput).length,534);
    });
    it('test3', () => {
        assert.equal(parseSymbolic(parseCode(inputTest3)['body'][0],vectorInput).length,450);
    });
    it('test4', () => {
        assert.equal(parseSymbolic(parseCode(inputTest4)['body'][0],vectorInput).length,702);
    });
    it('test5', () => {
        assert.equal(parseSymbolic(parseCode(inputTest5)['body'][0],vectorInput).length,979);
    });
    it('test6', () => {
        assert.equal(parseSymbolic(parseCode(inputTest6)['body'][0],vectorInputWithArray).length,1025);
    });
    it('test7', () => {
        assert.equal(parseSymbolic(parseCode(inputTest7)['body'][0],emptyVector).length,0);
    });
    it('test8', () => {
        assert.equal(parseSymbolic(parseCode(inputTest8)['body'][0],vectorInput).length,935);
    });
    it('test9', () => {
        assert.equal(parseSymbolic(parseCode(inputTest9)['body'][0],vectorInput).length,66);
    });
    it('test10', () => {
        assert.equal(parseSymbolic(parseCode(inputTest10)['body'][0],vectorInput2).length,288);
    });
    it('test11', () => {
        assert.equal(parseSymbolic(parseCode(inputTest11)['body'][0],vectorInput2).length,599);
    });
    it('test12', () => {
        assert.equal(parseSymbolic(parseCode(inputTest12)['body'][0],vectorInput2).length,189);
    });
    it('test13', () => {
        assert.equal(parseSymbolic(parseCode(inputTest13)['body'][0],vectorInputWithArray).length,346);
    });
    it('test14', () => {
        assert.equal(parseSymbolic(parseCode(inputTest14)['body'][0],vectorInput2).length,212);
    });
});


