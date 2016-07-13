/**
 * 找回密码
 */

require.config({
    paths: {
        "jquery": "jquery-1.8.3"
    }
});
retrieve(require);
function retrieve(require) {
    require(["jquery"], function ($) {
        var $email = $(".retrieve-input");
        var $sure = $(".retrieve-button");
        $email.keydown(function (event) {
            if (event.keyCode == 13 && $email.val() != "") {
                retrievePwd();
            }
        });

        $sure.click(function () {
            if ($email.val() != "") {
                retrievePwd();
            }
        });

        function retrievePwd() {
            var data = {
                email: $email.val() || ""
            };
            $.ajax({
                "url": "/retrievePwd",
                "data": data,
                "type": "post",
                "dataType": "json",
                success: function (res) {
                    console.log(res)
                    if(res && res.code==0){
                         var $mailSent=$(".mail-sent");
                         $mailSent.show(500);
                    }
                },
                error: function () {
                }

            })
        }
    })
}

