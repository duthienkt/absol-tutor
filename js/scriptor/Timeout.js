import BaseCommand from './BaseCommand';
import OOP from 'absol/src/HTML5/OOP';
import FunctionKeyManager from "./FunctionNameManager";

/***
 * @extends {BaseCommand}
 */
function Timeout() {
    BaseCommand.apply(this, arguments);
}

OOP.mixClass(Timeout, BaseCommand);

Timeout.attachEnv = function (tutor, env) {
    env.untilTimeout = function (millis) {
        return function () {
            return new Promise(function (resolve) {
                setTimeout(resolve, millis);
            });
        }
    };
};

FunctionKeyManager.addSync('untilTimeout');

export default Timeout;
