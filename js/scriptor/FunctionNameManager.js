function FunctionNameManager() {
    this.sync = {};
    this.async = {};
    this._cacheSync = null;
    this._cacheAsync = null;
}

FunctionNameManager.prototype.addAsync = function (key) {
    this.async[key] = true;
    this._cacheAsync = null;
    return this;
};

FunctionNameManager.prototype.addSync = function (key) {
    this.sync[key] = true;
    this._cacheSync = null;
    return this;
};


FunctionNameManager.prototype.getAllSync = function () {
    if (!this._cacheSync) this._cacheSync = Object.keys(this.sync);
    ;
    return this._cacheSync;
};

FunctionNameManager.prototype.getAllAsync = function () {
    if (!this._cacheAsync) this._cacheAsync = Object.keys(this.async);
    ;
    return this._cacheAsync;
};

FunctionNameManager.prototype.getAll = function () {
    return this.getAllSync().concat(this.getAllAsync());
};


FunctionNameManager.prototype.spreadObject = function (obj) {
    return this.getAll().map(function (key) {
        return obj[key];
    });
};


export default new FunctionNameManager();