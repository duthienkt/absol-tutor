import BaseCommand from "./BaseCommand";
import OOP from "absol/src/HTML5/OOP";
import TutorNameManager from "./TutorNameManager";

/***
 * @extends BaseCommand
 * @constructor
 */
function Delay() {
    BaseCommand.apply(this, arguments);
}

OOP.mixClass(Delay, BaseCommand);

Delay.prototype.exec = function () {
    this.start();
    this.preventInteract(true);
    var trigger = this.args.trigger;
    if (trigger.exec){
        if (trigger.depthClone) trigger = trigger.depthClone();
        return trigger.exec().then(this.stop.bind(this));
    }
    else if (typeof trigger === "number"){
        return  new Promise(function (resolve){
            setTimeout(resolve, trigger);
        })
    }
    else return  Promise.resolve();
}


Delay.attachEnv = function (tutor, env) {
    env.delay = function (trigger) {
        return new Delay(tutor, {
            trigger: trigger
        }).exec();
    };
}

TutorNameManager.addAsync('delay');

export default Delay;