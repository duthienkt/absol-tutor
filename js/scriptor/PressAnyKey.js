import BaseCommand from './BaseCommand';
import OOP from 'absol/src/HTML5/OOP';
import TutorNameManager from "./TutorNameManager";
import TACData from "./TACData";

/***
 * @extends {BaseCommand}
 */
function PressAnyKey() {
    BaseCommand.apply(this, arguments);
    this.ev_keyPress = this.ev_keyPress.bind(this);
    this._resolveCb = null;
}

OOP.mixClass(PressAnyKey, BaseCommand);

PressAnyKey.prototype.exec = function () {
    this.start();
    document.addEventListener('keydown', this.ev_keyPress);
    return new Promise(function (rs) {
        this._resolveCb = rs;
    }.bind(this)).then(this.stop.bind(this));

};

PressAnyKey.prototype.cancel = function () {
    document.removeEventListener('keydown', this.ev_keyPress);
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

TACData.define('PRESS_ANY_KEY', {
    type: 'Trigger'
});

export default PressAnyKey;
