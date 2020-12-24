import Context from "absol/src/AppPattern/Context";
import OOP from "absol/src/HTML5/OOP";
import ToolTip from "absol-acomp/js/Tooltip";
import {$, _} from "../dom/Core";
import '../../css/inspector.css';
import {getScreenSize} from "absol/src/HTML5/Dom";

function Inspector() {
    Context.call(this);
    this.ev_mouseenter = this.ev_mouseenter.bind(this);
    this._createBox();
}

OOP.mixClass(Inspector, Context);


Inspector.prototype.onResume = function () {
    document.body.addEventListener('mouseover', this.ev_mouseenter);
};


Inspector.prototype.onPause = function () {
    document.body.removeEventListener('mouseover', this.ev_mouseenter);
    this.$box.remove();
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
    if (target) {
        if (idPath.length > 0) {
            tooltipText.push('id=' + JSON.stringify(idPath[idPath.length - 1]));
            if (idPath.length > 1)
                tooltipText.push('path =' + JSON.stringify(idPath.join(' ')));
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
