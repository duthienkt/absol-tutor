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
    highlight = true;
    return new Promise(function (resolve) {
        thisC.onlyInteractWith(rootElt, function () {
            highlight = true;
            thisC.highlightElt(rootElt);
            thisC.showTooltip(rootElt);
            if (thisC.args.wrongMessage) {
                thisC.showTooltip(rootElt, thisC.args.wrongMessage);
            }
        });
        if (highlight) {
            thisC.highlightElt(rootElt);
            if (thisC.args.wrongMessage) {
                thisC.showTooltip(rootElt, thisC.args.wrongMessage);
            }
        }

        var itemElt = findNode(id, rootElt);
        var itemIndex = rootElt.$items.indexOf(itemElt);
        var isOpen = false;


        function onMouseEnter(event) {
            setTimeout(function () {
                if (rootElt.activeTab === itemIndex) {
                    thisC.onlyInteractWith(itemElt.$vmenu);
                    if (highlight)
                        thisC.highlightElt(itemElt.$vmenu)
                }
            }, 200);
        }

        function onMouseEnterSubMenu(event) {
            var subItem = findNode(subId, itemElt.$vmenu);
            thisC.onlyInteractWith(subItem);
            if (highlight)
                thisC.highlightElt(subItem);
        }

        function onClickBody(event) {
            setTimeout(function () {
                if (rootElt.activeTab >= 0) {
                    if (!isOpen) {
                        isOpen = true;
                        itemElt.on('mouseenter', onMouseEnter);
                        itemElt.$vmenu.on('mouseenter', onMouseEnterSubMenu);
                        if (hitElement(itemElt, event)) {
                            onMouseEnter.call(itemElt, event);
                        }
                    }
                }
                else {
                    if (isOpen) {
                        isOpen = false;
                        itemElt.off('mouseenter', onMouseEnter);
                        itemElt.$vmenu.off('mouseenter', onMouseEnterSubMenu);
                        document.body.removeEventListener('click', onClickBody);
                        resolve(false);
                    }
                }
            }, 5);
        }

        function onActiveTab(event) {
            console.log(event);
        }

        function onCancel(event) {

        }


        rootElt.on('activetab', onActiveTab);


        document.body.addEventListener('click', onClickBody);
    }).then(function (ok) {
        if (ok) return;
        return thisC._afterSelectRoot(rootElt, id, subId, true);
    })

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
