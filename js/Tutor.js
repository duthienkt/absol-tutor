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


    this.option = Object.assign({
        messageDelay: 300
    }, option);
    this.debug = {
        status: "NOT_START",
        loc: {
            start: -1,
            end: -1,
            row: 0, //indexing from 1
            col: 0,
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
    this.debug.status = "RUNNING";
    return this.script.exec.apply(null, args).then(function (result) {
        this.stop();
        this.debug.status = "FINISH";
        return result;
    }.bind(this)).catch(function (error) {
        this.stop();
        if (error instanceof Error) {
            this.debug.status = "ERROR";
            throw error;
        }
    }.bind(this));
};


Tutor.prototype.onStop = function () {
    var cmdList = this._commandStack.slice();
    for (var i = cmdList.length - 1; i >= 0; --i) {
        cmdList[i].stop();
    }
};


Tutor.prototype.findNode = function (query, unsafe) {
    var elt = findNode(query, this.$view);
    if (!elt && !unsafe) throw new Error('Can not find element with query="' + query + '"');
    return elt;
};

Tutor.prototype.findAllNode = function (query) {
    return findAllNode(query, this.$view);
};


Tutor.prototype.getStatus = function () {
    if (this.debug.status === "NOT_START") return {
        status: "NOT_START"
    };
    if (this.debug.status === "RUNNING" || this.debug.status === "ERROR")
        return {
            status: this.debug.status,
            code: this.script.code.substr(this.debug.loc.start, this.debug.loc.end - this.debug.loc.start),
            row: this.debug.loc.row - 1,
            col: this.debug.loc.col
        };
    return {
        status: "FINISH"
    };
}


export default Tutor;
