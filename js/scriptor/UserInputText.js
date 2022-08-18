import OOP from "absol/src/HTML5/OOP";
import wrapAsync from "../util/wrapAsync";
import FunctionKeyManager from "./TutorNameManager";
import AElement from "absol/src/HTML5/AElement";
import TACData from "./TACData";
import UserBaseAction from "./UserBaseAction";
import { $ } from "../dom/Core";
import TutorEngine from "./TutorEngine";
import BaseState from "./BaseState";
import { inheritCommand } from "../engine/TCommand";


/***
 * @extends BaseState
 * @constructor
 */
function StateWaitFocus() {
    BaseState.apply(this, arguments);
}

OOP.mixClass(StateWaitFocus, BaseState);


StateWaitFocus.prototype.onStart = function () {
    this.command.inputElt = $('input', this.command.elt) || $('textarea', this.command.elt);
    this.command.inputElt.on('focus', this.ev_focus);
    if (document.hasFocus() && document.activeElement === this.command.inputElt) {
        this.goto('user_input');
    }
    this.command.highlightElt(this.command.inputElt);
    this.command.clickCb = this.ev_clickOut;
    if (this.command.hadWrongAction && this.command.args.wrongMessage)
        this.command.showTooltip(this.command.inputElt, this.command.args.wrongMessage);
    this.command.onlyClickTo(this.command.inputElt);
}
StateWaitFocus.prototype.onStop = function () {
    this.command.inputElt.off('focus', this.ev_focus);
    this.command.clickCb = null;
};


StateWaitFocus.prototype.ev_focus = function () {
    this.goto('user_input');
};


StateWaitFocus.prototype.ev_clickOut = function () {
    this.command.hadWrongAction = true;
    if (this.command.args.wrongMessage)
        this.command.showTooltip(this.command.inputElt, this.command.args.wrongMessage);
};


/***
 * @extends BaseState
 * @constructor
 */
function StateUserInput() {
    BaseState.apply(this, arguments);
    this.chaged = false;
}

OOP.mixClass(StateUserInput, BaseState);

StateUserInput.prototype.onStart = function () {
    this.command.highlightElt(null);

    this.command.inputElt.on('change', this.ev_change)
        .on('blur', this.ev_change)
        .once('change', function () {
            this.changed = true;
        }.bind(this))
        .once('blur', function () {
            this.changed = true;
        }.bind(this))
        .on('keydown', this.ev_keyDown)
        .on('keyup', this.ev_keyUp);
};

StateUserInput.prototype.onStop = function () {
    this.command.inputElt.off('change', this.ev_change)
        .off('blur', this.ev_change)
        .off('keydown', this.ev_keyDown)
        .off('keyup', this.ev_keyUp);
    if (this.typingTimeout > 0) clearTimeout(this.typingTimeout);
    if (this.changeTimeout > 0) clearTimeout(this.changeTimeout);
};


StateUserInput.prototype.verify = function verify() {
    var isMatched;
    var matchExpression = this.args.match;
    var elt = this.command.inputElt;
    var wrongMessage = this.args.wrongMessage;
    var text = elt.value || elt.text || '';
    if (matchExpression && matchExpression.test) {
        isMatched = matchExpression.test(elt.value || elt.text || '');
    }
    else if (typeof matchExpression === "function") {
        isMatched = matchExpression(text);
    }
    else if (typeof matchExpression === 'string') {
        isMatched = text === matchExpression;
    }
    else if (typeof matchExpression === 'number') {
        isMatched = parseFloat(text) === matchExpression;
    }
    else {
        isMatched = text > 0;
    }
    if (!isMatched && wrongMessage) {
        this.command.showTooltip(elt, wrongMessage);
    }
    else if (isMatched) {
        this.command.closeTooltip();
    }

    return isMatched;
}


StateUserInput.prototype.ev_change = function () {
    var elt = this.command.inputElt;
    if (this.verify()) {
        this.goto('prevent_input');
    }
    else {
        this.changeTimeout = setTimeout(function () {
            this.changeTimeout = -1;
            if (!AElement.prototype.isDescendantOf.call(document.activeElement, elt)) {
                elt.focus();
            }
        }.bind(this), 1)
    }
};

StateUserInput.prototype.ev_keyUp = function () {
    if (this.typingTimeout > 0) clearTimeout(this.typingTimeout);
    this.typingTimeout = setTimeout(function () {
        this.typingTimeout = -1;
        if (this.verify()) {
            this.goto('prevent_input');
        }
    }.bind(this), 300);
};

StateUserInput.prototype.ev_keyDown = function (event) {
    this.command.highlightElt(null);
    if (event.key === 'Enter') {
        if (this.verify()) {
            this.goto('prevent_input');
        }
    }
};


/***
 * @extends BaseState
 * @constructor
 */
function StatePreventInput() {
    BaseState.apply(this, arguments);
    this.checkItv = -1;
}

OOP.mixClass(StatePreventInput, BaseState);

StatePreventInput.prototype.onStart = function () {
    var elt = this.command.inputElt;
    elt.on('keydown', this.ev_keyDown)
        .once('blur', this.ev_finish);
    this.checkItv = setInterval(function () {
        if (document.activeElement !== elt) {
            elt.off('keydown', this.ev_keyDown)
                .off('blur', this.ev_finish);
            clearInterval(this.checkItv);
        }
    }.bind(this), 100);
    this.goto('finish');
};

StatePreventInput.prototype.ev_finish = function () {
    clearInterval(this.checkItv);
    this.command.inputElt.off('keydown', this.ev_keyDown)
        .off('blur', this.ev_finish);
}

StatePreventInput.prototype.ev_keyDown = function (event) {
    if (event.key.length === 1 && !event.ctrlKey && !event.altKey) {
        event.preventDefault();
    }
};


