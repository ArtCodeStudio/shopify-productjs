/**
 * product-quantity-button
 * @template 
 */

if(typeof ProductJS !== 'object') {
    var ProductJS = {};
}

if(typeof ProductJS.Components !== 'object') {
  ProductJS.Components = {};
}

ProductJS.Components.productQuantityButtonCtr = function (element, data) {
  var controller = this;
  controller.product = data.product;
  controller.$element = $(element);
  controller.$input = controller.$element.find('input');
  controller.decrease = Number(data.decrease);
  controller.increase = Number(data.increase);
  controller.min = data.min;

  // console.log("productQuantityButtonCtr", controller);

  if(typeof controller.start !== 'number') {
    controller.start = window.ProductJS.settings.quantity;
  }

  if(typeof controller.product.variant.quantity !== 'number') {
    controller.product.variant.quantity = Number(controller.start);
  }

  controller.onClickDecrease = function () {
    var $button = $(this);

    if(typeof controller.product.variant.quantity !== 'number') {
      controller.product.variant.quantity = Number(controller.start);
    }

    controller.product.variant.quantity -= controller.decrease;
    if (controller.product.variant.quantity < controller.min) {
        controller.product.variant.quantity = controller.min;
    }
  }

  controller.onClickIncrease = function () {
    var $button = $(this);

    if(typeof controller.product.variant.quantity !== 'number') {
      controller.product.variant.quantity = Number(controller.start);
    }

    controller.product.variant.quantity += controller.increase;
  }

  // Make sure value is always a Number
  controller.onValueChange = function () {
    controller.product.variant.quantity = Number(controller.product.variant.quantity);
  }

}

rivets.components['product-quantity-button'] = {
  // Return the template for the component.
  template: function() {
    return ProductJS.templates.productQuantityButton;
  },

  // Takes the original element and the data that was passed into the
  // component (either from rivets.init or the attributes on the component
  // element in the template).
  initialize: function(el, data) {
    if(!data.product) {
      console.error(new Error("product attribute is required"));
    }
    if(!data.decrease) {
      console.error(new Error("decrease attribute is required"));
    }
    if(!data.increase) {
      console.error(new Error("increase attribute is required"));
    }
    if(typeof data.min !== 'number') {
      console.error(new Error("min attribute is required"));
    }
    return new ProductJS.Components.productQuantityButtonCtr(el, data);
  }
}