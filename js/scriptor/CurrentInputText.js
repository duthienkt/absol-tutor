import BaseCommand from './BaseCommand';
import OOP from 'absol/src/HTML5/OOP';
import wrapAsync from "../util/wrapAsync";

/***
 * @extends {BaseCommand}
 */
function CurrentInputText() {
    BaseCommand.apply(this, arguments);
}

OOP.mixClass(CurrentInputText, BaseCommand);

CurrentInputText.prototype.exec = function () {
    return Promise.resolve(this.tutor.memory.share.getCurrentInputText && this.tutor.memory.share.getCurrentInputText())
};

CurrentInputText.attachEnv = function (tutor, env) {
    env.CURRENT_INPUT_TEXT = new CurrentInputText(tutor);
};

export default CurrentInputText;
