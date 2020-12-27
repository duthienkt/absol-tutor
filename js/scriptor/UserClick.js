import BaseCommand from "./BaseCommand";
import OOP from "absol/src/HTML5/OOP";
import TutorNameManager from "./TutorNameManager";

/***
 * @extends BaseCommand
 * @constructor
 */
function UserClick() {
    BaseCommand.apply(this, arguments);
    this._rejectCb = null;
}

OOP.mixClass(UserClick, BaseCommand);

UserClick.prototype.exec = function () {
    this.start();
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
    return new Promise(function (resolve, reject) {
        function onClick(){
            thisC._rejectCb  = null;
            resolve();
        }
        thisC._rejectCb = function () {
            elt.off(onClick);
            reject();
        };
        elt.once('click', onClick);
    }).then(function () {
        this.stop();
    }.bind(this));
};

UserClick.prototype.cancel = function () {
    if (this._rejectCb) {
        this._rejectCb();
        this._rejectCb = null;
    }
};

UserClick.attachEnv = function (tutor, env) {
    env.userClick = function (eltPath, message, wrongMessage) {
        return new UserClick(tutor, { eltPath: eltPath, message: message, wrongMessage: wrongMessage }).exec();
    };
};

TutorNameManager.addAsync('userClick');

export default UserClick;