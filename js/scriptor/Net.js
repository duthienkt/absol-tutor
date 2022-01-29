import TutorNameManager from "./TutorNameManager";
import TACData from "./TACData";
import TutorEngine from "./TutorEngine";

var Net = {};

Net.properties = {};
Net.properties.downloadText = function (rqi) {
    return fetch(rqi).then(function (res) {
        return res.text();
    });
};

TutorEngine.installFunction('downloadText', Net.properties.downloadText, true);

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