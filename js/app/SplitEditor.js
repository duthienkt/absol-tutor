import Broadcast from "absol/src/Network/Broadcast";
import Fragment from "absol/src/AppPattern/Fragment";
import OOP from "absol/src/HTML5/OOP";
import {$, _} from "../dom/Core";
import AbsolBrace from "absol-brace";
import '../../css/spliteditor.css';
import 'absol-form/css/cmdtool.css';
import "../scriptor/TutorACECompleter";

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
        .on('request_script', this.ev_request_script.bind(this))
    ;
}

OOP.mixClass(SplitEditor, Fragment, Broadcast);

SplitEditor.prototype.createView = function () {
    var thisE = this;
    this.$view = _({
        class: "atr-split-editor",
        child: [
            'p.atr-split-editor-ace'
        ]
    });
    this.$editor = $('p.atr-split-editor-ace', this.$view);
    this.editor = AbsolBrace.ace.edit(this.$editor);
    this.editor.getSession().setMode("ace/mode/javascript");
    this.editor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: false
    });
    if (window['TUTOR_LOCAL_SAVE']) {
        this.editor.on('change', this.localSaveDelay.bind(this))
    }
    // this.$playBtn = $('.atr-play-btn', this.$view).on('click', this.playScript.bind(this));
};

SplitEditor.prototype.localSaveDelay = function () {
    var thisSE = this;
    if (this._saveTimeout >= 0) {
        clearTimeout(this._saveTimeout);
    }
    this._saveTimeout = setTimeout(function () {
        var script = thisSE.editor.getValue();
        localStorage.setItem('TUTOR_MASTER_SCRIPT', script);
    }, 1000);

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

SplitEditor.prototype.ev_request_script = function () {
    this.emit('script', { data: this.editor.getValue() });
};


export default SplitEditor;

