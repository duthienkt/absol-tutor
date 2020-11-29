import BaseCommand from './BaseCommand';
import OOP from 'absol/src/HTML5/OOP';
import SnackbarElt from 'absol-acomp/js/Snackbar';

/***
 * @extends {BaseCommand}
 */
function SnackBar() {
    BaseCommand.apply(this, arguments);
}

OOP.mixClass(SnackBar, BaseCommand);


SnackBar.prototype.exec = function () {
    SnackbarElt.show(this.args.text);
    return this.args.until.exec();
};

SnackBar.attachEnv = function (tutor, env) {
    env.SNACK_BAR = function (text, until) {
        return new SnackBar(tutor, { text: text, until: until });
    };
};

export default SnackBar;
