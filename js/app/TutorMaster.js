import Broadcast from "absol/src/Network/Broadcast";
import {randomIdent} from "absol/src/String/stringGenerate";
import OOP from "absol/src/HTML5/OOP";
import editorText from '../../asset/page/spliteditor.tpl';
import OnScreenWindow from "absol-acomp/js/OnsScreenWindow";
import Tutor from "../Tutor";
import Fragment from "absol/src/AppPattern/Fragment";
import {TutorIco} from "../dom/Icon";
import '../../css/tutormaster.css';
import {openFileDialog} from "absol-acomp/js/utils";
import {_, $} from '../dom/Core';
import FlagManager from "./FlagManager";

var tutorSrc = document.currentScript.src;
FlagManager.add('TUTOR_LOCAL_SAVE', true);

/***
 * @extends Context
 * @constructor
 */
function TutorMaster() {
    Fragment.call(this);
    this.script = (window['TUTOR_LOCAL_SAVE'] && localStorage.getItem('TUTOR_MASTER_SCRIPT')) || '';
    this.broadcast = new Broadcast(randomIdent(24), randomIdent(24));
    this.broadcast.on('response_editor', this.ev_response_editor.bind(this))
        .on('play_script', this.ev_play_script.bind(this));
}

OOP.mixClass(TutorMaster, Fragment);

TutorMaster.prototype.createView = function () {
    this.$view = _({
        class: 'atr-tutor-master',
        child: [
            {
                class: 'atr-tutor-master-head',
                child: TutorIco.cloneNode(true)
            },
            {
                tag: 'button',
                attr: {
                    title: 'Import File Script'
                },
                class: ['as-from-tool-button', 'atr-import-btn'],
                child: 'span.mdi.mdi-file-import'

            },
            {
                tag: 'button',
                attr: {
                    title: 'Edit Script'
                },
                class: ['as-from-tool-button', 'atr-edit-script-btn'],
                child: 'span.mdi.mdi-script-text-outline'
            },
            {
                tag: 'button',
                attr: {
                    title: 'Play'
                },
                class: ['as-from-tool-button', 'atr-play-btn'],
                child: 'span.mdi.mdi-play'
            },
            {
                tag: 'button',
                attr: {
                    title: 'Engine not support stop script'
                },
                class: ['as-from-tool-button', 'atr-stop-btn'],
                child: 'span.mdi.mdi-stop'
            },
            {
                tag: 'button',
                attr: {
                    title: 'Download Script'
                },
                class: ['as-from-tool-button', 'atr-download-btn'],
                child: 'span.mdi.mdi-cloud-download'
            },
            {
                tag: 'a',
                class: 'atr-download-link',
                attr: {
                    download: 'tutor_script.js'
                },
                style: {
                    display: 'none'
                }
            }

        ]
    });

    this.$importBtn = $('.atr-import-btn', this.$view)
        .on('click', this.importFromFileDialog.bind(this));

    this.$editScriptBtn = $('.atr-edit-script-btn', this.$view)
        .on('click', this.ev_clickEditScript.bind(this));

    this.$playBtn = $('.atr-play-btn', this.$view)
        .on('click', this.ev_clickPlayBtn.bind(this));

    this.$stopBtn = $('.atr-stop-btn', this.$view)
    // .on('click');
    this.$stopBtn.disabled = true;

    this.$stopBtn = $('.atr-download-btn', this.$view)
        .on('click', this.downloadScript.bind(this));
    this.$downloadLink = $('a.atr-download-link', this.$view);

    var htmlCode = editorText.replace('"EDITOR_CHANNEL_STRING"', JSON.stringify(this.broadcast.channel))
        .replace('"ABSOL_URL_STRING"', JSON.stringify(tutorSrc));
    var blob = new Blob([htmlCode], { type: 'text/html' });
    var url = URL.createObjectURL(blob);
    this.iframeUrl = url;
    this.$editIframe = _('iframe').addStyle({
        width: '100%',
        height: '100%',
        border: 'none'
    });
    this.$editIframe.src = this.iframeUrl;

    /***
     * @type {OnScreenWindow}
     */
    this.$editWindow = _('onscreenwindow').addStyle({
        width: '600px',
        height: '600px',
        left: 'calc(100vw - 610px)',
        visibility: 'hidden'
    }).addClass('attr-split-editor-window');

    this.$editWindow.windowTitle = 'Tutor';
    this.$editWindow.addChild(this.$editIframe);
    this.$editWindow.addTo(document.body);
    this.$editWindow.$closeBtn.on('click', this.ev_clickCloseScript.bind(this));
};

