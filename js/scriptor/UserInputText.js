import OOP from "absol/src/HTML5/OOP";
import wrapAsync from "../util/wrapAsync";
import FunctionKeyManager from "./TutorNameManager";
import AElement from "absol/src/HTML5/AElement";
import TACData from "./TACData";
import UserBaseAction from "./UserBaseAction";

/***
 * @extends UserBaseAction
 * @constructor
 */
function UserInputText() {
    UserBaseAction.apply(this, arguments);
}

OOP.mixClass(UserInputText, UserBaseAction);

UserInputText.prototype._verifyTextInput = function (elt){
    var tagName = elt.tagName.toLowerCase();
    var ok = true;
    if (tagName !== 'input' &&tagName !== 'textarea'){
        ok = false;
    }
    if (!ok)
        throw new Error('Type invalid: not a text input!');
};

UserInputText.prototype.requestUserAction = function () {
    var matchExpression = this.args.match;
    var thisC = this;
    var elt = this.tutor.findNode(this.args.eltPath);
    this._verifyTextInput(elt);
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
                        .off('click', onClick);
                    if (changeTimeout >= 0) clearTimeout(changeTimeout);

                    thisC._rejectCb = null;
                    resolve();
                }
            }
        }

        function onChange(event) {
            if (verify()) {
                elt.off('keyup', verify)
                    .off('change', onChange)
                    .off('blur', onChange)
                    .off('keydown', onKeydown)
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
            .on('keydown', onKeydown);
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

    env.EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
};

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