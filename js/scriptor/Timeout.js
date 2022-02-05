import BaseCommand from './BaseCommand';
import OOP from 'absol/src/HTML5/OOP';
import FunctionKeyManager from "./TutorNameManager";
import TACData from "./TACData";
import BaseState from "./BaseState";
import { inheritCommand } from "../engine/TCommand";
import TutorEngine from "./TutorEngine";

/***
 * @extends BaseCommand
 * @constructor
 */
function StateWait() {
    BaseState.apply(this, arguments);
    this.toIdx = -1;
}

OOP.mixClass(StateWait, BaseState);

StateWait.prototype.onStart = function () {
    this.toIdx = setTimeout(this.goto.bind(this, 'finish'), this.args.millis);
};


StateWait.prototype.onStart = function () {
    clearTimeout(this.toIdx);
};


/***
 * @extends {BaseCommand}
 */
function Timeout() {
    BaseCommand.apply(this, arguments);
}

inheritCommand(Timeout, BaseCommand);

Timeout.prototype.type = 'sync';
Timeout.prototype.name = 'TIME_OUT';
Timeout.prototype.stateClasses['entry'] = StateWait;
Timeout.prototype.argNames = ['millis'];

TutorEngine.installClass(Timeout);




FunctionKeyManager.addSync('TIME_OUT')
    .addAsync('delay')
    .addAsync('delayUntil');

TACData.define('TIME_OUT',
    {
        type: 'function',
        args: [
            { name: 'millis', type: 'number' }
        ],
        returns: 'Trigger'
    })

export default Timeout;
