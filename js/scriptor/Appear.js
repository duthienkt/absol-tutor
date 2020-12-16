import BaseCommand from './BaseCommand';
import OOP from 'absol/src/HTML5/OOP';
import {$} from "../dom/Core";

/***
 * @extends {BaseCommand}
 */
function Appear() {
    BaseCommand.apply(this, arguments);
}

OOP.mixClass(Appear, BaseCommand);

Appear.prototype.exec = function () {
    var tutor = this.tutor;
    var eltPath = this.args.eltPath;
    return new Promise(function (resolve) {
        var elt;
        var timeoutIdx = setTimeout(function () {
            resolve(false);
            clearInterval(intervalIdx);
        }.bind(this));
        var eltBound;
        var intervalIdx = setInterval(function () {
            if (!elt) {
                elt = tutor.findNode(eltPath, true) || $(eltPath);
            }
            if (elt) {
                eltBound = elt.getBoundingClientRect();
                if (eltBound.width > 0 || eltBound.height > 0) {
                    if ($(eltBound).getComputedStyleValue('visibility') !== 'hidden') {
                        clearTimeout(timeoutIdx);
                        clearInterval(intervalIdx);
                        resolve(true);
                    }
                }
            }
        }, 200);
    });
};

Appear.attachEnv = function (tutor, env) {
    env.APPEAR = function (eltPath, timeout) {
        return new Appear(tutor, { eltPath: eltPath, timeout: timeout || 100000 });
    };
};

export default Appear;
