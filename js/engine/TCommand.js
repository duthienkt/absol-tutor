import AsyncCommand from "./AsyncCommand";
import noop from 'absol/src/Code/noop';

/***
 * @type {function(...args: function):void}
 */
export function inheritCommand() {
    var classes = Array.prototype.slice.call(arguments);
    var clazz = classes.shift();
    if (classes.length === 0) classes.push(AsyncCommand);
    var argNames = [];
    var stateClasses;
    var des = {};
    for (var i = 0; i < classes.length; ++i) {
        Object.assign(des, Object.getOwnPropertyDescriptors(classes[i].prototype));
        if (classes[i].prototype.stateClass) {
            stateClasses = Object.assign(stateClasses || {}, classes[i].prototype.stateClass);
        }
        if (classes[i].prototype.argNames) {
            argNames = classes[i].prototype.argNames;
        }
    }

    delete des.constructor;
    Object.defineProperties(clazz.prototype, des);
    clazz.prototype.argNames = argNames.slice();
    if (stateClasses) {
        clazz.prototype.stateClass = stateClasses;
    }
}

/***
 *
 * @param {TProcess} process
 * @param {{}} args
 * @constructor
 */
function TCommand(process, args) {
    this.process = process;
    this.args = args;
}

TCommand.prototype.className = 'TCommand';
TCommand.prototype.argNames = [];

TCommand.prototype.onStart = noop;
TCommand.prototype.onStop = noop;
TCommand.prototype.exec = noop;


export default TCommand;