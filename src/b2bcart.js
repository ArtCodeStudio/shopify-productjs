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

  $(document).trigger('b2bcart.change', product.b2b_cart);
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

  // WORKAROUND Do not remove item from list just hide items with quantity === 0
  // if(index > -1) {
  //   product.b2b_cart.splice(index, 1);
  // }

  $(document).trigger('b2bcart.change', product.b2b_cart);
  return product;
}

/**
 * @see https://help.shopify.com/themes/development/getting-started/using-ajax-api
 */
ProductJS.B2bCart.updateCart = function (product) {
  var adds = [];
  var updates = {};
  var removes = {};
  var properties = {
    group: product.handle
  };

  for (var i = 0; i < product.b2b_cart.length; i++) {
    var variant = product.b2b_cart[i];

    if(typeof variant.quantity !== 'number') {
      variant.quantity = 0;
    }

    if(variant.inCart) {
      if(variant.quantity > 0) {
        updates[variant.id] = variant.quantity;
      } else {
        removes[variant.id] = 0;
      }
    } else {
      adds.push(variant);
    }
  }

  // console.log("adds", adds);
  // console.log("updates", updates);
  // console.log("removes", removes);

  if(Object.keys(updates).length > 0) {
    CartJS.updateItemQuantitiesById(updates, {
      "success": function(data, textStatus, jqXHR) {
        console.log('success updates', data);
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

  if(Object.keys(removes).length > 0) {
    CartJS.updateItemQuantitiesById(removes, {
      "success": function(data, textStatus, jqXHR) {
        console.log('success removes', data);
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

  for (var a = 0; a < adds.length; a++) {
    var variant = adds[a];

    CartJS.addItem(variant.id, variant.quantity, properties, {
      "success": function(data, textStatus, jqXHR) {
        console.log('success add', data);
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

ProductJS.B2bCart.findGrouped = function(grouped, handle) {
  var index = -1;
  for (var i = 0; i < grouped.length; i++) {
    var item = grouped[i];
    if(item.handle === handle) {
      index = i;
      break;
    }
  }
  return index;
}

ProductJS.B2bCart.group = function(cart) {
  cart.grouped = [];
  for (var i = 0; i < cart.items.length; i++) {
    var item = cart.items[i];
    var handle = item.handle;
    var index = ProductJS.B2bCart.findGrouped(cart.grouped , handle);
    if(index > -1) {
      cart.grouped[index].variants.push(cart.items[i]);
    } else {
      cart.grouped.push({
        handle: handle,
        image: cart.items[i].image,
        vendor: cart.items[i].vendor,
        product_title: cart.items[i].product_title,
        variant: [cart.items[i]], // auto select first variant
        variants: [cart.items[i]]
      });
    }
  }
  console.log("grouped cart", cart);
  return cart;
}

ProductJS.B2bCart.loadCart = function(cart) {
  $(document).trigger('b2bcart.bind.befor');
  console.log("loadCart", cart);
  cart = ProductJS.B2bCart.group(cart);
  rivets.bind($('#cart'), {cart: cart, settings: ProductJS.settings});
  $(document).trigger('b2bcart.bind.after');
}