import Context from "absol/src/AppPattern/Context";
import OOP from "absol/src/HTML5/OOP";
import ToolTip from "absol-acomp/js/Tooltip";
import {$, _} from "../dom/Core";
import '../../css/inspector.css';
import {getScreenSize} from "absol/src/HTML5/Dom";
import BaseEditor from "absol-form/js/core/BaseEditor";
import OnScreenWindow from "absol-acomp/js/OnsScreenWindow";
import ExpTree from "absol-acomp/js/ExpTree";
import {copyText} from "absol/src/HTML5/Clipboard";
import SnackBar from "absol-acomp/js/Snackbar";


/***
 * @extends BaseEditor
 * @constructor
 */
function Inspector() {
    BaseEditor.call(this);
    this.ev_mouseenter = this.ev_mouseenter.bind(this);
    this._createBox();
    this._createTreeWindow();
}

OOP.mixClass(Inspector, BaseEditor);

Inspector.prototype.CONFIG_STORE_KEY = "TUTOR_INSPECTOR_SETTING";

Inspector.prototype.config = {
    inspectedTreeWindow: {
        x: 1,
        y: 58,
        width: 15,
        height: 40
    }
};

Inspector.prototype.onResume = function () {
    document.body.addEventListener('mouseover', this.ev_mouseenter);
    this.$treeWindow.addTo(document.body);
};


Inspector.prototype.onPause = function () {
    document.body.removeEventListener('mouseover', this.ev_mouseenter);
    this.$box.remove();
    this.$treeWindow.remove();

};


Inspector.prototype._createBox = function () {
    this.$box = _({
        class: 'atr-inspector-rect',
        child: {
            class: 'atr-inspector-rect-text',
            child: { text: '' }
        }
    });
    this.$text = $('.atr-inspector-rect-text', this.$box);
};

Inspector.prototype._createTreeWindow = function () {
    this.$treeWindow = _({
        tag: OnScreenWindow.tag,
        style: {
            zIndex: 1900000000,
            top: this.config.inspectedTreeWindow.y + 'vh',
            left: this.config.inspectedTreeWindow.x + 'vw',
            width: this.config.inspectedTreeWindow.width + 'vw',
            height: this.config.inspectedTreeWindow.height + 'vh'
        },
        props: {
            windowTitle: 'Inspected Tree'
        },
        child: [
            {
                class: 'atr-inspector-tree-ctn',
                child: {
                    tag: ExpTree.tag,
                    props: {
                        name: ':root',
                        icon: 'span.mdi.mdi-source-commit-start-next-local',
                        status: 'open'
                    }
                }
            },
            {
                class: 'atr-inspector-tree-footer',
                child: {
                    text: 'Tip: click to copy path'
                }
            }
        ]
    });
    /***
     *
     * @type {ExpTree}
     */
    this.$tree = $('exptree', this.$treeWindow);
};


Inspector.prototype.tag2Icon = {
    'default': 'span.mdi.mdi-source-commit-start-next-local',
    'selectmenu': 'span.mdi.mdi-menu-open',
    'quickmenutrigger': 'span.mdi.mdi-dots-vertical-circle-outline',
    'checkbox': 'span.mdi.mdi-check-box-outline',
    'text-input': 'span.mdi.mdi-form-textbox'
}
/**
 *
 * @param {Array<string>} path
 * @param {string} tagName
 */
Inspector.prototype.addNode = function (path, tagName) {
    var current = this.$tree;
    var prev = null;
    for (var i = 0; i < path.length; ++i) {
        prev = current;
        prev.status = 'open';
        current = prev.accessByPath([path[i]]);
        if (!current) {
            current = _({
                    tag: ExpTree.tag,
                    extendEvent: 'contextmenu',
                    props: {
                        name: path[i],
                    },
                    on: {
                        press: function (event) {
                            var path = this.getPath();
                            path.shift();
                            copyText(JSON.stringify(path.join(' ')));
                            SnackBar.show('Copy: ' + JSON.stringify(path.join(' ')));
                        }
                    }
                }
            );

            if (i + 1 === path.length) {
                current.icon = this.tag2Icon[tagName] || this.tag2Icon.default;
            }
            else {
                current.icon = this.tag2Icon.default;
            }

            prev.addChild(current);

        }
        if (i + 1 === path.length) {
            if (this.$lastActiveNode) {
                this.$lastActiveNode.active = false;
            }
            this.$lastActiveNode = current;
            this.$lastActiveNode.active = true;
        }
    }
};

Inspector.prototype.ev_mouseenter = function (event) {
    var target = event.target;
    var elt;
    var idPath = [];
    var tooltipText = [];
    while (target) {
        if (target.classList.contains('absol-selectlist-item') && !(target.parentElement && target.parentElement.classList.contains('absol-selectmenu-holder-item'))) {
            elt = target;
            break;
        }
        var tutorId = target.getAttribute('data-tutor-id') || target['data-tutor-id'] || target['data-tutor-id'];
        if (tutorId) {
            if (!elt) elt = target;
            idPath.unshift(tutorId);
        }
        target = target.parentElement;
    }

    target = elt;
    var tagName = 'default';
    if (target) {
        if (idPath.length > 0) {
            tooltipText.push('id=' + JSON.stringify(idPath[idPath.length - 1]));
            if (idPath.length > 1)
                tooltipText.push('path =' + JSON.stringify(idPath.join(' ')));
            if (target.classList.contains('absol-selectmenu')) tagName = 'selectmenu';
            if (target.classList.contains('as-quick-menu-trigger')) tagName = 'quickmenutrigger';
            if (target.classList.contains('absol-checkbox')) tagName = 'checkbox';
            if (target.tagName === 'INPUT' && target.type === 'text') tagName = 'text-input';
            this.addNode(idPath, tagName);
        }
        if (target.classList.contains('absol-selectlist-item') || target.classList.contains('absol-selectmenu')) {
            if (target.value === 0 || target.value)
                tooltipText.push('value=' + target.value);
        }

        if (tooltipText.length > 0) {
            this.$text.firstChild.data = tooltipText.join('  ');
            var bound = target.getBoundingClientRect();
            this.$box.addStyle({
                width: bound.width + 2 + 'px',
                height: bound.height + 2 + 'px',
                left: bound.left - 1 + 'px',
                top: bound.top - 1 + 'px',
            }).addTo(document.body);
            var textBound = this.$text.getBoundingClientRect();

            var screen = getScreenSize();
            if (bound.top < textBound.height) {
                this.$box.addClass('atr-bottom');
            }
            else {
                this.$box.removeClass('atr-bottom');
            }
            if (bound.left + textBound.width > screen.width) {
                this.$box.addClass('atr-left');
            }
            else {
                this.$box.removeClass('atr-left');
            }

        }
    }
    if (!target) {
        this.$box.remove();
    }

}


export default Inspector;
