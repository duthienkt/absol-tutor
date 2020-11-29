import BaseCommand from './BaseCommand';
import OOP from 'absol/src/HTML5/OOP';

/***
 * @extends {BaseCommand}
 */
function Earliest() {
    BaseCommand.apply(this, arguments);
}

OOP.mixClass(Earliest, BaseCommand);

Earliest.prototype.exec = function () {
    var expressions = this.args.expressions;
    return Promise.any(expressions.map(function (exp) {
        return exp.exec();
    })).then(function (result) {
        expressions.forEach(function (expession) {
            expession.cancel && expession.cancel();
        });
        return result;
    });
};

Earliest.attachEnv = function (tutor, env) {
    env.EARLIEST = function () {
        return new Earliest(tutor, { expressions: Array.prototype.slice.call(arguments) });
    };
};

export default Earliest;
