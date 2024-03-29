import OOP from "absol/src/HTML5/OOP";
import TState from "./TState";
import noop from 'absol/src/Code/noop';


export var STATE_FINISH = 'finish';


/***
 * @extends TState
 * @param command
 * @constructor
 */
function StateFinish(command) {
    TState.apply(this, arguments);
}

OOP.mixClass(StateFinish, TState);


StateFinish.prototype.onStart = function () {
    this.command.resolve();
};

/***
 *
 * @param {TProcess}process
 * @param {{}} args
 * @constructor
 */
function AsyncCommand(process, args) {
    this.process = process;
    this.args = args;
    this.state = null;
    this.promise = new Promise(function (resolve, reject) {
        this._resolveCb = resolve;
        this._rejectCb = reject;
    }.bind(this));
}

AsyncCommand.prototype.type = 'async';

AsyncCommand.prototype.argNames = [];

AsyncCommand.prototype.onStart = noop;

AsyncCommand.prototype.onStop = noop;


AsyncCommand.prototype.goto = function (state) {
    if (!this.state) return;// stop or not start, can not goto
    var clazz = this.stateClasses[state];
    this.state.onStop();
    this.state = new clazz(this);
    this.state.onStart();
};

AsyncCommand.prototype.resolve = function (result) {
    var stackIdx;
    if (this.state) {
        this.state.onStop();
        this.onStop();
        this.state = null;
        stackIdx = this.process.stack.indexOf(this);
        if (stackIdx >= 0) {
            this.process.stack.splice(stackIdx, 1);
        }
        else {
            throw new Error('Stack error: process.stack run incorrectly!');
        }
    }
    if (this._resolveCb) {
        this._resolveCb(result);
        this._rejectCb = null;
        this._resolveCb = null;
    }
};

AsyncCommand.prototype.reject = function (err) {
    if (this.state) {
        this.state.onStop();
        this.state = null;
        this.onStop();
    }

    if (this._rejectCb) {
        this._rejectCb(err);

        this._rejectCb = null;
        this._resolveCb = null;
    }
};

AsyncCommand.prototype.exec = function () {
    if (!this.state) {
        this.process.stack.push(this);
        this.onStart();
        this.state = new this.stateClasses.entry(this);
        this.state.onStart();
    }
    return this.promise;
};


AsyncCommand.prototype.stateClasses = {};

AsyncCommand.prototype.stateClasses.finish = StateFinish;
AsyncCommand.prototype.stateClasses.entry = StateFinish;


export default AsyncCommand;