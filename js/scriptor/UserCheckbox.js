import OOP from "absol/src/HTML5/OOP";
import FunctionNameManager from "./TutorNameManager";
import TACData from "./TACData";
import UserBaseAction from "./UserBaseAction";
import { inheritCommand } from "../engine/TCommand";
import BaseState from "./BaseState";
import TutorEngine from "./TutorEngine";

/****
 * @extends BaseState
 * @constructor
 */
function StateWaitCheck() {
    BaseState.apply(this, arguments);
    this.checkTO = -1;
}

OOP.mixClass(StateWaitCheck, BaseState);

StateWaitCheck.prototype.onStart = function () {
    this.command.elt.on('click', this.ev_click);
    this.command.highlightElt(this.command.elt);
    this.command.onlyClickTo(this.command.elt);
    this.command.clickCb = function () {
        this.command.showTooltip(this.command.elt, this.command.args.wrongMessage);
    }.bind(this);
};


StateWaitCheck.prototype.onStop = function () {
    this.command.elt.off('click', this.ev_click);
    clearTimeout(this.checkTO);
};

StateWaitCheck.prototype.delayCheck = function () {
    this.checkTO = setTimeout(function () {
        if (!!this.command.elt.checked === !!this.args.checked) {
            this.goto('finish');
        }
    }.bind(this), 50)
};

StateWaitCheck.prototype.ev_click = function () {
    this.delayCheck();
};


/***
 * @extends UserBaseAction
 * @constructor
 */
function UserCheckbox() {
    UserBaseAction.apply(this, arguments);
}

inheritCommand(UserCheckbox, UserBaseAction);

UserCheckbox.prototype.name = 'userCheckbox';
UserCheckbox.prototype.stateClasses['user_begin'] = StateWaitCheck;
UserCheckbox.prototype.argNames = ['eltPath', 'checked', 'message', 'wrongMessage'];



UserCheckbox.prototype.verifyElt = function () {
    var elt = this.elt;
    if (!elt.hasClass || !((elt.hasClass('absol-checkbox')
        || elt.hasClass('absol-radio')
        || elt.hasClass('as-checkbox-input')
        || elt.hasClass('as-checkbox-input')
        || elt.hasClass('as-radio-input')
        || elt.hasClass('absol-switch')
        || (elt.tagName.toLowerCase() === 'input' && (elt.type === 'checkbox' || elt.type === 'radio'))
    ))) {
        return new Error('Type error: not a radio or checkbox');
    }
    return null;
};

/***
 * @extends UserCheckbox
 * @constructor
 */
function UserSwitch(){
    UserCheckbox.apply(this, arguments);
}

inheritCommand(UserSwitch, UserCheckbox);
UserSwitch.prototype.name = 'userSwitch';

/***
 * @extends UserCheckbox
 * @constructor
 */
function UserRadio(){
    UserCheckbox.apply(this, arguments);
}
inheritCommand(UserRadio, UserCheckbox);
UserRadio.prototype.name = 'userRadio';




TutorEngine.installClass(UserCheckbox);
TutorEngine.installClass(UserSwitch);
TutorEngine.installClass(UserRadio);

FunctionNameManager.addAsync('userCheckbox');
FunctionNameManager.addAsync('userSwitch');
FunctionNameManager.addAsync('userRadio');


TACData.define('userCheckbox', {
    type: 'function',
    args: [
        { name: 'eltPath', type: '(string|AElement)' },
        { name: 'checked', type: 'boolean' },
        { name: 'message', type: 'string' },
        { name: 'wrongMessage', type: 'string' }
    ]
}).define('userRadio', {
    type: 'function',
    args: [
        { name: 'eltPath', type: '(string|AElement)' },
        { name: 'checked', type: 'boolean' },
        { name: 'message', type: 'string' },
        { name: 'wrongMessage', type: 'string' }
    ]
});


export default UserCheckbox;