import BaseCommand from './BaseCommand';
import OOP from 'absol/src/HTML5/OOP';

/***
 * @extends {BaseCommand}
 */
function Latest() {
    BaseCommand.apply(this, arguments);
}

OOP.mixClass(Latest, BaseCommand);

Latest.prototype.exec = function () {
    var expressions = this.args.expressions;
    return Promise.all(expressions.map(function (exp) {
        return exp.exec();
    }));
};

Latest.attachEnv = function (tutor, env) {
    env.LATEST = function () {
        return new Latest(tutor, { expressions: Array.prototype.slice.call(arguments) });
    };
};

export default Latest;
