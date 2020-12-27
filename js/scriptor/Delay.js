import BaseCommand from "./BaseCommand";
import OOP from "absol/src/HTML5/OOP";
import TutorNameManager from "./TutorNameManager";

/***
 * @extends BaseCommand
 * @constructor
 */
function Delay() {
    BaseCommand.apply(this, arguments);
    this._timeoutId = -1;
    this._rejectCb = null;
}

OOP.mixClass(Delay, BaseCommand);

Delay.prototype.exec = function () {
    var thisC = this;
    this.start();
    this.preventInteract(true);
    var trigger = this.args.trigger;
    if (trigger.exec) {
        if (trigger.depthClone) trigger = trigger.depthClone();
        return trigger.exec().then(this.stop.bind(this));
    }
    else if (typeof trigger === "number") {
        return new Promise(function (resolve, reject) {
            thisC._rejectCb = reject;
            thisC._timeoutId = setTimeout(resolve, trigger);
        }).then(this.stop.bind(this));
    }
    else {
        this.stop();
        return Promise.resolve();
    }
};

Delay.prototype.cancel = function (){
    if (this._rejectCb) {
        this._rejectCb();
        this._rejectCb = null;
    }
    if (this._timeoutId >= 0) {
        clearTimeout(this._timeoutId);
        this._timeoutId = -1;
    }
};



Delay.attachEnv = function (tutor, env) {
    env.delay = function (trigger) {
        return new Delay(tutor, {
            trigger: trigger
        }).exec();
    };
}

TutorNameManager.addAsync('delay');

export default Delay;