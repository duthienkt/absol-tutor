import UserSwitchTabIfNeed from "./UserSwitchTabIfNeed";
import OOP from "absol/src/HTML5/OOP";
import TutorNameManager from "./TutorNameManager";
import TACData from "./TACData";
import UserBaseAction from "./UserBaseAction";

/***
 * @extends UserSwitchTabIfNeed
 * @constructor
 */
function UserSwitchTab() {
    UserSwitchTabIfNeed.apply(this, arguments);
}

OOP.mixClass(UserSwitchTab, UserSwitchTabIfNeed);


UserSwitchTab.prototype.requestUserAction = function () {
    var thisC = this;
    var elt = this.tutor.findNode(this.args.eltPath);
    console.log(elt)
    var wrongMessage = this.args.wrongMessage;
    var tabInfo = this.findTabView(elt);
    if (!tabInfo) {
        throw Error(this.args.eltPath+' is not a element of any tab!')
    }
    var tabViewElt = tabInfo.tabViewElt;
    var tabFrameElt = tabInfo.tabFrameElt;
    var tabButton = tabViewElt.$tabbar.getButtonByIdent(tabFrameElt.id);
    tabButton.addClass('atr-tab-button-disabled-close');
    return new Promise(function (resolve, reject) {
        function onClick() {
            thisC._clickCb = null;
            tabButton.removeClass('atr-tab-button-disabled-close');
            resolve();
        }

        thisC._rejectCb = function () {
            tabButton.removeClass('atr-tab-button-disabled-close');
            tabButton.off('click', onClick);
            reject();
        };
        thisC._clickCb = function () {
            if (wrongMessage)
                thisC.showTooltip(tabButton, wrongMessage);
            thisC.highlightElt(tabButton);
        }
        thisC.onlyClickTo(tabButton);
        tabButton.on('click', onClick);
    });
};

UserSwitchTab.prototype.exec = UserBaseAction.prototype.exec;

UserSwitchTab.attachEnv = function (tutor, env) {
    env.userSwitchTab = function (eltPath, message, wrongMessage) {
        return new UserSwitchTab(tutor, {
            eltPath: eltPath,
            message: message,
            wrongMessage: wrongMessage
        }).exec();
    };
};

TutorNameManager.addAsync('userSwitchTab');

TACData.define('userSwitchTab', {
    type: 'function',
    args: [
        { name: 'eltPath', type: '(string|AElement)' },
        { name: 'message', type: 'string' },
        { name: 'wrongMessage', type: 'string' },

    ],
    desc: "eltPath: phần tử bất kì trong tab cần bật, nếu đang mở đúng tab hiện tại, nếu đang mở đúng tab hiện tại thì người" +
        "dùng vẫn phải bấm bút tab dù nó không có tác dụng gì"
});

export default UserSwitchTab;