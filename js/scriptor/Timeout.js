import BaseCommand from './BaseCommand';
import OOP from 'absol/src/HTML5/OOP';
import FunctionKeyManager from "./TutorNameManager";
import TACData from "./TACData";

/***
 * @extends {BaseCommand}
 */
function Timeout() {
    BaseCommand.apply(this, arguments);
    this._timeoutId = -1;
    this._rejectCb = null;
}

OOP.mixClass(Timeout, BaseCommand);


Timeout.prototype.exec = function () {
    this.start();
    var thisC = this;
    if (thisC._timeoutId > 0) {
        throw  new Error("Trigger TIMEOUT is not finish before started again!");
    }
    return new Promise(function (resolve, reject) {
        thisC._timeoutId = setTimeout(function () {
            thisC._rejectCb = null;
            thisC._timeoutId = -1;
            resolve();
        }, thisC.args.millis);
        thisC._rejectCb = reject;
    }).then(this.stop.bind(this));
};

Timeout.prototype.cancel = function () {
    if (this._timeoutId > 0) {
        clearTimeout(this._timeoutId);
        this._timeoutId = -1;
    }
    if (this._rejectCb) {
        this._rejectCb();
        this._rejectCb = null;
    }
};

Timeout.attachEnv = function (tutor, env) {
    env.TIME_OUT = function (millis) {
        return new Timeout(tutor, {
            millis: millis
        });
    };

    env.delayUntil = function (trigger) {
        if (!trigger || !trigger.exec)
            throw new Error("delayUntil: param " + trigger + " is not a Trigger!");
        trigger = trigger.depthClone();
        return trigger.exec();
    };
};

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
