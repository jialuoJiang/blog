/**
 *  alert弹出窗
 */

/**
 * 弹窗，用于做出yes or no 的选择
 */

require.config({
    path: {
        "jquery": "jquery-1.8.3"
    }
});
define(["jquery"], function ($) {
    var $alertWrapper = $(".alert-win-wrapper");
    $alertWrapper.css("height", window.outerHeight);
    $alertWrapper.css("width", window.outerWidth);
    var callbackFnSure = '', callbackFnCancel = '';

    var Alert = function (options) {
        var alertPanel = createAlert(options);
        var alertWrap = document.createElement('div');
        alertWrap.innerHTML = alertPanel;
        alertWrap.setAttribute('class', 'alert-win-wrapper');
        document.body.appendChild(alertWrap);
        $alertWrapper.css("display", "block");
        init();
        $(".alert-sure").on('click', function () {
            callbackFnSure && callbackFnSure();
        });
        $(".alert-cancel").on('click', function () {
            var alert=document.getElementsByClassName("alert-win-wrapper")[0];
            document.body.removeChild(alert);
        });
    }

    Alert.prototype.onSure = function (callback) {
        callbackFnSure = callback;
        // console.log(callbackFnSure,'--------callbackFun')
    };
    Alert.prototype.onCancel = function (callback) {

    };

    function createAlert(options) {
        var option = options;
        var alertHtml =
            '<div class="alert-win-wrap-bg">'+'</div>'+
            '<div class="alert-win">' +
            '<div class="alert-title">' + option.title + '</div>' +
            '<div class="alert-content">' + option.content + '</div>' +
            '<div class="alert-select">' +
            '<input type="button" value="知道啦" class="alert-sure">' +
            '</div>' +
            '</div>';
        return alertHtml;
    }

    function init() {
        var $alertWrapper = $(".alert-win-wrapper");
        $alertWrapper.css("height", window.outerHeight);
        $alertWrapper.css("width", window.outerWidth);
    }

    return Alert
});