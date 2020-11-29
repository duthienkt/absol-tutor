import BaseCommand from './BaseCommand';
import OOP from 'absol/src/HTML5/OOP';

/***
 * @extends {BaseCommand}
 */
function Or() {
    BaseCommand.apply(this, arguments);
}

OOP.mixClass(Or, BaseCommand);

Or.prototype.exec = function () {
    var expressions = this.args.expressions;
    return Promise.all(expressions.map(function (exp) {
        return exp.exec();
    })).then(function (result) {
        return result.reduce(function (ac, cr) {
            return ac || cr;
        }, false);
    });
};

Or.attachEnv = function (tutor, env) {
    env.OR = function () {
        return new Or(tutor, { expressions: Array.prototype.slice.call(arguments) });
    };
};

export default Or;
