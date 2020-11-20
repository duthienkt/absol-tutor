import getNodeTree from "../util/getNodeTree";

export default function runTutorScript(rootElt, script, option){
    rootElt = rootElt || document.body;
    var nodeTree = getNodeTree(rootElt);
    console.log(nodeTree)
}