import BaseCommand from "./BaseCommand";
import OOP from "absol/src/HTML5/OOP";
import wrapAsync from "../util/wrapAsync";
import FunctionKeyManager from "./TutorNameManager";

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


    return new Promise(function (resolve) {
        function onChange() {
            if (verify()) {
                elt.off('keyup', verify)
                    .off('change', onChange)
                    .off('blur', onChange);
                thisC._rejectCb = null;
                resolve();
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
};

FunctionKeyManager.addAsync('userInputText');


export default UserInputText;