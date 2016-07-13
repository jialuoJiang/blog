/**
 * 查看全文
 */
function full(require){
    require(['jquery','confirm'],function($,Confirm){
        var $delete=$(".delete-article");
        var $articleMark=$(event.target).attr("name");
        $delete.click(function(event){
            var confirm=new  Confirm({
                title: "删除文章",
                content: "删除后无法恢复，你确定要删除吗？"
            })
            confirm.onSure(function(){
                var data = {
                    theid: $articleMark
                };
                $.ajax({
                    type: "post",
                    url: "/delete",
                    dataType: "json",
                    data: data,
                    success: function (res) {
                        location.href = "/"; //刷新页面
                    },
                    error: function () {
                        location.href="/error";
                    }
                })
            })
            confirm.onCancel(function(){

            })
/*



            var tips=confirm("删除后无法恢复，你确定要删除吗？");
            var data={
                theid:$articleMark
            };
            if(tips) {
                $.ajax({
                    data:data,
                    type:"post",
                    dataType:"json",
                    url:"/delete",
                    success:function(res){
                        if(res && res.code=='0'){
                            location.href='/'
                        }else{
                            alert('出错了，请联系姜小白')
                        }
                    },
                    error:function(res){
                        alert('出错了，请联系姜小白');
                    }
                })
            }*/
        })
    })
}


require.config({
    paths:{
        'jquery':'jquery-1.8.3'
    }
});
full(require)