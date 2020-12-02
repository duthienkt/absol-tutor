import BaseCommand from './BaseCommand';
import OOP from 'absol/src/HTML5/OOP';
import wrapAsync from "../util/wrapAsync";

/***
 * @extends {BaseCommand}
 */
function Not() {
    BaseCommand.apply(this, arguments);
}

OOP.mixClass(Not, BaseCommand);

Not.prototype.exec = function () {
    return wrapAsync(this.args.value).then(function (value) {
        return !value;
    });
};

Not.attachEnv = function (tutor, env) {
    env.NOT = function (value) {
        return new Not(tutor, { value: value });
    };
};

export default Not;
