/**
 * product-b2b-button
 * @template 
 */

if(typeof ProductJS !== 'object') {
    var ProductJS = {};
}

if(typeof ProductJS.Components !== 'object') {
  ProductJS.Components = {};
}

ProductJS.Components.productB2bButtonCtr = function (element, data) {
  var controller = this;
  controller.product = data.product;
  controller.$element = $(element);
  controller.showRemove = false;

  if(!ProductJS.Utilities.isArray(controller.product.b2b_cart)) {
      controller.product.b2b_cart = [];
  }

  var onChange = function (event, object) {
    console.log('onChange');
    var index = ProductJS.B2bCart.getItem(controller.product.b2b_cart, controller.product.variant.id);
    if(index > -1 && controller.product.variant.quantity > 0) {
      controller.showRemove = true;
    } else {
      controller.showRemove = false;
    }
  }

  $(document).on('b2bcart.change', onChange);
  $(document).on('product.variant.change', onChange);
  $(document).on('product.variant.quantity.change', onChange);  

  controller.add = function () {
    ProductJS.B2bCart.add(controller.product, controller.product.variant, {
      removeEmpty: false,
      sumQuantity: false,
    });
  }

  controller.remove = function () {
    var $button = $(this);
    var index = ProductJS.B2bCart.getItem(controller.product.b2b_cart, controller.product.variant.id);
    controller.product = ProductJS.B2bCart.remove(controller.product, controller.product.variant, { resetQuantity: true })
  }

  // If prodeuct has no options hide dropdown and add the online on variant to the b2b list
  if(controller.product.variants.length <= 1) {
    controller.add();
  }

}

rivets.components['product-b2b-button'] = {
  template: function() {
    return ProductJS.templates.productB2bButton;
  },

  initialize: function(el, data) {
    if(!data.product) {
      console.error(new Error("product attribute is required"));
    }
    return new ProductJS.Components.productB2bButtonCtr(el, data);
  }
}