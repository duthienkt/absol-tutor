import Explain from './Explain';
import Timeout from './Timeout';
import PressAnyKey from './PressAnyKey';
import ClickAnyWhere from './ClickAnyWhere';
import Earliest from './Earliest';
import Latest from './Latest';
import ShowSnackBar from './ShowSnackBar';
import Appear from "./Appear";
import Var from "./Var";
import QuerySelector from "./QuerySelector";
import UserClick from "./UserClick";
import CurrentInputText from "./CurrentInputText";
import UserCheckbox from "./UserCheckbox";
import UserInputText from "./UserInputText";
import SetRootView from "./SetRootView";
import UserSelectMenu from "./UserSelectMenu";
import ShowToastMessage from "./ShowToastMessage";
import UserCalendarInput from "./UserCalendarInput";
import DateTime from "./DateTime";

var commandList = [
    SetRootView,
    Var,
    Explain,
    Timeout,
    DateTime,
    PressAnyKey,
    ClickAnyWhere,
    Earliest,
    Latest,
    ShowSnackBar,
    Appear,
    QuerySelector,
    UserClick,
    UserCheckbox,
    CurrentInputText,
    UserInputText,
    UserSelectMenu,
    ShowToastMessage,
    UserCalendarInput,

];


export default commandList;

