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

  if(!ProductJS.Utilities.isArray(controller.product.b2b_cart)) {
      controller.product.b2b_cart = [];
  }

  controller.contains = function (b2b_cart, productId) {
    var index = -1;
    for (var i = 0; i < b2b_cart.length; i++) {
      if(b2b_cart[i].id === productId) {
        return index = i;
        break;
      }      
    }
    console.log("contains", index);
    return index;
  }


  controller.onClick = function () {
    var $button = $(this);
    
    
    var index = controller.contains(controller.product.b2b_cart, controller.product.variant.id);

    if(index === -1) {
      // if product is not in b2b_cart insert a copy of it to the b2b cart
      controller.product.b2b_cart.push(controller.product.variant);
    } else {
      // if product is already in b2b_cart just increase the quantity
      // controller.product.b2b_cart[index].quantity += controller.product.variant.quantity;
    }

    console.log("onClick", controller.product.b2b_cart);
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