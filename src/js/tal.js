import * as esprima from 'esprima';

let functionParamsMap;
let vectorInp; // = [1 , 2 , 3];
let dummyVector = [] ;
let dotsList;
let dotsObj = [];
let index;
let arrowFalse = false;
let counter;
let currentNodeColor;
let enterdIf;
let justIfElse;
let justVisitedElse;
let counterIfElse = 0;


const parseCode = (codeToParse) => {
    return esprima.parseScript(codeToParse);
};

/*function logMapElements(value, key, map) {
    console.log(`m[${key}] = ${value['symbolicVal']}`);
    console.log(`m[${key}] = ${value['value']}`);
}*/

const initializeParamsList = (functionParamsMap,inputList,vectorInp) => {
    if (vectorInp.length === 0) return [];
    let vecObj = JSON.parse(inputList);
    let inputNameList = Object.keys(vecObj).map(function(key) {
        return key;
    });
    for(let i=0; i<vectorInp.length; i++) {
        functionParamsMap.set(inputNameList[i],{'symbolicVal': inputNameList[i], 'value': vectorInp[i]});
    }
    return functionParamsMap;
};

const initializeVectorInput = (vectorInput) => {
    //{ "x" : 6 , "Y" : 9 , "z" : 20 }  with no error
    //{ "x" : { "x" : 6 , "Y" : 9 , "z" : 20 } , "Y" : 9 , "z" : 20 }  with error
    if (vectorInput.length === 0) return [];
    let vecObj = JSON.parse(vectorInput);
    let isObj = (typeof vecObj === 'object');
    if (!isObj) return vecObj;
    let vectorInp = Object.keys(vecObj).map(function(key) {
        return [key, initializeVectorInput(JSON.stringify(vecObj[key]))];
    });
    vectorInp = vectorInp.map(function(arr) { return arr[1]; });
    return vectorInp;
};

const initializeGlobals = (vectorInput) => {
    functionParamsMap = new Map();
    dummyVector = [ 0 ];
    index = 0;
    dotsList = '';
    dotsObj = [];
    arrowFalse = false;
    counter = 0;
    enterdIf = true;
    justIfElse = false;
    counterIfElse = 0;
    justVisitedElse = false;
    currentNodeColor = ' style=filled fillcolor=green';
    vectorInp = initializeVectorInput(vectorInput);
    initializeParamsList(functionParamsMap,vectorInput,vectorInp);
    //vectorInp = initializeVectorInput( '{ "x" : 1 , "y" : 16 , "z" : 8 }' ); //vectorInput
    //initializeParamsList(functionParamsMap,'{ "x" : 1 , "y" : 16 , "z" : 8 }',vectorInp);
};

const parseSymbolic = (jsonObj,vectorInput) => {
    //initiazlie
    initializeGlobals(vectorInput);
    if (vectorInp.length === 0) return '';
    /*just one iteration for now.. */
    /*just one iteration for now.. */
    /*just one iteration for now.. */
    /*just one iteration for now.. */
    //let lengthOfProgram = 4; //jsonObj.body.length;
    //console.log('ppp: '+jsonObj.body[4]);
    parsingSymbolicProgram( jsonObj,functionParamsMap);
    /*functionParamsMap.forEach(logMapElements);*/
    /*for(let i=0 ; i<outputLines.length; i++ ) {
        console.log(outputLines[i]);
    }*/
    //console.log('length: '+dotsList.length);
    return dotsList;
};

/*const extractLinesAndPaint = () => {
    let arr = '';
    for(let i=0; i<outputLines.length; i++) {
        let greenLine = '<p style="background-color: green;">' + outputLines[i]+ '<p>' + '\n';
        let readLine = '<p style="background-color: red;">' + outputLines[i]+ '<p>' + '\n';
        let whiteLine = '<p style="background-color: white;">' + outputLines[i]+ '<p>' + '\n';
        let currentColoredLine = (color[i] === 1)? greenLine : (color[i] === 2)? readLine : whiteLine;
        arr = arr + currentColoredLine;
    }
    return arr;
};*/

