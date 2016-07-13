/**
 * 日期格式化工具
 */
require.config({
    paths:{

    }
});
define(function(){
    var dateFormatYYMMDD=function(date){
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
        return theTime
    };

    return{
        dateFormatYYMMDD:dateFormatYYMMDD
    }

});
