function TutorNameManager() {
    this.sync = {};
    this.async = {};
    this.const = {};
    this._cacheSync = null;
    this._cacheAsync = null;
    this._cacheConst = null;
}

TutorNameManager.prototype.addAsync = function (key) {
    this.async[key] = true;
    this._cacheAsync = null;
    return this;
};

TutorNameManager.prototype.addSync = function (key) {
    this.sync[key] = true;
    this._cacheSync = null;
    return this;
};

TutorNameManager.prototype.addConst = function (key) {
    this.const[key] = true;
    this._cacheConst = null;
    return this;
};


TutorNameManager.prototype.getAllSync = function () {
    if (!this._cacheSync) this._cacheSync = Object.keys(this.sync);
    return this._cacheSync;
};

TutorNameManager.prototype.getAllAsync = function () {
    if (!this._cacheAsync) this._cacheAsync = Object.keys(this.async);
    return this._cacheAsync;
};

TutorNameManager.prototype.getAllConst = function () {
    if (!this._cacheConst) this._cacheConst = Object.keys(this.const);
    return this._cacheConst;
};

TutorNameManager.prototype.getAll = function () {
    return this.getAllSync().concat(this.getAllAsync()).concat(this.getAllConst());
};


TutorNameManager.prototype.spreadObject = function (obj) {
    return this.getAll().map(function (key) {
        return obj[key];
    });
};


export default new TutorNameManager();