import Toast from "absol-acomp/js/Toast";
import FunctionKeyManager from "./TutorNameManager";
import BaseCommand from "./BaseCommand";
import OOP from "absol/src/HTML5/OOP";
import TACData from "./TACData";

/***
 * @extends BaseCommand
 * @constructor
 */
function ShowToastMessage() {
    BaseCommand.apply(this, arguments);
    this.$toast = null;
}

OOP.mixClass(ShowToastMessage, BaseCommand);

/***
 *
 * @protected
 */
ShowToastMessage.prototype._avoidOverlay = function () {
    var thisC = this;
    var avoidElt = null;
    this._toastElts.push(this.$toast);
    if (this.args.avoid) {
        if (["se", "sw", "ne", "nw"].indexOf(this.args.avoid) < 0) {
            avoidElt = this.args.avoid && this.tutor.findNode(this.args.avoid, true);
            if (avoidElt)
                thisC.assignTarget(avoidElt);
            setTimeout(function () {
                avoidElt = avoidElt || (thisC.args.avoid && thisC.tutor.findNode(thisC.args.avoid, true));
                if (avoidElt)
                    thisC.assignTarget(avoidElt);
            }, 3)
        }
    }
}

ShowToastMessage.prototype.exec = function () {
    var thisC = this;
    var title = this.args.title;
    var text = this.args.text;
    var until = this.args.until;
    var variant = this.args.variant;
    var disappearTimeout = this.args.disappearTimeout;

    this.start();
    var pos = 'se';
    if (["se", "sw", "ne", "nw"].indexOf(this.args.avoid) >= 0) {
        pos = this.args.avoid;
    }
    this.$toast = Toast.make({
        class: ['as-variant-background', 'atr-toast-message'],
        props: {
            htitle: title,
            disappearTimeout: disappearTimeout,
            variant: variant,
            timeText: ''
        },
        child: BaseCommand.prototype.md2HTMLElements.call({ $htmlRender: BaseCommand.prototype.$htmlRender }, text)
    }, pos);
    this._avoidOverlay();
    if (typeof until === "function") {
        thisC.preventMouse(true);
        thisC.preventKeyBoard(true);
        return until().then(function () {
            thisC.$toast = null;
            this.stop();
        });
    }
    else if (until && until.exec && until.depthClone) {
        thisC.preventMouse(true);
        return until.depthClone().exec().then(function () {
            thisC.$toast = null;
            thisC.stop();
        });
    }
    else {
        thisC.$toast = null;
    }
}
;


ShowToastMessage.attachEnv = function (tutor, env) {
    env.showToastMessage = function (title, text, disappearTimeout, until, variant, avoid) {
        return new ShowToastMessage(tutor, {
            title: title, text: text, disappearTimeout: disappearTimeout, until: until, variant: variant,
            avoid: avoid
        }).exec();
    }
};

FunctionKeyManager.addAsync('showToastMessage');

TACData.define('showToastMessage', {
    type: 'function',
    args: [
        { name: 'title', type: 'string' },
        { name: 'text', type: 'MarkdownString' },
        { name: 'disappearTimeout', type: 'number' },
        { name: 'until', type: 'Trigger' },
        { name: 'variant', type: 'VariantColorNamesMap' },
        { name: 'avoid?', type: '(string|AElement)' }
    ],
    desc: 'VariantColorNamesMap("primary" | "secondary" | "success" | "info" | "warning" | "error" | "danger" | "light" | "dark" | "link" | "note")'
});

export default ShowToastMessage;

