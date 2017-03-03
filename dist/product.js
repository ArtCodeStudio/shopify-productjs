if (typeof ProductJS !== "object") {
    var ProductJS = {};
}

if (typeof ProductJS.Utilities !== "object") {
    ProductJS.Utilities = {};
}

if (typeof ProductJS.cache !== "object") {
    ProductJS.cache = {};
}

ProductJS.Utilities.formatMoney = function(value, format, formatName, currency) {
    var _ref, _ref1;
    if (currency == null) {
        currency = "";
    }
    if (!currency) {
        currency = ProductJS.settings.currency;
    }
    if (window.Currency != null && currency !== ProductJS.settings.currency) {
        value = Currency.convert(value, ProductJS.settings.currency, currency);
        if (((_ref = window.Currency) != null ? _ref.moneyFormats : void 0) != null && currency in window.Currency.moneyFormats) {
            format = window.Currency.moneyFormats[currency][formatName];
        }
    }
    if (((_ref1 = window.Shopify) != null ? _ref1.formatMoney : void 0) != null) {
        return Shopify.formatMoney(value, format);
    } else {
        return value;
    }
};

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
        console.log("optionTitle", optionTitle);
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

ProductJS.Utilities.isArray = function(array) {
    return $.isArray(array);
};

ProductJS.Utilities.extend = function(target, object1, object2) {
    return $.extend(target, object1, object2);
};

ProductJS.Utilities.extendProduct = function(product, variant) {
    product.available = variant.available;
    product.barcode = variant.barcode;
    product.compare_at_price = variant.compare_at_price;
    if (variant.featured_image) {
        product.featured_image = variant.featured_image;
    }
    product.id = variant.id;
    product.inventory_management = variant.inventory_management;
    product.inventory_policy = variant.inventory_policy;
    product.inventory_quantity = variant.inventory_quantity;
    product.name = variant.name;
    product.price = variant.price;
    product.public_title = variant.public_title;
    product.requires_shipping = variant.requires_shipping;
    product.sku = variant.sku;
    product.taxable = variant.taxable;
    product.variant_title = variant.title;
    product.weight = variant.weight;
    return product;
};

ProductJS.Utilities.clone = function(object) {
    return $.extend(true, {}, object);
};

ProductJS.Utilities.getOptionValues = function($selects) {
    var optionValues = [];
    $selects.each(function(index) {
        var $select = $(this);
        optionValues.push(ProductJS.Utilities.getOption($select).val());
    });
    return optionValues;
};

ProductJS.Utilities.getQty = function($input) {
    var qty = 1;
    if ($input.length > 0) {
        qty = parseInt($input.val().replace(/\D/g, ""));
    }
    qty = jumplink.validateQty(qty);
    return qty;
};

ProductJS.Utilities.cacheProduct = function(product) {
    if (ProductJS.settings.cache === false) {
        return product;
    }
    if (ProductJS.cache[product.title]) {
        console.log("product is cached", ProductJS.cache[product.title]);
        return ProductJS.cache[product.title];
    } else {
        product = ProductJS.Utilities.setVariant(ProductJS.Utilities.splitOptions(product));
        ProductJS.cache[product.title] = product;
    }
    return product;
};

ProductJS.Utilities.getCurrentOptionValues = function(selectOptions) {
    var optionValues = [];
    for (var index = 0; index < selectOptions.length; index++) {
        optionValues.push(selectOptions[index].select);
    }
    return optionValues;
};

ProductJS.Utilities.setVariant = function(product) {
    var variantIndex = ProductJS.Utilities.getVariant(null, product.selectOptions, product.variants);
    if (variantIndex !== -1) {
        console.log("set variant to", product.variants[variantIndex]);
        product.variant = product.variants[variantIndex];
    }
    return product;
};

ProductJS.Utilities.getVariant = function(optionValues, options, variants) {
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
    return ProductJS.Utilities.formatMoney(value, ProductJS.settings.moneyFormat, "money_format", currency);
};

