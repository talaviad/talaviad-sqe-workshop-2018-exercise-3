/* eslint-disable no-console,no-unused-vars,indent,max-lines-per-function */
import $ from 'jquery';
import {runGraph} from './code-analyzer';
//import d3  from 'd3-graphviz';
//import Viz from 'viz.js';
//import * as d3 from 'd3';
import * as d3 from 'd3-graphviz';


$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let vectorInput = $('#vectorInput').val();
        let jsonParsedCode = runGraph(codeToParse,vectorInput);
        console.log('cons: '+JSON.stringify(jsonParsedCode, null, 2));
        $('#jsonCode').val(JSON.stringify(jsonParsedCode, null, 2));
    });
});
