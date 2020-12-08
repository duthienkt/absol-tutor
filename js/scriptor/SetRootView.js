import BaseCommand from './BaseCommand';
import OOP from 'absol/src/HTML5/OOP';

/***
 * @extends {BaseCommand}
 */
function SetRootView() {
    BaseCommand.apply(this, arguments);
}

OOP.mixClass(SetRootView, BaseCommand);

SetRootView.prototype.exec = function () {
    return this.asyncGetElt(this.args.query).then(function (elt) {
        this.tutor.$view = elt || document.body;
    }.bind(this));
};


SetRootView.attachEnv = function (tutor, env) {
    env.SET_ROOT_VIEW = function (millis) {
        return new SetRootView(tutor, { query: millis });
    };
};

export default SetRootView;