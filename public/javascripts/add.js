/**
 *  编辑/新增文章
 */
function add() {
    $('#summernote').summernote();
    var $video = $(".fa-youtube-play");
    $($video.parent()).css("display", "none");
    var $fullscreen = $(".icon-fullscreen");
    $($fullscreen.parent()).css("display", "none");
    var code=$(".note-view");
    code.css("display","none");
    var help=$(".note-help");
    help.css("display","none");


    var $cancelArticle = $("#cancel-the-article");
    var $publishArticle = $("#publish-the-article");
    var date = new Date();
    var thePublishTime = dateFormat(date);
    $publishArticle.click(function () {
        var $articleTile = $("#add-edit-article-title").val();
        var $articleContent = $('#summernote').code();
        /*var isvaild = /(<([^>]+)>)/ig.test($articleContent);
         var regExp = /(<([^>]+)>)/ig;
         $articleContent.replace(regExp, " ");*/
        var data = {
            articleTitle: $articleTile || "",
            articleContent: $articleContent || "",
            articlePubTime: thePublishTime || "",
            articleAuthor: "姜小白"
        };
        if (data.articleTitle == "") {
            alert('标题不能为空');
            return;
        }
        if (data.articleContent == "") {
            alert('正文不能为空');
            return;
        }
        $.ajax({
            type: "post",
            data: data,
            url: '/add',
            dataType: "json",
            success: function (res) {
                if (res && res.code == '0') {
                    location.href = '/';
                }
                if (res && res.code == '-1') {
                    alert('发布文章出错，你可以联系姜小白')
                }
            },
            error: function (res) {
                alert('出错了！！！')
            }
        })
    })
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
}

add();