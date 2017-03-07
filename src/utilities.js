if(typeof ProductJS !== 'object') {
    var ProductJS = {};
}

if(typeof ProductJS.Utilities !== 'object') {
    ProductJS.Utilities = {};
}

if(typeof ProductJS.cache !== 'object') {
    ProductJS.cache = {};
}

/**
 * Format a monetary amount using Shopify's formatMoney if available.
 * 
 * If it's not available, just return the value.
 * 
 * @source: https://github.com/discolabs/cartjs/blob/master/src/utils.coffee
 */
ProductJS.Utilities.formatMoney = function(value, format, formatName, currency) {
  var _ref, _ref1;
  if (currency == null) {
    currency = '';
  }
  if (!currency) {
    currency = ProductJS.settings.currency;
  }
  if ((window.Currency != null) && currency !== ProductJS.settings.currency) {
    value = Currency.convert(value, ProductJS.settings.currency, currency);
    if ((((_ref = window.Currency) != null ? _ref.moneyFormats : void 0) != null) && (currency in window.Currency.moneyFormats)) {
      format = window.Currency.moneyFormats[currency][formatName];
    }
  }
  if (((_ref1 = window.Shopify) != null ? _ref1.formatMoney : void 0) != null) {
    return Shopify.formatMoney(value, format);
  } else {
    return value;
  }
};

/**
 * Makes array unique / remove dulicated values
 * 
 * @see http://jszen.com/best-way-to-get-unique-values-of-an-array-in-javascript.7.html
 */
ProductJS.Utilities.unique = function(array) {
	var n = {},r=[];
	for(var i = 0; i < array.length; i++) 
	{
		if (!n[array[i]]) 
		{
			n[array[i]] = true; 
			r.push(array[i]); 
		}
	}
	return r;
}

/**
 * Split product options by variant name and create html select elements for it
 * 
 * @param product
 */
ProductJS.Utilities.splitOptions = function (product) {
  if( typeof(product.options) === 'undefined' ) {
    console.warn('no options!');
    return;
  }

  product.selectOptions = [];
  for (var index = 0; index < product.options.length; index++) {
    var optionTitle = product.options[index];
    console.log("optionTitle", optionTitle);
    product.selectOptions.push({
      index: index,
      title: optionTitle,
      handle: rivets.formatters.handleize(optionTitle),
      values: [],
    });
  }

  for (var i = 0; i < product.variants.length; i++) {
    var variantOptions = product.variants[i].options;
    for (var k = 0; k < variantOptions.length; k++) {
      var variantOption = variantOptions[k];
      product.selectOptions[k].values.push(variantOption);
    }
  }

  
  for (var i = 0; i < product.selectOptions.length; i++) {
    // unique select options
    product.selectOptions[i].values = ProductJS.Utilities.unique( product.selectOptions[i].values );

    // first option is set by default
    product.selectOptions[i].index = 0;
    product.selectOptions[i].select = product.selectOptions[i].values[product.selectOptions[i].index];
  }



  // console.log('options', options);
  return product;
};

/**
 * Check if object is array
 * 
 * @param array
 * @return boolean
 */
ProductJS.Utilities.isArray = function (array) {
  return $.isArray(array);
}


/**
 * Check if object is a function
 * 
 * @param obj
 * @return boolean
 * @see http://jsperf.com/alternative-isfunction-implementations/4
 */
ProductJS.Utilities.isFunction = function(obj) {
  return typeof(obj) === 'function';
};

/**
 * Merge the contents of two or more objects together into the first object.
 * 
 * @see https://api.jquery.com/jquery.extend/#jQuery-extend-target-object1-objectN
 */
ProductJS.Utilities.extend = function (target, object1, object2) {
  return $.extend(target, object1, object2);
}

/**
 * Clone an object without references
 * 
 * @see http://stackoverflow.com/a/5364657
 */
ProductJS.Utilities.clone = function (object) {
  return $.extend(true, {}, object);
}

/**
 * Set product.optionValues needed for selects and dropdowns to choose the product variant 
 * 
 */
ProductJS.Utilities.getOptionValues = function ($selects) {
  var optionValues = [];
  $selects.each(function( index ) {
    var $select = $( this );
    optionValues.push(ProductJS.Utilities.getOption($select).val());
  });
  return optionValues;
}

/**
 * Cache Product selected variant and quantity 
 * 
 * @param product
 * @return product - cached product
 */
