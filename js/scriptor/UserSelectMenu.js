import UserBaseAction from "./UserBaseAction";
import OOP from "absol/src/HTML5/OOP";
import '../../css/basecommand.css';
import FunctionNameManager from "./TutorNameManager";
import TACData from "./TACData";
import TutorEngine from "./TutorEngine";
import BaseState from "./BaseState";

/***
 * @extends BaseState
 * @constructor
 */
function StateWaitOpenModal() {
    BaseState.apply(this, arguments);
}

OOP.mixClass(StateWaitOpenModal, BaseState);

StateWaitOpenModal.prototype.onStart = function () {
    this.command.elt.on('click', this.ev_click);
    this.command.onlyClickTo(this.command.elt);
    this.command.highlightElt(this.command.elt);
};


StateWaitOpenModal.prototype.onStop = function () {
    this.command.elt.off('click', this.ev_click);
    this.command.highlightElt(null);
    clearTimeout(this._checkTO);
    this.command.onlyClickTo(null);

};

StateWaitOpenModal.prototype.checkSelectBox = function () {
    var selectListBox = this.command.elt.$selectlistBox;
    if (selectListBox.getBoundingClientRect().width > 0) {
        this.goto('user_wait_close_modal');
    }

};

StateWaitOpenModal.prototype.ev_click = function () {
    this._checkTO = setTimeout(this.checkSelectBox.bind(this), 50);
};


/***
 * @extends BaseState
 * @constructor
 */
function StateWaitCloseModal() {
    BaseState.apply(this, arguments);

}

OOP.mixClass(StateWaitCloseModal, BaseState);


StateWaitCloseModal.prototype.onStart = function () {
    this.inv = setInterval(this.checkSelectBox.bind(this), 150);
    var elt = this.command.elt;
    this.command.onlyClickTo(elt.$selectlistBox);
    var searchMessage = this.args.searchMessage;
    if (searchMessage && elt.enableSearch) {
        this.command.showTooltip(elt.$selectlistBox.$searchInput, searchMessage);
    }
};


StateWaitCloseModal.prototype.onStop = function () {
    clearInterval(this.inv);
    this.command.showTooltip(null);
};

StateWaitCloseModal.prototype.checkSelectBox = function () {
    var selectListBox = this.command.elt.$selectlistBox;
    var bound = selectListBox.getBoundingClientRect();
    if (bound.width === 0) {
        this.goto('check_value');
    }
};


/***
 * @extends BaseState
 * @constructor
 */
function StateCheckValue() {
    BaseState.apply(this, arguments);

}

OOP.mixClass(StateCheckValue, BaseState);

StateCheckValue.prototype.onStart = function () {
    if (this.command.elt.value === this.args.value) {
        this.goto('finish');
    }
    else {
        this.goto('user_begin');
        if (this.args.wrongMessage) {
            this.command.showTooltip(this.command.elt, this.args.wrongMessage);
        }
    }
};


/***
 * @extends UserBaseAction
 * @constructor
 */
function UserSelectMenu() {
    UserBaseAction.apply(this, arguments);
}

OOP.mixClass(UserSelectMenu, UserBaseAction);

UserSelectMenu.prototype.className = 'UserSelectMenu';
UserSelectMenu.prototype.name = 'userSelectMenu';
UserSelectMenu.prototype.argNames = ['eltPath', 'value', 'message', 'wrongMessage', 'searchMessage'];

UserSelectMenu.prototype.stateClasses.user_begin = StateWaitOpenModal;

UserSelectMenu.prototype.stateClasses.user_wait_close_modal = StateWaitCloseModal;
UserSelectMenu.prototype.stateClasses.check_value = StateCheckValue;


UserSelectMenu.prototype.verifyElt = function () {
    var elt = this.elt;
    if (!elt.containsClass || !(
        elt.containsClass('absol-selectmenu')
        || elt.containsClass('as-select-menu')
        || elt.containsClass('as-select-tree-menu')
    )) {
        return new Error("Type error: not a select-menu!");
    }
    return null;
};


TutorEngine.installClass(UserSelectMenu);

TACData.define('userSelectMenu', {
    type: 'function',
    args: [
        { name: 'eltPath', type: '(string|AElement)' },
        { name: 'value', type: '(string|value)' },
        { name: 'message', type: 'string' },
        { name: 'wrongMessage', type: 'string' },
        { name: 'searchMessage', type: 'string' }
    ]
});

FunctionNameManager.addAsync('userSelectMenu');


export default UserSelectMenu;