const getId = () => {
    counter++;
    return ' | #'+counter;
};

const parsingSymbolicProgram = (expression,env) => {
    let result = [];
    //console.log('type: '+expression.type);
    switch (expression.type) {
    case 'FunctionDeclaration' : /*console.log('in func');*/ result = AnalyzeFunctionDecleration(expression,env); break;
    case 'VariableDeclaration' : /*console.log('in VariableDeclaration');*/ result = AnalyzeVariableDeclaration(expression,env); break;
    case 'MemberExpression' : /*console.log('in MemberExpression');*/ result = AnalyzeMemberExpression(expression,env); break;
    case 'BinaryExpression' : /*console.log('in BinaryExpression'); */result =  AnalyzeBinaryExpression(expression,env); break;
    default: result = parsingSymbolicProgram2(expression,env); break;
    }
    return result;
};

const parsingSymbolicProgram2 = (expression,env) => {
    let result = [];
    switch (expression.type) {
    case 'Identifier' : /*console.log('in Identifier');*/ result =  AnalyzeIdentifier(expression,env); break;
    case 'AssignmentExpression' : /*console.log('in AssignmentExpression');*/ result = AnalyzeAssignmentExpression(expression,env); break;
    case 'ExpressionStatement' : /*console.log('in ExpressionStatement');*/ result = parsingSymbolicProgram(expression.expression,env); break;
    //case 'ReturnStatement' : result = AnalyzeReturnStatement(expression,env); break;
    default: result = parsingSymbolicProgram3(expression,env); break;
    }
    return result;
};

const parsingSymbolicProgram3 = (expression,env) => {
    let result = [];
    switch (expression.type) {
    case 'UpdateExpression' : result = AnalyzeUpdateExpression(expression,env,null); break;
    case 'BlockStatement' : /* console.log('in BlockStatement'); */ for(let i=0; i<expression.body.length; i++) { result = result.concat(parsingSymbolicProgram(expression.body[i],env)); dotsList = dotsList + ((result.length <= 1)? '' : (makeArrows(index-1,[result[result.length-2]]))); } break;
    default: result = parsingSymbolicProgram4(expression,env); break;
    }
    return result;
};

const parsingSymbolicProgram4 = (expression,env) => {
    let result = [];
    switch (expression.type) {
    case 'Literal' : /*console.log('in Literal');*/ result = {'name': expression.value, 'symbolicVal': expression.value, 'value': expression.value}; break;
    case 'ArrayExpression' : /*console.log('in ArrayExpression');*/ result = AnalyzeArrayExpression(expression, env); break;
    }
    return result;
};

const AnalyzeArrayExpression = (arrExp,env) => {
    let elements = arrExp.elements;
    let arr = [];
    for (let i=0; i<elements.length; i++) {
        let currentElement = parsingSymbolicProgram(elements[i],env);
        let CurrEleValue = currentElement['value'];
        arr.push(CurrEleValue);
    }
    return { 'name': arr , 'symbolicVal' : '[ ' +arr.toString() + ' ]' , 'value' : arr };
};

const AnalyzeFunctionDecleration = (funcExpr,env) => {
    let functionBody = funcExpr.body.body;
    analyzeFunctionBody(functionBody,env);
};

const analyzeFunctionBody = (functionBody,env) => {
    let result = null;
    for(let i=0; i<functionBody.length; i++) {
        result = analyzeSpecificExp(functionBody,env,i,result);
    }
};

