/**
 * 登陆和注册页
 */

$(document).ready(function () {
    var clickParent = $(".wrap-top");
    var theEmailItem = $(".useremail");
    var theConfirm = $("#confirm");
    var $successPrompt=$(".success-prompt");
    var $wjmm=$(".wjmm");
    $successPrompt.hide();
    theEmailItem.hide();

    clickParent.click(function (event) {
        if (event && event.target.nodeName == 'LI' && event.target.innerText == '登录') {
            var otherItem = event.target.nextElementSibling || event.target.previousElementSibling;
            otherItem.removeAttribute("class");
            event.target.setAttribute("class", "selected");
            theEmailItem.hide()
            $wjmm.show();
            theConfirm.val("登录");
        }
        if (event && event.target.nodeName == 'LI' && event.target.innerText == '注册') {
            var otherItem = event.target.nextElementSibling || event.target.previousElementSibling;
            otherItem.removeAttribute("class");
            event.target.setAttribute("class", "selected");
            theEmailItem.show();
            $wjmm.hide();
            theConfirm.val("注册");
        }
    });

    theConfirm.click(function (event) {
        var userName = $("#username").val();
        var userPwd = $("#userpwd").val();
        var $nameprompt = $(".nameprompt");
        var $pwdprompt = $('.pwdprompt');
        if (event && event.target && event.target.value == "注册") {
            var userEmail = $("#useremail").val();
            var $emailprompt = $('.emailprompt');
            var data = {
                userName: userName || "",
                userPwd: userPwd || "",
                userEmail: userEmail || ""
            };

            if (data.userName == "") {
                $nameprompt.text("用户名为空");
                $nameprompt.show(500).delay(3000).hide(500);
                return;
            }
            if (data.userPwd == "") {
                $pwdprompt.text("密码为空");
                $pwdprompt.show(500).delay(3000).hide(500);
                return;
            }
            if (data.userEmail == "") {
                $emailprompt.text("邮箱为空");
                $emailprompt.show(500).delay(3000).hide(500);
                return;
            }
            if (data.userEmail != "" && data.userPwd != "" && data.userName != "") {
                $.ajax({
                    data: data,
                    type: "post",
                    url: "/register",
                    dataType: "json",
                    success: function (res) {
                        if (res) {
                            if(res.code && res.code!="0"){
                               $nameprompt.text(res.msg)
                            }
                            if(res.code && res.code=="0"){
                                $successPrompt.text('注册成功,请再次输入账号密码输入');
                                $successPrompt.show();
                                $successPrompt.animate({top:"505px"});
                            }
                        }
                    },
                    error: function (res) {
                        if (res) {
                             location.href='/error';
                        }
                    }
                })
            }
        }
        if (event && event.target && event.target.value == '登录') {
            var data={
                userName:userName||"",
                userPwd:userPwd||""
            }
            if (data.userName == "") {
                $nameprompt.text("用户名为空");
                $nameprompt.show(500).delay(3000).hide(500);
                return;
            }
            if (data.userPwd == "") {
                $pwdprompt.text("密码为空");
                $pwdprompt.show(500).delay(3000).hide(500);
                return;
            }
            if(data.userPwd != "" && data.userName != ""){
                $.ajax({
                    data:data,
                    url:"/login",
                    type:"post",
                    dataType:"json",
                    success:function(res){
                        if(res && res.code=='-1'){
                            $nameprompt.text(res.msg);
                            $nameprompt.show(500).delay(3000).hide(500);
                        }
                        if(res && res.code=='-2'){
                            $pwdprompt.text(res.msg);
                            $pwdprompt.show(500).delay(3000).hide(500);
                        }
                        if(res && res.code=='0'){
                           location.href='/';
                        }
                    },
                    error:function(res){
                      /*  console.log(res)
                        location.href='/error'*/
                    }
                })
            }
        }
    })
});