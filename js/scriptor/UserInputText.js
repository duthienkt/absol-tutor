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
}

OOP.mixClass(UserInputText, BaseCommand);

UserInputText.prototype.exec = function () {
    this.start();
    var matchExpression = this.args.match;
    var thisC = this;
    return Promise.all([
        this.asyncGetElt(this.args.eltPath),
        wrapAsync(this.args.message),
        wrapAsync(this.args.wrongMessage)
    ]).then(function (args) {
        var elt = args[0];
        var message = args[1];
        var wrongMessage = args[2];
        var tooltipToken;

        thisC.tutor.memory.share.getCurrentInputText = function () {
            return elt.value || elt.text || '';
        }

        thisC.showToast(message);
        var changed = false;
        thisC.onlyInteractWith(elt, function () {
            verify().then(function (result) {
                if (!result || !changed) {
                    thisC.highlightElt(elt);
                }
            });
        });

        function verify() {
            var isMatchedAsync;
            if (matchExpression && matchExpression.test) {
                isMatchedAsync = wrapAsync(!!matchExpression.test(elt.value || elt.text || ''));
            }
            else {
                isMatchedAsync = wrapAsync(matchExpression && matchExpression.depthClone && matchExpression.depthClone());
            }
            return isMatchedAsync.then(function (matched) {
                if (!matched && wrongMessage) {
                    thisC.showTooltip(elt, wrongMessage);
                }
                else if (matched && tooltipToken) {
                    thisC.closeTooltip();
                }
                return matched;
            });
        }


        return new Promise(function (resolve) {
            function onChange() {
                verify().then(function (result) {
                    if (result) {
                        elt.off('keyup', verify)
                            .off('change', onChange);
                        thisC.tutor.memory.share.getCurrentInputText = null;
                        resolve();
                    }
                });
            }

            elt.on('keyup', verify)
                .on('change', onChange)
                .once('change', function () {
                    changed = true;
                });
        });

    }).then(function () {
        thisC.stop();
    });
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