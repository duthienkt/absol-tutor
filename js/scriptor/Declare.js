import BaseCommand from './BaseCommand';
import OOP from 'absol/src/HTML5/OOP';
import wrapAsync from "../util/wrapAsync";

/***
 * @extends {BaseCommand}
 */
function Declare() {
    BaseCommand.apply(this, arguments);
}

OOP.mixClass(Declare, BaseCommand);

Declare.prototype.exec = function () {
    return wrapAsync(this.args.initValue).then(function (result) {
        this.tutor.memory.variables[this.args.name] = result;
        return result;
    }.bind(this));
};


Declare.attachEnv = function (tutor, env) {
    env.DECLARE = function (name, initValue) {
        return new Declare(tutor, { name: name, initValue: initValue });
    };
};

export default Declare;