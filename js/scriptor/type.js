/***
 * @exports window
 * @global
 * @function
 * @name EXPLAIN
 * @param eltPath
 * @param text
 * @param until
 * @returns {Explain}
 */

/***
 * @exports window
 * @global
 * @function
 * @name SNACK_BAR
 * @param text
 * @param until
 * @returns {ShowSnackBar}
 */

/***
 * @exports window
 * @global
 * @function
 * @name TOAST_MESSAGE
 * @param {string} title
 * @param {string} text
 * @param {number=} disappearTimeout
 * @param {BaseCommand=} until
 * @param {string=} variant
 * @returns {ShowSnackBar}
 */

/***
 * @global
 * @function
 * @name TIME_OUT
 * @param {number} millis
 * @returns {Timeout}
 */

/***
 * @global
 * @function
 * @name DECLARE
 * @param {string} name
 * @param {BaseCommand} initValue
 * @returns {Declare}
 */

/***
 * @global
 * @function
 * @name ASSIGN
 * @param {string} name
 * @param {BaseCommand} value
 * @returns {Assign}
 */

/***
 * @global
 * @function
 * @name VAR
 * @param {string} name
 * @returns {Var}
 */

/***
 * @global
 * @function
 * @name QUERY_SELECTOR
 * @param {string} query
 * @returns {QuerySelector}
 */

/***
 * @global
 * @function
 * @name USER_CLICK
 * @param {string|QuerySelector} query
 * @param {string|BaseCommand} message
 * @returns {UserClick}
 */

/***
 * @global
 * @function
 * @name USER_CHECKBOX
 * @param {string|QuerySelector} query
 * @param {boolean|BaseCommand} checked
 * @param {string|BaseCommand} message
 * @param {string|BaseCommand} wrongMessage
 * @returns {UserCheckbox}
 */



/***
 * @global
 * @function
 * @name USER_INPUT_TEXT
 * @param {string|QuerySelector} query
 * @param {RegExp|BaseCommand} match
 * @param {string|BaseCommand} message
 * @param {string|BaseCommand} wrongMessage
 * @returns {UserCheckbox}
 */


/***
 * @global
 * @var
 * @type {CurrentInputText}
 * @name CURRENT_INPUT_TEXT
 */


/***
 * @global
 * @function
 * @name USER_SELECT_MENU
 * @param {string|QuerySelector} query
 * @param {any|BaseCommand} value
 * @param {string|BaseCommand} message
 * @param {string|BaseCommand} wrongMessage
 * @param {string|BaseCommand} searchMessage
 * @returns {UserSelectMenu}
 */



/***
 * @global
 * @function
 * @name SET_ROOT_VIEW
 * @param {string|QuerySelector} query
 * @returns {SetRootView}
 */


