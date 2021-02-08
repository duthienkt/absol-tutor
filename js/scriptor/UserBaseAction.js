import OOP from "absol/src/HTML5/OOP";
import BaseCommand from "./BaseCommand";

/***
 * @extends BaseCommand
 * @constructor
 */
function UserBaseAction() {
    BaseCommand.apply(this, arguments);
}

OOP.mixClass(UserBaseAction, BaseCommand);
/***
 *
 * @return {Promise<void>}
 */
UserBaseAction.prototype.requestUserAction = function () {
    return Promise.resolve();
};

UserBaseAction.prototype.exec = function () {
    this.start();
    this.assignTarget(this.tutor.findNode(this.args.eltPath, true));
    return this.showDelayToast(this.args.message)
        .then(function (){
            var target = this.tutor.findNode(this.args.eltPath, true);
            this.assignTarget(target);
            setTimeout(function (){
                if (this.state === "RUNNING"){
                    this.assignTarget(target);
                }
            }.bind(this),200)
        }.bind(this))
        .then(this.requestUserAction.bind(this))
        .then(this.stop.bind(this));
};

export default UserBaseAction;