/**
 * productB2bAdd
 * 
 * @template <product-b2b-add product="product"></product-b2b-add>
 */

if(typeof ProductJS !== 'object') {
    var ProductJS = {};
}

if(typeof ProductJS.Components !== 'object') {
  ProductJS.Components = {};
}

ProductJS.Components.productB2bAddCtr = function (element, data) {
  var controller = this;
  controller.product = data.product;
  controller.$element = $(element);
  controller.addLabel = data.addLabel;
  controller.updateLabel = data.updateLabel;

  // console.log("CartJS.cart", CartJS.cart);

  controller.addListToCart = function () {
    ProductJS.B2bCart.updateCart(controller.product);
  }

  console.log("productB2bAddCtr", controller);
}

rivets.components['product-b2b-add'] = {
  template: function() {
    return ProductJS.templates.productB2bAdd;
  },

  initialize: function(el, data) {
    console.log("init productB2bAddCtr", el, data);
    if(!data.product) {
      console.error(new Error("function attribute is required"));
    }
    return new ProductJS.Components.productB2bAddCtr(el, data);
  }
}