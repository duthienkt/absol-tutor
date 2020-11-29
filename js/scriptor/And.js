import BaseCommand from './BaseCommand';
import OOP from 'absol/src/HTML5/OOP';

/***
 * @extends {BaseCommand}
 */
function And() {
    BaseCommand.apply(this, arguments);
}

OOP.mixClass(And, BaseCommand);

And.prototype.exec = function () {
    var expressions = this.args.expressions;
    return Promise.all(expressions.map(function (exp) {
        return exp.exec();
    })).then(function (result) {
        return result.reduce(function (ac, cr) {
            return ac && cr;
        }, false);
    });
};

And.attachEnv = function (tutor, env) {
    env.AND = function () {
        return new And(tutor, { expressions: Array.prototype.slice.call(arguments) });
    };
};

export default And;
