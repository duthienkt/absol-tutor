var index = 0;
var message = "Bạn đã hoàn thành bài hướng dẫn";
var n = 2;
function haha(){
    for (var i = 0; i < n; ++i){
        showToastMessage("Congratulations!", '['+(index++)+']'+message, 3000 , untilTimeout(100), 'success');
        delay(1000);
    }
}


// TOAST_MESSAGE("Congratulations!", "Bạn đã hoàn thành bài hướng dẫn", 10000 ,TIME_OUT(100), 'success');


userSelectMenu($('selecttreemenu'), 4373,
    'Trong menu bộ phận, chọn "Dự Án & KỸ THUẬT"', 'Chọn đúng bộ phận "Dự Án & KỸ THUẬT"',"Có thể tìm kiếm để nhanh hơn");
userCheckbox($('checkboxinput'), true, "Tick vào checkbox để hiện sách nhân viên", "Checkbox này phải được bật");
userInputText($('input[placeholder="type here to search..."]'), /.+/,
    "Nhập đoạn chuỗi vào ô tìm kiếm", "Không được để trống");

var inputelt = $('input[value="có sẵn value"]');
if (showToastMessage("Text input", 'Giá trị là '+ inputelt.placeholder, 3000, untilTimeout(100)));
haha();