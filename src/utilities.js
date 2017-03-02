if(typeof ProductJS !== 'object') {
    var ProductJS = {};
}

if(typeof ProductJS.Utilities !== 'object') {
    ProductJS.Utilities = {};
}

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
 * Get selected option values of selects 
 * 
 * @param $selects
 * @return array
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
  console.log("getCurrentOptionValues", optionValues);
  return optionValues;
}

ProductJS.Utilities.setVariant = function (product) {
  console.log("setVariant");
  var variantIndex = ProductJS.Utilities.getVariant(null, product.selectOptions, product.variants);
  if(variantIndex > -1) {
    product.currentVariant = product.variants[variantIndex];
  }
  return product;
}

/**
 * 
 * 
 * @param $optionValues
 * @param options
 * @param variants
 */
ProductJS.Utilities.getVariant = function (optionValues, options, variants) {
  console.log("getVariant");

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