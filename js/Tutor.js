import expressionList from './scriptor/expressionList';
import findNode from './util/findNode';
import buildTutorJavaScript from "./buildTutorJavaScript";
import findAllNode from "./util/findAllNode";
import Context from "absol/src/AppPattern/Context";
import OOP from "absol/src/HTML5/OOP";
import EventEmitter from "absol/src/HTML5/EventEmitter";


/***
 * @augments Context
 * @param view
 * @param script
 * @param option
 * @constructor
 */
function Tutor(view, script, option) {
    EventEmitter.call(this);
    Context.call(this);
    this.$view = view;
    this.script = null;

    this.memory = {
        variables: {},
        share: {
            getCurrentInputText: null
        }
    };
    this._commandStack = [];
    this._compile(script);
}

OOP.mixClass(Tutor, EventEmitter, Context);

Tutor.prototype._compile = function (script) {
    this.script = buildTutorJavaScript(script);
};

Tutor.prototype.commandPush = function (command) {
    if (this._commandStack.indexOf(command) < 0) {
        this._commandStack.push(command);
    }
    else {
        throw new Error("Command Stack Error: re-push command!");
    }
};


Tutor.prototype.commandPop = function (command) {
    if (this._commandStack.indexOf(command) >= 0) {
        while (this._commandStack.length > 0) {
            if (this._commandStack.pop() === command) break;
        }
    }
    else {
        throw new Error("Command Stack Error: pop command not in stack!");
    }
};


Tutor.prototype.exec = function () {
    this.start();
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

    return this.script.exec.apply(null, args).then(function () {
        this.stop();
    }.bind(this));
};


Tutor.prototype.onStop = function () {
    this.emit('stop', {});
};


Tutor.prototype.onStart = function () {
    this.emit('start', {});
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
