import BaseCommand from './BaseCommand';
import OOP from 'absol/src/HTML5/OOP';
import wrapAsync from "../util/wrapAsync";

/***
 * @extends {BaseCommand}
 */
function Assign() {
    BaseCommand.apply(this, arguments);
}

OOP.mixClass(Assign, BaseCommand);

Assign.prototype.exec = function () {
    return wrapAsync(this.args.value).then(function (result) {
        this.tutor.memory.variables[this.args.name] = result;
        return result;
    }.bind(this));
};

Assign.attachEnv = function (tutor, env) {
    env.ASSIGN = function (name, value) {
        return new Assign(tutor, { name: name, value: value });
    };
};

export default Assign;