import Toast from "absol-acomp/js/Toast";
import FunctionKeyManager from "./TutorNameManager";
import BaseCommand from "./BaseCommand";

var ShowToastMessage = {};

ShowToastMessage.attachEnv = function (tutor, env) {
    env.showToastMessage = function (title, text, disappearTimeout, until, variant) {
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
        if (typeof until === "function")
            return until();
        if (until && until.exec && until.depthClone) return until.depthClone().exec();
    }
};

FunctionKeyManager.addAsync('showToastMessage');


export default ShowToastMessage;

