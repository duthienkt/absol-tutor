import TutorNameManager from "./TutorNameManager";
import TACData from "./TACData";

var Net = {};

Net.properties = {};
Net.properties.downloadText = function (rqi) {
    return fetch(rqi).then(function (res) {
        return res.text();
    });
};

Net.attachEnv = function (tutor, env) {
    Object.assign(env, Net.properties);
};

TutorNameManager.addAsync('downloadText');

TACData.define('downloadText', {
    type: 'function',
    args: [
        { name: 'rqi', type: 'string|RequestInfo' }
    ],
    returns: 'string',
    desc: "Tải file về và trả ra string"
});


export default Net;