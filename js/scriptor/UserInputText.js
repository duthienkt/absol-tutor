import BaseCommand from "./BaseCommand";
import OOP from "absol/src/HTML5/OOP";
import wrapAsync from "../util/wrapAsync";
import FunctionKeyManager from "./TutorNameManager";
import AElement from "absol/src/HTML5/AElement";

/***
 * @extends BaseCommand
 * @constructor
 */
function UserInputText() {
    BaseCommand.apply(this, arguments);
    this._rejectCb = null;
}

OOP.mixClass(UserInputText, BaseCommand);

UserInputText.prototype.exec = function () {
    this.start();
    var matchExpression = this.args.match;
    var thisC = this;
    var elt = this.tutor.findNode(this.args.eltPath);
    var message = this.args.message;
    var wrongMessage = this.args.wrongMessage;
    var match = this.args.match;

    thisC.showToast(message);
    var changed = false;
    thisC.onlyInteractWith(elt, function () {
        var result = verify();
        if (!result || !changed) {
            thisC.highlightElt(elt);
        }
    });

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

        function onChange(event) {
            if (verify()) {
                elt.off('keyup', verify)
                    .off('change', onChange)
                    .off('blur', onChange);
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
            });
        thisC._rejectCb = function () {
            elt.off('keyup', verify)
                .off('change', onChange)
                .off('blur', onChange);
            if (changeTimeout >= 0) clearTimeout(changeTimeout);
            reject();
        };
    }).then(this.stop.bind(this));
};

UserInputText.prototype.cancel = function () {
    if (this._rejectCb) {
        this._rejectCb();
        this._rejectCb = null;
    }
};


UserInputText.attachEnv = function (tutor, env) {
    env.USER_INPUT_TEXT = function (eltPath, match, message, wrongMessage) {
        return new UserInputText(tutor, {
            eltPath: eltPath,
            match: match,
            message: message,
            wrongMessage: wrongMessage
        });
    };

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


export default UserInputText;