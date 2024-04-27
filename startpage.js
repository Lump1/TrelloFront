var dotsCount = 3;
var actualCount = 0;

var maxPos = 1000;
var minPos = -300;

function generateDot() {
    var positionX = Math.floor(Math.random() * (maxPos - minPos) + minPos);
    var positionY = Math.floor(Math.random() * (maxPos - minPos) + minPos);

    var size = Math.floor(Math.random() * (600 - 300) + 300);

    jQuery('<div>', {
        id: actualCount,
        class: 'rounded-shape-base',
        css: {
            width: size,
            height: size,
            top: positionY,
            left: positionX
        }
    }).appendTo('body');

    jQuery('<div>', {
        id: actualCount,
        class: 'rounded-shape-child',
        css: {
            width: size * 0.7,
            height: size * 0.7
        }
    }).appendTo('#' + actualCount + ".rounded-shape-base");
}

$( document ).ready(function() {
    if(actualCount < dotsCount){
        for(; dotsCount > actualCount; actualCount++){
            generateDot();
            setTimeout(function() {}, 300)
        }
    }
});

$(".rounded-shape-base").mouseenter(function(e) {
    $(e.target).addClass('pulse');
    setTimeout(function() {
        $(e.target).remove();
    }, 3000);

    actualCount--;

    if(actualCount < dotsCount){
        generateDot();
        actualCount++;
    }
});