rivets.formatters.money_with_currency = function(value, currency) {
    return ProductJS.Utilities.formatMoney(value, ProductJS.settings.moneyWithCurrencyFormat, "money_with_currency_format", currency);
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

rivets.formatters.default = function(value, args) {
    return typeof value !== "undefined" && value !== null ? value : args;
};

rivets.formatters.contains = function(value, attr, search) {
    console.log("contains", value, attr, search);
    if (!ProductJS.Utilities.isArray(value)) {
        console.warn("not an array");
        return false;
    }
    if (typeof search === "undefined") {
        search = attr;
        if (ProductJS.Utilities.isArray(value)) {
            return value.indexOf(search) !== -1;
        }
    }
    for (var i = 0; i < value.length; i++) {
        if (value[i][attr] === search) {
            return true;
            break;
        }
    }
    return false;
};

if (typeof ProductJS !== "object") {
    var ProductJS = {};
}

if (typeof ProductJS.templates !== "object") {
    ProductJS.templates = {};
}

ProductJS.templates.backbone = "<h1>{product.title}</h1>";

ProductJS.templates.productB2bButton = '<div class="d-flex justify-content-center w-100 pt-4"><button rv-hide="product.b2b_cart | contains \'id\' product.variant.id" rv-on-click="add" type="button" class="btn btn-secondary">Add</button> <button rv-show="product.b2b_cart | contains \'id\' product.variant.id" rv-on-click="remove" type="button" class="btn btn-secondary">Remove</button></div>';

ProductJS.templates.productB2bList = '<table rv-hide="product.b2b_cart | empty" class="table table-hover"><thead><tr class="d-flex flex-row align-items-stretch"><th rv-each-select="product.selectOptions">{ select.title }</th><th>Quantity</th></tr></thead><tbody class="d-flex flex-column-reverse"><tr rv-each-variant="product.b2b_cart" class="d-flex flex-row align-items-stretch"><td rv-each-option="variant.options">{ option }</td><td>{ variant.quantity }</td></tr></tbody></table>';

ProductJS.templates.productQuantityButton = '<div class="input-group group-quantity-actions" role="group" aria-label="Adjust the quantity"><span class="input-group-btn"><button rv-on-click="onClickDecrease" type="button" class="btn btn-secondary">&minus;</button> </span><input rv-on-change="onValueChange" rv-value="product.variant.quantity | default start" type="text" name="quantity" class="form-control" min="0" aria-label="quantity" pattern="[0-9]*"> <span class="input-group-btn"><button rv-on-click="onClickIncrease" type="button" class="btn btn-secondary border-left-0">+</button></span></div>';

ProductJS.templates.productVariantDropdowns = '<div class="dropdown" rv-each-select="product.selectOptions" rv-data-index="%select%" rv-data-title="select.title"><button rv-id="select.title | handleize | append \'-dropdown-toggle\'" rv-class="dropdownButtonClass | append \' btn btn-secondary dropdown-toggle\'" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{ select.select }</button><div rv-class="select.title | handleize | append \' dropdown-menu\'" rv-aria-labelledby="select.title | handleize | append \'-dropdown-toggle\'"><h6 class="dropdown-header">{ select.title }</h6><a class="dropdown-item" rv-on-click="onOptionClick" rv-each-option="select.values" rv-data-index="%option%" rv-data-value="option" href="#">{ option }</a></div></div><product-quantity-button rv-if="showQuantityButton" product="product" start="start" min="0" decrease="10" increase="10"></product-quantity-button>';

ProductJS.templates.productVariantSelectors = '<select rv-on-change="onOptionChange" rv-each-select="product.selectOptions" rv-class="select.title | handleize | append \' custom-select form-control\'" rv-id="select.title | handleize | append \' custom-select form-control\'"><!--<option rv-value="false">{ select.title }</option>--><option rv-each-option="select.values" rv-value="option">{ option }</option></select>';

if (typeof ProductJS !== "object") {
    var ProductJS = {};
}

if (typeof ProductJS.Components !== "object") {
    ProductJS.Components = {};
}

ProductJS.Components.backboneCtr = function(element, data) {
    var controller = this;
    controller.product = data.product;
    controller.$element = $(element);
    console.log("backboneCtr", controller);
};

rivets.components["backbone"] = {
    template: function() {
        return ProductJS.templates.backbone;
    },
    initialize: function(el, data) {
        if (!data.product) {
            console.error(new Error("function attribute is required"));
        }
        return new ProductJS.Components.backboneCtr(el, data);
    }
};

if (typeof ProductJS !== "object") {
    var ProductJS = {};
}

if (typeof ProductJS.Components !== "object") {
    ProductJS.Components = {};
}

ProductJS.Components.productB2bButtonCtr = function(element, data) {
    var controller = this;
    controller.product = data.product;
    controller.$element = $(element);
    if (!ProductJS.Utilities.isArray(controller.product.b2b_cart)) {
        controller.product.b2b_cart = [];
    }
    controller.contains = function(b2b_cart, productId) {
        var index = -1;
        for (var i = 0; i < b2b_cart.length; i++) {
            if (b2b_cart[i].id === productId) {
                return index = i;
                break;
            }
        }
        console.log("contains", index);
        return index;
    };
    controller.add = function() {
        var $button = $(this);
        var index = controller.contains(controller.product.b2b_cart, controller.product.variant.id);
        if (index === -1) {
            controller.product.b2b_cart.push(controller.product.variant);
        }
        console.log("add", controller.product.b2b_cart);
    };
    controller.remove = function() {
        var $button = $(this);
        var index = controller.contains(controller.product.b2b_cart, controller.product.variant.id);
        if (index > -1) {
            controller.product.b2b_cart.splice(index, 1);
        }
    };
};

rivets.components["product-b2b-button"] = {
    template: function() {
        return ProductJS.templates.productB2bButton;
    },
    initialize: function(el, data) {
        if (!data.product) {
            console.error(new Error("product attribute is required"));
        }
        return new ProductJS.Components.productB2bButtonCtr(el, data);
    }
};

if (typeof ProductJS !== "object") {
    var ProductJS = {};
}

if (typeof ProductJS.Components !== "object") {
    ProductJS.Components = {};
}

ProductJS.Components.productB2bListCtr = function(element, data) {
    var controller = this;
    this.product = data.product;
    this.$element = $(element);
    console.log("productB2bListCtr", controller);
};

rivets.components["product-b2b-list"] = {
    template: function() {
        return ProductJS.templates.productB2bList;
    },
    initialize: function(el, data) {
        if (!data.product) {
            console.error(new Error("function attribute is required"));
        }
        return new ProductJS.Components.productB2bListCtr(el, data);
    }
};

if (typeof ProductJS !== "object") {
    var ProductJS = {};
}

if (typeof ProductJS.Components !== "object") {
    ProductJS.Components = {};
}

ProductJS.Components.productQuantityButtonCtr = function(element, data) {
    var controller = this;
    controller.product = data.product;
    controller.$element = $(element);
    controller.$input = controller.$element.find("input");
    controller.decrease = Number(data.decrease);
    controller.increase = Number(data.increase);
    controller.min = data.min;
    console.log("productQuantityButtonCtr", controller);
    if (typeof controller.start !== "number") {
        controller.start = window.ProductJS.settings.quantity;
    }
    if (typeof controller.product.variant.quantity !== "number") {
        controller.product.variant.quantity = Number(controller.start);
    }
    controller.onClickDecrease = function() {
        var $button = $(this);
        if (typeof controller.product.variant.quantity !== "number") {
            controller.product.variant.quantity = Number(controller.start);
        }
        controller.product.variant.quantity -= controller.decrease;
        if (controller.product.variant.quantity < controller.min) {
            controller.product.variant.quantity = controller.min;
        }
    };
    controller.onClickIncrease = function() {
        var $button = $(this);
        if (typeof controller.product.variant.quantity !== "number") {
            controller.product.variant.quantity = Number(controller.start);
        }
        controller.product.variant.quantity += controller.increase;
    };
    controller.onValueChange = function() {
        controller.product.variant.quantity = Number(controller.product.variant.quantity);
    };
};

rivets.components["product-quantity-button"] = {
    template: function() {
        return ProductJS.templates.productQuantityButton;
    },
    initialize: function(el, data) {
        if (!data.product) {
            console.error(new Error("product attribute is required"));
        }
        if (!data.decrease) {
            console.error(new Error("decrease attribute is required"));
        }
        if (!data.increase) {
            console.error(new Error("increase attribute is required"));
        }
        if (typeof data.min !== "number") {
            console.error(new Error("min attribute is required"));
        }
        return new ProductJS.Components.productQuantityButtonCtr(el, data);
    }
};

if (typeof ProductJS !== "object") {
    var ProductJS = {};
}

if (typeof ProductJS.Components !== "object") {
    ProductJS.Components = {};
}

ProductJS.Components.productVariantDropdownsCtr = function(element, data) {
    var controller = this;
    controller.product = data.product;
    controller.showQuantityButton = data.showQuantityButton === true;
    controller.start = data.startQuantity;
    if (typeof controller.start !== "number") {
        controller.start = window.ProductJS.settings.quantity;
    }
    if (data.dropdownButtonClass) {
        controller.dropdownButtonClass = data.dropdownButtonClass;
    }
    controller.$element = $(element);
    controller.onOptionClick = function() {
        var $item = $(this);
        var value = $item.data("value");
        var index = $item.data("index");
        var $dropdown = $item.closest(".dropdown");
        var optionIndex = $dropdown.data("index");
        var title = $dropdown.data("title");
        var $button = $dropdown.find(".dropdown-toggle");
        controller.product.selectOptions[optionIndex].index = index;
        controller.product.selectOptions[optionIndex].select = controller.product.selectOptions[optionIndex].values[index];
        controller.product = ProductJS.Utilities.setVariant(controller.product);
        if (typeof controller.product.variant.quantity !== "number") {
            controller.product.variant.quantity = Number(controller.start);
        }
    };
    console.log("productVariantDropdownsCtr", data);
};

rivets.components["product-variant-dropdowns"] = {
    template: function() {
        return ProductJS.templates.productVariantDropdowns;
    },
    initialize: function(el, data) {
        if (!data.product) {
            console.error(new Error("product attribute is required"));
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
    var controller = this;
    this.onOptionChange = function() {
        console.log("onOptionChange", this, controller);
        var optionValues = ProductJS.Utilities.getOptionValues(controller.$element.find("select"));
        var variantIndex = ProductJS.Utilities.getVariant(optionValues, controller.product.selectOptions, controller.product.variants);
        if (variantIndex > -1) {
            controller.product.variant = controller.product.variants[variantIndex];
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
            console.error(new Error("product attribute is required"));
        }
        return new ProductJS.Components.productVariantSelectorsCtr(el, data);
    }
};

if (typeof window.ProductJS !== "object") {
    windows.ProductJS = {};
}

if (typeof window.ProductJS.settings !== "object") {
    window.ProductJS.settings = {
        cache: "true",
        quantity: 1
    };
}

window.ProductJS.init = function(product, options) {
    console.log("ProductJS.init", product);
    ProductJS.settings = ProductJS.Utilities.extend(ProductJS.settings, options);
    product = ProductJS.Utilities.cacheProduct(product);
    rivets.bind($("#handle-" + product.handle), {
        product: product
    });
};