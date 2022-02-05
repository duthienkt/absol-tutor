import BaseCommand from './BaseCommand';
import OOP from 'absol/src/HTML5/OOP';
import TutorNameManager from "./TutorNameManager";
import TACData from "./TACData";
import BaseState from "./BaseState";
import { inheritCommand } from "../engine/TCommand";
import TutorEngine from "./TutorEngine";
import safeThrow from "absol/src/Code/safeThrow";

/***
 * @extends BaseState
 * @constructor
 */
function WaitPressKey() {
    BaseState.apply(this, arguments);
}

OOP.mixClass(WaitPressKey, BaseState);

WaitPressKey.prototype.onStart = function () {
    document.addEventListener('keydown', this.ev_keyPress);
};


WaitPressKey.prototype.onStop = function () {
    document.removeEventListener('keydown', this.ev_keyPress);
};

WaitPressKey.prototype.ev_keyPress = function () {
    this.goto('finish');
};


/***
 * @extends {BaseCommand}
 */
function PressAnyKey() {
    BaseCommand.apply(this, arguments);
}

inheritCommand(PressAnyKey, BaseCommand);
PressAnyKey.prototype.type = 'const';
PressAnyKey.prototype.name = 'PRESS_ANY_KEY';
PressAnyKey.prototype.stateClasses['entry'] = WaitPressKey;

TutorEngine.installClass(PressAnyKey);

TutorNameManager.addConst('PRESS_ANY_KEY');

TACData.define('PRESS_ANY_KEY', {
    type: 'Trigger'
});

export default PressAnyKey;
