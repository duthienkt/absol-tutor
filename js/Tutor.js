import * as babelParser from '@babel/parser';
import expressionList from './scriptor/expressionList';
import traverse from "@babel/traverse";
import generate from "@babel/generator";
import findNode from './util/findNode';


function Tutor(view, script, option) {
    this.$view = view;
    this.script = [];

    this.memory = {
        variables: {}
    };
    this._compile(script);
}

Tutor.prototype._compile = function (script) {
    var tutor = this;

    var env = {
        EXEC: function (expression) {
            tutor.script.push(expression);
        }
    };

    expressionList.forEach(function (exp) {
        exp.attachEnv(tutor, env);
    });
    var ast = babelParser.parse(script);
    traverse(ast, {
        CallExpression: function (path) {
            if (path.parent.type === 'ExpressionStatement') {
                var node = path.node;
                if (env[node.callee.name]) {
                    if (node.callee.name != "EXEC") {
                        var newNode = babelParser.parseExpression('EXEC(' + script.substr(path.node.start, path.node.end - path.node.start) + ')');
                        path.replaceWith(newNode);
                    }
                    path.skip();
                }
            }
        }
    });

    var newScript = generate(
        ast, {
            /* options */
        },
        script
    ).code;

    var code = Object.keys(env).map(function (name) {
        return 'var ' + name + ' = env.' + name + ';';
    }).join('\n');
    (new Function('env', code + '\n' + newScript))(env);
    this.script = this.script.map(function (st) {
        return st.depthClone();
    });

};

Tutor.prototype.exec = function () {
    return this.script.reduce(function (ac, cr) {
        return ac.then(function () {
            return cr.exec();
        });
    }, Promise.resolve());
};

Tutor.prototype.findNode = function (query) {
    return findNode(query, this.$view);
};


export default Tutor;
