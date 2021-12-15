import OOP from "absol/src/HTML5/OOP";
import FunctionNameManager from "./TutorNameManager";
import TACData from "./TACData";
import UserBaseAction from "./UserBaseAction";

/***
 * @extends UserBaseAction
 * @constructor
 */
function UserCheckbox() {
    UserBaseAction.apply(this, arguments);
}

OOP.mixClass(UserCheckbox, UserBaseAction);

UserCheckbox.prototype._verifyCheckbox = function (elt) {
    if (!elt.containsClass || !((elt.containsClass('absol-checkbox')
        || elt.containsClass('absol-radio')
        || elt.containsClass('as-checkbox-input')
        || elt.containsClass('as-checkbox-input')
        || elt.containsClass('as-radio-input')
        || elt.containsClass('absol-switch')
        || (elt.tagName.toLowerCase() === 'input' && (elt.type === 'checkbox' || elt.type === 'radio'))
    ))) {
        throw new Error('Type error: not a radio or checkbox');
    }
};

UserCheckbox.prototype.requestUserAction = function () {
    var thisC = this;
    var elt = this.tutor.findNode(this.args.eltPath);
    this._verifyCheckbox(elt);
    var wrongMessage = this.args.wrongMessage;
    var checked = this.args.checked;
    thisC.highlightElt(elt);
    this._clickCb = function () {
        if (wrongMessage) {
            thisC.showTooltip(elt, wrongMessage);
        }
    }
    this.onlyClickTo(elt);
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
    });
};


UserCheckbox.attachEnv = function (tutor, env) {
    env.userCheckbox = function (eltPath, checked, message, wrongMessage) {
        return new UserCheckbox(tutor, {
            eltPath: eltPath,
            checked: checked,
            message: message,
            wrongMessage: wrongMessage
        }).exec();
    };

    env.userSwitch = env.userCheckbox;

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
FunctionNameManager.addAsync('userSwitch');
FunctionNameManager.addAsync('userRadio');


TACData.define('userCheckbox', {
    type: 'function',
    args: [
        {name: 'eltPath', type: '(string|AElement)'},
        {name: 'checked', type: 'boolean'},
        {name: 'message', type: 'string'},
        {name: 'wrongMessage', type: 'string'}
    ]
}).define('userRadio', {
    type: 'function',
    args: [
        {name: 'eltPath', type: '(string|AElement)'},
        {name: 'checked', type: 'boolean'},
        {name: 'message', type: 'string'},
        {name: 'wrongMessage', type: 'string'}
    ]
});


export default UserCheckbox;