import Toast from "absol-acomp/js/Toast";
import FunctionKeyManager from "./TutorNameManager";
import BaseCommand from "./BaseCommand";
import OOP from "absol/src/HTML5/OOP";
import TACData from "./TACData";
import { inheritCommand } from "../engine/TCommand";
import TutorEngine from "./TutorEngine";
import BaseState from "./BaseState";

/****
 * @extends BaseState
 * @constructor
 */
function StateShowMessage() {
    BaseState.apply(this, arguments);
}

OOP.mixClass(StateShowMessage, BaseState);

StateShowMessage.prototype.onStart = function () {
    var title = this.args.title;
    var text = this.args.text;
    var variant = this.args.variant;
    var avoid = this.args.avoid;
    var disappearTimeout = this.args.disappearTimeout;
    var pos = 'se';
    if (["se", "sw", "ne", "nw", 'sc'].indexOf(avoid) >= 0) {
        pos = avoid;
    }
    this.command.$toast = Toast.make({
        class: ['as-variant-background', 'atr-toast-message'],
        props: {
            htitle: title,
            disappearTimeout: disappearTimeout,
            variant: variant,
            timeText: ''
        },
        child: BaseCommand.prototype.md2HTMLElements.call({ $htmlRender: BaseCommand.prototype.$htmlRender }, text)
    }, pos);
    this.command.avoidOverlay();
    this.goto('wait_until')

};


/****
 * @extends BaseState
 * @constructor
 */
function StateWaitUntil() {
    BaseState.apply(this, arguments);
}

OOP.mixClass(StateWaitUntil, BaseState);

StateWaitUntil.prototype.onStart = function () {
    var until = this.args.until;
    if (!until) until = Promise.resolve();
    if (typeof until === 'number') {
        until = new Promise(function (resolve) {
            setTimeout(resolve, until);
        })
    }
    else if (typeof until === "function") {
        until = until();
    }
    if (until.depthClone) until = until.depthClone();
    if (until.exec) until = until.exec();
    if (until.then) {
        until.then(this.goto.bind(this, 'finish'));
    }
    else {
        this.goto('finish');
    }
};


/***
 * @extends BaseCommand
 * @constructor
 */
function ShowToastMessage() {
    BaseCommand.apply(this, arguments);
    this.$toast = null;
}

inheritCommand(ShowToastMessage, BaseCommand);

ShowToastMessage.prototype.argNames = ['title', 'text', 'disappearTimeout', 'until', 'variant', 'avoid'];

ShowToastMessage.prototype.name = 'showToastMessage';
ShowToastMessage.prototype.stateClasses.entry = StateShowMessage;
ShowToastMessage.prototype.stateClasses.wait_until = StateWaitUntil;

/***
 *
 * @protected
 */
ShowToastMessage.prototype.avoidOverlay = function () {
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

TutorEngine.installClass(ShowToastMessage);

TutorEngine.installClass(ShowToastMessage);

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

