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
        return until();
    }

    env.delay = function (millis) {
        return new Promise(function (resolve) {
            setTimeout(resolve, millis || 1);
        });
    }
};

FunctionKeyManager.addAsync('showToastMessage');
FunctionKeyManager.addAsync('delay');


export default ShowToastMessage;

