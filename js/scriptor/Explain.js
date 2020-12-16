import '../../css/explain.css';
import BaseCommand from './BaseCommand';
import OOP from 'absol/src/HTML5/OOP';
import {_} from '../dom/Core';
import ToolTip from "absol-acomp/js/Tooltip";
import wrapAsync from "../util/wrapAsync";
import TutorNameManager from "./TutorNameManager";


/***
 * @extends {BaseCommand}
 */
function Explain() {
    BaseCommand.apply(this, arguments);
}

OOP.mixClass(Explain, BaseCommand);

Explain.prototype.exec = function () {
    return Promise.all([this.asyncGetElt(this.args.eltPath), wrapAsync(this.args.text)]).then(function (result) {
        var targetElt = result[0];
        var text = result[1];
        if (!this.$puncturedModal.isDescendantOf(document.body)) {
            this.$puncturedModal.addTo(document.body);
        }
        if (!this.$transparentModal.isDescendantOf(document.body)) {
            this.$transparentModal.addTo(document.body);
        }

        this.$puncturedModal.removeStyle('visibility', 'hidden');
        var contentElt = _({
            class: 'atr-explain-text',
            child: { text: text }
        });
        var token = ToolTip.show(targetElt, contentElt, 'auto');
        this.$puncturedModal.follow(targetElt);

        return this.args.until.exec().then(function () {
            this.$puncturedModal.addStyle('visibility', 'hidden');
            this.$transparentModal.remove();
            ToolTip.closeTooltip(token);
        }.bind(this));
    }.bind(this));
};


Explain.attachEnv = function (tutor, env) {
    env.explain = function (eltPath, text, until) {
        return new Explain(tutor, { eltPath: eltPath, text: text, until: until }).exec();
    };
};

TutorNameManager.addAsync('explain');


export default Explain;
