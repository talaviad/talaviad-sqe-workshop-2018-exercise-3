/* eslint-disable no-console,no-unused-vars,max-lines-per-function */
import { parseCode, parseSymbolic } from './tal';
import * as d3 from 'd3-graphviz';

const runGraph = (codeToParse,vectorInput) => {
    let parsedCode = parseCode(codeToParse);
    let dotList = parseSymbolic(parsedCode['body'][0],vectorInput);
    d3.graphviz('#here' /*,{ useWorker:false }*/).renderDot('digraph { '+dotList+' }');
    return dotList;
};

export {runGraph};
