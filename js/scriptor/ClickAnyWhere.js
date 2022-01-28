import BaseCommand from './BaseCommand';
import OOP from 'absol/src/HTML5/OOP';
import TutorNameManager from "./TutorNameManager";
import TACData from "./TACData";
import TutorEngine from "./TutorEngine";
import { inheritCommand } from "../engine/TCommand";
import BaseState from "./BaseState";

/***
 * @extends BaseState
 * @constructor
 */
function StateWaitClick() {
    BaseState.apply(this, arguments);
}


OOP.mixClass(StateWaitClick, BaseState);

StateWaitClick.prototype.onStart = function () {
    document.addEventListener('click',this.ev_click);
};

StateWaitClick.prototype.ev_click = function (event) {
    this.goto('finish');
};

StateWaitClick.prototype.onStop = function (){
    document.removeEventListener('click',this.ev_click);
};


/***
 * @extends {BaseCommand}
 */
function ClickAnyWhere() {
    BaseCommand.apply(this, arguments);
}

inheritCommand(ClickAnyWhere, BaseCommand);

ClickAnyWhere.prototype.type = 'const';
ClickAnyWhere.prototype.name = 'CLICK_ANY_WHERE';

ClickAnyWhere.prototype.stateClasses.entry = StateWaitClick;

TutorEngine.installClass(ClickAnyWhere);

TutorNameManager.addConst('CLICK_ANY_WHERE');

TACData.define('CLICK_ANY_WHERE', {
    type: 'Trigger'
});

export default ClickAnyWhere;
