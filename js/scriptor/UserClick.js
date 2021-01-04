import OOP from "absol/src/HTML5/OOP";
import TutorNameManager from "./TutorNameManager";
import TACData from "./TACData";
import UserBaseAction from "./UserBaseAction";

/***
 * @extends UserBaseAction
 * @constructor
 */
function UserClick() {
    UserBaseAction.apply(this, arguments);
}

OOP.mixClass(UserClick, UserBaseAction);

UserClick.prototype.requestUserAction = function (){
    var thisC = this;
    var elt = this.tutor.findNode(this.args.eltPath);
    var wrongMessage = this.args.wrongMessage;
    this._clickCb = function (){
        thisC.highlightElt(elt);
        if (wrongMessage)
            thisC.showTooltip(elt, wrongMessage);
    };
    this.onlyClickTo(elt);
    this.preventKeyBoard(true);
    return new Promise(function (resolve, reject) {
        function onClick() {
            thisC._rejectCb = null;
            resolve();
        }

        thisC._rejectCb = function () {
            elt.off(onClick);
            document.body.removeEventListener("click", clickForceGround);
            reject();
        };

        function clickForceGround(event) {
            if (thisC.hitSomeOf(elt, event)) {
                reject(new Error("Duplicated id detected!"));
            }
        }

        elt.once('click', onClick);
        document.body.addEventListener("click", clickForceGround);
    })

};

UserClick.attachEnv = function (tutor, env) {
    env.userClick = function (eltPath, message, wrongMessage) {
        return new UserClick(tutor, { eltPath: eltPath, message: message, wrongMessage: wrongMessage }).exec();
    };
};

TutorNameManager.addAsync('userClick');

TACData.define('userClick', {
    type: 'function',
    args: [
        { name: 'eltPath', type: '(string|AElement)' },
        { name: 'message', type: 'string' },
        { name: 'wrongMessage', type: 'string' }
    ]
});


export default UserClick;