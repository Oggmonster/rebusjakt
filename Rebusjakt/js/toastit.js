//allow you to trigger toast (part of base.min.js) from code
var toastIt = function (msg) {
    var element = $("#toast-content");
    if (!element.length) {
        element = $("<div id='toast-content' data-toggle='toast' data-original-title='" + msg + "'></div>").tooltip({
            animation: false,
            container: '.toast',
            html: true,
            placement: 'bottom',
            template: '<div class="tooltip"><div class="toast-inner tooltip-inner"></div></div>',
            trigger: 'manual'
        });
        $("body").append(element);
    } else {
        element.attr("data-original-title", msg);
    }
    if ($('.toast').hasClass('toast-show')) {
        toastHide(0, element);
    }
    element.trigger("click");
};
