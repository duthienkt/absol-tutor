var TACData = {
    define: function (path, desc) {
        var t = path.split('.');
        var cObject = this;
        var cKey;
        for (var i = 0; i < t.length; ++i) {
            cKey = t[i];
            cObject.properties = cObject.properties || {};

            if (i + 1 === t.length) {
                cObject.properties[cKey] = desc;
            }
            else {
                cObject.properties[cKey] = cObject.properties[cKey] || {};
            }
            cObject = cObject.properties[cKey];
        }
    }
};

TACData.define('Math.max', {
    type: 'function',
    args: [{
        name: '...x',
        type: 'number'
    }],
    returns: 'number',
    desc: "Giá trị lớn nhất"
});


export default TACData;