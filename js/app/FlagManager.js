import '../../css/fragmanager.css';
import Fragment from "absol/src/AppPattern/Fragment";
import {$, _} from "../dom/Core";
import OOP from "absol/src/HTML5/OOP";
import 'absol-form/css/propertyeditor.css';
import OnScreenWindow from "absol-acomp/js/OnsScreenWindow";

/***
 * @extends Fragment
 * @constructor
 */
function FlagManager() {
    Fragment.call(this);
    this.flag = {
        FLAG_MANAGER_STARTUP: false,
        ABSOL_DEBUG: false,
        TUTOR_START_UP: false
    };
    this.readSetting();
}

OOP.mixClass(FlagManager, Fragment);

FlagManager.prototype.STORE_KEY = "ABSOL_FLAG"

FlagManager.prototype.readSetting = function () {
    var flagText = localStorage.getItem(this.STORE_KEY) || '{}';
    var newFlag = {};
    try {
        newFlag = JSON.parse(flagText);
    } catch (err) {

    }
    this.applyFlag(newFlag);
};

FlagManager.prototype.applyFlag = function (newFlag, save) {
    Object.keys(Object.assign({}, this.flag, newFlag)).forEach(function (key) {
        if (key in window) {
            if (key in newFlag) {
                window[key] = newFlag[key];
            }
            else {
                delete window[key];
            }
        }
        else {
            if (key in newFlag) {
                window[key] = newFlag[key];
            }
        }
    });
    this.flag = newFlag;
    if (save) this.saveSetting();
};

FlagManager.prototype.saveSetting = function () {
    localStorage.setItem(this.STORE_KEY, JSON.stringify(this.flag));
};


FlagManager.prototype.createView = function () {

    /****
     * @type {OnScreenWindow}
     */
    this.$view = _({
        tag: 'onscreenwindow',
        class: 'atr-flag-manager',
        style: {
            width: '400px',
            height: '400px',
            top: '20px',
            left: 'calc(100vw - 420px)'
        },
        props: {
            windowTitle: "Flag Manager"
        },
        child: [
            {
                class: ['as-property-editor', 'as-bscroller'],
                style: {
                    width: '100%',
                    height: '100%',
                    overflow: 'auto',

                },
                child: {

                    tag: 'table',
                    style: {
                        width: '100%'
                    },
                    child: [
                        '<thead><tr><td>key</td><td>value</td><td></td></tr></thead>',
                        {
                            tag: 'tbody',
                            child: [
                                {
                                    tag: 'tr',
                                    class: 'atr-add-flag-row',
                                    child: [
                                        {
                                            tag: 'td',
                                            attr: {
                                                colspan: '3'
                                            },
                                            style: {
                                                textAlign: 'center'
                                            },
                                            child: 'span.mdi.mdi-plus'
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            }
        ]
    });
    this.$tbody = $('.as-property-editor tbody', this.$view);
    this.$addRow = $('.atr-add-flag-row', this.$view).on('click', this.addRow.bind(this, '', false));
    for (var key in this.flag) {
        this.addRow(key, this.flag[key]);
    }
    this.$view.$minimizeBtn.addStyle('display', 'none');
    this.$view.$dockBtn.addStyle('display', 'none');
    this.$view.$closeBtn.on('click', this.stop.bind(this));
};

FlagManager.prototype.onResume = function () {
    var view = this.getView();
    if (!view.isDescendantOf(document.body)) {
        document.body.appendChild(view);
    }
};


FlagManager.prototype._updateInputColor = function () {
    var dict = {};
    $('input.atr-flag-name', this.$tbody, function (inputELt) {
        var value = inputELt.value.trim();
        if (value) {
            if (dict[value]) {
                inputELt.addStyle('border-color', 'red');

            }
            else {
                inputELt.removeStyle('border-color');
                dict[value] = true;
            }
        }
        else {
            inputELt.addStyle('border-color', 'rgb(150, 255, 0)');
        }
    });
};

FlagManager.prototype._getFlagFromInput = function () {
    var res = {};
    $('.atr-flag-row', this.$tbody, function (rowElt) {
        var p = rowElt.getFlag && rowElt.getFlag();
        if (p) {
            res[p.key] = p.value;
        }
    });
    return res;
}

FlagManager.prototype.addRow = function (key, value) {
    var thisFM = this;
    var newRow = _({
        tag: 'tr',
        class: 'atr-flag-row',
        child: ['td', 'td', 'td']
    });
    var name = _('input.atr-flag-name').addTo(newRow.childNodes[0]);
    name.value = key || '';
    var value = _({
        tag: 'selectmenu',
        props: {
            items: [
                { text: 'TRUE', value: true },
                { text: 'FALSE', value: false }
            ], value: !!value
        }
    }).addStyle('width', '50px').addTo(newRow.childNodes[1]);
    value.on('change', function () {
        thisFM.applyFlag(thisFM._getFlagFromInput(), true);
    });
    var deleteBtn = _('span.mdi.mdi-trash-can-outline').addTo(newRow.childNodes[2])
        .on('click', function () {
            newRow.remove();
            thisFM.applyFlag(thisFM._getFlagFromInput(), true);
        });
    name.on('change', function () {
        thisFM.applyFlag(thisFM._getFlagFromInput(), true);
    }).on('keyup', function (event) {
        if (event.key === 'Enter') {
            this.blur();
        }
        thisFM._updateInputColor();
    });
    this.$tbody.addChildBefore(newRow, this.$addRow);
    newRow.getFlag = function () {
        if (name.value)
            return { key: name.value, value: value.value }
    };
    this._updateInputColor();
};

FlagManager.prototype.onPause = function () {
    var view = this.getView();
    if (view.isDescendantOf(document.body)) {
        view.remove();
    }
};

export default new FlagManager();