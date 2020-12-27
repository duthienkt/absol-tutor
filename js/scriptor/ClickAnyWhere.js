import BaseCommand from './BaseCommand';
import OOP from 'absol/src/HTML5/OOP';
import TutorNameManager from "./TutorNameManager";

/***
 * @extends {BaseCommand}
 */
function ClickAnyWhere() {
    BaseCommand.apply(this, arguments);
    this.ev_click = this.ev_click.bind(this);
    this._resolveCb = null;
}

OOP.mixClass(ClickAnyWhere, BaseCommand);


ClickAnyWhere.prototype.exec = function () {
   this.start();
    document.addEventListener('click', this.ev_click);
    return new Promise(function (rs) {
        this._resolveCb = rs;
    }.bind(this)).then(this.stop.bind(this));

};

ClickAnyWhere.prototype.cancel = function () {
    document.removeEventListener('click', this.ev_click);
};


ClickAnyWhere.prototype.ev_click = function (event) {
    if (this._resolveCb) {
        this._resolveCb();
        this._resolveCb = null;
    }
};


ClickAnyWhere.attachEnv = function (tutor, env) {
    env.CLICK_ANY_WHERE = new ClickAnyWhere(tutor, {});
};

TutorNameManager.addConst('CLICK_ANY_WHERE');

export default ClickAnyWhere;