const analyzeSpecificExp = (functionBody,env,i,lastDotObjs) => {
    let currentExp = functionBody[i];
    let result= [];
    let result1= null;
    let result2 = null;
    let toConcat = [];
    switch (currentExp.type) {
    //case 'UpdateExpression' : result = AnalyzeUpdateExpression(currentExp,env); break;
    //case 'BlockStatement' : for(let i=0; i<currentExp.body.length; i++) { result = result.concat(parsingSymbolicProgram(currentExp.body[i],env)); dotsList = dotsList + ((result.length <= 1)? '' : (makeArrows(index-1,[result[result.length-2]]))); } break;
    case 'VariableDeclaration': /*console.log('lastDotObjs: '+lastDotObjs);*/ result = result.concat(AnalyzeVariableDeclaration(currentExp,env,lastDotObjs)); break;
    default: result = analyzeSpecificExp2(functionBody,env,i,lastDotObjs,currentExp,result,result1,result2,toConcat); break;
    }
    return result;
};

const analyzeSpecificExp2 = (functionBody,env,i,lastDotObjs,currentExp,result,result1,result2,toConcat) => {
    switch (currentExp.type) {
    //case 'ExpressionStatement' : result = result.concat(AnalyzeAssignmentExpression(currentExp.expression, env, lastDotObjs)); break;
    case 'ExpressionStatement' : (currentExp.expression.type === 'UpdateExpression')? result = result.concat(AnalyzeUpdateExpression(currentExp.expression, env, lastDotObjs)) : result = result.concat(AnalyzeAssignmentExpression(currentExp.expression, env, lastDotObjs)); break;
    case 'WhileStatement' : result = AnalyzeWhileStatement(currentExp, new Map(env), lastDotObjs); break;
    case 'ReturnStatement' : result = AnalyzeReturnStatement(currentExp, env, lastDotObjs); break;
    default: result = analyzeSpecificExp3(functionBody,env,i,lastDotObjs,currentExp,result,result1,result2,toConcat); break;
    }
    return result;
};

const analyzeSpecificExp3 = (functionBody,env,i,lastDotObjs,currentExp,result,result1,result2,toConcat) => {
    switch (currentExp.type) {
    case 'IfStatement' :
        result1 = AnalyzeIfStatement(currentExp, new Map(env), lastDotObjs);
        result2 = AnalyzeElseIfStatement(currentExp.alternate, new Map(env));
        dotsList = dotsList + result1[0] + ' -> ' + result1[1] + ' [label=T]\n';
        if (result2 !== null) {
            dotsList =  dotsList + result1[0] + ' -> ' + result2[0] + ' [label=F]\n';
            arrowFalse = false;
            toConcat = (justIfElse === true)? result2[0] : result2.slice(1);
            result = [result1[result1.length - 1]].concat(toConcat);
        }
        else { arrowFalse = true; result = [result1[0], result1[result1.length - 1]].concat(toConcat); }
        justIfElse = false;
        break;
    default: result = parsingSymbolicProgram(currentExp, env); break;
    }
    return result;
};

/*const analyzeSpecificExp3 = (functionBody,env,i,lastDotObjs,currentExp,result,result1,result2,toConcat) => {
    switch (currentExp.type) {
        case 'IfStatement' :
            result1 = AnalyzeIfStatement(currentExp, new Map(env), lastDotObjs);
            result2 = AnalyzeElseIfStatement(currentExp.alternate, new Map(env));
            dotsList = dotsList + result1[0] + ' -> ' + result1[1] + ' [label=T]\n';
            if (result2 !== null) {
                dotsList =  dotsList + result1[0] + ' -> ' + result2[0] + ' [label=F]\n';
                arrowFalse = false;
                toConcat = (justIfElse === true)? result2[0] : result2.slice(1);
                result = [result1[result1.length - 1]].concat(toConcat);
            }
            else {
                arrowFalse = true;
                result = [result1[0], result1[result1.length - 1]].concat(toConcat);
            }
            //dotsList = dotsList + ((result2 === null) ? '' : (result1[0] + ' -> ' + result2[0] + ' [label=F]\n'));
            //arrowFalse = (result2 === null) ? true : false;
            //toConcat = ((result2 === null) ? [] : ((justIfElse === true) ? result2[0] : result2.slice(1)));
            justIfElse = false;
            //result = (result2 === null) ? [result1[0], result1[result1.length - 1]].concat(toConcat) : [result1[result1.length - 1]].concat(toConcat);
            break;
        default: result = parsingSymbolicProgram(currentExp, env); break;
    }
    return result;
};*/

