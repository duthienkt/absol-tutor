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
    this.$a = this;
    this.$b = $('.atr-punctured-modal-b', this);
    this.$c = $('.atr-punctured-modal-c', this);
    this.$d = $('.atr-punctured-modal-d', this);
}

PuncturedModal.tag = 'PuncturedModal'.toLowerCase();
PuncturedModal.render = function () {
    return _({
        extendEvent: 'positionchange',
        class: ['atr-punctured-modal', 'atr-punctured-modal-a'],
        child: [
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
        ResizeSystem.add(this.$attachhook);
    }
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
    var bound = this.$target.getBoundingClientRect();
    this.addStyle({
        '--punctured-x': bound.left + 'px',
        '--punctured-y': bound.top + 'px',
        '--punctured-width': bound.width + 'px',
        '--punctured-height': bound.height + 'px'
    });

    this.emit('positionchange', { target: this, bound: bound }, this);
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
