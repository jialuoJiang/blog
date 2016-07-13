/**
 * 页码
 */
require.config({
    path: {
        "jquery": "jquery-1.8.3.js"
    }
});
define(["jquery"], function ($) {
    function paging() {
        var $currentPageNum = $(".selected-page").text() || 1;
        var $prePage = $(".pre-page") || '';
        var $nextPage = $(".next-page") || '';
        var $pageNumber = $(".page-number");
        var pathName = location.pathname || '';
        var searchWhat = location.search || '';
        $pageNumber.click(function (event) {
            var event = event || window.event;
            $currentPageNum = event.target.innerText || 1;
            go2search();
        });

        $nextPage.click(function () {
            // 已经是最后一页
            if ($currentPageNum == $pageNumber.length) {
            } else {
                $currentPageNum = parseInt($currentPageNum) + 1;
                go2search();
            }
        });
        $prePage.click(function () {
            // 已经是第一页
            if ($currentPageNum == 1) {
            } else {
                $currentPageNum = parseInt($currentPageNum) - 1;
                go2search();
            }
        });

        function go2search() {
            if (pathName == '/') {
                location.href = pathName + '?curPage=' + $currentPageNum
            }
            if (pathName == '/query') {
              if(searchWhat.indexOf('&curPage=')>0){
                    searchWhat=searchWhat.split('&curPage=')[0];
                }
                location.href = pathName + searchWhat+'&curPage='+$currentPageNum;
            }
        }
    }
    return {
        paging: paging()
    }
});
