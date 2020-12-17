import BaseCommand from "./BaseCommand";
import OOP from "absol/src/HTML5/OOP";
import wrapAsync from "../util/wrapAsync";
import {_} from "../dom/Core";
import ToolTip from "absol-acomp/js/Tooltip";
import TutorNameManager from "./TutorNameManager";

/***
 * @extends BaseCommand
 * @constructor
 */
function UserClick() {
    BaseCommand.apply(this, arguments);
}

OOP.mixClass(UserClick, BaseCommand);

UserClick.prototype.exec = function () {
    var thisC = this;
    var elt = this.tutor.findNode(this.args.eltPath);
    var wrongMessage = this.args.wrongMessage;
    thisC.onlyInteractWith(elt, function () {
        thisC.highlightElt(elt);
        if (wrongMessage)
            thisC.showTooltip(elt, wrongMessage);
    });
    var message = this.args.message;
    this.showToast(message);
    return new Promise(function (resolve) {
        elt.once('click', resolve);
    }).then(function () {
        thisC.highlightElt(undefined);
        thisC.onlyInteractWith(undefined);
        thisC.closeTooltip();
    }.bind(this));
};

UserClick.attachEnv = function (tutor, env) {
    env.userClick = function (eltPath, message, wrongMessage) {
        return new UserClick(tutor, { eltPath: eltPath, message: message, wrongMessage: wrongMessage }).exec();
    };
};

TutorNameManager.addAsync('userClick');

export default UserClick;