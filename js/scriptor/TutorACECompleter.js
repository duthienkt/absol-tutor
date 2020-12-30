function TutorACECompleter() {
    this.name = 'absol';
    this.spaceRex = /\s+/;
    this.global = Object.assign({}, window);
    this.global.Math = Math;
    this.global.Date = Date;
    this.structIdent = { identifier: true, 'variable.language': true, 'support.constant': true };
};

TutorACECompleter.prototype._getArgs = function (func) {
    var args = (func.toString().match(/function\s.*?\(([^)]*)\)/) || ['', ''])[1];
    return args.split(',').map(function (arg) {
        return arg.replace(/\/\*.*\*\//, '').trim();
    }).filter(function (arg) {
        return arg;
    });
};

TutorACECompleter.prototype._jsTrackStruct = function (session, pos, prefix) {
    var res = [];
    var track = [];
    var tokenIto = new ace.TokenIterator(session, pos.row, pos.column);
    var firstToken;
    while (true) {
        var token = tokenIto.getCurrentToken();
        if (token == undefined) break;
        if (!this.spaceRex.test(token.value)) {
            if (token.value != '.' && !this.structIdent[token.type]) break;
            if (!firstToken) firstToken = token.value;
            if (this.structIdent[token.type]) {
                track.push(token.value);
            }
        }
        tokenIto.stepBackward();
    }
    if (firstToken != '.' && track.length > 0 && prefix == track[0]) track.shift();

    var currentKey;
    var currentObj = this.global;
    for (var i = track.length - 1; i >= 0; --i) {
        currentKey = track[i];
        currentObj = currentObj[currentKey];
    }
    currentObj && Object.keys(currentObj).forEach(function (key) {
        if (key.startsWith(prefix)) {
            var item = { name: key, value: key, score: 1000000 + track.length * 2, meta: 'browser' };
            if (typeof (currentObj[key]) == 'function') {
                item.type = 'function';
                item.args = this._getArgs(currentObj[key]);
            }
            res.push(item);
        }
    }.bind(this));

    return res;
};

TutorACECompleter.prototype._jsTrackLocalValue = function (session, pos, prefix) {
    var res = [];
    var tokenIto = new ace.TokenIterator(session, pos.row, pos.column);
    var currentToken = tokenIto.getCurrentToken();
    if ((currentToken && currentToken.value === prefix) || pos.column == 0) {
        tokenIto.stepBackward();
        currentToken = tokenIto.getCurrentToken();
    }
    if (currentToken && currentToken.value === '.') return res;
    var lastIdentifier = false;
    while (currentToken) {
        if (currentToken.type === "identifier") {
            lastIdentifier = currentToken.value;
        }
        else if (currentToken.type === 'storage.type') {
            if (lastIdentifier) {
                var item = { value: lastIdentifier, meta: currentToken.value, score: 1000001 };
                res.push(item);
                lastIdentifier = false;
            }
        }
        else if (!this.spaceRex.test(currentToken.value)) {
            lastIdentifier = false;
        }
        tokenIto.stepBackward();
        currentToken = tokenIto.getCurrentToken();
    }

    return res;
};


TutorACECompleter.prototype.getCompletions = function (editor, session, pos, prefix, callback) {
    if (session.getMode().$id !== "ace/mode/javascript") {
        callback(null, []);
        return;
    }

    var completions = [];

    completions.push.apply(completions, this._jsTrackStruct(session, pos, prefix));
    completions.push.apply(completions, this._jsTrackLocalValue(session, pos, prefix));
    completions.sort(function (a, b) {
        if (a.score !== b.score) return a.score - b.score;
        var x = a.value.toUpperCase();
        var y = b.value.toUpperCase();
        return ((x === y) ? 0 : ((x > y) ? 1 : -1));
    });
    callback(null, completions);
};


TutorACECompleter.prototype.getDocTooltip = function (item) {
    if (item.type === "function" && !item.docHTML) {
        item.docHTML = [
            '<div class="ace_line" style="height: 14px;">',
            '<span class="ace_storage ace_type">function</span>',
            '<span class="ace_paren ace_lparen">(</span>']
            .concat([item.args.map(function (arg) {
                return '<span class="ace_identifier">' + arg + '</span>';
            }).join('<span class="ace_punctuation ace_operator">,</span>')])
            .concat(['<span class="ace_paren ace_rparen">)</span>', '</div>']).join("");
    }
};

if (window.ace) {
    var langTools = ace.acequire('ace/ext/language_tools');
    if (langTools)
        langTools.addCompleter(new TutorACECompleter());
}

export default TutorACECompleter;