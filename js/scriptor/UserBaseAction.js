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
    return this.showDelayToast(this.args.message).then(this.requestUserAction.bind(this))
        .then(this.stop.bind(this));
};

export default UserBaseAction;