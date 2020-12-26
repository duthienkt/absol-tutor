import '../../css/puncturedmodal.css';
import AElement from "absol/src/HTML5/AElement";
import Core, {_, $} from "./Core";
import ResizeSystem from "absol/src/HTML5/ResizeSystem";
import {ClickIco, ScrollBarIco} from "./Icon";


/***
 * @extends AElement
 * @constructor
 */
function PuncturedModal() {
    this.$target = null;
    this.$trackScrollParents = [];
    this._handlePositionChange = this._handlePositionChange.bind(this);
    this.$attachhook = $('attachhook', this);
    this.$attachhook.requestUpdateSize = this._handlePositionChange;
    this.$a = $('.atr-punctured-modal-a', this);
    this.$b = $('.atr-punctured-modal-b', this);
    this.$c = $('.atr-punctured-modal-c', this);
    this.$d = $('.atr-punctured-modal-d', this);
    this._updateTimeout = -1;
}

PuncturedModal.tag = 'PuncturedModal'.toLowerCase();
PuncturedModal.render = function () {
    return _({
        extendEvent: 'positionchange',
        class: ['atr-punctured-modal', 'atr-punctured-modal-root'],
        child: [
            '.atr-punctured-modal.atr-punctured-modal-a',
            '.atr-punctured-modal.atr-punctured-modal-b',
            '.atr-punctured-modal.atr-punctured-modal-d',
            '.atr-punctured-modal.atr-punctured-modal-c',
            'attachhook']

    });
};

PuncturedModal.prototype.follow = function (targetElt) {
    if (this.$trackScrollParents.length > 0)
        this.stopTrackPosition();
    this.$target = targetElt || null;
    var trackElt = this.$target;
    if (!trackElt) return;
    while (trackElt) {
        if (trackElt.addEventListener)
            trackElt.addEventListener('scroll', this._handlePositionChange, false);
        else
            trackElt.attachEvent('onscroll', this._handlePositionChange, false);

        this.$trackScrollParents.push(trackElt);
        trackElt = trackElt.parentElement;
    }
    if (document.addEventListener) {
        document.addEventListener('scroll', this._handlePositionChange, false);
    }
    else {
        document.attachEvent('onscroll', this._handlePositionChange, false);
    }
    this.$trackScrollParents.push(document);
    if (this.isDescendantOf(document.body)) {
        this._handlePositionChange();
    }
    else {
        this.$attachhook.resetState();
    }
    ResizeSystem.add(this.$attachhook);
};

PuncturedModal.prototype.stopTrackPosition = function () {
    var trackElt;
    for (var i = 0; i < this.$trackScrollParents.length; ++i) {
        trackElt = this.$trackScrollParents[i];
        if (trackElt.removeEventListener)
            trackElt.removeEventListener('scroll', this._handlePositionChange, false);
        else
            trackElt.dettachEvent && trackElt.dettachEvent('onscroll', this._handlePositionChange, false);
    }
    this.$trackScrollParents = [];
}


PuncturedModal.prototype._handlePositionChange = function (event) {
    if (!this.$target) return;
    var thisM = this;
    if (this._updateTimeout > 0)
        clearTimeout(this._updateTimeout);
    var bound = undefined;

    function update() {
        thisM._updateTimeout = -1;
        if (!thisM.$target) return;
        var bound1 = thisM.$target.getBoundingClientRect();
        if (!bound || bound1.left !== bound.left || bound1.width !== bound.width
            || bound1.top !== bound.top || bound1.height !== bound.height) {
            thisM.addStyle({
                '--punctured-x': bound1.left + 'px',
                '--punctured-y': bound1.top + 'px',
                '--punctured-width': bound1.width + 'px',
                '--punctured-height': bound1.height + 'px'
            });
            thisM.emit('positionchange', { target: this, bound: bound }, this);
            bound = bound1;
            thisM._updateTimeout = setTimeout(update, 10);
        }
    }

    update();

};

PuncturedModal.prototype.reset = function () {
    this.removeStyle({
        '--punctured-x': null,
        '--punctured-y': null,
        '--punctured-width': null,
        '--punctured-height': null
    });
};

Core.install(PuncturedModal);

export default PuncturedModal;
