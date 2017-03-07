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
  controller.label = data.label;

  console.log("CartJS.cart", CartJS.cart);

  controller.addListToCart = function () {
    var $button = $(this);
    console.log("onClick", $button);
    for (var i = 0; i < controller.product.b2b_cart.length; i++) {
        var variant = controller.product.b2b_cart[i];
        console.log(variant.id, variant.quantity);
        var properties = {};
        if(typeof variant.quantity === 'number' && variant.quantity > 0) {
            CartJS.addItem(variant.id, variant.quantity, properties, {
                "success": function(data, textStatus, jqXHR) {
                    console.log(data, CartJS.cart);
                // alertify.success(window.translations.cart.general.added.replace('[title]', data.product_title));
                },
                "error": function(jqXHR, textStatus, errorThrown) {
                    console.error(jqXHR, textStatus, errorThrown);
                    console.error(jqXHR.responseJSON.message);
                    console.error(jqXHR.responseJSON.description);
                    console.error(jqXHR.responseJSON.status);
                    // alertify.error(jqXHR.responseJSON.description);
                }
            });
        }

    }
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