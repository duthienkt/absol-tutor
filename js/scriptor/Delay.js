import BaseCommand from "./BaseCommand";
import OOP from "absol/src/HTML5/OOP";
import TutorNameManager from "./TutorNameManager";
import TACData from "./TACData";
import { inheritCommand } from "../engine/TCommand";
import BaseState from "./BaseState";
import TutorEngine from "./TutorEngine";

/***
 * @extends BaseState
 * @constructor
 */
function StateRunTrigger() {
    BaseState.apply(this, arguments);
    this.expression = this.args.until;
    if (this.expression && this.expression.depthClone) {
        this.expression = this.expression.depthClone();
    }
    this.toId = -1;

}

OOP.mixClass(StateRunTrigger, BaseState);

StateRunTrigger.prototype.onStart = function () {
    if (typeof this.expression === "number") {
        this.toId = setTimeout(this.goto.bind(this, 'finish'), this.expression);
    }
    else if (this.expression && this.expression.exec) {
        this.expression.exec().then(this.goto.bind(this, 'finish'));
    }
    else {
        throw new Error("\"until\" argument is not valid!");
    }
};

StateRunTrigger.prototype.onStop = function () {
    if (this.toId > 0) {
        clearTimeout(this.toId);
    }
};

/***
 * @extends BaseCommand
 * @constructor
 */
function Delay() {
    BaseCommand.apply(this, arguments);

}

inheritCommand(Delay, BaseCommand);

Delay.prototype.argNames = ['until'];

Delay.prototype.className = 'Delay';
Delay.prototype.name = 'delay';

Delay.prototype.stateClasses.entry = StateRunTrigger;


TutorEngine.installClass(Delay);

TutorNameManager.addAsync('delay');

TACData.define('delay', {
    type: 'function',
    args: [
        { name: 'trigger', type: 'Trigger|number' }
    ],
    desc: "Chờ trong khoảng thời gian hoặc trigger kích hoạt"
})

export default Delay;