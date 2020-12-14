import BaseCommand from "./BaseCommand";
import OOP from "absol/src/HTML5/OOP";
import wrapAsync from "../util/wrapAsync";
import Toast from "absol-acomp/js/Toast";

/***
 * @extends BaseCommand
 * @constructor
 */
function ShowToastMessage() {
    BaseCommand.apply(this, arguments);
}

OOP.mixClass(ShowToastMessage, BaseCommand);

ShowToastMessage.prototype.exec = function () {
    var thisC = this;
    return Promise.all([
        wrapAsync(this.args.title),
        wrapAsync(this.args.text),
        wrapAsync(this.args.disappearTimeout),
        wrapAsync(this.args.variant)
    ]).then(function (args) {
        var title = args[0];
        var text = args[1];
        var timeout = args[2];
        var variant = args[3];
        Toast.make({
            props: {
                htitle: title,
                message: text,
                disappearTimeout: timeout,
                variant: variant
            }
        });
        return wrapAsync(thisC.args.until);
    });
};

ShowToastMessage.attachEnv = function (tutor, env) {
    env.TOAST_MESSAGE = function (title, text, disappearTimeout, until, variant) {
        return new ShowToastMessage(tutor, {
            title: title,
            text: text,
            disappearTimeout: disappearTimeout || 0,
            until: until,
            variant: variant
        });
    };
};


export default ShowToastMessage;

