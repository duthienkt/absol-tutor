import BaseCommand from "./BaseCommand";
import OOP from "absol/src/HTML5/OOP";
import wrapAsync from "../util/wrapAsync";
import SelectTreeMenu from "absol-acomp/js/SelectTreeMenu";
import '../../css/basecommand.css';
import FunctionNameManager from "./TutorNameManager";
import TACData from "./TACData";

/***
 * @extends BaseCommand
 * @constructor
 */
function UserSelectMenu() {
    BaseCommand.apply(this, arguments);
}

OOP.mixClass(UserSelectMenu, BaseCommand);


UserSelectMenu.prototype._afterOpenList = function (menuElt) {
    var thisC = this;
    return new Promise(function (resolve, reject) {
        function listenter() {
            setTimeout(function () {
                if (menuElt.isFocus) {
                    menuElt.off('click', listenter);
                    thisC._rejectCb = null;
                    resolve();
                }
            }, 10);
        }

        thisC._rejectCb = function () {
            menuElt.off('click', listenter);
            reject();
        };
        menuElt.on('click', listenter);
    });
};

UserSelectMenu.prototype._afterCloseList = function (menuElt) {
    var thisC = this;
    return new Promise(function (resolve, reject) {
        function listenter() {
            setTimeout(function () {
                if (!menuElt.isFocus) {
                    document.body.removeEventListener('pointerdown', listenter);
                    thisC._rejectCb = null;
                    resolve();
                }
            }, 200);
        }

        thisC._rejectCb = function () {
            document.body.removeEventListener('pointerdown', listenter);
            reject();
        };
        document.body.addEventListener('pointerdown', listenter);
    });
};

/***
 *
 * @param {SelectTreeMenu} elt
 * @param value
 * @param wrongMessage
 * @param searchMessage
 * @return {Promise<unknown>}
 * @private
 */
UserSelectMenu.prototype._afterSelect = function (elt, value, wrongMessage, searchMessage, highlight) {
    var thisC = this;
    if (highlight) thisC.highlightElt(elt);
    thisC.onlyInteractWith(elt, function () {
        thisC.highlightElt(elt);
        thisC.showTooltip(elt, wrongMessage);
        highlight = true;
    });
    return thisC._afterOpenList(elt).then(function () {
        if (highlight) {
            thisC.highlightElt(elt);
            elt.$selectlistBox.addClass('atr-on-top');
        }
        if (searchMessage) {
            thisC.showTooltip(elt.$selectlistBox.$searchInput, searchMessage);
        }
        thisC.onlyInteractWith(elt.$selectlistBox, function () {
            thisC.highlightElt(elt);
            thisC.showTooltip(elt, wrongMessage);
        });
        thisC._rejectCb1 = function () {
            elt.$selectlistBox.removeClass('atr-on-top');
        }
        return thisC._afterCloseList(elt).then(function () {
            thisC.onlyInteractWith(null);
            elt.$selectlistBox.removeClass('atr-on-top');
            thisC._rejectCb1 = null;
            if (elt.value === value) {
                return true;
            }
            else {
                thisC.showTooltip(elt, wrongMessage);
                return false;
            }
        });
    }).then(function (success) {
        if (success) return true;
        return thisC._afterSelect(elt, value, wrongMessage, searchMessage, true);
    });
};


UserSelectMenu.prototype.exec = function () {
    var thisC = this;
    this.start();
    /***
     *
     * @type {SelectTreeMenu}
     */
    var elt = this.tutor.findNode(this.args.eltPath);
    var value = this.args.value;
    var items;
    if (elt.$selectlistBox && elt.$selectlistBox.findItemsByValue) {
        items = elt.$selectlistBox.findItemsByValue(value);
        if (!items || items.length === 0) {
            throw new Error("Not found value=" + (JSON.stringify(value) || value) + ' in SelectMenu');
        }
    }

    var message = this.args.message;
    var wrongMessage = this.args.wrongMessage;
    var searchMessage = this.args.searchMessage;
    thisC.showToast(message);
    return thisC._afterSelect(elt, value, wrongMessage, searchMessage).then(function () {
        thisC.stop();
    });
};

UserSelectMenu.prototype.cancel = function () {
    if (this._rejectCb) {
        this._rejectCb();
        this._rejectCb = null;
    }
    if (this._rejectCb1) {
        this._rejectCb1();
        this._rejectCb1 = null;
    }
};

UserSelectMenu.attachEnv = function (tutor, env) {
    env.userSelectMenu = function (eltPath, value, message, wrongMessage, searchMessage) {
        return new UserSelectMenu(tutor, {
            eltPath: eltPath, value: value, message: message, wrongMessage: wrongMessage, searchMessage: searchMessage
        }).exec();
    };
};

TACData.define('userSelectMenu', {
    type: 'function',
    args: [
        { name: 'eltPath', type: '(string|AElement)' },
        { name: 'value', type: '(string|value)' },
        { name: 'message', type: 'string' },
        { name: 'wrongMessage', type: 'string' },
        { name: 'searchMessage', type: 'string' }
    ]
});

FunctionNameManager.addAsync('userSelectMenu');


export default UserSelectMenu;