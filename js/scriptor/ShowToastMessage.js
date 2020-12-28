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
    this.$toast = null;
}

OOP.mixClass(ShowToastMessage, BaseCommand);

ShowToastMessage.prototype.exec = function () {
    var thisC = this;
    var title = this.args.title;
    var text = this.args.text;
    var until = this.args.until;
    var variant = this.args.variant;
    var disappearTimeout = this.args.disappearTimeout;
    this.start();
    this.$toast = Toast.make({
        class: ['as-variant-background', 'atr-toast-message'],
        props: {
            htitle: title,
            disappearTimeout: disappearTimeout,
            variant: variant,
            timeText: ''
        },
        child: BaseCommand.prototype.md2HTMLElements.call({ $htmlRender: BaseCommand.prototype.$htmlRender }, text)
    });
    if (typeof until === "function") {
        thisC.preventInteract(true);
        return until().then(function () {
            thisC.$toast = null;
            this.stop();
        });
    }
    else if (until && until.exec && until.depthClone) {
        thisC.preventInteract(true);
        return until.depthClone().exec().then(function () {
            thisC.$toast = null;
            thisC.stop();
        });
    }
    else {
        thisC.$toast = null;
    }
};

ShowToastMessage.prototype.cancel = function () {
    if (this.$toast) {
        this.$toast.remove();
        this.$toast = null;
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

