import AsyncCommand from "./AsyncCommand";

import regeneratorRuntime from "regenerator-runtime/runtime";
import TProgram from "./TProgram";
import TDebug from "./TDebug";

var traverse = babel.traverse;
var parse = babel.parse;
var babelTypes = babel.types;
var presetEnv = babel.presetEnv;
var generator = babel.generator;


function ScriptEngine() {
    this.asyncCommandClasses = {};
    this.syncCommandClasses = {};
    this.asyncCommandFunctions = {};
    this.syncCommandFunctions = {};
    this.constants = {};
    this.installCommand(TDebug);
}

ScriptEngine.prototype.makeModuleTemplate = function (code, argNames) {
    return 'module.exports = async function exec(' + argNames.join(',') + ') {\n' +
        code +
        '\nreturn 0;' +
        '}';

};


ScriptEngine.prototype.awaitInject = function (code, ast) {
    var dict = Object.assign({}, this.asyncCommandClasses,
        this.asyncCommandFunctions);

    traverse(ast, {
        ExpressionStatement: function (path) {
            if (path.node.ignore) return;
            if (path.node.loc.start.line === 1) return;
            var _db = babel.types.callExpression(
                babel.types.identifier("_db"), [
                    babel.types.numericLiteral(path.node.loc.start.line),
                    babel.types.numericLiteral(path.node.loc.start.column),
                    babel.types.numericLiteral(path.node.start),
                    babel.types.numericLiteral(path.node.end)
                ]
            );
            _db.ignore = true;
            path.insertBefore(_db)
        },
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
};


ScriptEngine.prototype.makeEnvVariable = function (process, name) {
    var clazz = this.asyncCommandClasses[name] || this.syncCommandClasses[name];
    var className;
    if (clazz) {
        if (clazz.attachEnv) {
            clazz.attachEnv(process, process.env);
        }
        else {
            className = clazz.prototype.className || clazz.name;
            (new Function('process', 'env', className,
                'env.' + name + ' = function ' + name + '(' + clazz.prototype.argNames.join(', ') + ') {'
                + 'return new ' + className + '(process, {' +
                clazz.prototype.argNames.map(function (argName) {
                    return argName + ': ' + argName;
                }).join(',\n')
                + '}).exec();'
                + '}'
            ))(process, process.env, clazz);
        }
        return;
    }

    var func = this.syncCommandFunctions[name];
    if (func) {
        process.env[name] = func;
        return;
    }

    if (name in this.constants) {
        process.env[name] = this.constants[name];
    }
};

/***
 *
 * @param {TProcess} process
 * @returns {*}
 */
ScriptEngine.prototype.makeEnvVariables = function (process) {
    process.program.envArgNames.forEach(function (arg) {
        this.makeEnvVariable(process, arg);
    }.bind(this));
};

ScriptEngine.prototype.ProgramClass = TProgram;

/***
 * @returns TProgram
 */
ScriptEngine.prototype.compile = function (code) {
    var argNames = Object.keys(Object.assign({}, this.asyncCommandClasses, this.syncCommandClasses, this.constants));
    code = this.makeModuleTemplate(code, argNames);
    var ast = parse(code);
    this.awaitInject(code, ast);

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
    return new this.ProgramClass(this, m.exports, argNames, {
        code: code,
        es6Code: newCode,
        transformedCode: transformedCode
    });
};


ScriptEngine.prototype.installCommand = function (clazz) {
    var isAsync = clazz.prototype.type === 'async';
    if (isAsync) {
        this.asyncCommandClasses[clazz.prototype.name] = clazz;
    }
    else {
        this.syncCommandClasses[clazz.prototype.name] = clazz;
    }
    return this;
};

ScriptEngine.prototype.installFunction = function (name, func, async) {
    if (async) {
        this.asyncCommandFunctions[name] = func;
    }
    else {
        this.syncCommandFunctions[name] = func;
    }
    return this;
};

ScriptEngine.prototype.installConst = function (name, value) {
    this.constants[name] = value;
};

export default ScriptEngine;
