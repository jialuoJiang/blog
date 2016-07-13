/**
 * 主页
 */

function main(require) {
    require(["jquery", "nav", "waterfull_flow", "confirm", "paging"], function ($, nav, waterfull, Confirm) {
        nav.editPersonalInfo();
        //用瀑布流展示article
        waterfull.waterFull();
        var $searchSomething = $("#search-somthing");
        var $searchTitle = $(".search-title");
        var $searchContent = $(".search-content");

        // 搜索框 回车查询
        $searchSomething.keydown(function (event) {
            var event = event || window.event;
            var $something = $.trim($searchSomething.val());
            if (event.keyCode == 13 && $something == "") {
            }
            // 直接回车时 默认搜索全文
            if (event.keyCode == 13 && $something != "") {
                location.href = "/query?type=fulltext&key=" + $something;
            }
        });

        $searchTitle.click(function (event) {
            var $something = $.trim($searchSomething.val());
            if ($something != "") {
                location.href = "/query?type=title&key=" + $something;
            }
        });

        $searchContent.click(function (event) {
            var $something = $.trim($searchSomething.val());
            if ($something != "") {
                location.href = "/query?type=fulltext&key=" + $something;
            }
        });

        $(".delete-blog").click(function (event) {
            var theId = event.target.name || event.srcElement.name;
            var confirm = new Confirm({
                title: "删除文章",
                content: "删除后无法恢复，你确定要删除吗？"
            })
            confirm.onSure(function () {
                var data = {
                    theid: theId
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
            });
            confirm.onCancel(function () {

            })
        })
    })
}
require.config({
    paths: {
        "jquery": "jquery-1.8.3"
    }
});
main(require);



