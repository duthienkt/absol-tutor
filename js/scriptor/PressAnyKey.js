import BaseCommand from './BaseCommand';
import OOP from 'absol/src/HTML5/OOP';
import TutorNameManager from "./TutorNameManager";

/***
 * @extends {BaseCommand}
 */
function PressAnyKey() {
    BaseCommand.apply(this, arguments);
    this._isRunning = false;
    this.ev_keyPress = this.ev_keyPress.bind(this);
    this._resolveCb = null;
}

OOP.mixClass(PressAnyKey, BaseCommand);

PressAnyKey.prototype.exec = function () {
    if (this._isRunning) throw new Error("Trigger PRESS_ANY_KEY is not finished before stared again!");
    this._isRunning = true;
    document.addEventListener('keydown', this.ev_keyPress);
    return new Promise(function (rs) {
        this._resolveCb = rs;
    }.bind(this)).then(function () {
        this.cancel();
    }.bind(this));

};

PressAnyKey.prototype.cancel = function () {
    document.removeEventListener('keydown', this.ev_keyPress);
    this._isRunning = false;
};


PressAnyKey.prototype.ev_keyPress = function (event) {
    if (this._resolveCb) {
        this._resolveCb();
        this._resolveCb = null;
    }
};

PressAnyKey.attachEnv = function (tutor, env) {
    env.PRESS_ANY_KEY = new PressAnyKey(tutor, {});
};

TutorNameManager.addConst('PRESS_ANY_KEY');

export default PressAnyKey;
