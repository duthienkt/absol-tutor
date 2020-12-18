import Dom from "absol/src/HTML5/Dom";
import install from "absol-acomp/js/dom/install";

var Core = new Dom({});
install(Core);
export var _ = Core._;
export var $ = Core.$;
export var $$ = Core.$$;

export default Core;