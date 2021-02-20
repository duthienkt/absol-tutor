import Toast from "absol-acomp/js/Toast";
import FunctionKeyManager from "./TutorNameManager";
import BaseCommand from "./BaseCommand";
import OOP from "absol/src/HTML5/OOP";
import TACData from "./TACData";
import ShowToastMessage from "./ShowToastMessage";

/***
 * @extends ShowToastMessage
 * @constructor
 */
function ShowConfirmToast() {
    ShowToastMessage.apply(this, arguments);
    this.$toast = null;
}

OOP.mixClass(ShowConfirmToast, ShowToastMessage);

ShowConfirmToast.prototype.exec = function () {
    var thisC = this;
    var title = this.args.title;
    var text = this.args.text;
    var buttonText = this.args.buttonText;
    var variant = this.args.variant;
    this.start();
    var pos = 'se';
    if (["se", "sw", "ne", "nw"].indexOf(this.args.avoid) >= 0) {
        pos = this.args.avoid;
    }
    var child = BaseCommand.prototype.md2HTMLElements.call({ $htmlRender: BaseCommand.prototype.$htmlRender }, text);
    if (!(child instanceof Array)) child = [child];
    return new Promise(function (resolve, reject) {
        child.push({
            class: 'atr-confirm-toast-footer',
            child: {
                tag: 'flexiconbutton',
                props: { text: buttonText },
                on: {
                    click: function () {
                        thisC.$toast.disappear();
                        thisC._rejectCb = null;
                        resolve();
                    }
                }
            }
        });
        thisC.$toast = Toast.make({
            class: ['as-variant-background', 'atr-toast-message'],
            props: {
                htitle: title,
                disappearTimeout: 0,
                variant: variant,
                timeText: ''
            },
            child: child,
        }, pos);
        thisC.$toast.$closeBtn.on('click', function () {
            thisC._rejectCb = null;
            resolve();
        });
        thisC.preventMouse(true);
        thisC.preventKeyBoard(true);
        thisC._rejectCb = function () {
            thisC._rejectCb = null;
            thisC.$toast.remove();
            reject();
        }
        console.log(thisC.args)
        thisC._avoidOverlay();
    }).then(this.stop.bind(this));
};

ShowConfirmToast.attachEnv = function (tutor, env) {
    env.showConfirmToast = function (title, text, buttonText, variant, avoid) {
        return new ShowConfirmToast(tutor, {
            title: title, text: text, buttonText: buttonText, variant: variant,
            avoid: avoid
        }).exec();
    }
};

FunctionKeyManager.addAsync('showConfirmToast');

TACData.define('showConfirmToast', {
    type: 'function',
    args: [
        { name: 'title', type: 'string' },
        { name: 'text', type: 'MarkdownString' },
        { name: 'buttonText', type: 'string' },
        { name: 'variant', type: 'VariantColorNamesMap' },
        { name: 'avoid?', type: '(string|AElement)' }
    ],
    desc: 'VariantColorNamesMap("primary" | "secondary" | "success" | "info" | "warning" | "error" | "danger" | "light" | "dark" | "link" | "note")'
});

export default ShowConfirmToast;

