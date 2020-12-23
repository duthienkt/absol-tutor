import BaseCommand from "./BaseCommand";
import OOP from "absol/src/HTML5/OOP";
import TutorNameManager from "./TutorNameManager";
import findNode from "../util/findNode";
import {hitElement} from "absol/src/HTML5/EventEmitter";

/***
 * @extends BaseCommand
 * @constructor
 */
function UserLevel2Menu() {
    BaseCommand.apply(this, arguments);
}

OOP.mixClass(UserLevel2Menu, BaseCommand);


UserLevel2Menu.prototype._afterSelectRoot = function (rootElt, id, subId, highlight) {
    var thisC = this;
    return new Promise(function (resolve) {
        var itemElt = findNode(id, rootElt);
        var itemIndex = rootElt.$items.indexOf(itemElt);
        var subItem = findNode(subId, itemElt.$vmenu);
        thisC.onlyInteractWith(rootElt, function () {
            highlight = true;
            thisC.highlightElt(rootElt);
            thisC.showTooltip(rootElt);
            if (thisC.args.wrongMessage) {
                thisC.showTooltip(rootElt, thisC.args.wrongMessage);
            }
        });
        if (highlight) {
            thisC.highlightElt(itemElt);
            if (thisC.args.wrongMessage) {
                thisC.showTooltip(rootElt, thisC.args.wrongMessage);
            }
        }

        function onActiveTab(event) {
            if (event.tabIndex === itemIndex) {
                thisC.onlyInteractWith(subItem);
                if (highlight) {
                    thisC.highlightElt(itemElt.$vmenu);
                    setTimeout(function () {
                        thisC.highlightElt(subItem);
                    }, 500);
                }
            }
        }

        var cancelTimeout = -1;

        function onCancel(event) {
            cancelTimeout = setTimeout(function () {
                highlight = true;
                rootElt.off('activetab', onActiveTab)
                    .off('cancel', onCancel)
                    .off('press', onPressItem);
                resolve(false);
            }, 200)
        }

        function onPressItem(event) {
            if (cancelTimeout >= 0) clearTimeout(cancelTimeout);
            rootElt.off('activetab', onActiveTab)
                .off('cancel', onCancel)
                .off('press', onPressItem);
            resolve(event.menuItem === subItem);
        }

        rootElt.on('activetab', onActiveTab)
            .on('cancel', onCancel)
            .on('press', onPressItem);
    }).then(function (ok) {
        if (ok) return;
        return thisC._afterSelectRoot(rootElt, id, subId, true);
    });

};


UserLevel2Menu.prototype.exec = function () {
    this.start();
    var thisC = this;
    var elt = this.tutor.findNode(this.args.eltPath);
    this.showToast(this.args.message);
    return this._afterSelectRoot(elt, this.args.menuItemPath[0], this.args.menuItemPath[1], false).then(function () {
        thisC.stop();
    });
};

UserLevel2Menu.attachEnv = function (tutor, env) {
    env.userLevel2Menu = function (eltPath, menuItemPath, message, wrongMessage) {
        return new UserLevel2Menu(tutor, {
            eltPath: eltPath,
            menuItemPath: menuItemPath,
            message: message,
            wrongMessage: wrongMessage
        }).exec();
    };
};

TutorNameManager.addAsync('userLevel2Menu');


export default UserLevel2Menu;
