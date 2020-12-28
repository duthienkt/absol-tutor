import BaseCommand from "./BaseCommand";
import OOP from "absol/src/HTML5/OOP";
import FunctionNameManager from "./TutorNameManager";

/***
 * @extends BaseCommand
 * @constructor
 */
function UserCheckbox() {
    BaseCommand.apply(this, arguments);
    this._rejectCb = null;
}

OOP.mixClass(UserCheckbox, BaseCommand);


UserCheckbox.prototype.exec = function () {
    var thisC = this;
    this.start();
    var elt = this.tutor.findNode(this.args.eltPath);
    var message = this.args.message;
    var wrongMessage = this.args.wrongMessage;
    var checked = this.args.checked;

    function onInteractOut() {
        thisC.highlightElt(elt);
        if (wrongMessage) {
            thisC.showTooltip(elt, wrongMessage);
        }
    }

    thisC.onlyInteractWith(elt, onInteractOut);
    thisC.showToast(message);

    return new Promise(function (resolve, reject) {
        function onChange() {
            if (elt.checked === checked) {
                elt.off('change', onChange);
                resolve();
            }
        }

        elt.on('change', onChange);
        thisC._rejectCb = function () {
            elt.off('change', onChange);
            reject();
        }
    }).then(this.stop.bind(this));
};


UserCheckbox.prototype.cancel = function () {
    if (this._rejectCb) {
        this._rejectCb();
        this._rejectCb = null;
    }
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