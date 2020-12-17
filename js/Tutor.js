import expressionList from './scriptor/expressionList';
import findNode from './util/findNode';
import buildTutorJavaScript from "./buildTutorJavaScript";
import findAllNode from "./util/findAllNode";


function Tutor(view, script, option) {
    this.$view = view;
    this.script = null;

    this.memory = {
        variables: {},
        share: {
            getCurrentInputText: null
        }
    };
    this._compile(script);
}

Tutor.prototype._compile = function (script) {
    this.script = buildTutorJavaScript(script);
};

Tutor.prototype.exec = function () {
    var tutor = this;
    var env = {};
    expressionList.forEach(function (exp) {
        if (exp.attachEnv) {
            exp.attachEnv(tutor, env);
        }
    });
    var args = this.script.argNames.map(function (name) {
        return env[name];
    });

    return this.script.exec.apply(null, args);
};

Tutor.prototype.findNode = function (query, unsafe) {
    var elt = findNode(query, this.$view);
    if (!elt && !unsafe) throw new Error('Can not find element with query="' + query + '"');
    return elt;
};

Tutor.prototype.findAllNode = function (query) {
    return findAllNode(query, this.$view);
};


export default Tutor;
