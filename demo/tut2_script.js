var indicator_select = $('indicator_select');
if (indicator_select.value == 702 ){
    indicator_select.value = 1215;
}
var goal_select = $('goal_select');
if (goal_select.value == true){
    goal_select.value = false;
}


userSelectMenu('indicator_select', 702, "Chọn KPI ADG(20-100kg)",
    "Phải chọn đúng KPI  ADG(20-100kg", "Có thể nhập vào đây để tìm kiếm");



userSelectMenu('department_select', 4390, "Chọn bộ phận Chăn nuôi heo",
    "Phải chọn đúng bộ phận Chăn nuôi heo", "Có thể nhập vào đây để tìm kiếm");


userSelectMenu('goal_select', true, "Chọn mục tiêu giao từ trên xuống",
    "Phải chọn đúng mục tiêu giao từ trên xuống");


userClick('view_report_btn', 'Nhấn vào Xem báo cáo');

delay(2000);
