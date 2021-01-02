import OOP from "absol/src/HTML5/OOP";
import Tutor from "../Tutor";
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
import Vec2 from "absol/src/Math/Vec2";
import SplitEditor from "./SplitEditor";

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
    this.inspector = new Inspector();
    this.splitEditor = new SplitEditor();
}

OOP.mixClass(TutorMaster, BaseEditor);

TutorMaster.prototype.CONFIG_STORE_KEY = 'TUTOR_MASTER_SETTING';
TutorMaster.prototype.config = {
    editor: {
        width: 48,
        height: 48,
        x: 2,
        y: 50
    },
    toolbar: {
        x: 0.999,
        y: 0.999
    }
};


TutorMaster.prototype.createView = function () {
    this.$view = _({
        style: {
            '--tutor-master-x': this.config.toolbar.x,
            '--tutor-master-y': this.config.toolbar.y
        },
        class: 'atr-tutor-master',
        child: [
            {
                tag: 'hanger',
                class: 'atr-tutor-master-head',
                child: TutorIco.cloneNode(true),
                on: {
                    dragstart: this.ev_headerDragStart.bind(this),
                    drag: this.ev_headerDrag.bind(this)
                }
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


    /***
     * @type {OnScreenWindow}
     */
    this.$editWindow = _('onscreenwindow').addStyle({
        width: this.config.editor.width + 'vw',
        height: this.config.editor.height + 'vh',
        left: this.config.editor.x + 'vw',
        top: this.config.editor.y + 'vh',
        visibility: 'hidden',
        opacity: '0'
    }).addClass('attr-split-editor-window');
    this.$editWindow.on('relocation', this.ev_editWindowPositionChange.bind(this))
        .on('sizechange', this.ev_editWindowPositionChange.bind(this));
    this.$editWindow.windowTitle = 'Tutor';
    this.$editWindow.addChild(this.splitEditor.getView());
    this.$editWindow.addTo(document.body);
    this.$editWindow.$closeBtn.on('click', this.ev_clickCloseScript.bind(this));
    this.splitEditor.setValue(this.script);
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
    document.body.classList.add('atr-has-tutor-master');
};

TutorMaster.prototype.onPause = function () {
    document.body.classList.remove('atr-has-tutor-master');
};

TutorMaster.prototype.onStart = function () {
    var view = this.getView();
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
    if (!view.parentElement) {
        view.addTo(document.body);
        var bound = view.getBoundingClientRect();
        view.addStyle({
            '--tutor-master-width': bound.width + 'px',
            '--tutor-master-height': bound.height + 'px'
        });
    }
};

TutorMaster.prototype.onDestroy = function () {
    this.$editWindow.remove();
}

TutorMaster.prototype.setScript = function (script) {
    this.script = script || '';
    this.splitEditor.setValue(this.script);
};

TutorMaster.prototype.downloadScript = function () {
    var thisTM = this;
    var blob = new Blob([this.splitEditor.getValue()], { type: 'text/plain' })
    thisTM.$downloadLink.href = URL.createObjectURL(blob);
    thisTM.$downloadLink.click();
};


TutorMaster.prototype.ev_clickEditScript = function () {
    if (this.$editScriptBtn.containsClass('as-active')) {
        this.$editScriptBtn.removeClass('as-active');
        this.$editWindow.addStyle('visibility', 'hidden');
        this.$editWindow.addStyle('opacity', '0');
    }
    else {
        this.$editWindow.removeStyle('visibility');
        this.$editWindow.addStyle('opacity', '1');
        this.$editScriptBtn.addClass('as-active');
    }
};

TutorMaster.prototype.ev_clickCloseScript = function () {
    if (this.$editScriptBtn.containsClass('as-active')) {
        this.$editScriptBtn.removeClass('as-active');
        this.$editWindow.addStyle('visibility', 'hidden');
        this.$editWindow.addStyle('opacity', '0');
    }
};


TutorMaster.prototype.ev_clickPlayBtn = function () {
    this.script = this.splitEditor.getValue();
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
        else if (typeof err === 'number' || err === undefined) {
            if (err === 0) {
                Toast.make({
                    props: {
                        message: "Script finish successfully!",
                        variant: 'success',
                        htitle: "Success",
                        disappearTimeout: 20000
                    }
                });
            }
            else {
                Toast.make({
                    props: {
                        message: 'Script is interrupted!',
                        variant: 'warning',
                        htitle: "",
                        disappearTimeout: 20000
                    }
                });
            }
        }
        this.$playBtn.disabled = false;
        this.$stopBtn.disabled = true;
        if (this.$editScriptBtn.containsClass('as-active')) {
            this.$editWindow.removeStyle('visibility')
                .addStyle('opacity', '1');
        }
        this.tutor = null;
    }.bind(this);
    try {
        this.tutor = new Tutor(document.body, this.script);
        this.$stopBtn.disabled = false;
        return this.tutor.exec().then(onFinish).catch(onFinish)
    } catch (err) {
        this.$playBtn.disabled = false;
        if (this.$editScriptBtn.containsClass('as-active')) {
            this.$editWindow.removeStyle('visibility')
                .addStyle('opacity', '1');
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

TutorMaster.prototype.ev_headerDragStart = function () {
    var bound = this.$view.getBoundingClientRect();
    var screenSize = getScreenSize();
    this._headerDragData = {
        bound: bound,
        screenSize: screenSize,
        initPos: new Vec2(bound.left, bound.top)
    }
};


TutorMaster.prototype.ev_headerDrag = function (event) {
    var d = event.currentPoint.sub(event.startingPoint);
    var newPos = this._headerDragData.initPos.add(d);
    var x = (newPos.x - 2) / (this._headerDragData.screenSize.width - this._headerDragData.bound.width - 4);
    var y = (newPos.y - 2) / (this._headerDragData.screenSize.height - this._headerDragData.bound.height - 4);
    x = Math.max(0, Math.min(1, x));
    y = Math.max(0, Math.min(1, y));
    this.$view.addStyle({
        '--tutor-master-x': x,
        '--tutor-master-y': y
    });
    this.config.toolbar.x = x;
    this.config.toolbar.y = y;
    this.saveConfig();
};

export default TutorMaster;