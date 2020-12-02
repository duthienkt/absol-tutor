import BaseCommand from './BaseCommand';
import OOP from 'absol/src/HTML5/OOP';
import wrapAsync from "../util/wrapAsync";

/***
 * @extends {BaseCommand}
 */
function Equal() {
    BaseCommand.apply(this, arguments);
}

OOP.mixClass(Equal, BaseCommand);

Equal.prototype.exec = function () {
    return Promise.all(this.args.expressions.map(function (exp) {
        return wrapAsync(exp);
    })).then(function (result) {
        var first = result[0];
        for (var i = 1; i < result.length; ++i) {
            if (result[i] !== first) return false;
        }
        return true;
    });
};

Equal.attachEnv = function (tutor, env) {
    env.EQUAL = function () {
        return new Equal(tutor, { expressions: Array.prototype.slice.call(arguments) });
    };
};

export default Equal;