const AnalyzeWhileStatement = (whileExp,env,lastDotObjs) => {
    let arrowLines = (lastDotObjs===null) ? '' : makeArrows(index,lastDotObjs);//dotsObj[dotsObj.length-2] + ' -> ' + 'a'+index+'\n';
    let dotObjNull = 'a'+index+' [label="NULL'+getId()+'" shape=box'+currentNodeColor+']\n';
    let dotNull = 'a'+index; index++;
    dotsList = dotsList + dotObjNull + arrowLines;
    let test = parsingSymbolicProgram(whileExp.test,env);
    let testValue = eval(test['value']);
    let dotObj = 'a'+index+' [label="' + test['name'] + getId()+'" shape=diamond style=filled fillcolor=green]\n';
    let testDotObj = 'a'+index;
    dotsList = dotsList + dotObj;
    dotsList = dotsList + dotNull + ' -> ' + testDotObj+'\n'; index++;
    currentNodeColor = testValue? currentNodeColor : '';
    let result = parsingSymbolicProgram(whileExp.body,env);
    currentNodeColor = testValue? currentNodeColor : ' style=filled fillcolor=green';
    dotsList = dotsList + testDotObj + ' -> ' + result[0]+ ' [label=T]\n';
    dotsList = dotsList + [result[result.length-1]] + ' -> ' + dotNull+'\n';
    arrowFalse = true;
    return [testDotObj];
};

const AnalyzeElseIfContinuation3 = (arrayToReturn,result2) => {
    let newResult2 = (justVisitedElse === true)? result2 : ((result2 === null)? result2 : result2.slice(1));
    justVisitedElse = false;
    counterIfElse--;
    return arrayToReturn.concat((result2 === null)? [] :  newResult2);
};

const AnalyzeElseIfContinuation2 = (elseifExp,env,result1,testDotObj,elseEnv,testValue) => {
    let arrowLines1 = (result1 === null || result1.length === 0)? ''  : (testDotObj + ' -> ' +  (result1[0] + ' [label=T]\n'));    //is not correct
    dotsList = dotsList + arrowLines1;
    currentNodeColor = testValue? '' : ' style=filled fillcolor=green';
    let result2 = AnalyzeElseIfStatement(elseifExp.alternate,elseEnv); //should be fixed
    currentNodeColor = ' style=filled fillcolor=green';             //'a' + (index-1)
    let arrowLines2 = (result2 === null)? '' : (testDotObj + ' -> ' + result2[0] + ' [label=F]\n');
    dotsList = dotsList + arrowLines2;
    //console.log('dotsList-ElseIf: '+dotsList);
    let arrayToReturn = [testDotObj , result1[result1.length-1]];
    return AnalyzeElseIfContinuation3(arrayToReturn,result2);
};


const AnalyzeElseIfContinuation1 = (elseifExp,env) => {
    counterIfElse++;
    let elseEnv = new Map(env); let test = parsingSymbolicProgram(elseifExp.test,env); let testValue = eval(test['value']);
    let colored = enterdIf? 'none' : 'green' ;
    let dotObj = 'a'+index+' [label="' + test['name'] + getId()+'" shape=diamond style=filled fillcolor='+colored+']\n';
    let testDotObj = 'a'+index;
    dotsList = dotsList + dotObj;
    dotsObj.push('a'+index);
    index++;
    currentNodeColor = (enterdIf || !testValue)? '' : ' style=filled fillcolor=green' ;
    let result1 = parsingSymbolicProgram(elseifExp.consequent,env); //should be fixed
    return AnalyzeElseIfContinuation2(elseifExp,env,result1,testDotObj,elseEnv,testValue);
};


