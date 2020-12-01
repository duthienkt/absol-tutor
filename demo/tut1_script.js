/*
function SNACK_BAR(message: string, until:Expression):Void;
function TIME_OUT(millis: number): Trigger; 
function LATEST(...tringer: Trigger): Trigger;
function EARLIEST(...tringer: Trigger): Trigger;
*/

// DECLARE('s1', 'Đây là form đăng nhập');
//
// EXPLAIN('login_form', VAR('s1'),
//     TIME_OUT(2000)
// );
//
// ASSIGN('s1', 'Tên đăng nhập ở đây');
// EXPLAIN('login_user_name', VAR('s1'),
//     TIME_OUT(2000)
// );
// EXPLAIN('login_password', 'Ô  này nhập mật khẩu nè',
//     TIME_OUT(2000)
// );
// EXPLAIN('forgot_password', 'Nếu bạn quên mật khẩu',
//     TIME_OUT(2000)
// );
//
// EXPLAIN(QUERY_SELECTOR('.submitBtn'), 'Nút đăng nhập',
//     TIME_OUT(2000)
// );

USER_CLICK('close_btn', "Nhấn vào đây để thoát");