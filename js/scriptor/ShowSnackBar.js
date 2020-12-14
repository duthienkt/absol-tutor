import BaseCommand from './BaseCommand';
import OOP from 'absol/src/HTML5/OOP';
import SnackbarElt from 'absol-acomp/js/Snackbar';

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
    env.SNACK_BAR = function (text, until) {
        return new ShowSnackBar(tutor, { text: text, until: until });
    };
};

export default ShowSnackBar;
