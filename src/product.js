if(typeof ProductJS !== 'object') {
    var ProductJS = {};
}

/**
 * 
 * 
 * @param product
 */
ProductJS.init = function (product) {
  console.log('ProductJS.init', product);
  rivets.bind($('#handle-'+product.handle), {product: product});
}