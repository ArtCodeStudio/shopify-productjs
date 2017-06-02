
/**
 * Custom version of rivents hide binder to make style "display: none !important"
 * Hides the element when the value evaluates to true and shows the element when the value evaluates to false.
 * 
 * ```
 * <section rv-hide="feature.disabled"></section>
 * ```
 */
rivets.binders.hide = function(el, value) {
  var $element = $(el);
  if(value) {
    $element.attr('style', 'display: none !important');
  } else {
    $element.attr('style', '');
  }
};

/**
 * Disable element
 * 
 * ```
 * <section rv-disable="feature.disabled"></section>
 * ```
 */
rivets.binders.disable = function(el, value) {
  var $element = $(el);
  if(value) {
    $element.attr('disabled', 'disabled').prop('disabled', true);
  } else {
    $element.removeAttr('disabled').prop('disabled', false);
  }
};


/**
 * Set style to `display: block !important` of element when the value evaluates to true and remove style of element when the value evaluates to false.
 * 
 * ```
 * <button rv-d-block="user.admin">Remove</button>
 * ```
 */
rivets.binders['d-block'] = function(el, value) {
  var $element = $(el);
  if(value) {
    $element.attr('style', 'display: block !important');
  } else {
    $element.attr('style', '');
  }
};

/**
 * Set style to `display: flex !important` of element when the value evaluates to true and remove style of element when the value evaluates to false.
 * 
 * ```
 * <button rv-d-flex="user.admin">Remove</button>
 * ```
 */
rivets.binders['d-flex'] = function(el, value) {
  var $element = $(el);
  if(value) {
    $element.attr('style', 'display: flex !important');
  } else {
    $element.attr('style', '');
  }
};

/**
 * Set background image to of element.
 * 
 * ```
 * <div class="background-box ratio-16-9" rv-background-image="product.featured_image" rv-title="product.title"></div>
 * ```
 */
rivets.binders['background-image'] = function(el, value) {
  var $element = $(el);
  $element.css('background-image', 'url('+value+')');
};