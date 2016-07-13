/**
 * 左侧个人简介栏
 */
require.config({
    paths: {
        "jquery": "jquery-1.8.3"
    }
});
define(["jquery",'alert'], function ($,Alert) {
    var editPersonalInfo = function () {
        var $userImage = $(".user-image");
        var $uploadAvatarWrap=$(".upload-avatar-wrap");
        var $uploadAvatar=$("#upload-avatar");
        console.log(Alert)

        // 修改头像
        $userImage.click(function(){
            $userImage.addClass("user-image-float");
            $uploadAvatarWrap.addClass("upload-avatar-wrap-display");
        });

        $uploadAvatar.change(function(){
            var uploadVal=$uploadAvatar.val();
            if(uploadVal.length){
                var imgName=uploadVal;
                var imgFormat=imgName.substring(imgName.lastIndexOf("."),imgName.length).toLowerCase();
                if(imgFormat==".jpg"||imgFormat==".png"){
                    var data=new FormData();
                    data.append("uploadAvatar",$uploadAvatar[0].files[0]);
                    $.ajax({
                        url:"/uploadimg",
                        type:"post",
                        data:data,
                        cache:false,
                        contentType:false,// 不可缺参数，告诉JQuery不要去设置Content-Type请求头
                        processData:false,// 不可缺参数，告诉JQuery不要去处理发送的数据
                        success:function(res){
                            if(res && res.code=="0"){
                                location.href="/";
                            }else{
                                location.href="/error";
                            }
                        },
                        error:function(){
                            location.href="/error";
                        }
                    })
                }else{
                    var alert = new Alert({
                        title: "更换头像",
                        content: "仅支持png或jpg格式的图片！！"
                    });
                    alert.onSure(function () {
                       location.reload();
                    });
                    alert.onCancel(function () {

                    })
                }
            }
        })
    };
    return {
        editPersonalInfo: editPersonalInfo
    }
});
