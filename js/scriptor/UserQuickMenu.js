import UserBaseAction from "./UserBaseAction";
import OOP from "absol/src/HTML5/OOP";
import TutorNameManager from "./TutorNameManager";
import {$, $$} from "../dom/Core";
import findNode from "../util/findNode";
import TACData from "./TACData";

/***
 * @extends UserBaseAction
 * @constructor
 */
function UserQuickMenu() {
    UserBaseAction.apply(this, arguments);
    this._rejectCb = null;
}

OOP.mixClass(UserQuickMenu, UserBaseAction);

UserQuickMenu.prototype._afterOpenQuickMenu = function (elt, highlight) {
    var thisC = this;
    var wrongMessage = thisC.args.wrongMessage;
    return new Promise(function (resolve, reject) {
        function onClick() {
            setTimeout(function () {
                var quickMenuElt = $('quickmenu');
                if (quickMenuElt) {
                    elt.off('click', onClick);
                    if (highlight)
                        thisC.showTooltip(quickMenuElt, wrongMessage);
                    thisC.assignTarget(quickMenuElt);
                    thisC._rejectCb = null;
                    resolve({ quickMenuElt: quickMenuElt, highlight: highlight });
                }
            }, 100);
        }

        thisC._clickCb = function () {
            thisC.showTooltip(elt, wrongMessage);
            highlight = true;
        };
        thisC.onlyClickTo(elt);
        thisC.highlightElt(elt);
        thisC.assignTarget(elt);
        elt.on('click', onClick);
        thisC._rejectCb = function () {
            elt.off('click', onClick);
            reject();
        }
        if (highlight) {
            thisC.showTooltip(elt, wrongMessage);
        }
    });
};

UserQuickMenu.prototype._afterSelectQM = function (elt, selectId, highlight) {
    var thisC = this;
    return this._afterOpenQuickMenu(elt, highlight).then(function (result) {
        var menuElt = result.quickMenuElt;
        highlight = result.highlight;
        return new Promise(function (resolve, reject) {
            var wrongMessage = thisC.args.wrongMessage;
            var itemElt = findNode(selectId, menuElt);
            if (!itemElt) {
                throw new Error("Not found menu id=" + selectId);
            }


            setTimeout(function () {
                if (thisC.state !== 'RUNNING') return;
                if (itemElt.isDescendantOf(document.body)) {
                    thisC.onlyClickTo(itemElt);
                    thisC.highlightElt(itemElt);
                    thisC.assignTarget(itemElt);
                    if (highlight) {
                        if (wrongMessage)
                            thisC.showTooltip(itemElt, wrongMessage);
                    }
                }
            }, 50);

            function onSelect(ev) {
                document.body.removeEventListener('click', onClose);
                menuElt.off('press', onSelect);
                var id = ev.menuItem["data-tutor-id"] || ev.menuItem.id || ev.menuItem.text;
                thisC._rejectCb = null;
                resolve(id === selectId);
            }

            function onClose() {
                setTimeout(function () {
                    document.body.removeEventListener('click', onClose);
                    menuElt.off('press', onSelect);
                    thisC._rejectCb = null;
                    thisC.closeTooltip();
                    resolve(false);
                }, 100)
            }

            document.body.addEventListener('click', onClose);
            menuElt.on('press', onSelect);
            thisC._rejectCb = function () {
                document.body.removeEventListener('click', onClose);
                menuElt.off('press', onSelect);
                reject();
            }
        });
    }).then(function (isOK) {
        if (!isOK) {
            return thisC._afterSelectQM(elt, thisC.args.selectId, true);
        }
        return true;
    });
};

UserQuickMenu.prototype._verifyQuickMenuTrigger = function (elt) {
      if (!elt.containsClass || !elt.containsClass('as-quick-menu-trigger')){
          console.warn(elt , " may not a quick-menu trigger!")
      }
};

UserQuickMenu.prototype.requestUserAction = function () {
    var elt = this.tutor.findNode(this.args.eltPath);
    this._verifyQuickMenuTrigger(elt);
    return this._afterSelectQM(elt, this.args.selectId);
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

TACData.define('userQuickMenu', {
    type: 'function',
    args: [
        { name: 'eltPath', type: '(string|AElement)' },
        { name: 'selectId', type: 'string' },
        { name: 'message', type: 'string' },
        { name: 'wrongMessage', type: 'string' }
    ]
}).define('getAllQuickMenuTriggers',
    {
        type: 'function',
        args: [],
        returns: 'QuickMenuTriggers[]'
    }
);

export default UserQuickMenu;