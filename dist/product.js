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

ProductJS.Utilities.isFunction = function(obj) {
    return typeof obj === "function";
};

ProductJS.Utilities.extend = function(target, object1, object2) {
    return $.extend(target, object1, object2);
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

ProductJS.Utilities.getCurrentOptionIndex = function(selectOption, value) {
    var resultIndex = -1;
    for (var index = 0; index < selectOption.values.length; index++) {
        if (selectOption.values[index] === value) {
            resultIndex = index;
            break;
        }
    }
    return resultIndex;
};

ProductJS.Utilities.setVariant = function(product) {
    var variantIndex = ProductJS.Utilities.getVariant(null, product.selectOptions, product.variants);
    if (variantIndex !== -1) {
        console.log("set variant to", product.variants[variantIndex]);
        product.variant = product.variants[variantIndex];
    }
    return product;
};

ProductJS.Utilities.findVariant = function(product, id) {
    var index = -1;
    for (var i = 0; i < product.variants.length; i++) {
        var variant = product.variants[i];
        if (variant.id === id) {
            index = i;
            break;
        }
    }
    return index;
};

ProductJS.Utilities.mergeCart = function(product, options, cb) {
    $.getJSON("/cart.js", function(cart) {}).done(function(cart) {
        console.log("second success", cart);
        product.variantInCart = false;
        for (var i = 0; i < product.variants.length; i++) {
            var variant = product.variants[i];
            variant.inCart = false;
        }
        for (var i = 0; i < cart.items.length; i++) {
            var item = cart.items[i];
            var index = ProductJS.Utilities.findVariant(product, item.variant_id);
            if (index > -1) {
                product.variants[index].quantity = item.quantity;
                product.variants[index].inCart = true;
                product.variantInCart = true;
                if (typeof options === "object" && ProductJS.Utilities.isFunction(options.handle)) {
                    options.handle(product, index);
                }
            } else {
                console.warn("Variant id " + item.variant_id + " not found!", product);
            }
        }
        console.log("mergeCart", product);
        return cb(null, product);
    }).fail(function(jqXHR, textStatus, errorThrown) {
        console.error(jqXHR.responseJSON.description, jqXHR.responseJSON.message);
        return cb(jqXHR.responseJSON, product);
    }).always(function() {});
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

if (typeof ProductJS !== "object") {
    var ProductJS = {};
}

if (typeof ProductJS.B2bCart !== "object") {
    ProductJS.B2bCart = {};
}

ProductJS.B2bCart.getItem = function(b2b_cart, id) {
    var index = -1;
    for (var i = 0; i < b2b_cart.length; i++) {
        var item = b2b_cart[i];
        if (item.id === id) {
            index = i;
            break;
        }
    }
    return index;
};

ProductJS.B2bCart.add = function(product, variant, options) {
    if (!ProductJS.Utilities.isArray(product.b2b_cart)) {
        product.b2b_cart = [];
    }
    if (!options) {
        options = {
            removeEmpty: false,
            sumQuantity: false
        };
    }
    var index = ProductJS.B2bCart.getItem(product.b2b_cart, variant.id);
    if (variant.quantity > 0) {
        if (index > -1) {
            if (options && options.sumQuantity) {
                product.b2b_cart[index].quantity += variant.quantity;
            } else {
                product.b2b_cart[index] = variant;
            }
        } else {
            product.b2b_cart.push(variant);
        }
    } else {
        if (options && options.removeEmpty) {
            if (index > -1) {
                product.b2b_cart.splice(index, 1);
            }
        }
    }
    return product;
};

ProductJS.B2bCart.remove = function(product, variant, options) {
    if (!ProductJS.Utilities.isArray(product.b2b_cart)) {
        product.b2b_cart = [];
    }
    var index = ProductJS.B2bCart.getItem(product.b2b_cart, variant.id);
    if (options && options.resetQuantity) {
        variant.quantity = 0;
    }
    if (index > -1) {
        product.b2b_cart.splice(index, 1);
    }
    return product;
};

ProductJS.B2bCart.updateCart = function(product) {
    var adds = [];
    var updates = {};
    for (var i = 0; i < product.b2b_cart.length; i++) {
        var variant = product.b2b_cart[i];
        if (typeof variant.quantity !== "number") {
            variant.quantity = 0;
        }
        if (variant.inCart) {
            updates[variant.id] = variant.quantity;
        } else {
            adds.push(variant);
        }
        for (var a = 0; a < adds.length; a++) {
            var variant = adds[a];
            CartJS.addItem(variant.id, variant.quantity, {}, {
                success: function(data, textStatus, jqXHR) {
                    console.log(data, CartJS.cart);
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.error(jqXHR, textStatus, errorThrown);
                    console.error(jqXHR.responseJSON.message);
                    console.error(jqXHR.responseJSON.description);
                    console.error(jqXHR.responseJSON.status);
                }
            });
        }
        CartJS.updateItemQuantitiesById(updates);
    }
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

ProductJS.templates.backbone = '<h1 rv-on-click="onClick">{product.title}</h1>';

ProductJS.templates.productB2bAdd = '<div class="form-add-to-cart form-group"><button rv-on-click="addListToCart" type="button" name="add" class="btn btn-primary w-100">{ label }</button></div>';

ProductJS.templates.productB2bButton = '<div class="d-flex justify-content-center w-100 pt-4"><button rv-hide="product.b2b_cart | contains \'id\' product.variant.id" rv-on-click="add" type="button" class="btn btn-secondary">Add</button> <button rv-show="product.b2b_cart | contains \'id\' product.variant.id" rv-on-click="remove" type="button" class="btn btn-secondary">Remove</button></div>';

ProductJS.templates.productB2bList = '<table rv-hide="product.b2b_cart | empty" class="table table-hover"><thead><tr class="d-flex flex-row align-items-stretch"><th rv-each-select="product.selectOptions">{ select.title }</th><th>Quantity</th></tr></thead><tbody class="d-flex flex-column-reverse"><tr rv-each-variant="product.b2b_cart" rv-on-click="onClickRow" class="d-flex flex-row align-items-stretch"><td rv-each-option="variant.options" rv-data-value="option" rv-data-index="%option%" data-type="option">{ option }</td><td data-type="quantity">{ variant.quantity }</td></tr></tbody></table>';

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
    controller.onClick = function() {
        var $button = $(this);
        console.log("onClick", $button);
    };
    console.log("backboneCtr", controller);
};

rivets.components["backbone"] = {
    template: function() {
        return ProductJS.templates.backbone;
    },
    initialize: function(el, data) {
        console.log("init backbone", el, data);
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

ProductJS.Components.productB2bAddCtr = function(element, data) {
    var controller = this;
    controller.product = data.product;
    controller.$element = $(element);
    controller.label = data.label;
    console.log("CartJS.cart", CartJS.cart);
    controller.addListToCart = function() {
        var $button = $(this);
        console.log("onClick", $button);
        for (var i = 0; i < controller.product.b2b_cart.length; i++) {
            var variant = controller.product.b2b_cart[i];
            console.log(variant.id, variant.quantity);
            var properties = {};
            if (typeof variant.quantity === "number" && variant.quantity > 0) {
                CartJS.addItem(variant.id, variant.quantity, properties, {
                    success: function(data, textStatus, jqXHR) {
                        console.log(data, CartJS.cart);
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        console.error(jqXHR, textStatus, errorThrown);
                        console.error(jqXHR.responseJSON.message);
                        console.error(jqXHR.responseJSON.description);
                        console.error(jqXHR.responseJSON.status);
                    }
                });
            }
        }
    };
    console.log("productB2bAddCtr", controller);
};

rivets.components["product-b2b-add"] = {
    template: function() {
        return ProductJS.templates.productB2bAdd;
    },
    initialize: function(el, data) {
        console.log("init productB2bAddCtr", el, data);
        if (!data.product) {
            console.error(new Error("function attribute is required"));
        }
        return new ProductJS.Components.productB2bAddCtr(el, data);
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
    controller.add = function() {
        ProductJS.B2bCart.add(controller.product, controller.product.variant, {
            removeEmpty: false,
            sumQuantity: false
        });
    };
    controller.remove = function() {
        var $button = $(this);
        var index = ProductJS.B2bCart.getItem(controller.product.b2b_cart, controller.product.variant.id);
        controller.product = ProductJS.B2bCart.remove(controller.product, controller.product.variant, {
            resetQuantity: true
        });
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
    controller.product = data.product;
    controller.$element = $(element);
    ProductJS.Utilities.mergeCart(controller.product, {
        handle: function(product, index) {
            product = ProductJS.B2bCart.add(product, product.variants[index]);
        }
    }, function(error, product) {
        if (error) {
            return error;
        }
        if (typeof product === "object") {
            controller.product = product;
        }
    });
    controller.onClickRow = function() {
        var $tableRow = $(this);
        var $cols = $tableRow.children();
        $cols.each(function(i) {
            var $col = $(this);
            var value = String($col.data("value"));
            var index = Number($col.data("index"));
            var type = String($col.data("type"));
            switch (type) {
              case "option":
                var selectOption = controller.product.selectOptions[index];
                var openIndex = ProductJS.Utilities.getCurrentOptionIndex(selectOption, value);
                if (openIndex > -1) {
                    selectOption.select = value;
                    selectOption.select.index = openIndex;
                    controller.product = ProductJS.Utilities.setVariant(controller.product);
                } else {
                    console.error("Open value not found", "value", value, "index", index, "product", controller.product);
                }
                break;

              case "quantity":
                break;

              default:
                console.warn("Unknown column type", type);
                break;
            }
        });
    };
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
        var optionValues = ProductJS.Utilities.getOptionValues(controller.$element.find("select"));
        var variantIndex = ProductJS.Utilities.getVariant(optionValues, controller.product.selectOptions, controller.product.variants);
        if (variantIndex > -1) {
            controller.product.variant = controller.product.variants[variantIndex];
        }
    };
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