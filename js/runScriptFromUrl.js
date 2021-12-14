import Tutor from "./Tutor";

export default function runScriptFromUrl(url, elt) {
    return fetch(url).then(function (res) {
        return res.text();
    }).then(function (text) {
        elt = elt || document.body;
        var tutor = new Tutor(elt, text);
        return tutor.exec();
    });
};