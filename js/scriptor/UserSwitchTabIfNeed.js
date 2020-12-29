import BaseCommand from "./BaseCommand";
import OOP from "absol/src/HTML5/OOP";
import TutorNameManager from "./TutorNameManager";
import UserQuickMenu from "./UserQuickMenu";

/***
 * @extends BaseCommand
 * @constructor
 */
function UserSwitchTabIfNeed() {
    BaseCommand.apply(this, arguments);
    this._rejectCb = null;
}

OOP.mixClass(UserSwitchTabIfNeed, BaseCommand);

/***
 *
 * @param {HTMLElement} elt
 */
UserSwitchTabIfNeed.prototype.findTabView = function (elt) {
    var tabFrameElt = null;
    var tabViewElt = null;
    while (elt) {
        if (elt.classList.contains('absol-tab-frame')) {
            tabViewElt = null;
            tabFrameElt = elt;
        }
        else if (elt.classList.contains('absol-tabview')) {
            tabViewElt = elt;
        }
        elt = elt.parentElement;
    }
    return tabFrameElt && tabViewElt && {
        tabFrameElt: tabFrameElt,
        tabViewElt: tabViewElt
    };
};


UserSwitchTabIfNeed.prototype.exec = function () {
    this.start();
    var thisC = this;
    var elt = this.tutor.findNode(this.args.eltPath);
    var message = this.args.message;
    var wrongMessage = this.args.wrongMessage;
    var tabInfo = this.findTabView(elt);
    if (!tabInfo) {
        this.stop();
        return Promise.resolve();
    }
    var tabViewElt = tabInfo.tabViewElt;
    var tabFrameElt = tabInfo.tabFrameElt;
    var activeTabId = tabViewElt.historyOfTab[tabViewElt.historyOfTab.length - 1];
    if (activeTabId === tabFrameElt.id) return Promise.resolve();
    var tabButton = tabViewElt.$tabbar.getButtonByIdent(tabFrameElt.id);
    tabButton.addClass('atr-tab-button-disabled-close');
    this.showToast(message);
    return new Promise(function (resolve, reject) {
        function onClick() {
            resolve();
        }

        thisC._rejectCb = function () {
            tabButton.removeClass('atr-tab-button-disabled-close');
            tabButton.off('click', onClick);
            reject();
        };
        thisC.onlyInteractWith(tabButton, function () {
            if (wrongMessage)
                thisC.showTooltip(tabButton, wrongMessage);
            thisC.highlightElt(tabButton);
        });
        tabButton.on('click', onClick);
    }).then(this.stop.bind(this));
};

UserSwitchTabIfNeed.prototype.cancel = function () {
    if (this._rejectCb) {
        this._rejectCb();
        this._rejectCb = null;
    }
};

UserSwitchTabIfNeed.attachEnv = function (tutor, env) {
    env.userSwitchTabIfNeed = function (eltPath, message, wrongMessage) {
        return new UserSwitchTabIfNeed(tutor, {
            eltPath: eltPath,
            message: message,
            wrongMessage: wrongMessage
        }).exec();
    };
};

TutorNameManager.addAsync('userSwitchTabIfNeed');

export default UserSwitchTabIfNeed;