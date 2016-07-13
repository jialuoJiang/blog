/**
 * 弹窗，用于做出yes or no 的选择
 */

require.config({
    path: {
        "jquery": "jquery-1.8.3"
    }
});
define(["jquery"], function ($) {
    var $confirmWrapper = $(".confirm-win-wrapper");
    $confirmWrapper.css("height", window.outerHeight);
    $confirmWrapper.css("width", window.outerWidth);
    var callbackFnSure = '', callbackFnCancel = '';

    var Confirm = function (options) {
        var alertPanel = createConfirm(options);
        var alertWrap = document.createElement('div');
        alertWrap.innerHTML = alertPanel;
        alertWrap.setAttribute('class', 'confirm-win-wrapper');
        document.body.appendChild(alertWrap);
        $confirmWrapper.css("display", "block");
        init();
        $(".confirm-sure").on('click', function () {
            callbackFnSure && callbackFnSure();
        });
        $(".confirm-cancel").on('click', function () {
            var alert=document.getElementsByClassName("confirm-win-wrapper")[0];
            document.body.removeChild(alert);
        });
    }

    Confirm.prototype.onSure = function (callback) {
        callbackFnSure = callback;
        // console.log(callbackFnSure,'--------callbackFun')
    };
    Confirm.prototype.onCancel = function (callback) {

    };

    function createConfirm(options) {
        var option = options;
        var alertHtml =
            '<div class="confirm-win-wrap-bg">'+'</div>'+
            '<div class="confirm-win">' +
               '<div class="confirm-title">' + option.title + '</div>' +
               '<div class="confirm-content">' + option.content + '</div>' +
               '<div class="confirm-select">' +
                  '<input type="button" value="确定" class="confirm-sure">' +
                  '<input type="button" value="取消" class="confirm-cancel">' +
               '</div>' +
            '</div>';
        return alertHtml;
    }

    function init() {
        var $confirmWrapper = $(".confirm-win-wrapper");
        $confirmWrapper.css("height", window.outerHeight);
        $confirmWrapper.css("width", window.outerWidth);
    }

    return Confirm
});