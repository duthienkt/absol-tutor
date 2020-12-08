import BaseCommand from "./BaseCommand";
import OOP from "absol/src/HTML5/OOP";
import wrapAsync from "../util/wrapAsync";
import ToolTip from "absol-acomp/js/Tooltip";
import {_} from "../dom/Core";
import SnackbarElt from "absol-acomp/js/Snackbar";

/***
 * @extends BaseCommand
 * @constructor
 */
function UserCheckbox() {
    BaseCommand.apply(this, arguments);
}

OOP.mixClass(UserCheckbox, BaseCommand);


UserCheckbox.prototype.exec = function () {
    var thisC = this;
    return Promise.all([this.asyncGetElt(this.args.eltPath),
        wrapAsync(this.args.checked),
        wrapAsync(this.args.message),
        wrapAsync(this.args.wrongMessage)
    ]).then(function (args) {
        var elt = args[0];
        var checked = args[1];
        var message = args[2];
        var wrongMessage = args[3];
        var messageElt = _({
            class: 'atr-explain-text',
            child: { text: message }
        });

        var wrongMessageElt = wrongMessage && _({
            class: 'atr-explain-text',
            child: { text: wrongMessage }
        });

        var tooltipToken;

        function onInteractOut() {
            thisC.highlightElt(elt);
            if (wrongMessage) {
                tooltipToken = ToolTip.show(elt, wrongMessageElt, 'auto');
            }
        }

        thisC.onlyInteractWith(elt, onInteractOut);
        tooltipToken = ToolTip.show(elt, messageElt, 'auto');

        return new Promise(function (resolve) {
            function onChange() {
                if (elt.checked === checked) {
                    elt.off('change', onChange);
                    thisC.onlyInteractWith(null);
                    thisC.highlightElt(null);
                    if (tooltipToken)
                        ToolTip.closeTooltip(tooltipToken);
                    resolve();
                }
            }

            elt.on('change', onChange);
        });
    });

};

UserCheckbox.attachEnv = function (tutor, env) {
    env.USER_CHECKBOX = function (eltPath, checked, message, wrongMessage) {
        return new UserCheckbox(tutor, {
            eltPath: eltPath,
            checked: checked,
            message: message,
            wrongMessage: wrongMessage
        });
    }
};


export default UserCheckbox;