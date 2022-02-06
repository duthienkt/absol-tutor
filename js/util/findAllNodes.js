import {isDomNode} from "absol/src/HTML5/Dom";
import {$} from "../dom/Core";
import TutorPath from "../TutorPath";

export default function findAllNodes(query, root) {
    if (isDomNode(query)) return $(query);
    root = root || document.body;
    if (typeof query != 'string') return null;
    var tutorPath = TutorPath.compile(query);
    var res = tutorPath.findAll(root);
    if (res && res.length>0 ) res.forEach(function (e){
        $(e);
    });
    return res;
}