import AElement from "absol/src/HTML5/AElement";
import {ATTR_ID} from "../Constants";


/***
 *
 * @param {AElement} rootElt
 */
export default function getNodeTree(rootElt) {
    var resTree = [];
    var queue = [{ elt: rootElt, parent: resTree }];
    var cHolder;
    var cParent;
    while (queue.length > 0) {
        cHolder = queue.shift();
        var id = cHolder.elt.getAttribute && cHolder.elt.getAttribute(ATTR_ID);
        if (id) {
            cParent = [];
            cHolder.parent.push({
                elt: cHolder.elt,
                id: id,
                child: cParent
            });
        }
        else {
            cParent = cHolder.parent;
        }
        if (cHolder.elt.childNodes)
            queue.push.apply(queue, Array.prototype.map.call(cHolder.elt.childNodes, function (elt) {
                return {
                    elt: elt,
                    parent: cParent
                }
            }));
    }
    return resTree;
}