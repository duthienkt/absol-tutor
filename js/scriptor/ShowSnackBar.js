import BaseCommand from './BaseCommand';
import OOP from 'absol/src/HTML5/OOP';
import SnackbarElt from 'absol-acomp/js/Snackbar';
import TutorNameManager from "./TutorNameManager";

/***
 * @extends {BaseCommand}
 */
function ShowSnackBar() {
    BaseCommand.apply(this, arguments);
}

OOP.mixClass(ShowSnackBar, BaseCommand);


ShowSnackBar.prototype.exec = function () {
    SnackbarElt.show(this.args.text);
    return this.args.until.exec();
};

ShowSnackBar.attachEnv = function (tutor, env) {
    env.showSnackBar = function (text, until) {
        return new ShowSnackBar(tutor, { text: text, until: until }).exec();
    };
};

TutorNameManager.addAsync('showSnackBar');

export default ShowSnackBar;
