/*
function SNACK_BAR(message: string, until:Expression):Void;
function TIME_OUT(millis: number): Trigger; 
function LATEST(...tringer: Trigger): Trigger;
function EARLIEST(...tringer: Trigger): Trigger;
*/


// SNACK_BAR("Xin chào", EARLIEST(TIME_OUT(1000), TIME_OUT(500)));
// SNACK_BAR("Hôm nay tôi sẽ hướng dẫn cho  bạn", LATEST(TIME_OUT(1000), TIME_OUT(500)));
// SNACK_BAR("Bạn đã sẵn sàng chưa? Nhấn phím bất kì để tiếp tục",  EARLIEST(PRESS_ANY_KEY, CLICK_ANY_WHERE));
// SNACK_BAR("3", TIME_OUT(500));
// SNACK_BAR("2", TIME_OUT(500));
// SNACK_BAR("1", TIME_OUT(500));
// SNACK_BAR("Bắt đầu", TIME_OUT(100));
EXPLAIN('login_form', 'Đây là form đăng nhập',
    TIME_OUT(2000)
);

EXPLAIN('login_user_name', 'Tên đăng nhập ở đây',
    TIME_OUT(2000)
);
EXPLAIN('login_password', 'Ô  này nhập mật khẩu nè',
    TIME_OUT(2000)
);
EXPLAIN('forgot_password', 'Nếu bạn quên mật khẩu',
    TIME_OUT(2000)
);