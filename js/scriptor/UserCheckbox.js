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


UserCheckbox.prototype.requestUserAction = function () {
    var thisC = this;
    var elt = this.tutor.findNode(this.args.eltPath);
    this._verifyCheckbox(elt);
    var wrongMessage = this.args.wrongMessage;
    var checked = this.args.checked;
    thisC.highlightElt(elt);
    this._clickCb = function () {
        if (wrongMessage) {
            thisC.showTooltip(elt, wrongMessage);
        }
    }
    this.onlyClickTo(elt);
    return new Promise(function (resolve, reject) {
        var clickTimeout = -1;

        function onChange() {
            if (clickTimeout > 0) {
                clearTimeout(clickTimeout);
                clickTimeout = -1;
            }
            if (elt.checked === checked) {
                elt.off('change', onChange)
                    .off('click', onClick);
                resolve();
            }
        }

        function onClick() {
            if (clickTimeout > 0) clearTimeout(clickTimeout);
            setTimeout(function () {
                clickTimeout = -1;
                if (elt.checked === checked) {
                    elt.off('change', onChange)
                        .off('click', onClick);
                    resolve();
                }
            }, 50);
        }

        elt.on('change', onChange)
            .on('click', onClick);
        thisC._rejectCb = function () {
            elt.off('change', onChange)
                .off('click', onClick);
            reject();
        }
    });
};


UserCheckbox.attachEnv = function (tutor, env) {
    env.userCheckbox = function (eltPath, checked, message, wrongMessage) {
        return new UserCheckbox(tutor, {
            eltPath: eltPath,
            checked: checked,
            message: message,
            wrongMessage: wrongMessage
        }).exec();
    };

    env.userSwitch = env.userCheckbox;

    env.userRadio = function (eltPath, checked, message, wrongMessage) {
        return new UserCheckbox(tutor, {
            eltPath: eltPath,
            checked: checked,
            message: message,
            wrongMessage: wrongMessage
        }).exec();
    }

};

TutorEngine.installClass(UserCheckbox);

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