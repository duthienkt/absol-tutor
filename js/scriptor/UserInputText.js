import BaseCommand from "./BaseCommand";
import OOP from "absol/src/HTML5/OOP";
import wrapAsync from "../util/wrapAsync";
import {_} from "../dom/Core";
import ToolTip from "absol-acomp/js/Tooltip";
import SnackbarElt from "absol-acomp/js/Snackbar";

/***
 * @extends BaseCommand
 * @constructor
 */
function UserInputText() {
    BaseCommand.apply(this, arguments);
}

OOP.mixClass(UserInputText, BaseCommand);

UserInputText.prototype.exec = function () {
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

        var messageElt = _({
            class: 'atr-explain-text',
            child: { text: message }
        });

        var wrongMessageElt = wrongMessage && _({
            class: 'atr-explain-text',
            child: { text: wrongMessage }
        });
        thisC.onlyInteractWith(elt, function () {
            verify().then(function (result) {
                if (!result) {
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
                    tooltipToken = ToolTip.show(elt, wrongMessageElt, 'auto');
                }
                else if (matched && tooltipToken) {
                    ToolTip.closeTooltip(tooltipToken);
                }
                return matched;
            });
        }

        tooltipToken = ToolTip.show(elt, messageElt, 'auto');

        return new Promise(function (resolve) {
            function onChange() {
                verify().then(function (result) {
                    if (result) {
                        elt.off('keyup', verify)
                            .off('change', onChange);
                        thisC.tutor.memory.share.getCurrentInputText = null;
                        resolve();
                    }
                })
            }

            elt.on('keyup', verify)
                .on('change', onChange);
        });

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
};


export default UserInputText;