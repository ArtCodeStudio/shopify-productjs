if(typeof window.ProductJS !== 'object') {
  windows.ProductJS = {};
}

if(typeof window.ProductJS.settings !== 'object') {
  // default settings
  window.ProductJS.settings = {
    cache: "true",
    quantity: 1
  };
}

/**
 * 
 * 
 * @param product
 * @param options.moneyFormat
 * @param options.moneyWithCurrencyFormat
 */
window.ProductJS.init = function (settings) {
  console.log('ProductJS.init', product);
  ProductJS.settings = ProductJS.Utilities.extend(ProductJS.settings, settings);
}

window.ProductJS.loadProduct = function (product) {
  $(document).trigger('product.bind.befor');
  console.log('ProductJS.loadProduct', product);
  product = ProductJS.Utilities.cacheProduct(product);
  rivets.bind($('#handle-'+product.handle), {product: product, settings: ProductJS.settings});
  $(document).trigger('product.bind.after');
}
