import Broadcast from "absol/src/Network/Broadcast";
import Fragment from "absol/src/AppPattern/Fragment";
import OOP from "absol/src/HTML5/OOP";
import {$, _} from "../dom/Core";
import AbsolBrace from "absol-brace";
import '../../css/spliteditor.css';
import 'absol-form/css/cmdtool.css'

/***
 * @augments Broadcast
 * @augments Fragment
 * @param channel
 * @param id
 * @constructor
 */
function SplitEditor(channel, id) {
    Fragment.call(this);
    Broadcast.call(this, channel, id);
    this.on('request_editor', function () {
        this.emit('response_editor', {});
    }).on('set_script', this.ev_set_script.bind(this))
        .on('playing', this.ev_playinng.bind(this))
        .on('stopped', this.ev_stopped.bind(this))
        .on('request_play_script', this.ev_request_play_script.bind(this))
    ;
}

OOP.mixClass(SplitEditor, Fragment, Broadcast);

SplitEditor.prototype.createView = function () {
    var thisE = this;
    this.$view = _({
        class: "atr-split-editor",
        child: [
            // {
            //     class: 'as-form-cmd-tool',
            //     child: [
            //         {
            //             class: 'as-from-tool-group-buttons',
            //             child: [
            //                 {
            //                     tag: 'button',
            //                     class: ['as-from-tool-button', 'atr-play-btn'],
            //                     child: 'span.mdi.mdi-play'
            //                 }
            //             ]
            //         }
            //     ]
            // },
            'p.atr-split-editor-ace'
        ]
    });
    this.$editor = $('p.atr-split-editor-ace', this.$view);
    this.editor = AbsolBrace.ace.edit(this.$editor);
    this.editor.getSession().setMode("ace/mode/javascript");
    // this.$playBtn = $('.atr-play-btn', this.$view).on('click', this.playScript.bind(this));
};

SplitEditor.prototype.onResume = function () {
    this.emit('response_editor', {});
};


SplitEditor.prototype.ev_set_script = function (ev) {
    this.editor.setValue(ev.data);
};

SplitEditor.prototype.ev_playinng = function (ev) {
    this.$playBtn.disabled = true;
};

SplitEditor.prototype.ev_stopped = function (ev) {
    this.$playBtn.disabled = false;
};

SplitEditor.prototype.ev_request_play_script = function () {
    this.emit('play_script', { script: this.editor.getValue() });
};

export default SplitEditor;

