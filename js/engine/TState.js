import noop from 'absol/src/Code/noop';

/***
 *
 * @param {AsyncCommand} command
 * @constructor
 */
function TState(command) {
    this.command = command;
}

TState.prototype.name = 'noop';

TState.prototype.onStart = noop;
TState.prototype.onStop = noop;

/***
 *
 * @param {string} state
 */
TState.prototype.goto = function (state) {
    this.command.goto(state);
}

export default TState;