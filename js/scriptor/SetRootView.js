import {isDomNode} from "absol/src/HTML5/Dom";
import FunctionNameManager from "./TutorNameManager";
import {$} from "../dom/Core";


var SetRootView = {};

SetRootView.attachEnv = function (tutor, env) {
    env.setRootView = function (eltPath) {
        if (typeof eltPath === 'string') {
            var elt = tutor.findNode(eltPath, true) || $(eltPath);
            tutor.$view = elt || document.body;
        }
        else if (isDomNode(eltPath)) {
            tutor.$view = eltPath;
        }
        else {
            tutor.$view = document.body;
        }
    };
};

FunctionNameManager.addSync('setRootView');

export default SetRootView;