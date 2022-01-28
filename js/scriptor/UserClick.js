import OOP from "absol/src/HTML5/OOP";
import TutorNameManager from "./TutorNameManager";
import TACData from "./TACData";
import UserBaseAction from "./UserBaseAction";
import TutorEngine from "./TutorEngine";
import BaseState from "./BaseState";


/***
 * @extends BaseState
 * @constructor
 */
function StateWaitClick(){
    BaseState.apply(this, arguments);
}

OOP.mixClass(StateWaitClick,BaseState);

StateWaitClick.prototype.onStart = function (){
    this.command.highlightElt(this.command.elt);
    this.command.onlyClickTo(this.command.elt);
    this.command.clickCb = this.ev_clickOut;
    this.command.elt.addEventListener('click', this.ev_click);
};

StateWaitClick.prototype.onStop = function (){
    this.command.elt.removeEventListener('click', this.ev_click);
};

StateWaitClick.prototype.ev_clickOut = function (){
   if (this.args.wrongMessage){
       this.command.showTooltip(this.command.elt, this.args.wrongMessage);
   }
};

StateWaitClick.prototype.ev_click = function (){
    this.goto('finish');
}



/***
 * @extends UserBaseAction
 * @constructor
 */
function UserClick() {
    UserBaseAction.apply(this, arguments);
}

OOP.mixClass(UserClick, UserBaseAction);

UserClick.prototype.name = 'userClick';
UserClick.prototype.argNames = ['eltPath', 'message', 'wrongMessage'];

UserClick.prototype.stateClasses.user_begin = StateWaitClick;

UserClick.prototype.requestUserAction = function (){
    var thisC = this;
    var elt = this.tutor.findNode(this.args.eltPath);
    var wrongMessage = this.args.wrongMessage;
    thisC.highlightElt(elt);
    this._clickCb = function (){
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
    });
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

TutorEngine.installCommand(UserClick);


export default UserClick;