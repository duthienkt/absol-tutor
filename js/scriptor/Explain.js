import '../../css/explain.css';
import BaseCommand from './BaseCommand';
import OOP from 'absol/src/HTML5/OOP';
import TutorNameManager from "./TutorNameManager";


/***
 * @extends {BaseCommand}
 */
function Explain() {
    BaseCommand.apply(this, arguments);
}

OOP.mixClass(Explain, BaseCommand);

Explain.prototype.exec = function () {
    this.start();
    var targetElt = this.tutor.findNode(this.args.eltPath);
    var text = this.args.text;
    this.showTooltip(targetElt, text);
    this.preventInteract(true);
    return this.args.until.exec().then(this.stop.bind(this));
};


Explain.attachEnv = function (tutor, env) {
    env.explain = function (eltPath, text, until) {
        return new Explain(tutor, { eltPath: eltPath, text: text, until: until }).exec();
    };
};

TutorNameManager.addAsync('explain');


export default Explain;
