import Toast from "absol-acomp/js/Toast";
import FunctionKeyManager from "./FunctionNameManager";

var ShowToastMessage = {};

ShowToastMessage.attachEnv = function (tutor, env) {
    env.showToastMessage = function (title, text, disappearTimeout, until, variant) {
        Toast.make({
            props: {
                htitle: title,
                message: text,
                disappearTimeout: disappearTimeout,
                variant: variant
            }
        });
        if (typeof until === "function")
            return until();
        if (until.exec) return until.exec();
    }
};

FunctionKeyManager.addAsync('showToastMessage');


export default ShowToastMessage;

