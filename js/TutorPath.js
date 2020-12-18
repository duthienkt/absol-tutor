import JSPath from "absol/src/HTML5/JSPath";

/***
 * @extends JSPath
 * @constructor
 */
function TutorPath() {
    this.match = TutorPath.prototype.match;
    return this;
}

TutorPath.prototype.match = function (elt, query) {
    var res = JSPath.prototype.match.call(this, elt, query);
    res = res || elt.getAttribute('data-tutor-id') === query.tagName;
    res = res || elt.getAttribute('data-tutor-id') === query.id;
    return res;
};

/****
 *
 * @param query
 * @return {TutorPath}
 */
TutorPath.compile = function (query) {
    var jsPath = JSPath.compileJSPath(query);
    jsPath = TutorPath.call(jsPath);
    return jsPath;
};


export default TutorPath;