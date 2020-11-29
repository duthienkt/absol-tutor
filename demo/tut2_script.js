var myDelay = TIME_OUT(1000);//lưu ý, biến myDelay không lưu giữ kết quả, nó lưu giữ biểu thức

SNACK_BAR('Bấm chuột trái để bắt đầu' , CLICK_ANY_WHERE);
for (var i = 3; i >= 1; --i){
    SNACK_BAR(i +'' , myDelay);
}


/**
 nếu viết vậy thì kịch bản sẽ thành thế này
 SNACK_BAR("Đây là thông báo số 0", TIME_OUT(1000));
 SNACK_BAR("Đây là thông báo số 1", TIME_OUT(1000));
 SNACK_BAR("Đây là thông báo số 2", TIME_OUT(1000));
 SNACK_BAR("Đây là thông báo số 3", TIME_OUT(1000));
 SNACK_BAR("Đây là thông báo số 4", TIME_OUT(1000));
 SNACK_BAR("Đây là thông báo số 5", TIME_OUT(1000));
 SNACK_BAR("Đây là thông báo số 6", TIME_OUT(1000));
 SNACK_BAR("Đây là thông báo số 7", TIME_OUT(1000));
 SNACK_BAR("Đây là thông báo số 8", TIME_OUT(1000));
 SNACK_BAR("Đây là thông báo số 9", TIME_OUT(1000));
**/ 