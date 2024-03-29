/***
 * Một số param cơ bản
 * @name someFunctionName
 * @param {string|AElement} eltPath - là chuỗi kí tự miêu tả đường dẫn đến element hoặc truyền HTMLElement
 * @param {Timeout|PressAnyKey|ClickAnyWhere|*} until - kiểu Trigger, kích hoạt khi một điều kiện nào đó xảy ra, đối với
 * các hàm có trường này, lệnh sẽ kết thúc sau khi until kích hoạt.
 * Ví dụ về giá trị của until: TIME_OUT(1234), PRESS_ANY_KEY, CLICK_ANY_WHERE
 * @param {string} query - cú pháp gần giống cú pháp JSPath.
 * Ví dụ tìm element add_btb trong thẻ objective_lines, objective_lines phải nằm trong report_KPI_tab và  sẽ là "report_KPI_tab objective_lines add_btb"
 * với các id cách nhau bởi dấu space
 */

/***
 * Danh sách các màu variant hiện có
 * @typedef {"primary" | "secondary" | "success" | "info" | "warning" | "error" | "danger" | "light" | "dark" | "link" | "note"} VariantColorNamesMap
 * @typedef {string} MarkdownString
 */

/***
 * Giải thích về một element
 * @function
 * @name explain
 * @param {string|AElement} eltPath
 * @param {MarkdownString} text
 * @param {BaseCommand} until
 */

/***
 * Hiển thị thông báo dạng SnackBar(thanh thông báo nhỏ, tự biến mất sau thời gian cố định)
 * @function
 * @name showSnackBar
 * @param {string} text
 * @param {(Timeout|PressAnyKey|ClickAnyWhere|*)=} until
 */

/***
 * Hiển thị thông báo dạng Toast, trong thời gian đó mọi thao tác click sẽ bị chặn
 * @function
 * @name showToastMessage
 * @param {string} title
 * @param {MarkdownString} text
 * @param {number=} disappearTimeout - thời gian cho đến khi thông báo báo mất(không phải thời gian chờ kết thúc lệnh)
 * @param {BaseCommand=} until
 * @param {VariantColorNamesMap|string=} variant
 */

/***
 * Trả về Trigger, kích hoạt sau millis(milliseconds)
 * @function
 * @name TIME_OUT
 * @param {number} millis
 * @returns {Timeout}
 */


/***
 * Tìm và trả về trực tiếp HTMLElement, có thể dùng trong trường eltPath
 * lưu ý, nếu không tìm thấy, script sẽ lỗi và chấm dứt
 * hàm bị ảnh hưởng trong tầm vực tìm kiếm được cài đặt bởi setRootView
 * @function
 * @name $
 * @param {string} query
 * @returns {AElement}
 */

/***
 * Tìm toàn bộ các HTMLElement, trả về mảng, nếu không tìm thấy trả về mảng rỗng, không lỗi
 * hàm bị ảnh hưởng trong tầm vực tìm kiếm được cài đặt bởi setRootView
 * @function
 * @name $$
 * @param {string} query
 * @returns {AElement[]}
 */

/***
 * Yêu cầu người dùng click
 * @function
 * @name userClick
 * @param {string|AElement} query
 * @param {MarkdownString} message
 * @param {MarkdownString} wrongMessage
 */

/***
 * Yêu cầu người dùng check vào checkbox, nếu giá trị checked ban đầu đúng thì phải nhấn 2 lần
 * @function
 * @name userCheckbox
 * @param {string|AElement} query
 * @param {boolean} checked
 * @param {MarkdownString} message
 * @param {MarkdownString} wrongMessage
 */

/***
 * Yêu cầu người bật hoặc tắt, nếu giá trị checked ban đầu đúng thì phải nhấn 2 lần
 * @function
 * @name userSwitch
 * @param {string|AElement} query
 * @param {boolean} checked
 * @param {MarkdownString} message
 * @param {MarkdownString} wrongMessage
 */


/***
 * Yêu cầu người dùng nhập vào chuỗi, kiểm tra bởi match,
 * trong trường hợp ban đầu đã đúng điều kiện, chỉ cần có tương tác với input là được
 * @function
 * @name userInputText
 * @param {string} query
 * @param {RegExp|BaseCommand} match - hiện giờ chỉ hỗ trợ biểu thức chính quy
 * @param {MarkdownString} message
 * @param {MarkdownString} wrongMessage
 */


/***
 * Yêu cầu người dùng chọn SelectMenu(danh sách/cây), nếu giá trị ban đầu đã là value, có thể chọn đúng lại giá trị cũ
 * @function
 * @name userSelectMenu
 * @param {string|AElement} eltPath
 * @param {string|number} value
 * @param {MarkdownString} message
 * @param {MarkdownString} wrongMessage
 * @param {MarkdownString} searchMessage - gợi ý khi mở dropdown
 */

/***
 * Yêu cầu người dùng chọn ngày, giá trị có thể giống giá trị ban đầu
 * @function
 * @name userCalendarInput
 * @param {string|AElement} eltPath
 * @param {Date} value - kiểu ngày tháng, có thể dùng chuỗi qua hàm parse, ví dụ datetime.parseDMY("22/12/2020")
 * @param {MarkdownString} message
 * @param {MarkdownString} wrongMessage
 */

/***
 * Yêu cầu người dùng chuyển đến tab có element, nếu đang ở đó, không yêu cầu gì cả và bỏ qua
 * @function
 * @name userSwitchTabIfNeed
 * @param {string|AElement} eltPath
 * @param {MarkdownString} message
 * @param {MarkdownString} wrongMessage
 */


/***
 * Yêu cầu người dùng nhập ngày tháng trong năm
 * @function
 * @name userDateInYearInput
 * @param {string|AElement} eltPath
 * @param {string|{month: number, date: number}} value
 * @param {MarkdownString} message
 * @param {string} wrongMessage
 * @param {string} finishMessage
 */

/***
 * Yêu cầu người dùng nhập file
 * @function
 * @name userFileInputBox
 * @param {string|AElement} eltPath
 * @param {string} message
 * @param {string} wrongMessage
 */


/***
 * Yêu cầu người dùng nhập nhiều file
 * @function
 * @name userFileListInput
 * @param {string|AElement} eltPath
 * @param {string} fileCount
 * @param {string} message
 * @param {string} wrongMessage
 */




 /***
 * Trì hoãn trong một thời gian hoặc cho đến khi trigger được gọi, mọi thao tác chuột bị chặn
 * @function
 * @name delay
 * @param {number|Promise|*} until - trên thực tế, với bất kì giá trị nào, thời gian delay tối thiểu là ~4ms
 */

/***
 * Gán tầm vực tìm kiếm, mặc định tầm vực là toàn bộ trang
 * @function
 * @name setRootView
 * @param {string|AElement} query - truy vấn này chạy trên toàn bộ trang, không ảnh hưởng bởi việc gọi setRootView trước đó
 */

/***
 * @constant {number} EMAIL_REGEX
 *
 */

