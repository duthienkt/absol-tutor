export default function findNode(query, root) {
    root = root || document.body;
    query = query || [];
    if (query.trim) {
        query = query.trim().split(/[\s>]+/);
    }
    if (query.length == 0) return root;
    var queue = [root];
    var cNode = [];
    var res = null;
    while (queue.length > 0 && !res) {
        cNode = queue.shift();
        if (cNode.getAttribute && cNode.getAttribute('data-tutor-id') === query[0]) {
            res = findNode(query.slice(1), cNode);
        }
        else {
            queue.push.apply(queue, cNode.childNodes);
        }
    }
    return res;
}
