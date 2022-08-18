import FunctionNameManager from "./TutorNameManager";
import findNode from "../util/findNode";
import TutorEngine from "./TutorEngine";


var SetRootView = {
    prototype: {
        name: 'setRootView',
        type: 'sync'
    }
};

SetRootView.attachEnv = function (tutor, env) {
    env.setRootView = function (eltPath) {
        tutor.$view = findNode(eltPath) || document.body;
    };
};

TutorEngine.installClass(SetRootView);


FunctionNameManager.addSync('setRootView');

export default SetRootView;