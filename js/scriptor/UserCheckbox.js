import BaseCommand from "./BaseCommand";
import OOP from "absol/src/HTML5/OOP";
import FunctionNameManager from "./TutorNameManager";
import TACData from "./TACData";

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
        var clickTimeout = -1;

        function onChange() {
            if (clickTimeout > 0) {
                clearTimeout(clickTimeout);
                clickTimeout = -1;
            }
            if (elt.checked === checked) {
                elt.off('change', onChange)
                    .off('click', onClick);
                resolve();
            }
        }

        function onClick() {
            if (clickTimeout > 0) clearTimeout(clickTimeout);
            setTimeout(function () {
                clickTimeout = -1;
                if (elt.checked === checked) {
                    elt.off('change', onChange)
                        .off('click', onClick);
                    resolve();
                }
            }, 50);
        }

        elt.on('change', onChange)
            .on('click', onClick);
        thisC._rejectCb = function () {
            elt.off('change', onChange)
                .off('click', onClick);
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

    env.userRadio = function (eltPath, checked, message, wrongMessage) {
        return new UserCheckbox(tutor, {
            eltPath: eltPath,
            checked: checked,
            message: message,
            wrongMessage: wrongMessage
        }).exec();
    }

};

FunctionNameManager.addAsync('userCheckbox');


TACData.define('userCheckbox', {
    type: 'function',
    args: [
        { name: 'eltPath', type: '(string|AElement)' },
        { name: 'checked', type: 'boolean' },
        { name: 'message', type: 'string' },
        { name: 'wrongMessage', type: 'string' }
    ]
}).define('userRadio', {
    type: 'function',
    args: [
        { name: 'eltPath', type: '(string|AElement)' },
        { name: 'checked', type: 'boolean' },
        { name: 'message', type: 'string' },
        { name: 'wrongMessage', type: 'string' }
    ]
});



export default UserCheckbox;