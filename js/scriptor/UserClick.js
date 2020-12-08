import BaseCommand from "./BaseCommand";
import OOP from "absol/src/HTML5/OOP";
import wrapAsync from "../util/wrapAsync";
import {_} from "../dom/Core";
import ToolTip from "absol-acomp/js/Tooltip";

/***
 * @extends BaseCommand
 * @constructor
 */
function UserClick() {
    BaseCommand.apply(this, arguments);
}

OOP.mixClass(UserClick, BaseCommand);

UserClick.prototype.exec = function () {
    var eltAsync = this.asyncGetElt(this.args.eltPath);
    var messageAsync = wrapAsync(this.args.message);
    var thisC = this;
    return Promise.all([eltAsync, messageAsync]).then(function (result) {
        var elt = result[0];
        thisC.highlightElt(elt);
        thisC.onlyInteractWith(elt);
        var message = result[1];
        var contentElt = _({
            class: 'atr-explain-text',
            child: { text: message }
        });
        var token = ToolTip.show(elt, contentElt, 'auto');
        return new Promise(function (resolve) {
            elt.once('click', resolve);
        }).then(function () {
            thisC.highlightElt(undefined);
            thisC.onlyInteractWith(undefined);
            ToolTip.closeTooltip(token);
        }.bind(this));
    }.bind(this));
};

UserClick.attachEnv = function (tutor, env) {
    env.USER_CLICK = function (eltPath, message) {
        return new UserClick(tutor, { eltPath: eltPath, message: message });
    };
};


export default UserClick;