const AnalyzeElseIfStatement = (elseifExp,env) => { //continue from here...
    let result = null;
    if (elseifExp !== null) {
        if (elseifExp.type === 'IfStatement') return AnalyzeElseIfContinuation1(elseifExp,env);
        else {
            if (counterIfElse === 0) justIfElse = true;
            justVisitedElse = true;
            return parsingSymbolicProgram(elseifExp,env);
        }
    }
    return result; //just for return something
};

const AnalyzeReturnStatement = (retExp,env,lastDotObjs) => {
    let dotArgument = parsingSymbolicProgram(retExp.argument,env);
    let dotRetObj = 'a'+index+' [label="return ' + dotArgument['name'] + getId()+'" shape=box'+currentNodeColor+']\n';
    let arrowLines = makeArrows(index,lastDotObjs);
    dotsList = dotsList + dotRetObj + arrowLines;
    //console.log('dotsList-ret: '+dotsList);
    return dotArgument;
};

const AnalyzeIfStatement = (ifExp,env,lastDotObjs) => {
    let test = parsingSymbolicProgram(ifExp.test,env);
    let testValue = eval(test['value']);
    enterdIf = testValue? true : false;
    let dotObj = 'a'+index+' [label="' + test['name'] + getId()+'" shape=diamond style=filled fillcolor=green]\n';
    let testDotObj = 'a'+index;
    dotsList = dotsList + dotObj;
    dotsObj.push('a'+index);
    let arrowLines = (lastDotObjs===null) ? '' : makeArrows(index,lastDotObjs);
    dotsList = dotsList + arrowLines;
    index++;
    currentNodeColor = testValue? currentNodeColor : '';
    let result = parsingSymbolicProgram(ifExp.consequent,env);
    currentNodeColor = testValue? currentNodeColor : ' style=filled fillcolor=green';
    //console.log('result of if body: '+result);
    //console.log('dotsList inside if: '+dotsList);
    return [testDotObj].concat(result);
};

const AnalyzeVariableDeclaration = (variableDecleration,env,lastDotObj) => {
    //(variableDecleration);
    for(let i=0; i<variableDecleration.declarations.length; i++) {
        let variableDeclarator = variableDecleration.declarations[i];
        let name = variableDeclarator.id.name;
        let init = parsingSymbolicProgram(variableDeclarator.init,env);
        let newObj = { 'symbolicVal': init['symbolicVal'] , 'value': eval(init['value']) }; //been changed
        env.set(name,newObj);
        let dotObj = 'a'+index+' [label="' + name +' = '+ init['name'] + getId()+'" shape=box'+currentNodeColor+']\n';
        dotsList = dotsList + dotObj;
        dotsObj.push('a'+index);
        let arrowLines = (i===0 && lastDotObj===null) ? '' : makeArrows(index,lastDotObj);//dotsObj[dotsObj.length-2] + ' -> ' + 'a'+index+'\n';
        dotsList = dotsList + arrowLines;
        index++;
    }
    return [dotsObj[dotsObj.length-1]]; //returning the object to continue the flow
};

const makeArrows = (index,lastDotObj) => {
    let arrows = '';
    if (lastDotObj === null || lastDotObj === undefined) return '';
    for(let i=0; i<lastDotObj.length; i++) {
        let addingFalse = (arrowFalse)? ' [label=F]' : '';
        arrowFalse = false;
        arrows = arrows + lastDotObj[i] + ' -> ' + 'a' + index + addingFalse+'\n';
    }
    return arrows;
};

const AnalyzeIdentifier = (identifier,env) => {
    let name = identifier.name;
    //console.log('name: '+name);
    return { 'name': name, 'symbolicVal': env.get(name)['symbolicVal'], 'value': env.get(name)['value'] };
};

