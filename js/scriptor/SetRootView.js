import FunctionNameManager from "./TutorNameManager";
import findNode from "../util/findNode";


var SetRootView = {};

SetRootView.attachEnv = function (tutor, env) {
    env.setRootView = function (eltPath) {
        tutor.$view = findNode(eltPath) || document.body;
    };
};

FunctionNameManager.addSync('setRootView');

export default SetRootView;