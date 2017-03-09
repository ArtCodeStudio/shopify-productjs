// overwrite opriginal rivents binder to make style " !important;"
rivets.binders.hide = function(el, value) {
    var $element = $(el);
    if(value) {
        $element.attr('style', 'display: none !important');
    } else {
        $element.attr('style', '');
    }
};

rivets.binders['background-image'] = function(el, value) {
    var $element = $(el);
    $element.css('background-image', 'url('+value+')');
};