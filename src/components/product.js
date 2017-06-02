/**
 * product
 * 
 * @template <product product="product"></product>
 */

if(typeof ProductJS !== 'object') {
    var ProductJS = {};
}

if(typeof ProductJS.Components !== 'object') {
  ProductJS.Components = {};
}

ProductJS.Components.productCtr = function (element, data) {
  var controller = this;
  controller = ProductJS.Utilities.extend(controller, data)
  controller.$element = $(element);

  console.log("productCtr", controller, data);
}

rivets.components['product'] = {
  // Return the template for the component.
  template: function() {
    return ProductJS.templates.product;
  },

  // Takes the original element and the data that was passed into the
  // component (either from rivets.init or the attributes on the component
  // element in the template).
  initialize: function(el, data) {
    // console.log("init product", el, data);
    if(!data.product) {
      console.error(new Error("product attribute is required"));
    }
    return new ProductJS.Components.productCtr(el, data);
  }
}