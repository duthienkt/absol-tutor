import Fragment from "absol/src/AppPattern/Fragment";
import OOP from "absol/src/HTML5/OOP";
import {$, _} from "../dom/Core";
import AbsolBrace from "absol-brace";
import '../../css/spliteditor.css';
import 'absol-form/css/cmdtool.css';
import "../scriptor/TutorACECompleter";

/***
 * @augments Fragment
 * @param channel
 * @param id
 * @constructor
 */
function SplitEditor(channel, id) {
    Fragment.call(this);
}

OOP.mixClass(SplitEditor, Fragment);

SplitEditor.prototype.createView = function () {
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


SplitEditor.prototype.setValue = function (data) {
    this.editor.setValue(data);
};

SplitEditor.prototype.getValue = function () {
    return this.editor.getValue();
};


export default SplitEditor;

