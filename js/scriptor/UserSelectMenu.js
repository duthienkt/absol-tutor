import BaseCommand from "./BaseCommand";
import OOP from "absol/src/HTML5/OOP";
import wrapAsync from "../util/wrapAsync";
import SelectTreeMenu from "absol-acomp/js/SelectTreeMenu";
import '../../css/basecommand.css';
import FunctionNameManager from "./TutorNameManager";

/***
 * @extends BaseCommand
 * @constructor
 */
function UserSelectMenu() {
    BaseCommand.apply(this, arguments);
}

OOP.mixClass(UserSelectMenu, BaseCommand);


UserSelectMenu.prototype._afterOpenList = function (menuElt) {
    return new Promise(function (resolve) {
        function listenter() {
            setTimeout(function () {
                if (menuElt.isFocus) {
                    menuElt.off('click', listenter);
                    resolve();
                }
            }, 10);
        }

        menuElt.on('click', listenter);
    });
};

UserSelectMenu.prototype._afterCloseList = function (menuElt) {
    return new Promise(function (resolve) {
        function listenter() {
            setTimeout(function () {
                if (!menuElt.isFocus) {
                    document.body.removeEventListener('pointerdown', listenter);
                    resolve();
                }
            }, 200);
        }

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
    return new Promise(function (resolve) {
        if (highlight) thisC.highlightElt(elt);
        thisC.onlyInteractWith(elt, function () {
            thisC.highlightElt(elt);
            thisC.showTooltip(elt, wrongMessage);
            highlight = true;
        });
        thisC._afterOpenList(elt).then(function () {
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
                resolve(false);
            });

            thisC._afterCloseList(elt).then(function () {
                elt.$selectlistBox.removeClass('atr-on-top');
                if (elt.value === value) {
                    resolve(true);
                }
                else {
                    thisC.showTooltip(elt, wrongMessage);
                    resolve(false);
                }
            });
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
    var message = this.args.message;
    var wrongMessage = this.args.wrongMessage;
    var searchMessage = this.args.searchMessage;
    thisC.showToast(message);
    return thisC._afterSelect(elt, value, wrongMessage, searchMessage).then(function () {
        thisC.stop();
    });
};

UserSelectMenu.attachEnv = function (tutor, env) {
    env.userSelectMenu = function (eltPath, value, message, wrongMessage, searchMessage) {
        return new UserSelectMenu(tutor, {
            eltPath: eltPath, value: value, message: message, wrongMessage: wrongMessage, searchMessage: searchMessage
        }).exec();
    };
};

FunctionNameManager.addAsync('userSelectMenu');


export default UserSelectMenu;