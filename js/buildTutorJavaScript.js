import regeneratorRuntime from "regenerator-runtime/runtime";
import FunctionKeyManager from "./scriptor/TutorNameManager";

var traverse = babel.traverse;
var parse = babel.parse;
var babelTypes = babel.types;
var presetEnv  = babel.presetEnv;
var generator = babel.generator;

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
    var ast = parse(code);
    awaitInject(code, ast, FunctionKeyManager.getAllAsync());
    var options = {
        presets: [
            presetEnv
        ]
    };

    var newCode = generator(
        ast, {},
        code
    ).code;

    var transformedCode = babel.transform(newCode, options).code;
    var m = {};
    var execFn = new Function('module', 'regeneratorRuntime', transformedCode);
    execFn(m, regeneratorRuntime);
    return {
        argNames: argNames,
        exec: m.exports
    };
}

