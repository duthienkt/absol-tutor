import BaseCommand from './BaseCommand';
import OOP from 'absol/src/HTML5/OOP';

/***
 * @extends {BaseCommand}
 */
function Timeout() {
    BaseCommand.apply(this, arguments);
}

OOP.mixClass(Timeout, BaseCommand);

Timeout.prototype.exec = function () {
    var millis = this.args.millis || 0;
    return new Promise(function (rs) {
        setTimeout(rs, millis);
    });
};


Timeout.attachEnv = function (tutor, env) {
    env.TIME_OUT = function (millis) {
        return new Timeout(tutor, { millis: millis });
    };

    env.DELAY = function (millis) {
        return new Timeout(tutor, { millis: millis });
    };
};

export default Timeout;
