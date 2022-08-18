// delay(100);
// showToastMessage("Thông báo","Nhấn phím bất kì để tiếp tục",500, EARLIEST(PRESS_ANY_KEY, TIME_OUT(5000), CLICK_ANY_WHERE));
//
// userInputText('input1', 'Tết', 'Nhập vào *Tết*', "Phải nhập chính xác *Tết*");
// userSelectMenu('department_select', 29, 'Chọn item 29', "item *29*");
// userLevel2Menu('menu_root', ['mnu_report','mnu_report_org_emp', 'emp'], 'Ở menu, vào Báo cáo > Báo cáo bộ phận, nhân viên > Nhân viên', "Báo cáo > Báo cáo bộ phận, nhân viên > Nhân viên");
//
//
//
// userLevel2Menu('menu_root', ['mnu_report','mnu_performance', ], 'Ở menu, vào Báo cáo > Hiệu suất', "Báo cáo > Hiệu suất");
// userScrollIfNeed('time_start', 'Scroll tới Date Input', 'Kéo lên', 'Kéo xuống');
// userDateInput('time_start', datetime.parseDateString('16/3/2022', 'dd/MM/yyyy'), "Nhập ngày 16/3/2022", '16/3/2022');

userScrollIfNeed('cd1', 'Scroll tới lịch', 'Kéo lên', 'Kéo xuống');
userCalendarInput('cd1', datetime.parseDateString('16/3/2022', 'dd/MM/yyyy'), "Nhập ngày 16/3/2022", '16/3/2022' )
// return 0;
userScrollIfNeed('quick1', 'Scroll tới Quick Menu', 'Kéo lên', 'Kéo xuống');
userQuickMenu('quick1', 'qck_edit', 'Chọn trong menu 3 chấm > Sửa', 'Chọn "Sửa"')

userScrollIfNeed('switch', 'Scroll tới Switch', 'Kéo lên', 'Kéo xuống');
userSwitch('switch', true, 'Bật nút này lên', "check");

userScrollIfNeed('checkbox', 'Scroll tới Checkbox', 'Kéo lên', 'Kéo xuống');
userCheckbox('cbx-2', true, "Bật checkbox số 2", "Ở đây");
userScrollIfNeed('radio', 'Scroll tới Radio', 'Kéo lên', 'Kéo xuống');
userCheckbox('rdo-2', true, "Bật radio số 2", "Ở đây");

showConfirmToast('Chúc mừng', 'Bạn đã hoàn thành thử nghiệm đầu tiên', 'Xác nhận', 'primary');


