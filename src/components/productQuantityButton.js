/**
 * product-variant-selectors
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
  this.product = data.product;
  this.$element = $(element);
  this.$input = this.$element.find('input');
  this.decrease = Number(data.decrease);
  this.increase = Number(data.increase);
  if(typeof this.product.quantity !== 'number') {
    this.product.quantity = Number(data.start);
  }

  this.onClickDecrease = function () {
    var $button = $(this);
    controller.product.quantity -= controller.decrease;
    if (controller.product.quantity <= 1) {
        controller.product.quantity = 1;
    }
  }

  this.onClickIncrease = function () {
    var $button = $(this);
    controller.product.quantity += controller.increase;
  }

  // Make sure value is always a Number
  this.onValueChange = function () {
    controller.product.quantity = Number(controller.product.quantity);
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
    if(!data.start) {
      console.error(new Error("start attribute is required"));
    }
    if(!data.decrease) {
      console.error(new Error("decrease attribute is required"));
    }
    if(!data.increase) {
      console.error(new Error("increase attribute is required"));
    }
    return new ProductJS.Components.productQuantityButtonCtr(el, data);
  }
}