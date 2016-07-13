/**
 * Created by MLS on 16/6/30.
 */
function modify(require){
   require(["jquery"],function($){
       var $modifyConfirm=$(".modify-confirm");

       $modifyConfirm.click(function(event){
           var $modifyNickName= $.trim($(".modify-nickname").val());
           var $modifyEmail= $.trim($(".modify-email").val());
           var $modifyPwd= $.trim($(".modify-pwd").val());
           var $modifyBrief= $.trim($(".modify-brief").val());

            if($modifyNickName==""||$modifyPwd==""||$modifyEmail==""){
            }else{
                var data={
                    modifyNickName:$modifyNickName||"公子小白",
                    modifyPwd:$modifyPwd||"jiangxiaobai",
                    modifyEmail:$modifyEmail||"13552731570@163.com",
                    modifyBrief:$modifyBrief||"公子小白很懒，他什么也没写~~"
                }
                $.ajax({
                    data:data,
                    dataType:"json",
                    type:"post",
                    url:"/modify",
                    success:function(res){
                       if(res&& res.code!="0"){
                           location.href="/error"
                       }
                        if(res && res.code=="0"){
                           location.reload();
                        }
                    },
                    error:function(res){
                        location.href="/error"
                    }
                })
            }
       })
   });
}
require.config({
    paths:{
        jquery:'jquery-1.8.3'
    }
});
modify(require);
