import BaseCommand from "./BaseCommand";
import OOP from "absol/src/HTML5/OOP";
import TutorNameManager from "./TutorNameManager";
import UserQuickMenu from "./UserQuickMenu";
import TACData from "./TACData";

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
            break;
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
    if (activeTabId === tabFrameElt.id) {
        return new Promise(function (resolve, reject){
            if (!thisC.args.notNeedMessage) {
                resolve();
                return;
            }
            thisC.showToast(thisC.args.notNeedMessage);
            var timeoutId = setTimeout(function (){
                timeoutId = -1;
                thisC.stop();
            }, 2000);
            thisC._rejectCb = function (){
                if (timeoutId >=0){
                    clearTimeout(timeoutId);
                    timeoutId = -1;
                    reject();
                }
            }
        })
    }
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
    env.userSwitchTabIfNeed = function (eltPath, message, wrongMessage, notNeedMessage) {
        return new UserSwitchTabIfNeed(tutor, {
            eltPath: eltPath,
            message: message,
            wrongMessage: wrongMessage,
            notNeedMessage: notNeedMessage
        }).exec();
    };
};

TutorNameManager.addAsync('userSwitchTabIfNeed');

TACData.define('userSwitchTabIfNeed', {
    type: 'function',
    args: [
        { name: 'eltPath', type: '(string|AElement)' },
        { name: 'message', type: 'string' },
        { name: 'wrongMessage', type: 'string' },
        {
            name: 'notNeedMessage', type: 'string'
        },
    ],
    desc: "eltPath: phần tử bất kì trong tab cần bật, nếu đang mở đúng tab hiện tại, sử dụng notNeedMessage, delay 2s và nhảy lệnh " +
        "tiếp theo, nếu không có tab nào, lệnh không được thực hiện"
});

export default UserSwitchTabIfNeed;