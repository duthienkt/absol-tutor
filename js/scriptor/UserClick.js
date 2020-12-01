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
    var eltAsync = this.asyncGetElt(this.args.eltPah);
    var messageAsync = wrapAsync(this.args.message);
    return Promise.all([eltAsync, messageAsync]).then(function (result) {
        var elt = result[0];
        var message = result[1];
        this.$puncturedModal.removeStyle('visibility', 'hidden');
        var contentElt = _({
            class: 'atr-explain-text',
            child: { text: message }
        });
        var token = ToolTip.show(elt, contentElt, 'auto');
        this.$puncturedModal.follow(elt);
        return new Promise(function (resolve) {
            elt.once('click', resolve);
        }).then(function (){
            this.$puncturedModal.follow(undefined);
            this.$puncturedModal.addStyle('visibility', 'hidden');
            ToolTip.closeTooltip(token);
        }.bind(this));
    }.bind(this));
};

UserClick.attachEnv = function (tutor, env) {
    env.USER_CLICK = function (eltPah, message) {
        return new UserClick(tutor, { eltPah: eltPah, message: message });
    };
};


export default UserClick;