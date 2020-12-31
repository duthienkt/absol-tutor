import install from "./js/dom/install";
import "absol/src/absol";
import 'absol-acomp/dev';
import 'absol-brace/dev';
import tutor from '.';
import FlagManager from "./js/app/FlagManager";
import Dom from "absol/src/HTML5/Dom";
import TutorMaster from "./js/app/TutorMaster";
import BrowserDetector from "absol/src/Detector/BrowserDetector";

install(absol.coreDom);
absol.tutor = tutor;
absol.FlagManager = FlagManager;
FlagManager.add('FLAG_MANAGER_STARTUP');
FlagManager.add('TUTOR_STARTUP');

Dom.documentReady.then(function () {
    if (window.FLAG_MANAGER_STARTUP && window.self === window.top)
        FlagManager.start();
    if (window.TUTOR_STARTUP && window.self === window.top && !BrowserDetector.isMobile){
        var tutorMaster = new TutorMaster();
        tutorMaster.start();
    }
});
