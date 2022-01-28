import '../../css/explain.css';
import OOP from 'absol/src/HTML5/OOP';
import TutorNameManager from "./TutorNameManager";
import TACData from "./TACData";
import { inheritCommand } from "../engine/TCommand";
import BaseState from "./BaseState";
import UserBaseAction from "./UserBaseAction";
import TutorEngine from "./TutorEngine";

/***
 * @extends BaseState
 * @constructor
 */
function StateShowMessage(){
    BaseState.apply(this, arguments);
}

OOP.mixClass(StateShowMessage,BaseState);

StateShowMessage.prototype.onStart = function (){
    this.command.showTooltip(this.command.elt, this.args.text);
    var until = this.args.until;
    if (!until){
        this.goto('finish');
        return;
    }
    if (until.depthClone){
        until.depthClone().exec().then(this.goto.bind(this, 'finish'));
    }
    else if (until.exec){
        until.depthClone().exec().then(this.goto.bind(this, 'finish'));
    }
    else if (until.exec){
        until.exec().then(this.goto.bind(this, 'finish'));
    }
    else if (until.then){
        until.then(this.goto.bind(this, 'finish'));
    }
    else {
        this.goto('finish');
    }
};


/***
 * @extends {UserBaseAction}
 */
function Explain() {
    UserBaseAction.apply(this, arguments);
}

inheritCommand(Explain, UserBaseAction);

Explain.prototype.argNames = ['eltPath', 'text', 'until'];
Explain.prototype.name = 'explain';
Explain.prototype.stateClasses.user_begin = StateShowMessage;

TutorEngine.installClass(Explain);


TutorNameManager.addAsync('explain');

TACData.define('explain', {
    type: 'function',
    args: [
        { name: 'eltPath', type: '(string|AElement)' },
        { name: 'text', type: 'MarkdownString' },
        { name: 'until', type: 'Trigger' },
    ]
});

export default Explain;
