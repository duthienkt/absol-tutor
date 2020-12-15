import * as babelParser from '@babel/parser';
import * as Babel from '@babel/core';
import presetEnv from '@babel/preset-env';
import regeneratorRuntime from "regenerator-runtime/runtime";
import traverse from "@babel/traverse";
import generate from "@babel/generator";
import * as babelTypes from "@babel/types";
import FunctionKeyManager from "./scriptor/FunctionNameManager";
import Tutor from "./Tutor";


// FunctionKeyManager.addAsync('USER_SELECT_MENU')
//     .addAsync('USER_CHECKBOX')
//     .addAsync('USER_INPUT_TEXT')
//     .addAsync('TOAST_MESSAGE')
//     .addSync('$')
//     .addSync('TIME_OUT');

function moduleTemplate(code, argNames) {
    return 'module.exports = async function exec(' + argNames.join(',') + ') {' +
        code +
        '}'
}


function awaitInject(code, ast, asyncFunctionNames) {
    var dict = asyncFunctionNames.reduce(function (ac, cr) {
        ac[cr] = true;
        return ac;
    }, {});
    traverse(ast, {
        CallExpression: function (path) {
            var needUpdate = false;
            if (path.parent.type === 'AwaitExpression') {
                needUpdate = true;
            }
            else {
                var node = path.node;
                var callee = node.callee;
                var calleeName = code.substr(callee.start, callee.end - callee.start);
                if (dict[calleeName]) {
                    var newNode = babelTypes.awaitExpression(node);
                    path.replaceWith(newNode);
                    needUpdate = true;
                }
            }
            if (needUpdate) {
                var p = path;
                var pNode;
                while (p) {
                    pNode = p.node;
                    if (pNode.type === 'FunctionDeclaration') {
                        pNode.async = true;
                        dict[pNode.id.name] = true;
                        break;
                    }
                    p = p.parentPath;
                }
            }
        }
    });

    return ast;
}

export default function buildTutorJavaScript(code) {
    var argNames = FunctionKeyManager.getAll();
    code = moduleTemplate(code, argNames);
    var ast = babelParser.parse(code);
    awaitInject(code, ast, FunctionKeyManager.getAllAsync());
    var options = {
        presets: [
            presetEnv
        ]
    };

    var newCode = generate(
        ast, {},
        code
    ).code;

    var transformedCode = Babel.transform(newCode, options).code;
    var m = {};
    var execFn = new Function('module', 'regeneratorRuntime', transformedCode);
    execFn(m, regeneratorRuntime);
    return {
        argNames: argNames,
        exec: m.exports
    };
}

