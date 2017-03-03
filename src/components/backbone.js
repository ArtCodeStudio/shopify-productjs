/**
 * backbone
 * 
 * @template <backbone product="product"></backbone>
 */

if(typeof ProductJS !== 'object') {
    var ProductJS = {};
}

if(typeof ProductJS.Components !== 'object') {
  ProductJS.Components = {};
}

ProductJS.Components.backboneCtr = function (element, data) {
  var controller = this;
  controller.product = data.product;
  controller.$element = $(element);

  console.log("backboneCtr", controller);
}

rivets.components['backbone'] = {
  // Return the template for the component.
  template: function() {
    return ProductJS.templates.backbone;
  },

  // Takes the original element and the data that was passed into the
  // component (either from rivets.init or the attributes on the component
  // element in the template).
  initialize: function(el, data) {
    if(!data.product) {
      console.error(new Error("function attribute is required"));
    }
    return new ProductJS.Components.backboneCtr(el, data);
  }
}