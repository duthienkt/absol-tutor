/****
 * @externs BaseCommand
 * @constructor
 */
import BaseCommand from "./BaseCommand";
import OOP from "absol/src/HTML5/OOP";
import TutorNameManager from "./TutorNameManager";
import {$, $$} from "../dom/Core";
import findNode from "../util/findNode";

/***
 * @extends BaseCommand
 * @constructor
 */
function UserQuickMenu() {
    BaseCommand.apply(this, arguments);
}

OOP.mixClass(UserQuickMenu, BaseCommand);

UserQuickMenu.prototype._afterOpenQuickMenu = function (elt, highlight) {
    var thisC = this;
    var wrongMessage = thisC.args.wrongMessage;
    return new Promise(function (resolve) {
        function onClick() {
            setTimeout(function () {
                var quickMenuElt = $('quickmenu');
                if (quickMenuElt) {
                    elt.off('click', onClick);
                    if (highlight)
                        thisC.showTooltip(quickMenuElt, wrongMessage);
                    resolve({ quickMenuElt: quickMenuElt, highlight: highlight });
                }
            }, 100);
        }

        thisC.onlyInteractWith(elt, function () {
            thisC.showTooltip(elt, wrongMessage);
            thisC.highlightElt(elt);
            highlight = true;
        });
        elt.on('click', onClick);
        if (highlight) {
            thisC.highlightElt(elt);
            thisC.showTooltip(elt, wrongMessage);
        }
    });
};

UserQuickMenu.prototype._afterSelectQM = function (elt, selectId, highlight) {
    var thisC = this;
    return this._afterOpenQuickMenu(elt, highlight).then(function (result) {
        var menuElt = result.quickMenuElt;
        highlight = result.highlight;
        return new Promise(function (resolve) {
            var wrongMessage = thisC.args.wrongMessage;
            var itemElt = findNode(selectId, menuElt);
            thisC.onlyInteractWith(itemElt);
            if (highlight) {
                thisC.highlightElt(menuElt);
                thisC.highlightElt(menuElt);
                setTimeout(function () {
                    if (thisC.state !== 'RUNNING') return;
                    thisC.highlightElt(itemElt);
                    if (wrongMessage)
                        thisC.showTooltip(itemElt, wrongMessage);
                }, 800);
            }

            function onSelect(ev) {
                document.body.removeEventListener('click', onClose);
                menuElt.off('press', onSelect);
                var id = ev.menuItem["data-tutor-id"] || ev.menuItem.id || ev.menuItem.text;
                resolve(id === selectId);
            }

            function onClose() {
                setTimeout(function () {
                    document.body.removeEventListener('click', onClose);
                    menuElt.off('press', onSelect);
                    resolve(false);
                }, 100)
            }

            document.body.addEventListener('click', onClose);
            menuElt.on('press', onSelect);

        });
    });
};

UserQuickMenu.prototype.exec = function () {
    this.start();
    var elt = this.tutor.findNode(this.args.eltPath);
    var thisC = this;
    this.showToast(this.args.message);
    return this._afterSelectQM(elt, this.args.selectId).then(function (isOK) {
        if (!isOK) {
            return thisC._afterSelectQM(elt, thisC.args.selectId, true);
        }
        return true;
    }).then(function () {
        thisC.stop();
    });
};

UserQuickMenu.attachEnv = function (tutor, env) {
    env.userQuickMenu = function (eltPath, selectId, message, wrongMessage) {
        return new UserQuickMenu(tutor, {
            eltPath: eltPath,
            selectId: selectId,
            message: message,
            wrongMessage: wrongMessage
        }).exec();
    };

    env.getAllQuickMenuTriggers = function () {
        return $$('.as-quick-menu-trigger');
    };
};

TutorNameManager.addAsync('userQuickMenu')
    .addSync('getAllQuickMenuTriggers');


export default UserQuickMenu;