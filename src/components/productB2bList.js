/**
 * product-b2b-list
 * 
 * @template <product-b2b-list product="product"></product-b2b-list>
 */

if(typeof ProductJS !== 'object') {
    var ProductJS = {};
}

if(typeof ProductJS.Components !== 'object') {
  ProductJS.Components = {};
}

ProductJS.Components.productB2bListCtr = function (element, data) {
  var controller = this;
  this.product = data.product;
  this.$element = $(element);

  console.log("productB2bListCtr", controller);
}

rivets.components['product-b2b-list'] = {

  template: function() {
    return ProductJS.templates.productB2bList;
  },

  initialize: function(el, data) {
    if(!data.product) {
      console.error(new Error("function attribute is required"));
    }
    return new ProductJS.Components.productB2bListCtr(el, data);
  }
}