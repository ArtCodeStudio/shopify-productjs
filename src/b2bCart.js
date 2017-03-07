if(typeof ProductJS !== 'object') {
    var ProductJS = {};
}

if(typeof ProductJS.B2bCart !== 'object') {
    ProductJS.B2bCart = {};
}

ProductJS.B2bCart.getItem = function (b2b_cart, id) {
    var index = -1;
    for (var i = 0; i < b2b_cart.length; i++) {
        var item = b2b_cart[i];
        if(item.id === id) {
            index = i;
            break;
        }
    }
    return index;
}

/**
 * Add or remove variant to cart without duplicates
 * 
 * @param options.removeEmpty
 * @param options.sumQuantity
 */
ProductJS.B2bCart.add = function (product, variant, options) {
    if(!ProductJS.Utilities.isArray(product.b2b_cart)) {
        product.b2b_cart = [];
    }

    if(!options) {
        options = {
            removeEmpty: false,
            sumQuantity: false,

        }
    }

    var index = ProductJS.B2bCart.getItem(product.b2b_cart, variant.id);

    if(variant.quantity > 0) {
        // if quanity > 0 add variant to b2b cart
        if(index > -1) {
            // overwrite
            if(options && options.sumQuantity) {
                 product.b2b_cart[index].quantity += variant.quantity;
            } else {
                product.b2b_cart[index] = variant;
            }
            
        } else {
            // push
            product.b2b_cart.push(variant);
        }
    } else {
         // if quanity <= 0 remove variant from b2b cart
        if(options && options.removeEmpty) {
            if(index > -1) {
                product.b2b_cart.splice(index, 1);
            }
        }

    }
    return product;
}



ProductJS.B2bCart.remove = function (product, variant, options) {

  if(!ProductJS.Utilities.isArray(product.b2b_cart)) {
      product.b2b_cart = [];
  }


  var index = ProductJS.B2bCart.getItem(product.b2b_cart, variant.id);

  if(options && options.resetQuantity) {
    variant.quantity = 0;
  }
  
  if(index > -1) {
    product.b2b_cart.splice(index, 1);
  }
  return product;
}

/**
 * @see https://help.shopify.com/themes/development/getting-started/using-ajax-api
 */
ProductJS.B2bCart.updateCart = function (product) {
    var adds = [];
    var updates = {};

    for (var i = 0; i < product.b2b_cart.length; i++) {
        var variant = product.b2b_cart[i];

        if(typeof variant.quantity !== 'number') {
          variant.quantity = 0;
        }

        if(variant.inCart) {
          updates[variant.id] = variant.quantity;
        } else {
          adds.push(variant);
        }

        for (var a = 0; a < adds.length; a++) {
          var variant = adds[a];

          CartJS.addItem(variant.id, variant.quantity, {}, {
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

        CartJS.updateItemQuantitiesById(updates);
    }
  }