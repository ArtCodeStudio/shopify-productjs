if (typeof ProductJS !== "object") {
    var ProductJS = {};
}

if (typeof ProductJS.Utilities !== "object") {
    ProductJS.Utilities = {};
}

ProductJS.Utilities.unique = function(array) {
    var n = {}, r = [];
    for (var i = 0; i < array.length; i++) {
        if (!n[array[i]]) {
            n[array[i]] = true;
            r.push(array[i]);
        }
    }
    return r;
};

ProductJS.Utilities.splitOptions = function(product) {
    if (typeof product.options === "undefined") {
        console.warn("no options!");
        return;
    }
    product.selectOptions = [];
    for (var index = 0; index < product.options.length; index++) {
        var optionTitle = product.options[index];
        product.selectOptions.push({
            index: index,
            title: optionTitle,
            handle: rivets.formatters.handleize(optionTitle),
            values: []
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
        product.selectOptions[i].values = ProductJS.Utilities.unique(product.selectOptions[i].values);
        product.selectOptions[i].index = 0;
        product.selectOptions[i].select = product.selectOptions[i].values[product.selectOptions[i].index];
    }
    return product;
};

ProductJS.Utilities.getOptionValues = function($selects) {
    var optionValues = [];
    $selects.each(function(index) {
        var $select = $(this);
        optionValues.push(ProductJS.Utilities.getOption($select).val());
    });
    return optionValues;
};

ProductJS.Utilities.getCurrentOptionValues = function(selectOptions) {
    var optionValues = [];
    for (var index = 0; index < selectOptions.length; index++) {
        optionValues.push(selectOptions[index].select);
    }
    console.log("getCurrentOptionValues", optionValues);
    return optionValues;
};

ProductJS.Utilities.setVariant = function(product) {
    console.log("setVariant");
    var variantIndex = ProductJS.Utilities.getVariant(null, product.selectOptions, product.variants);
    if (variantIndex > -1) {
        product.currentVariant = product.variants[variantIndex];
    }
    return product;
};

ProductJS.Utilities.getVariant = function(optionValues, options, variants) {
    console.log("getVariant");
    if (optionValues === null) {
        optionValues = ProductJS.Utilities.getCurrentOptionValues(options);
    }
    var variantIndex = -1;
    for (var i = 0; i < variants.length; i++) {
        var variant = variants[i];
        var hits = 0;
        for (var z = 0; z < optionValues.length; z++) {
            var option = optionValues[z];
            for (var m = 0; m < variant.options.length; m++) {
                var variantOption = variant.options[m];
                if (variantOption === option) {
                    hits++;
                    break;
                }
            }
        }
        if (hits === optionValues.length) {
            variantIndex = i;
        }
    }
    return variantIndex;
};

ProductJS.Utilities.getOption = function($select) {
    return $select.find("option:selected");
};

rivets.formatters.eq = function(a, b) {
    return a === b;
};

rivets.formatters.includes = function(a, b) {
    return a.indexOf(b) >= 0;
};

rivets.formatters.match = function(a, regexp, flags) {
    return a.match(new RegExp(regexp, flags));
};

rivets.formatters.lt = function(a, b) {
    return a < b;
};

rivets.formatters.gt = function(a, b) {
    return a > b;
};

rivets.formatters.not = function(a) {
    return !a;
};

rivets.formatters.empty = function(a) {
    return !a.length;
};

rivets.formatters.plus = function(a, b) {
    return parseInt(a) + parseInt(b);
};

rivets.formatters.minus = function(a, b) {
    return parseInt(a) - parseInt(b);
};

rivets.formatters.times = function(a, b) {
    return a * b;
};

rivets.formatters.divided_by = function(a, b) {
    return a / b;
};

rivets.formatters.modulo = function(a, b) {
    return a % b;
};

rivets.formatters.prepend = function(a, b) {
    return b + a;
};

rivets.formatters.append = function(a, b) {
    return a + b;
};

rivets.formatters.slice = function(value, start, end) {
    return value.slice(start, end);
};

rivets.formatters.pluralize = function(input, singular, plural) {
    if (plural == null) {
        plural = singular + "s";
    }
    if (CartJS.Utils.isArray(input)) {
        input = input.length;
    }
    if (input === 1) {
        return singular;
    } else {
        return plural;
    }
};

rivets.formatters.array_element = function(array, index) {
    return array[index];
};

rivets.formatters.array_first = function(array) {
    return array[0];
};

rivets.formatters.array_last = function(array) {
    return array[array.length - 1];
};

rivets.formatters.money = function(value, currency) {
    return CartJS.Utils.formatMoney(value, CartJS.settings.moneyFormat, "money_format", currency);
};

rivets.formatters.money_with_currency = function(value, currency) {
    return CartJS.Utils.formatMoney(value, CartJS.settings.moneyWithCurrencyFormat, "money_with_currency_format", currency);
};

rivets.formatters.weight = function(grams) {
    switch (CartJS.settings.weightUnit) {
      case "kg":
        return (grams / 1e3).toFixed(CartJS.settings.weightPrecision);

      case "oz":
        return (grams * .035274).toFixed(CartJS.settings.weightPrecision);

      case "lb":
        return (grams * .00220462).toFixed(CartJS.settings.weightPrecision);

      default:
        return grams.toFixed(CartJS.settings.weightPrecision);
    }
};

rivets.formatters.weight_with_unit = function(grams) {
    return rivets.formatters.weight(grams) + CartJS.settings.weightUnit;
};

rivets.formatters.product_image_size = function(src, size) {
    return CartJS.Utils.getSizedImageUrl(src, size);
};

rivets.formatters.moneyWithCurrency = rivets.formatters.money_with_currency;

rivets.formatters.weightWithUnit = rivets.formatters.weight_with_unit;

rivets.formatters.productImageSize = rivets.formatters.product_image_size;

rivets.formatters.handleize = function(str) {
    str = jumplink.filter.strip(str);
    str = str.replace(/[^\w\s]/gi, "");
    str = jumplink.filter.downcase(str);
    return str.replace(/ /g, "-");
};

if (typeof ProductJS !== "object") {
    var ProductJS = {};
}

if (typeof ProductJS.templates !== "object") {
    ProductJS.templates = {};
}

ProductJS.templates.productVariantDropdowns = '<div class="dropdown" rv-each-select="product.selectOptions" rv-data-index="%select%" rv-data-title="select.title"><button rv-id="select.title | handleize | append \'-dropdown-toggle\'" rv-class="dropdownButtonClass | append \' btn btn-secondary dropdown-toggle\'" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{ select.title } - { select.select }</button><div rv-class="select.title | handleize | append \' dropdown-menu\'" rv-aria-labelledby="select.title | handleize | append \'-dropdown-toggle\'"><h6 class="dropdown-header">{ select.title }</h6><a class="dropdown-item" rv-on-click="onOptionClick" rv-each-option="select.values" rv-data-index="%option%" rv-data-value="option" href="#">{ option }</a></div></div>';

ProductJS.templates.productVariantSelectors = '<select rv-on-change="onOptionChange" rv-each-select="product.selectOptions" rv-class="select.title | handleize | append \' custom-select form-control\'" rv-id="select.title | handleize | append \' custom-select form-control\'"><!--<option rv-value="false">{ select.title }</option>--><option rv-each-option="select.values" rv-value="option">{ option }</option></select>';

if (typeof ProductJS !== "object") {
    var ProductJS = {};
}

if (typeof ProductJS.Components !== "object") {
    ProductJS.Components = {};
}

ProductJS.Components.productVariantDropdownsCtr = function(element, data) {
    var self = this;
    this.product = ProductJS.Utilities.setVariant(ProductJS.Utilities.splitOptions(data.product));
    if (data.dropdownButtonClass) {
        this.dropdownButtonClass = data.dropdownButtonClass;
    }
    this.$element = $(element);
    this.onOptionClick = function() {
        var $item = $(this);
        var value = $item.data("value");
        var index = $item.data("index");
        var $dropdown = $item.closest(".dropdown");
        var optionIndex = $dropdown.data("index");
        var title = $dropdown.data("title");
        var $button = $dropdown.find(".dropdown-toggle");
        self.product.selectOptions[optionIndex].index = index;
        self.product.selectOptions[optionIndex].select = self.product.selectOptions[optionIndex].values[index];
        console.log("onOptionClick", value, title, this, self);
        self.product = ProductJS.Utilities.setVariant(self.product);
    };
    console.log("productVariantDropdownsCtr", data);
};

rivets.components["product-variant-dropdowns"] = {
    template: function() {
        return ProductJS.templates.productVariantDropdowns;
    },
    initialize: function(el, data) {
        if (!data.product) {
            console.error(new Error("function attribute is required"));
        }
        return new ProductJS.Components.productVariantDropdownsCtr(el, data);
    }
};

if (typeof ProductJS !== "object") {
    var ProductJS = {};
}

if (typeof ProductJS.Components !== "object") {
    ProductJS.Components = {};
}

ProductJS.Components.productVariantSelectorsCtr = function(element, data) {
    this.product = ProductJS.Utilities.splitOptions(data.product);
    this.$element = $(element);
    var self = this;
    this.onOptionChange = function() {
        console.log("onOptionChange", this, self);
        var optionValues = ProductJS.Utilities.getOptionValues(self.$element.find("select"));
        var variantIndex = ProductJS.Utilities.getVariant(optionValues, self.product.selectOptions, self.product.variants);
        if (variantIndex > -1) {
            self.product.currentVariant = self.product.variants[variantIndex];
        }
    };
    console.log("variantSelectorsController", data);
};

rivets.components["product-variant-selectors"] = {
    template: function() {
        return ProductJS.templates.productVariantSelectors;
    },
    initialize: function(el, data) {
        if (!data.product) {
            console.error(new Error("function attribute is required"));
        }
        return new ProductJS.Components.productVariantSelectorsCtr(el, data);
    }
};

if (typeof ProductJS !== "object") {
    var ProductJS = {};
}

ProductJS.init = function(product) {
    console.log("ProductJS.init", product);
    rivets.bind($("#handle-" + product.handle), {
        product: product
    });
};