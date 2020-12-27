/***
 *
 * @param {string} scope
 * @constructor
 */
import {isDomNode} from "absol/src/HTML5/Dom";

function ParamVerifier(scope) {
    this.scope = scope;
}


ParamVerifier.prototype._makeError = function (mess) {
    throw new Error(this.scope + ': ' + mess);
}

/***
 *
 * @param value
 * @return {ParamVerifier}
 */
ParamVerifier.prototype.verifyEltPath = function (value) {
    if (isDomNode(value)) return this;
    if (typeof value === 'string') {
        value = value.trim();
        if (value.length === 0)
            this._makeError("Path empty!");
        else if (value.match(/[^0-9a-zA-Z_.#\-\[\]="\s]/)) {
            this._makeError('Invalid path ' + value + ', contains special character');
        }
    }
    else {
        this._makeError('Invalid path ' + (JSON.stringify(value) || value) + 'special type');
    }
    return this;
};

ParamVerifier.prototype.verifyString = function (text) {
    if (typeof text !== 'string') {
        this._makeError('Invalid string ' + (JSON.stringify(value) || value));
    }
    return this;
};

ParamVerifier.prototype.verifyLiteral = function (value){
    var typeName = typeof value;
    if (typeName ==='object' || typeName === 'function'){

    }
    return this;
}



ParamVerifier.make = function (scope) {
    return new ParamVerifier(scope)
    ''
}