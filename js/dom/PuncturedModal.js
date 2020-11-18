import '../../css/puncturedmodal.css';
import AElement from "absol/src/HTML5/AElement";
import Core, {_} from "./Core";
import ResizeSystem from "absol/src/HTML5/ResizeSystem";


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
            '.atr-punctured-modal.atr-punctured-modal-c',
            '.atr-punctured-modal.atr-punctured-modal-d',
            'attachhook'
        ]
    });
};

PuncturedModal.prototype.follow = function (targetElt) {
    ResizeSystem.add(this.$attachhook);
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
    this.$a.addStyle({
        width: bound.left + bound.width + 'px',
        height: bound.top + 'px'
    });
    this.$b.addStyle({
        left: bound.left + bound.width + 'px',
        height: bound.top + bound.height + 'px'
    });
    this.$c.addStyle({
        left: bound.left + 'px',
        top: bound.top + bound.height + 'px'
    });
    this.$d.addStyle({
        width: bound.left + 'px',
        top: bound.top + 'px'
    });

    this.emit('positionchange', { target: this, bound: bound }, this);
};

Core.install(PuncturedModal);

export default PuncturedModal;

