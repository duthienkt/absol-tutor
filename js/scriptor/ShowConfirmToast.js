import Toast from "absol-acomp/js/Toast";
import FunctionKeyManager from "./TutorNameManager";
import BaseCommand from "./BaseCommand";
import OOP from "absol/src/HTML5/OOP";
import TACData from "./TACData";
import ShowToastMessage from "./ShowToastMessage";
import { inheritCommand } from "../engine/TCommand";
import TutorEngine from "./TutorEngine";
import BaseState from "./BaseState";


/***
 * @extends BaseState
 * @constructor
 */
function StateShowMessage(){
    BaseState.apply(this, arguments);
}

OOP.mixClass(StateShowMessage, BaseState);

StateShowMessage.prototype.onStart = function (){
    var command = this.command;
    console.log(this)
    var title = this.args.title;
    var text = this.args.text;
    var buttonText = this.args.buttonText;
    var variant = this.args.variant;
    var avoid = this.args.avoid;
    var pos = 'se';

    if (["se", "sw", "ne", "nw"].indexOf(this.args.avoid) >= 0) {
        pos = avoid;
    }
    var self = this;
    var child = BaseCommand.prototype.md2HTMLElements.call({ $htmlRender: BaseCommand.prototype.$htmlRender }, text);
    if (!(child instanceof Array)) child = [child];
    child.push({
        class: 'atr-confirm-toast-footer',
        child: {
            tag: 'flexiconbutton',
            props: { text: buttonText },
            on: {
                click: function () {
                    command.$toast.disappear();
                    self.goto('finish');
                }
            }
        }
    });


    command.$toast = Toast.make({
        class: ['as-variant-background', 'atr-toast-message'],
        props: {
            htitle: title,
            disappearTimeout: 0,
            variant: variant,
            timeText: ''
        },
        child: child,
    }, pos);

    command.$toast.$closeBtn.on('click', function () {
        self.goto('finish');
    });


    command.preventMouse(true);
    command.preventKeyBoard(true);
    command.avoidOverlay();
};


StateShowMessage.prototype.onStop = function (){
    this.command.$toast.disappear();
};


/***
 * @extends ShowToastMessage
 * @constructor
 */
function ShowConfirmToast() {
    ShowToastMessage.apply(this, arguments);
}

inheritCommand(ShowConfirmToast, ShowToastMessage);
ShowConfirmToast.prototype.argNames = ['title', 'text', 'buttonText', 'variant', 'avoid'];

ShowConfirmToast.prototype.name = 'showConfirmToast';

ShowConfirmToast.prototype.stateClasses.entry = StateShowMessage;


TutorEngine.installClass(ShowConfirmToast);

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

