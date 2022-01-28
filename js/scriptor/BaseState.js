import TState from "../engine/TState";
import OOP from "absol/src/HTML5/OOP";

/***
 * @extends TState
 * @param command
 * @constructor
 */
function BaseState(command) {
    TState.apply(this, arguments);
    /***
     * @type BaseCommand
     * @name command
     * @memberOf BaseState#
     */

    for (var key in this) {
        if (key.startsWith('ev_') || (typeof this[key] === "function")) {
            this[key] = this[key].bind(this);
        }
    }
}

OOP.mixClass(BaseState, TState);


Object.defineProperty(BaseState.prototype, 'tutor', {
    get: function () {
        return this.command.tutor;
    }
});

Object.defineProperty(BaseState.prototype, 'args', {
    get: function () {
        return this.command.args;
    }
});

export default BaseState;