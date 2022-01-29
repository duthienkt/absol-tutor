import OOP from "absol/src/HTML5/OOP";
import TutorNameManager from "./TutorNameManager";
import TACData from "./TACData";
import UserBaseAction from "./UserBaseAction";
import TutorEngine from "./TutorEngine";
import BaseState from "./BaseState";
import { inheritCommand } from "../engine/TCommand";


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

inheritCommand(UserClick, UserBaseAction);

UserClick.prototype.name = 'userClick';
UserClick.prototype.argNames = ['eltPath', 'message', 'wrongMessage'];

UserClick.prototype.stateClasses.user_begin = StateWaitClick;

TutorNameManager.addAsync('userClick');

TACData.define('userClick', {
    type: 'function',
    args: [
        { name: 'eltPath', type: '(string|AElement)' },
        { name: 'message', type: 'string' },
        { name: 'wrongMessage', type: 'string' }
    ]
});

TutorEngine.installClass(UserClick);


export default UserClick;