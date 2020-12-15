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
};

FunctionKeyManager.addAsync('showToastMessage');


export default ShowToastMessage;

