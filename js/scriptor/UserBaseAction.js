import OOP from "absol/src/HTML5/OOP";
import BaseCommand from "./BaseCommand";
import { inheritCommand } from "../engine/TCommand";
import BaseState from "./BaseState";


/***
 * @extends BaseState
 * @param {BaseCommand} command
 * @constructor
 */
function StateWaitElt(command) {
    BaseState.call(this, command);
    this.checkElt = this.checkElt.bind(this);
    this.countDown = 20;
}


OOP.mixClass(StateWaitElt, BaseState);


StateWaitElt.prototype.onStart = function () {
    this.inv = setInterval(this.checkElt, 100);
};

StateWaitElt.prototype.onStop = function () {
    clearInterval(this.inv);
}

StateWaitElt.prototype.checkElt = function () {
    this.command.elt = this.command.findNode(this.args.eltPath, true);
    this.countDown--;
    if (this.countDown <= 0) {
        this.command.reject(new Error("Could not find " + this.args.eltPath));
        return;
    }
    if (this.command.elt) {
        this.command.assignTarget(this.command.elt);
        this.goto('show_message');
    }
};

/***
 * @extends BaseState
 * @param {BaseCommand} command
 * @constructor
 */
function StateShowMessage(command) {
    BaseState.call(this, command);
}

OOP.mixClass(StateShowMessage, BaseState);


StateShowMessage.prototype.onStart = function () {
    this.command.showDelayToast(this.args.message).then(function () {
        this.goto('user_begin');
    }.bind(this));
}

/***
 * @extends BaseCommand
 * @constructor
 */
function UserBaseAction() {
    BaseCommand.apply(this, arguments);
}

inheritCommand(UserBaseAction, BaseCommand);


/***
 *
 * @return {Promise<void>}
 */
UserBaseAction.prototype.requestUserAction = function () {
    return Promise.resolve();
};

UserBaseAction.prototype.stateClasses.entry = StateWaitElt;
UserBaseAction.prototype.stateClasses.show_message = StateShowMessage;
UserBaseAction.prototype.stateClasses.user_begin = UserBaseAction.prototype.stateClasses.finish;


export default UserBaseAction;