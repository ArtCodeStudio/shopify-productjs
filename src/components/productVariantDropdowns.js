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

ProductJS.Components.productVariantDropdownsCtr = function (element, data) {
  var controller = this;
  controller.product = data.product;
  controller.showQuantityButton = (data.showQuantityButton === true)

  controller.start = data.startQuantity;
  if(typeof controller.start !== 'number') {
    controller.start = window.ProductJS.settings.quantity;
  }

  if(data.dropdownButtonClass) {
      controller.dropdownButtonClass = data.dropdownButtonClass;
  }
  
  // controller.options = data.product.options;
  controller.$element = $(element);
  

  controller.onOptionClick = function() {
    var $item = $(this);
    var value = $item.data('value');
    var index = $item.data('index');

    var $dropdown = $item.closest('.dropdown');
    var optionIndex = $dropdown.data('index');
    var title = $dropdown.data('title');

    var $button = $dropdown.find('.dropdown-toggle');
    
    controller.product.selectOptions[optionIndex].index = index;
    controller.product.selectOptions[optionIndex].select = controller.product.selectOptions[optionIndex].values[index];

    // console.log('onOptionClick', value, title, this, controller);
    controller.product = ProductJS.Utilities.setVariant(controller.product);

    if(typeof controller.product.variant.quantity !== 'number') {
      controller.product.variant.quantity = Number(controller.start);
    }

  }

  console.log('productVariantDropdownsCtr', data);
}
    

rivets.components['product-variant-dropdowns'] = {
  // Return the template for the component.
  template: function() {
    return ProductJS.templates.productVariantDropdowns;
  },

  // Takes the original element and the data that was passed into the
  // component (either from rivets.init or the attributes on the component
  // element in the template).
  initialize: function(el, data) {
    if(!data.product) {
      console.error(new Error("product attribute is required"));
    }
    return new ProductJS.Components.productVariantDropdownsCtr(el, data);
  }
}