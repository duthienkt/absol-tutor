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
    env.delay = function (millis) {
        return new Promise(function (resolve) {
            setTimeout(resolve, millis || 1);
        });
    }
};

FunctionKeyManager.addSync('untilTimeout')
    .addSync('delay');

export default Timeout;
