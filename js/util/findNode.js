import {isDomNode} from "absol/src/HTML5/Dom";
import {$} from "../dom/Core";
import TutorPath from "../TutorPath";

export default function findNode(query, root) {
    if (isDomNode(query)) return $(query);
    root = root || document.body;
    if (typeof query != 'string') return null;
    var tutorPath = TutorPath.compile(query);
    var res = tutorPath.findFirst(root);
    if (res) $(res);
    return res;
}
