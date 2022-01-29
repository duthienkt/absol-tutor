import UserBaseAction from "./UserBaseAction";
import OOP from "absol/src/HTML5/OOP";
import TutorNameManager from "./TutorNameManager";
import findNode from "../util/findNode";
import TACData from "./TACData";
import TutorEngine from "./TutorEngine";
import { inheritCommand } from "../engine/TCommand";
import BaseState from "./BaseState";
import AElement from "absol/src/HTML5/AElement";

/***
 * @extends BaseState
 * @constructor
 */
function StateWaitSelectRoot() {
    BaseState.apply(this, arguments);
    this.toIdx = -1;
}

OOP.mixClass(StateWaitSelectRoot, BaseState);

StateWaitSelectRoot.prototype.onStart = function () {
    this.command.menuLevel = 0;
    this.command.highlightElt(this.command.elt);
    var itemElt = findNode(this.args.menuItemPath[0], this.command.elt);
    this.command.menuItemElt = itemElt;
    if (this.command.hadWrongAction && this.args.wrongMessage)
        this.command.showTooltip(this.command.menuItemElt, this.args.wrongMessage);
    this.command.onlyClickTo(itemElt);
    this.toIdx = setTimeout(function () {
        this.command.highlightElt(itemElt);
    }.bind(this), 400);
    itemElt.on('click', this.ev_click);
    this.command.clickCb = this.ev_clickOut;
};

StateWaitSelectRoot.prototype.onStop = function () {
    clearTimeout(this.toIdx);
    this.command.menuItemElt.off('click', this.ev_click);
    this.command.clickCb = null;
};


StateWaitSelectRoot.prototype.ev_click = function () {
    this.goto('hover_next');
};

StateWaitSelectRoot.prototype.ev_clickOut = function () {
    this.command.hadWrongAction = true;
    if (this.args.wrongMessage)
        this.command.showTooltip(this.command.menuItemElt, this.args.wrongMessage);
};


/***
 * @extends BaseState
 * @constructor
 */
function StateHoverNext() {
    BaseState.apply(this, arguments);
    this.toIdx = -1;
    this.checkInv = -1;
}

OOP.mixClass(StateHoverNext, BaseState);

StateHoverNext.prototype.onStart = function () {
    this.command.menuLevel++;
    this.command.highlightElt(this.command.menuItemElt.$container);
    var itemElt = findNode(this.args.menuItemPath[this.command.menuLevel], this.command.menuItemElt.$container);
    this.command.menuItemElt = itemElt;
    if (this.command.hadWrongAction && (this.args.wrongMessage1 || this.args.wrongMessage))
        this.command.showTooltip(this.command.menuItemElt, (this.args.wrongMessage1 || this.args.wrongMessage))
    this.command.onlyClickTo(itemElt);
    this.toIdx = setTimeout(function () {
        this.command.highlightElt(itemElt);
    }.bind(this), 100);
    this.command.menuItemElt.once('mouseenter', this.ev_mouseenter);
    this.checkInv = setInterval(this.checkItemVisibility.bind(this), 300);
};

StateHoverNext.prototype.checkItemVisibility = function () {
    var c = this.command.menuItemElt;
    while (c) {
        if (c.getBoundingClientRect().width === 0) return false;
        if (AElement.prototype.getComputedStyleValue.call(c, 'visibility') !== 'visible') {
            clearInterval(this.checkInv);
            this.command.hadWrongAction = true;
            this.goto('user_begin');
            break;
        }
        c = c.parentElement;
    }
};

StateHoverNext.prototype.onStop = function () {
    this.command.menuItemElt.off('mouseenter', this.ev_mouseenter);
};

StateHoverNext.prototype.ev_mouseenter = function () {
    if (this.command.menuLevel + 1 >= this.args.menuItemPath.length) {
        this.goto('wait_click_current');
    }
    else {
        this.goto('hover_next');
    }
};


/***
 * @extends BaseState
 * @constructor
 */
function StateWaitClickCurrent() {
    BaseState.apply(this, arguments);
    this.checkInv = -1;
}

OOP.mixClass(StateWaitClickCurrent, BaseState);

StateWaitClickCurrent.prototype.onStart = function () {
    this.command.onlyClickTo(this.command.menuItemElt);
    this.command.highlightElt(this.command.menuItemElt);
    this.checkInv = setInterval(this.checkItemVisibility.bind(this), 300);
    this.command.menuItemElt.once('click', this.ev_click);
};

StateWaitClickCurrent.prototype.onStop = function () {
    clearInterval(this.checkInv);
    this.command.menuItemElt.off('click', this.ev_click);
};

StateWaitClickCurrent.prototype.ev_click = function () {
    this.goto('finish');
}

StateWaitClickCurrent.prototype.checkItemVisibility = StateHoverNext.prototype.checkItemVisibility;


/***
 * @extends UserBaseAction
 * @constructor
 */

function UserLevel2Menu() {
    UserBaseAction.apply(this, arguments);
}

inheritCommand(UserLevel2Menu, UserBaseAction);

UserLevel2Menu.prototype.argNames = ['eltPath', 'menuItemPath', 'message', 'wrongMessage', 'wrongMessage1'];
UserLevel2Menu.prototype.name = 'userLevel2Menu';
UserLevel2Menu.prototype.className = 'UserLevel2Menu';


UserLevel2Menu.prototype.stateClasses.user_begin = StateWaitSelectRoot;
UserLevel2Menu.prototype.stateClasses.hover_next = StateHoverNext;
UserLevel2Menu.prototype.stateClasses.wait_click_current = StateWaitClickCurrent;


UserLevel2Menu.prototype.verifyElt = function () {
    var elt = this.elt;
    if (!elt.containsClass || !elt.containsClass('as-v-root-menu')) {
        return new Error('Type error: not a valid menu!');
    }
};


TutorEngine.installClass(UserLevel2Menu);

TutorNameManager.addAsync('userLevel2Menu');

TACData.define('userLevel2Menu', {
    type: 'function',
    args: [
        { name: 'eltPath', type: '(string|AElement)' },
        { name: 'menuItemPath', type: 'string[]' },
        { name: 'message', type: 'string' },
        { name: 'wrongMessage', type: 'string' },
        { name: 'wrongMessage1', type: 'string' }
    ]
});

export default UserLevel2Menu;
