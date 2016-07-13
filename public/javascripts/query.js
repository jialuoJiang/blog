/**
 *  查询结果页
 */

function query(require){
     require(['jquery','paging','waterfull_flow'],function($,paging,waterfull){
         var $searchSomething = $("#search-somthing");
         var $searchTitle = $(".search-title");
         var $searchContent = $(".search-content");
          waterfull.waterFull();
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
     })
}
require.config({
    paths:{
        'jquery':'jquery-1.8.3'
    }
});
query(require);