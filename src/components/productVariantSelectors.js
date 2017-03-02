/**
 * product-variant-selectors
 * @template <product-variant-selectors product="product" class="product-variants d-flex justify-content-between align-items-stretch flex-row"></product-variant-selectors>
 */

if(typeof ProductJS !== 'object') {
    var ProductJS = {};
}

if(typeof ProductJS.Components !== 'object') {
    ProductJS.Components = {};
}

ProductJS.Components.productVariantSelectorsCtr = function (element, data) {
    this.product = ProductJS.Utilities.splitOptions(data.product);
    // this.options = data.product.options;
    this.$element = $(element);
    var self = this;

    this.onOptionChange = function() {
      console.log('onOptionChange', this, self);
      var optionValues = ProductJS.Utilities.getOptionValues(self.$element.find('select'));
      var variantIndex = ProductJS.Utilities.getVariant(optionValues, self.product.selectOptions, self.product.variants);
      if(variantIndex > -1) {
        self.product.currentVariant = self.product.variants[variantIndex];
      }
    }

    console.log('variantSelectorsController', data);
}
    

rivets.components['product-variant-selectors'] = {
  // Return the template for the component.
  template: function() {
    return ProductJS.templates.productVariantSelectors;
  },

  // Takes the original element and the data that was passed into the
  // component (either from rivets.init or the attributes on the component
  // element in the template).
  initialize: function(el, data) {
    if(!data.product) {
      console.error(new Error("function attribute is required"));
    }
    return new ProductJS.Components.productVariantSelectorsCtr(el, data);
  }
}