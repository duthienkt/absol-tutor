import UserBaseAction from "./UserBaseAction";
import OOP from "absol/src/HTML5/OOP";
import TutorNameManager from "./TutorNameManager";
import { $, $$ } from "../dom/Core";
import findNode from "../util/findNode";
import TACData from "./TACData";
import TutorEngine from "./TutorEngine";
import { inheritCommand } from "../engine/TCommand";
import BaseState from "./BaseState";
import QuickMenu from "absol-acomp/js/QuickMenu";

/***
 * @extends BaseState
 * @constructor
 */
function StateWaitMenu() {
    BaseState.apply(this, arguments);
    this.wcIdx = -1;
}

OOP.mixClass(StateWaitMenu, BaseState);

StateWaitMenu.prototype.onStart = function () {
    this.command.highlightElt(this.command.elt);
    this.command.onlyClickTo(this.command.elt);
    if (this.command.hadWrongAction && this.args.wrongMessage)
        this.command.showTooltip(this.command.elt, this.args.wrongMessage);
    this.command.elt.on('click', this.ev_click);
    this.command.clickCb = this.ev_clickOut
};


StateWaitMenu.prototype.onStop = function () {
    clearTimeout(this.wcIdx);
};

StateWaitMenu.prototype.ev_clickOut = function () {
    this.command.hadWrongAction = true;
    if (this.args.wrongMessage)
        this.command.showTooltip(this.command.elt, this.args.wrongMessage);
};


StateWaitMenu.prototype.checkMenu = function () {
    if (QuickMenu.$elt && QuickMenu.$elt.getBoundingClientRect().width > 0) {
        this.goto('wait_click');
    }
};

StateWaitMenu.prototype.ev_click = function () {
    clearTimeout(this.wcIdx);
    this.wcIdx = setTimeout(this.checkMenu.bind(this), 10);
};


/***
 * @extends BaseState
 * @constructor
 */
function StateWaitClick() {
    BaseState.apply(this, arguments);
    this.checkMenuIdx = -1;
    this.blindIdx = -1;
}

OOP.mixClass(StateWaitClick, BaseState);


StateWaitClick.prototype.onStart = function () {
    this.command.highlightElt(QuickMenu.$elt);
    this.itemElt = findNode(this.args.selectId, QuickMenu.$elt);
    if (!this.itemElt) {
        this.command.reject(new Error("QuickMenu do not contain " + this.args.selectId));
        return;
    }
    this.itemElt.once('click', this.ev_clickItem);
    if (this.command.hadWrongAction && this.args.wrongMessage)
        this.command.showTooltip(QuickMenu.$elt, this.args.wrongMessage);
    this.command.onlyClickTo(this.itemElt);
    this.blindIdx = setTimeout(function () {
        this.command.highlightElt(this.itemElt);
    }.bind(this), 400);
    this.checkMenuIdx = setInterval(this.checkMenu.bind(this), 200);
    this.command.clickCb = this.checkMenu.bind(this);
};


StateWaitClick.prototype.onStop = function () {
    clearInterval(this.checkMenuIdx);
    clearInterval(this.blindIdx);
    this.itemElt.off('click', this.ev_clickItem)
    this.command.clickCb = null;
};

StateWaitClick.prototype.checkMenu = function () {
    if (QuickMenu.$elt.getBoundingClientRect().width === 0) {
        this.goto('user_begin');
    }
};

StateWaitClick.prototype.ev_clickItem = function () {
    this.goto('finish');
};


/***
 * @extends UserBaseAction
 * @constructor
 */
function UserQuickMenu() {
    UserBaseAction.apply(this, arguments);
}

inheritCommand(UserQuickMenu, UserBaseAction);

UserQuickMenu.prototype.className = 'UserQuickMenu';
UserQuickMenu.prototype.name = 'userQuickMenu';
UserQuickMenu.prototype.argNames = ['eltPath', 'selectId', 'message', 'wrongMessage'];
UserQuickMenu.prototype.stateClasses['user_begin'] = StateWaitMenu;
UserQuickMenu.prototype.stateClasses['wait_click'] = StateWaitClick;

UserQuickMenu.prototype.verifyElt = function () {
    // if (!this.elt.classList.contains('as-quick-menu-trigger')) {
    //     return new Error('Type error: not a quick-menu trigger');
    // }
    return null;
};


TutorEngine.installClass(UserQuickMenu);
TutorEngine.installFunction('getAllQuickMenuTriggers', function () {
    return $$('.as-quick-menu-trigger');
});

TutorNameManager.addAsync('userQuickMenu')
    .addSync('getAllQuickMenuTriggers');

TACData.define('userQuickMenu', {
    type: 'function',
    args: [
        { name: 'eltPath', type: '(string|AElement)' },
        { name: 'selectId', type: 'string' },
        { name: 'message', type: 'string' },
        { name: 'wrongMessage', type: 'string' }
    ]
}).define('getAllQuickMenuTriggers',
    {
        type: 'function',
        args: [],
        returns: 'QuickMenuTriggers[]'
    }
);

export default UserQuickMenu;