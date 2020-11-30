import BaseCommand from './BaseCommand';
import OOP from 'absol/src/HTML5/OOP';

/***
 * @extends {BaseCommand}
 */
function Var() {
    BaseCommand.apply(this, arguments);
}

OOP.mixClass(Var, BaseCommand);

Var.prototype.exec = function () {
    return Promise.resolve(this.tutor.memory.variables[this.args.name]);
};


Var.attachEnv = function (tutor, env) {
    env.VAR = function (name, initValue) {
        return new Var(tutor, { name: name, initValue: initValue });
    };
};

export default Var;
