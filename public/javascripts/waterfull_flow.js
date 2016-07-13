/**
 * 以瀑布就方式展示
 */

require.config({
    paths: {
        "jquery": "jquery-1.8.3"
    }
});
define(["jquery"],function($){
    //用瀑布流展示article
    var  waterFull=function() {
        var $box = $(".box");
        var $parent = $(".right-content");
        if ($box && $box.length > 0) {
            // box的宽度
            var $boxWidth = $box[0].offsetWidth;
            var cols = 3;// 每列放3篇
            var boxHeight = [];
            for (var i = 0; i < $box.length; i++) {
                if (i < cols) {
                    boxHeight.push($box[i].offsetHeight);
                } else {
                    var minBoxHeight = Math.min.apply(null, boxHeight);
                    var minHeightIndex = getMinHeightIndex(boxHeight, minBoxHeight);
                    $($box[i]).css("position", "absolute");
                    $($box[i]).css("top", +56 + minBoxHeight + "px");
                    $($box[i]).css("left", +0 + $boxWidth * minHeightIndex + "px");
                    boxHeight[minHeightIndex] = $box[i].offsetHeight + boxHeight[minHeightIndex];
                }
            }
            var maxHeight = Math.max.apply(null, boxHeight);
            $parent.css("height", maxHeight + "px");
        }
    };
    function getMinHeightIndex(boxHeight, minBoxHeight) {
        for (var i = 0; i < boxHeight.length; i++) {
            if (boxHeight[i] == minBoxHeight) {
                return i;
            }
        }
    }
    return{
        waterFull:waterFull
    }
});