TutorMaster.prototype.importFromFileDialog = function () {
    var thisTM = this;
    openFileDialog({
        accept: ".js"
    }).then(function (files) {
        if (files.length > 0) {
            var fileReader = new FileReader();
            fileReader.onload = function (event) {
                thisTM.setScript(event.target.result);
            };
            fileReader.readAsText(files[0]);
        }
    });
};

TutorMaster.prototype.onResume = function () {
    if (this._createNewTimeout > 0) {
        clearTimeout(this._createNewTimeout);
    }
    this._createNewTimeout = setTimeout(function () {
        this._createNewTimeout = -1;
        this._createNewSplitEditor();
    }.bind(this), 1000);
    var onResponse = function () {
        this.broadcast.off('response_editor', onResponse);
        if (this._createNewTimeout > 0) {
            clearTimeout(this._createNewTimeout);
            this._createNewTimeout = -1;
        }
    }.bind(this);
    this.broadcast.on('response_editor', onResponse);
    this.broadcast.emit("request_editor", {});
    document.body.classList.add('atr-has-tutor-master');
};

Tutor.prototype.onPause = function (){
    document.body.classList.remove('atr-has-tutor-master');
};

TutorMaster.prototype.onStart = function () {
    var view = this.getView();
    if (!view.parentElement) {
        view.addTo(document.body);
    }
};

TutorMaster.prototype.onDestroy = function () {
    this.$editIframe.src = '';
    this.$editWindow.remove();
}

TutorMaster.prototype._createNewSplitEditor = function () {
    this.$editIframe.src = this.iframeUrl;
};

TutorMaster.prototype.setScript = function (script) {
    this.script = script || '';
    this.broadcast.emit('set_script', { data: this.script });
};

TutorMaster.prototype.downloadScript = function () {
    var thisTM = this;
    this.broadcast.emit('request_script', {});
    this.broadcast.once('script', function (ev) {
        var blob = new Blob([ev.data], { type: 'text/plain' })
        thisTM.$downloadLink.href = URL.createObjectURL(blob);
        thisTM.$downloadLink.click();
    });
};


TutorMaster.prototype.ev_response_editor = function () {
    this.broadcast.emit('set_script', { data: this.script });
};

TutorMaster.prototype.ev_play_script = function (event) {
    this.script = event.script;
    this.$editWindow.addStyle('visibility', 'hidden');
    this.$playBtn.disabled = true;
    var onFinish = function (err) {
        if (err instanceof Error) {
            console.error(err)
        }
        this.$playBtn.disabled = false;
        if (this.$editScriptBtn.containsClass('as-active')) {
            this.$editWindow.removeStyle('visibility');
        }
    }.bind(this);
    this.tutor = new Tutor(document.body, this.script);
    return this.tutor.exec().catch(onFinish).then(onFinish)
};


TutorMaster.prototype.ev_clickEditScript = function () {
    if (this.$editScriptBtn.containsClass('as-active')) {
        this.$editScriptBtn.removeClass('as-active');
        this.$editWindow.addStyle('visibility', 'hidden');
    }
    else {
        this.$editWindow.removeStyle('visibility');
        this.$editScriptBtn.addClass('as-active');
    }
};

TutorMaster.prototype.ev_clickCloseScript = function () {
    if (this.$editScriptBtn.containsClass('as-active')) {
        this.$editScriptBtn.removeClass('as-active');
        this.$editWindow.addStyle('visibility', 'hidden');
    }
};


TutorMaster.prototype.ev_clickPlayBtn = function () {
    this.broadcast.emit('request_play_script', {});
};


export default TutorMaster;