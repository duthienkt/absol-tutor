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
    while (target) {
        var tutorId = JSON.stringify(target.getAttribute('data-tutor-id') || target['data-tutor-id'] || target['data-tutor-id'] || (target.id || undefined));
        var value;
        if (target.classList.contains('absol-selectlist-item')) {
            value = JSON.stringify(target.value);
        }
        var tooltipText = [];
        if (tutorId) tooltipText.push('id=' + tutorId);
        if (value) tooltipText.push('value=' + value);
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
            if (bound.right + textBound.width > screen.width) {
                this.$box.addClass('atr-left');
            }
            else {
                this.$box.removeClass('atr-left');
            }

            break;
        }
        target = target.parentElement;
    }
    if (!target){
        this.$box.remove();
    }

}


export default Inspector;