const AnalyzeMemberExpression = (memExp,env) => {
    let object = parsingSymbolicProgram(memExp.object,env);
    let property = parsingSymbolicProgram(memExp.property,env);
    let objToReturn = { 'name': object['name'] , 'symbolicVal':  object['symbolicVal'] +'[' + property['symbolicVal'] + ']' , 'value': object['value'][eval(property['value'])] , 'index': eval(property['value']) };
    return objToReturn;
};

const isNotUndefined = (vari) => {
    return vari !== undefined;
};

const newArrayFunc =  (isItMemberExp,existInCurrEnv,env,variable) => {
    return isItMemberExp? env.get(variable)['value'] : dummyVector;
};

const getIndex =  (isItMemberExp,vari) => {
    return isItMemberExp? vari : 0;
};

const getAnalysis = (existInCurrEnv,env,symbolicVal,value,existInFunctionParams,functionParamsMap,variable,lastDotObjs) => {
    let dotObj = 'a'+index+' [label="' + variable +' = '+ symbolicVal + getId()+'" shape=box'+currentNodeColor+']\n';
    dotsList = dotsList + dotObj;
    dotsObj.push('a'+index);
    let arrowLine = (lastDotObjs===null) ? '' : makeArrows(index,lastDotObjs);
    dotsList = dotsList + arrowLine;
    index++;
    env.set(variable, {'symbolicVal': symbolicVal, 'value': value});
    return ['a'+(index-1)];
};

const AnalyzeAssignmentExpression = (assExp,env,lastDotObjs) => {
    //console.log('exp: '+assExp.right);
    let left = parsingSymbolicProgram(assExp.left,env); let right = parsingSymbolicProgram(assExp.right, env);
    let isItMemberExp = isNotUndefined(left['index']);
    let variable = left['name'];
    let existInCurrEnv = isNotUndefined(env.get(variable));
    let existInFunctionParams = isNotUndefined(functionParamsMap.get(variable));
    let newArray = newArrayFunc(isItMemberExp,existInCurrEnv,env,variable);
    let index1 = getIndex(isItMemberExp,left['index']);
    newArray[index1] = right['value'];
    let value = isItMemberExp? newArray : right['value'];
    let symbolicVal = isItMemberExp?  left['name'] : right['name'];
    return getAnalysis(existInCurrEnv,env,symbolicVal,value,existInFunctionParams,functionParamsMap,variable,lastDotObjs);
};

const AnalyzeBinaryExpression = (binaryExp,env) => {
    let left = parsingSymbolicProgram(binaryExp.left,env);
    let right = parsingSymbolicProgram(binaryExp.right,env);
    let objToReturn = { 'name': '(' + left['name'] + ' ' + binaryExp.operator + ' '+ right['name'] + ')' , 'symbolicVal': '(' + left['symbolicVal'] + ' ' + binaryExp.operator + ' ' + right['symbolicVal'] + ')', 'value': ''+eval('(' + left['value'] + ' ' + binaryExp.operator + ' ' + right['value'] + ')') };
    return objToReturn;
};

const AnalyzeUpdateExpression = (updateExp,env,lastDotObjs) => {
    //alert(lastDotObjs);
    let name = updateExp.argument.name;
    let operator = (updateExp.operator === '++')? '+1' : '-1';
    let dotObj = 'a'+index+' [label="' + name + ' = ' + name + operator + getId()+ '" shape=box'+currentNodeColor+']\n';
    dotsList = dotsList + dotObj;
    dotsObj.push('a'+index);
    let arrowLine = (lastDotObjs===null) ? '' : makeArrows(index,lastDotObjs);
    dotsList = dotsList + arrowLine;
    let objToReturn = 'a'+index;
    index++;
    let oldValue = env.get(name)['value'];
    let newValue = eval(''+oldValue+operator);
    env.set(name, {'symbolicVal': name+'1', 'value': newValue});
    return objToReturn;
};

export {parseSymbolic};
export {parseCode};
