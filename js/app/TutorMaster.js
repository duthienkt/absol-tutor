import Broadcast from "absol/src/Network/Broadcast";
import {randomIdent} from "absol/src/String/stringGenerate";
import OOP from "absol/src/HTML5/OOP";
import editorText from '../../asset/page/spliteditor.tpl';
import Tutor from "../Tutor";
import Fragment from "absol/src/AppPattern/Fragment";
import {TutorIco} from "../dom/Icon";
import '../../css/tutormaster.css';
import {openFileDialog} from "absol-acomp/js/utils";
import {_, $} from '../dom/Core';
import FlagManager from "./FlagManager";
import Toast from "absol-acomp/js/Toast";
import Inspector from "./Inspector";
import BaseEditor from "absol-form/js/core/BaseEditor";
import OnScreenWindow from "absol-acomp/js/OnsScreenWindow";
import {getScreenSize} from "absol/src/HTML5/Dom";

var dependentSrc = $('script', false, function (elt) {
    if (elt.src && elt.src.indexOf('absol.dependents.js') >= 0) {
        return true;
    }
});

dependentSrc = dependentSrc && dependentSrc.src;

var tutorSrc = document.currentScript.src;
FlagManager.add('TUTOR_LOCAL_SAVE', true);

/***
 * @extends BaseEditor
 * @constructor
 */
function TutorMaster() {
    BaseEditor.call(this);
    this.script = (window['TUTOR_LOCAL_SAVE'] && localStorage.getItem('TUTOR_MASTER_SCRIPT')) || '';
    this.broadcast = new Broadcast(randomIdent(24), randomIdent(24));
    this.broadcast.on('response_editor', this.ev_response_editor.bind(this))
        .on('play_script', this.ev_play_script.bind(this));
    this.inspector = new Inspector();
}

OOP.mixClass(TutorMaster, BaseEditor);

TutorMaster.prototype.CONFIG_STORE_KEY = 'TUTOR_MASTER_SETTING';
TutorMaster.prototype.config = {
    editor: {
        width: 48,
        height: 48,
        x: 2,
        y: 50
    }
};


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
                tag: 'button',
                attr: {
                    title: 'Inspector'
                },
                class: ['as-from-tool-button', 'atr-inspector-btn'],
                child: 'span.mdi.mdi-auto-fix'
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
        .on('click', this.ev_clickStopBtn.bind(this));
    this.$stopBtn.disabled = true;

    this.$downloadBtn = $('.atr-download-btn', this.$view)
        .on('click', this.downloadScript.bind(this));
    this.$downloadLink = $('a.atr-download-link', this.$view);
    this.$inspectorBtn = $('.atr-inspector-btn', this.$view)
        .on('click', this.ev_clickInspectorBtn.bind(this));

    var htmlCode = editorText.replace('"EDITOR_CHANNEL_STRING"', JSON.stringify(this.broadcast.channel))
        .replace('"ABSOL_DEPENDENT_URL_STRING"', JSON.stringify(dependentSrc))
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
        width: this.config.editor.width + 'vw',
        height: this.config.editor.height + 'vh',
        left: this.config.editor.x + 'vw',
        top: this.config.editor.y + 'vh',
        visibility: 'hidden'
    }).addClass('attr-split-editor-window');
    this.$editWindow.on('relocation', this.ev_editWindowPositionChange.bind(this))
        .on('sizechange', this.ev_editWindowPositionChange.bind(this));
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

TutorMaster.prototype.onPause = function () {
    document.body.classList.remove('atr-has-tutor-master');
};

TutorMaster.prototype.onStart = function () {
    var view = this.getView();
    if (!view.parentElement) {
        view.addTo(document.body);
    }
    if (window.data_module && window.data_module.exportDatabase) {
        this.$databaseBtn = _({
            tag: 'button',
            attr: {
                title: 'ExportDatabase'
            },
            class: ['as-from-tool-button', 'atr-inspector-btn'],
            child: 'span.mdi.mdi-database',
            on: {
                click: window.data_module.exportDatabase.bind(window.data_module)
            }
        }).addTo(this.$view)
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
            Toast.make({
                props: {
                    message: err.message,
                    variant: 'error',
                    htitle: "Tutor Runtime Error!",
                    disappearTimeout: 20000
                }
            });
            console.error(err)
        }
        this.$playBtn.disabled = false;
        this.$stopBtn.disabled = true;
        if (this.$editScriptBtn.containsClass('as-active')) {
            this.$editWindow.removeStyle('visibility');
        }
        this.tutor = null;
    }.bind(this);
    try {
        this.tutor = new Tutor(document.body, this.script);
        this.$stopBtn.disabled = false;
        return this.tutor.exec().catch(onFinish).then(onFinish)
    } catch (err) {
        this.$playBtn.disabled = false;
        if (this.$editScriptBtn.containsClass('as-active')) {
            this.$editWindow.removeStyle('visibility');
        }
        Toast.make({
            props: {
                variant: 'error',
                htitle: 'Script Error!',
                message: err.message,
                disappearTimeout: 20000
            }
        })
        console.error(err);
        this.$stopBtn.disabled = true;
        this.tutor = null;
    }

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

TutorMaster.prototype.ev_clickStopBtn = function () {
    if (this.tutor) {
        this.tutor.stop();
    }
};

TutorMaster.prototype.ev_clickInspectorBtn = function () {
    if (this.$inspectorBtn.containsClass('as-active')) {
        this.$inspectorBtn.removeClass('as-active');
        this.inspector.stop();
    }
    else {
        this.$inspectorBtn.addClass('as-active');
        this.inspector.start();
    }
};

TutorMaster.prototype.ev_editWindowPositionChange = function () {
    var screenSize = getScreenSize();
    var bound = this.$editWindow.getBoundingClientRect();
    this.config.editor.x = bound.left / screenSize.width * 100;
    this.config.editor.y = bound.top / screenSize.height * 100;
    this.config.editor.width = bound.width / screenSize.width * 100;
    this.config.editor.height = bound.height / screenSize.height * 100;
    this.saveConfig();
};


export default TutorMaster;