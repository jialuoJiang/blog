/**
 * 编辑文章
 */

function edit() {
    $('#summernote').summernote();
    var $video = $(".fa-youtube-play");
    $($video.parent()).css("display", "none");
    var $fullscreen = $(".icon-fullscreen");
    $($fullscreen.parent()).css("display", "none");
    var code = $(".note-view");
    code.css("display", "none");
    var help = $(".note-help");
    help.css("display", "none");
    var $delete = $(".delete-article");
    var $theArticleMark = $delete.attr("name");
    var $cancelArticle = $("#cancel-the-article");
    var $publishArticle = $("#publish-the-article");
  /*  $delete.click(function () {
        var tips = confirm("删除后无法恢复，你确定要删除这篇文章吗？");
        if (tips) {
            var data = {
                theid: $theArticleMark
            };
            $.ajax({
                type: "post",
                url: '/delete',
                dataType: "json",
                data: data,
                success: function (res) {
                    var res = res;
                    if (res && res.code == "0") {
                        location.href = "/";
                    } else {
                    }
                },
                error: function () {

                }
            })
        } else {
        }
    });*/

    $publishArticle.click(function () {
        var date = new Date();
        var thePublishTime = dateFormat(date);
        var $articleTile = $("#add-edit-article-title").val();
        var $articleContent = $('#summernote').code();
        var data = {
            time: thePublishTime || "",
            title: $articleTile || "",
            content: $articleContent || "",
            id: $theArticleMark
        };
        if (data.title == "") {
            alert("请输入标题");
            return;
        }
        if (data.content == "") {
            alert("请是输入正文");
            return;
        }
        $.ajax({
            data: data,
            type: "post",
            dataType: "json",
            url: "/edit",
            success: function (res) {
                if (res && res.code == '0') {
                    location.href = '/';
                } else {
                    alert("出错了，请联系姜小白");
                }
            },
            error: function (res) {
                alert("出错了，请联系姜小白");
            }
        })
    });

    function dateFormat(date) {
        var theYear = date.getFullYear();
        var theMonth = date.getMonth() + 1;
        if (theMonth < 10) {
            theMonth = '0' + theMonth;
        }
        var theDate = date.getDate();
        if (theDate < 10) {
            theDate = '0' + theDate;
        }
        var theHour = date.getHours();
        if (theHour < 10) {
            theHour = '0' + theHour;
        }
        var theMinute = date.getMinutes();
        if (theMinute < 10) {
            theMinute = '0' + theMinute;
        }
        var theSecond = date.getSeconds();
        if (theSecond < 10) {
            theSecond = '0' + theSecond
        }
        var theTime = theYear + '-' + theMonth + '-' + theDate + ' ' + theHour + ':' + theMinute + ':' + theSecond;
        return theTime;
    }

    $cancelArticle.click(function () {
        location.href = '/';
    })
}
edit();