import BaseCommand from './BaseCommand';
import OOP from 'absol/src/HTML5/OOP';
import SnackbarElt from 'absol-acomp/js/Snackbar';
import TutorNameManager from "./TutorNameManager";
import TACData from "./TACData";

/***
 * @extends {BaseCommand}
 */
function ShowSnackBar() {
    BaseCommand.apply(this, arguments);
}

OOP.mixClass(ShowSnackBar, BaseCommand);


ShowSnackBar.prototype.exec = function () {
    this.start();
    this.preventInteract(true);
    SnackbarElt.show(this.args.text);
    if (this.args.until && this.args.until.exec) {
        return this.args.until.depthClone().exec().then(this.stop.bind(this));
    }
    else {
        this.stop();
        return Promise.resolve();
    }
};

ShowSnackBar.attachEnv = function (tutor, env) {
    env.showSnackBar = function (text, until) {
        return new ShowSnackBar(tutor, { text: text, until: until }).exec();
    };
};

TutorNameManager.addAsync('showSnackBar');


TACData.define('showSnackBar', {
    type: 'function',
    args: [
        { name: 'title', type: 'string' },
        { name: 'text', type: 'MarkdownString' },
        { name: 'until', type: 'Trigger' },
    ]
});

export default ShowSnackBar;
