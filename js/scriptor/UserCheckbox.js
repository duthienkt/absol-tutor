import BaseCommand from "./BaseCommand";
import OOP from "absol/src/HTML5/OOP";
import wrapAsync from "../util/wrapAsync";
import ToolTip from "absol-acomp/js/Tooltip";
import {_} from "../dom/Core";
import FunctionNameManager from "./TutorNameManager";

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
    this.start();
    return Promise.all([this.asyncGetElt(this.args.eltPath),
        wrapAsync(this.args.checked),
        wrapAsync(this.args.message),
        wrapAsync(this.args.wrongMessage)
    ]).then(function (args) {
        var elt = args[0];
        var checked = args[1];
        var message = args[2];
        var wrongMessage = args[3];

        function onInteractOut() {
            thisC.highlightElt(elt);
            if (wrongMessage) {
                thisC.showTooltip(elt, wrongMessage);
            }
        }

        thisC.onlyInteractWith(elt, onInteractOut);
        thisC.showToast(message);

        return new Promise(function (resolve) {
            function onChange() {
                if (elt.checked === checked) {
                    elt.off('change', onChange);
                    thisC.onlyInteractWith(null);
                    thisC.highlightElt(null);
                    thisC.closeTooltip();
                    resolve();
                }
            }

            elt.on('change', onChange);
        });
    }).then(this.stop.bind(this));
};

UserCheckbox.attachEnv = function (tutor, env) {
    env.userCheckbox = function (eltPath, checked, message, wrongMessage) {
        return new UserCheckbox(tutor, {
            eltPath: eltPath,
            checked: checked,
            message: message,
            wrongMessage: wrongMessage
        }).exec();
    }

};

FunctionNameManager.addAsync('userCheckbox');


export default UserCheckbox;