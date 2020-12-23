import Toast from "absol-acomp/js/Toast";
import FunctionKeyManager from "./TutorNameManager";
import BaseCommand from "./BaseCommand";
import OOP from "absol/src/HTML5/OOP";

/***
 * @extends BaseCommand
 * @constructor
 */
function ShowToastMessage() {
    BaseCommand.apply(this, arguments);
}

OOP.mixClass(ShowToastMessage, BaseCommand);

ShowToastMessage.prototype.exec = function () {
    var thisC = this;
    var title = this.args.title;
    var text = this.args.text;
    var until = this.args.until;
    var variant = this.args.variant;
    var disappearTimeout = this.args.disappearTimeout;
    Toast.make({
        class: ['as-variant-background', 'atr-toast-message'],
        props: {
            htitle: title,
            disappearTimeout: disappearTimeout,
            variant: variant,
            timeText: ''
        },
        child: BaseCommand.prototype.md2HTMLElements.call({ $htmlRender: BaseCommand.prototype.$htmlRender }, text)
    });
    console.log(until)
    if (typeof until === "function"){
        thisC.preventInteract(true);
        return until().then(function (){
            thisC.preventInteract(false);
        });
    }
    if (until && until.exec && until.depthClone) {
        thisC.preventInteract(true);
        return until.depthClone().exec().then(function (){
            thisC.preventInteract(false);
        });
    }
};

ShowToastMessage.attachEnv = function (tutor, env) {
    env.showToastMessage = function (title, text, disappearTimeout, until, variant) {
        return new ShowToastMessage(tutor, {
            title: title, text: text, disappearTimeout: disappearTimeout, until: until, variant: variant
        }).exec();
    }
};

FunctionKeyManager.addAsync('showToastMessage');


export default ShowToastMessage;

