import '../../css/blinkmask.css';
import AElement from "absol/src/HTML5/AElement";
import Core, {_, $} from "./Core";
import ResizeSystem from "absol/src/HTML5/ResizeSystem";
import {ClickIco, ScrollBarIco} from "./Icon";
import PuncturedModal from "./PuncturedModal";


/***
 * @extends PuncturedModal
 * @constructor
 */
function BlinkMask() {
    this.$target = null;
    this.$trackScrollParents = [];
    this._handlePositionChange = this._handlePositionChange.bind(this);
    this.$attachhook = $('attachhook', this);
    this.$attachhook.requestUpdateSize = this._handlePositionChange;
    ;
    this._updateTimeout = -1;
}

BlinkMask.tag = 'BlinkMask'.toLowerCase();
BlinkMask.render = function () {
    return _({
        extendEvent: 'positionchange',
        class: ['atr-blink-mask', 'as-anim'],
        child: [
            'attachhook']

    });
};


BlinkMask.prototype.follow = PuncturedModal.prototype.follow;

BlinkMask.prototype.stopTrackPosition = PuncturedModal.prototype.stopTrackPosition;


BlinkMask.prototype._handlePositionChange = function (event) {
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
                left: bound1.left + 'px',
                top: bound1.top + 'px',
                width: bound1.width + 'px',
                height: bound1.height + 'px'
            });
            thisM.emit('positionchange', { target: this, bound: bound }, this);
            bound = bound1;
            thisM._updateTimeout = setTimeout(update, 10);
        }
    }

    update();

};

BlinkMask.prototype.reset = function () {
    this.removeStyle({
        left: null,
        top: null,
        width: null,
        height: null
    });
};

Core.install(BlinkMask);

export default BlinkMask;