ProductJS.Utilities.cacheProduct = function (product) {

  if(ProductJS.settings.cache === false) {
    return product;
  }
  
  if(ProductJS.cache[product.title]) {
    // if product is cached
    console.log("product is cached", ProductJS.cache[product.title]);
    return ProductJS.cache[product.title];
  } else {
    product = ProductJS.Utilities.setVariant(ProductJS.Utilities.splitOptions(product));
    ProductJS.cache[product.title] = product;
  }
  return product;
}

/**
 * Get current active option values of selectOptions 
 * 
 * @param selectOptions
 * @return array
 */
ProductJS.Utilities.getCurrentOptionValues = function (selectOptions) {
  var optionValues = [];
  for (var index = 0; index < selectOptions.length; index++) {
    optionValues.push(selectOptions[index].select);
  }
  // console.log("getCurrentOptionValues", optionValues);
  return optionValues;
}

/**
 * Get current option index of selectOption by value
 * 
 * @param selectOption
 * @return array
 */
ProductJS.Utilities.getCurrentOptionIndex = function (selectOption, value) {
  var resultIndex = -1;
  for (var index = 0; index < selectOption.values.length; index++) {
    if(selectOption.values[index] === value) {
      resultIndex = index;
      break;
    }
  }
  return resultIndex;
}

/**
 * Set the current selected variant by product.selectOptions
 * Selected variant will be set to product.variant
 * 
 * @param product
 * @return product
 */
ProductJS.Utilities.setVariant = function (product) {
  // console.log("setVariant");
  var variantIndex = ProductJS.Utilities.getVariant(null, product.selectOptions, product.variants);
  if(variantIndex !== -1) {
    console.log("set variant to", product.variants[variantIndex]);

    product.variant = product.variants[variantIndex];

    // product = ProductJS.Utilities.extendProduct(product, product.variants[variantIndex]);
  }
  return product;
}

/**
 * Find variant by id
 * 
 * @param product
 * @param id
 * @param index - variant index
 */
ProductJS.Utilities.findVariant = function (product, id) {
  var index = -1;
  for (var i = 0; i < product.variants.length; i++) {
    var variant = product.variants[i];
    if(variant.id === id) {
      index = i;
      break;
    }
  }
  return index;
}

/**
 * Find variants that are already in the shopify cart
 * 
 * @param product
 * @param options.pushTo - push found variants to this array if set
 * @param cb
 */
ProductJS.Utilities.mergeCart = function (product, options, cb) {
  $.getJSON('/cart.js', function(cart) {
    // console.log( "success" );
  }).done(function(cart) {
    console.log( "second success", cart );

    // mark all variants to "not in cart"  
    product.variantInCart = false;
    for (var i = 0; i < product.variants.length; i++) {
      var variant = product.variants[i];
      variant.inCart = false;
    }

    // mark found variants to "in cart"
    for (var i = 0; i < cart.items.length; i++) {
      var item = cart.items[i];
      var index = ProductJS.Utilities.findVariant(product, item.variant_id);
      if(index > -1) {
        product.variants[index].quantity = item.quantity;
        product.variants[index].inCart = true;
        product.variantInCart = true;
        
        if(typeof options === 'object' && ProductJS.Utilities.isFunction(options.handle)) {
          options.handle(product, index);
        }
      } else {
        console.warn("Variant id "+item.variant_id+" not found!", product);
      }
    }
    console.log("mergeCart", product);
    return cb(null, product);

  })
  .fail(function(jqXHR, textStatus, errorThrown) {
    console.error(jqXHR.responseJSON.description, jqXHR.responseJSON.message);
    return cb(jqXHR.responseJSON, product);
  })
  .always(function() {
    // console.log( "complete" );
  });
}

/**
 * 
 * 
 * @param $optionValues
 * @param options
 * @param variants
 */
ProductJS.Utilities.getVariant = function (optionValues, options, variants) {
  // console.log("getVariant");

  if(optionValues === null) {
    optionValues = ProductJS.Utilities.getCurrentOptionValues(options);
  }
 
  var variantIndex = -1;
  
  for (var i = 0; i < variants.length; i++) {
    var variant = variants[i];
    var hits = 0;
    for (var z = 0; z < optionValues.length; z++) {
      var option = optionValues[z];  
      
      for (var m = 0; m < variant.options.length; m++) {
        var variantOption =  variant.options[m];
        if(variantOption === option) {
          hits++;
          break;
        }
      }
    }
    // all options pass?
    if(hits === optionValues.length) {
        variantIndex = i;
    }
  }

  return variantIndex;
  
};

/**
 * 
 * 
 * @param $select
 */
ProductJS.Utilities.getOption = function ($select) {
  return $select.find('option:selected');
};