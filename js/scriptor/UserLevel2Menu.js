import UserBaseAction from "./UserBaseAction";
import OOP from "absol/src/HTML5/OOP";
import TutorNameManager from "./TutorNameManager";
import findNode from "../util/findNode";
import TACData from "./TACData";

/***
 * @extends UserBaseAction
 * @constructor
 */
function UserLevel2Menu() {
    UserBaseAction.apply(this, arguments);
}

OOP.mixClass(UserLevel2Menu, UserBaseAction);


UserLevel2Menu.prototype._afterSelectRoot = function (rootElt, id, subId, highlight) {
    var thisC = this;
    return new Promise(function (resolve, reject) {
        thisC.highlightElt(rootElt);

        var wrongMessage = thisC.args.wrongMessage;
        var wrongMessage1 = thisC.args.wrongMessage1 || thisC.args.wrongMessage;
        var itemElt = findNode(id, rootElt);
        if (!itemElt) {
            throw new Error("Not found menu id=" + JSON.stringify(id));
        }
        var highlightTimeout = setTimeout(function () {
            highlightTimeout = -1;
            thisC.highlightElt(itemElt);
        }, 400);
        var itemIndex = rootElt.$items.indexOf(itemElt);
        var subItem = findNode(subId, itemElt.$vmenu);
        if (!subItem) {
            throw new Error("Not found menu id=" + subId);
        }
        thisC._clickCb = function () {
            highlight = true;
            thisC.highlightElt(rootElt);
            if (highlightTimeout) {
                highlightTimeout = -1;

            }
            highlightTimeout = setTimeout(function () {
                highlightTimeout = -1;
                thisC.highlightElt(itemElt);
            }, 400);
            if (wrongMessage) {
                thisC.showTooltip(rootElt, wrongMessage);
            }
        }
        thisC.onlyClickTo(rootElt);
        if (highlight) {
            if (wrongMessage) {
                thisC.showTooltip(itemElt, wrongMessage);
            }
        }

        function onActiveTab(event) {
            if (event.tabIndex === itemIndex) {
                thisC.onlyClickTo(subItem);
                thisC.highlightElt(itemElt.$vmenu);
                if (highlightTimeout) {
                    highlightTimeout = -1;
                }
                highlightTimeout = setTimeout(function () {
                    thisC.highlightElt(subItem);
                }, 400);
                if (highlight) {
                    if (wrongMessage1) {
                        thisC.showTooltip(subItem, wrongMessage1);
                    }

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
                thisC._rejectCb = null;
                resolve(false);
            }, 200)
        }

        function onPressItem(event) {
            if (cancelTimeout >= 0) clearTimeout(cancelTimeout);
            if (highlightTimeout) {
                highlightTimeout = -1;
                clearTimeout(highlightTimeout);
            }
            rootElt.off('activetab', onActiveTab)
                .off('cancel', onCancel)
                .off('press', onPressItem);
            thisC._rejectCb = null;
            resolve(event.menuItem === subItem);
        }

        rootElt.on('activetab', onActiveTab)
            .on('cancel', onCancel)
            .on('press', onPressItem);
        thisC._rejectCb = function () {
            if (highlightTimeout) {
                highlightTimeout = -1;
                clearTimeout(highlightTimeout);
            }
            rootElt.off('activetab', onActiveTab)
                .off('cancel', onCancel)
                .off('press', onPressItem);
            reject();
        }
    }).then(function (ok) {
        if (ok) return;
        return thisC._afterSelectRoot(rootElt, id, subId, true);
    });

};

UserLevel2Menu.prototype._verifyMenu = function (elt) {
    if (!elt.containsClass || !elt.containsClass('as-v-root-menu')) {
        throw new Error('Type error: not a valid menu!');
    }
};

UserLevel2Menu.prototype.requestUserAction = function () {
    var elt = this.tutor.findNode(this.args.eltPath);
    this._verifyMenu(elt);
    return this._afterSelectRoot(elt, this.args.menuItemPath[0], this.args.menuItemPath[1], false);
};


UserLevel2Menu.attachEnv = function (tutor, env) {
    env.userLevel2Menu = function (eltPath, menuItemPath, message, wrongMessage, wrongMessage1) {
        return new UserLevel2Menu(tutor, {
            eltPath: eltPath,
            menuItemPath: menuItemPath,
            message: message,
            wrongMessage: wrongMessage,
            wrongMessage1: wrongMessage1
        }).exec();
    };
};

TutorNameManager.addAsync('userLevel2Menu');

TACData.define('userLevel2Menu', {
    type: 'function',
    args: [
        { name: 'eltPath', type: '(string|AElement)' },
        { name: 'menuItemPath', type: 'string[]' },
        { name: 'message', type: 'string' },
        { name: 'wrongMessage', type: 'string' },
        { name: 'wrongMessage1', type: 'string' }
    ]
});

export default UserLevel2Menu;
