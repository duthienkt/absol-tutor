import BaseCommand from './BaseCommand';
import OOP from 'absol/src/HTML5/OOP';
import { inheritCommand } from "../engine/TCommand";
import { StateWaitEltAppear } from "./Appear";
import TutorEngine from "./TutorEngine";
import TutorNameManager from "./TutorNameManager";
import TACData from "./TACData";


/***
 * @extends StateWaitEltAppear
 * @constructor
 */
function StateWaitEltDisappear() {
    StateWaitEltAppear.apply(this, arguments);
}

OOP.mixClass(StateWaitEltDisappear, StateWaitEltAppear);

StateWaitEltDisappear.prototype.checkElt = function () {
    var now = new Date().getTime();
    this.timeOut = -1;
    var elt = this.command.findNode(this.args.eltPath, true);
    if (!this.isVisibility(elt)) {
        this.command.resolve(true);
    }
    else if (now > this.endTime) {
        this.command.resolve(false);
    }
    else {
        this.timeOut = setTimeout(this.checkElt.bind(this), Math.min(100, this.endTime - now));
    }
};


/***
 * @extends {BaseCommand}
 */
function Disappear() {
    BaseCommand.apply(this, arguments);
}

inheritCommand(Disappear, BaseCommand);

Disappear.prototype.className = 'Disappear';
Disappear.prototype.argNames = ['eltPath', 'timeout'];
Disappear.prototype.stateClasses.entry = StateWaitEltDisappear;
Disappear.prototype.name = 'DISAPPEAR';
Disappear.prototype.type = 'sync';//it will return Promise

TutorEngine.installClass(Disappear);


TutorNameManager.addAsync('DISAPPEAR');

TACData.define('DISAPPEAR', {
    type: 'function',
    args: [
        { name: 'eltPath', type: '(string|AElement)' },
        { name: 'timeout', type: 'number' },

    ],
    desc: "Trigger chờ element biến mất"
});

export default Disappear;
