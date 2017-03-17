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

/**
 * Group Product variants to object like the normal product object
 */
ProductJS.B2bCart.group = function(cart) {
  cart.products = [];
  for (var i = 0; i < cart.items.length; i++) {
    var variant = cart.items[i];
    variant.inCart = true;
    var handle = variant.handle;
    var index = ProductJS.Utilities.findVariantByHandle(cart.products, handle);
    if(index > -1) {
      cart.products[index].variants.push(variant);
    } else {
      cart.products.push({
        variantInCart: true,
        handle: handle,
        featured_image: variant.image,
        vendor: variant.vendor,
        title: variant.product_title,
        variant: [variant], // auto select first variant
        variants: [variant]
      });
    }
  }
  // console.log("products cart", cart);
  return cart;
}

/**
 * Find variants for each product that are already in the b2b grouped cart
 * 
 * @param product
 * @param cart
 * @param options.handle
 * 
 * @see ProductJS.Utilities.mergeCart 
 */
ProductJS.B2bCart.mergeCart = function (b2bCard, newCart, options) {

  console.log("mergeCart");
  console.log("b2bCard", b2bCard);
  console.log("newCart", newCart);
  console.log("options", options);

  b2bCard.attributes = newCart.attributes;
  b2bCard.item_count = newCart.item_count;
  b2bCard.items = newCart.items;
  b2bCard.note = newCart.note;
  b2bCard.original_total_price = newCart.original_total_price;
  // b2bCard.products = newCart.products;
  b2bCard.requires_shipping = newCart.requires_shipping;
  b2bCard.token = newCart.token;
  b2bCard.total_discount = newCart.total_discount;
  b2bCard.total_price = newCart.total_price;
  b2bCard.total_weight = newCart.total_weight;

  for (var i = 0; i < b2bCard.products.length; i++) {
    var product = b2bCard.products[i];
    product = ProductJS.Utilities.mergeCart(product, newCart, options);
  }

  return b2bCard;
}

ProductJS.B2bCart.loadCart = function(cart) {
  $(document).trigger('b2bcart.bind.befor');
  b2bCard = ProductJS.B2bCart.group(cart);

  $(document).on('cart.requestComplete', function(event, newCart) {
    b2bCard = ProductJS.B2bCart.mergeCart(b2bCard, newCart, {});
  });

  // load all products via pajax
  ProductJS.Utilities.getProducts(b2bCard.products, function (error, products) {
    b2bCard.products = products;    
    rivets.bind($('#cart'), {cart: b2bCard, settings: ProductJS.settings});
    $(document).trigger('b2bcart.bind.after');
  });
}