/***
 * @extends UserBaseAction
 * @constructor
 */
function UserInputText() {
    UserBaseAction.apply(this, arguments);
}

inheritCommand(UserInputText, UserBaseAction);

UserInputText.prototype.name = 'userInputText';
UserInputText.prototype.stateClasses['user_begin'] = StateWaitFocus;
UserInputText.prototype.stateClasses['user_input'] = StateUserInput;
UserInputText.prototype.stateClasses['prevent_input'] = StatePreventInput;

UserInputText.prototype.verifyElt = function (elt) {
    var res = $('input', elt) || $('textarea', elt);
    if (!res)
        return new Error('Type invalid: not a text input or not contains text input!');
    return null;
};


UserInputText.prototype.requestUserAction = function () {
    var matchExpression = this.args.match;
    var thisC = this;
    var elt = this.tutor.findNode(this.args.eltPath);
    elt = this._verifyTextInput(elt);
    var wrongMessage = this.args.wrongMessage;
    thisC.highlightElt(elt);
    var changed = false;

    function onClick() {
        thisC.highlightElt(null);
    }


    this._clickCb = function () {
        var result = verify();
        if (!result || !changed) {
            thisC.highlightElt(elt);
        }
    };
    thisC.onlyClickTo(elt);

    function verify() {
        var isMatched;
        var text = elt.value || elt.text || '';
        if (matchExpression && matchExpression.test) {
            isMatched = matchExpression.test(elt.value || elt.text || '');
        }
        else if (typeof matchExpression === "function") {
            isMatched = matchExpression(text);
        }
        else if (typeof matchExpression === 'string') {
            isMatched = text === matchExpression;
        }
        else if (typeof matchExpression === 'number') {
            isMatched = parseFloat(text) === matchExpression;
        }
        else {
            isMatched = text > 0;
        }
        if (!isMatched && wrongMessage) {
            thisC.showTooltip(elt, wrongMessage);
        }
        else if (isMatched) {
            thisC.closeTooltip();
        }


        return isMatched;
    }


    return new Promise(function (resolve, reject) {
        var changeTimeout = -1;

        function onKeydown(event) {
            thisC.highlightElt(null);
            if (event.key === 'Enter') {
                if (verify()) {
                    elt.off('keyup', verify)
                        .off('change', onChange)
                        .off('blur', onChange)
                        .off('keydown', onKeydown)
                        .off('onKeyUp', onKeydown)
                        .off('click', onClick);
                    if (changeTimeout >= 0) clearTimeout(changeTimeout);

                    thisC._rejectCb = null;
                    resolve();
                }
            }
        }

        var typingTimout = -1;

        function onKeyUp() {
            if (typingTimout > 0) clearTimeout(typingTimout);
            typingTimout = setTimeout(function () {
                typingTimout = -1;
                if (verify()) {
                    function preventKey(event) {
                        if (event.key.length === 1 && !event.ctrlKey && !event.altKey) {
                            event.preventDefault();
                        }
                    }

                    var checkIntv = setInterval(function () {
                        if (document.activeElement !== elt)
                            finishPrevent();
                    }, 100);
                    elt.on('keydown', preventKey)
                        .on('blur', finishPrevent);

                    function finishPrevent() {
                        elt.off('keydown', preventKey)
                            .off('blur', finishPrevent);
                        clearInterval(checkIntv);
                    }

                    elt.off('keyup', verify)
                        .off('change', onChange)
                        .off('blur', onChange)
                        .off('keydown', onKeydown)
                        .off('onKeyUp', onKeydown)
                        .off('click', onClick);
                    resolve();
                }
            }, 300);

        }

        function onChange(event) {
            if (verify()) {
                elt.off('keyup', verify)
                    .off('change', onChange)
                    .off('blur', onChange)
                    .off('keydown', onKeydown)
                    .off('keyup', onKeyUp)
                    .off('click', onClick);
                if (changeTimeout >= 0) clearTimeout(changeTimeout);

                thisC._rejectCb = null;
                resolve();
            }
            else {
                changeTimeout = setTimeout(function () {
                    changeTimeout = -1;
                    if (!AElement.prototype.isDescendantOf.call(document.activeElement, elt)) {
                        elt.focus();
                    }
                }, 1)
            }
        }

        elt.on('keyup', verify)
            .on('change', onChange)
            .on('blur', onChange)
            .once('change', function () {
                changed = true;
            })
            .once('blur', function () {
                changed = true;
            })
            .on('click', onClick)
            .on('keydown', onKeydown)
            .on('keyup', onKeyUp);
        thisC._rejectCb = function () {
            elt.off('keyup', verify)
                .off('change', onChange)
                .off('blur', onChange);
            if (changeTimeout >= 0) clearTimeout(changeTimeout);
            reject();
        };
    });
};


UserInputText.attachEnv = function (tutor, env) {
    env.userInputText = function (eltPath, match, message, wrongMessage) {
        return new UserInputText(tutor, {
            eltPath: eltPath,
            match: match,
            message: message,
            wrongMessage: wrongMessage
        }).exec();
    }
};

TutorEngine.installConst('EMAIL_REGEX', /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
TutorEngine.installClass(UserInputText);

FunctionKeyManager.addAsync('userInputText')
    .addConst('EMAIL_REGEX');

TACData.define('userInputText', {
    type: 'function',
    args: [
        { name: 'eltPath', type: '(string|AElement)' },
        { name: 'match', type: 'Regex|function(string):bool' },
        { name: 'message', type: 'string' },
        { name: 'wrongMessage', type: 'string' }
    ]
}).define('EMAIL_REGEX', {
    type: 'Regex',
    desc: "Biểu thức kiểm tra email"
});


export default UserInputText;