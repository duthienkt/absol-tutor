import Toast from "absol-acomp/js/Toast";
import FunctionKeyManager from "./TutorNameManager";

var ShowToastMessage = {};

ShowToastMessage.attachEnv = function (tutor, env) {
    env.showToastMessage = function (title, text, disappearTimeout, until, variant) {
        Toast.make({
            props: {
                htitle: title,
                message: text,
                disappearTimeout: disappearTimeout,
                variant: variant,
                timeText: ''
            }
        });
        if (typeof until === "function")
            return until();
        if (until && until.exec && until.depthClone) return until.depthClone().exec();
    }
};

FunctionKeyManager.addAsync('showToastMessage');


export default ShowToastMessage;

