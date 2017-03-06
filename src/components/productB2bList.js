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
  controller.product = data.product;
  controller.$element = $(element);

  controller.onClickRow = function () {
    var $tableRow = $(this);
    var $cols = $tableRow.children();

    $cols.each(function( i ) {
        var $col = $(this);
        var value = String($col.data('value'));
        var index = Number($col.data('index'));
        var type = String($col.data('type'));
        switch (type) {
            case 'option':
                var selectOption = controller.product.selectOptions[index];
                var openIndex = ProductJS.Utilities.getCurrentOptionIndex(selectOption, value);
                if(openIndex > -1) {
                    selectOption.select = value;
                    selectOption.select.index = openIndex;
                    controller.product = ProductJS.Utilities.setVariant(controller.product);
                } else {
                    console.error("Open value not found", "value", value, "index", index, "product", controller.product);
                }
                break;
            case 'quantity':
                
                break;
            default:
                console.warn("Unknown column type", type);
                break;
        }

        console.log(type, index, value);
    });


    
  }

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