import BaseCommand from './BaseCommand';
import OOP from 'absol/src/HTML5/OOP';
import { $ } from "../dom/Core";
import { inheritCommand } from "../engine/TCommand";
import BaseState from "./BaseState";
import TutorEngine from "./TutorEngine";

/***
 * @extends BaseState
 * @constructor
 */
export function StateWaitEltAppear() {
    BaseState.apply(this, arguments);
    this.timeOut = -1;
}

OOP.mixClass(StateWaitEltAppear, BaseState);

StateWaitEltAppear.prototype.onStart = function () {
    this.endTime = new Date().getTime() + (this.args.timeout || 100);
    this.checkElt();
};

StateWaitEltAppear.prototype.onStop = function () {
    if (this.timeOut >= 0) {
        clearTimeout(this.timeOut);
        this.timeOut = -1;
    }

};


StateWaitEltAppear.prototype.isVisibility = function (elt) {
    var eltBound;
    if (elt) {
        eltBound = elt.getBoundingClientRect();
        if (eltBound.width > 0 || eltBound.height > 0) {
            if ($(elt).getComputedStyleValue('visibility') !== 'hidden') {
                return true;
            }
        }

    }
    return false;
};

StateWaitEltAppear.prototype.checkElt = function () {
    var now = new Date().getTime();
    this.timeOut = -1;
    var elt = this.command.findNode(this.args.eltPath, true);
    if (this.isVisibility(elt)) {
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
 * @constructor
 */
function Appear() {
    BaseCommand.apply(this, arguments);
}

inheritCommand(Appear, BaseCommand);

Appear.prototype.className = 'Appear';
Appear.prototype.argNames = ['eltPath', 'timeout'];
Appear.prototype.name = 'APPEAR';
Appear.prototype.stateClasses.entry = StateWaitEltAppear;
Appear.prototype.type = 'sync';

TutorEngine.installClass(Appear);

export default Appear;
