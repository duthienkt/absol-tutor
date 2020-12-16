import BaseCommand from './BaseCommand';
import OOP from 'absol/src/HTML5/OOP';
import FunctionNameManager from "./TutorNameManager";

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
        expressions.forEach(function (expression) {
            expression.cancel && expression.cancel();
        });
        return result;
    });
};

Earliest.attachEnv = function (tutor, env) {
    env.EARLIEST = function () {
        return new Earliest(tutor, { expressions: Array.prototype.slice.call(arguments) });
    };

    env.waitEarliest = function () {
        return new Earliest(tutor, { expressions: Array.prototype.slice.call(arguments) }).exec();
    };
};

FunctionNameManager.addAsync('waitEarliest');

export default Earliest;
