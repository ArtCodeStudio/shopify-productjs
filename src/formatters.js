/**
 * Add useful general-purpose formatters for Rivets.js
 * Formatters from cart.js
 * @see https://github.com/discolabs/cartjs/blob/master/src/rivets.coffee#L52
 */
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
    plural = singular + 's';
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

// Add Shopify-specific formatters for Rivets.js.
rivets.formatters.money = function(value, currency) {
  return CartJS.Utils.formatMoney(value, CartJS.settings.moneyFormat, 'money_format', currency);
};

rivets.formatters.money_with_currency = function(value, currency) {
  return CartJS.Utils.formatMoney(value, CartJS.settings.moneyWithCurrencyFormat, 'money_with_currency_format', currency);
};

rivets.formatters.weight = function(grams) {
  switch (CartJS.settings.weightUnit) {
    case 'kg':
      return (grams / 1000).toFixed(CartJS.settings.weightPrecision);
    case 'oz':
      return (grams * 0.035274).toFixed(CartJS.settings.weightPrecision);
    case 'lb':
      return (grams * 0.00220462).toFixed(CartJS.settings.weightPrecision);
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

// Add camelCase aliases for underscore formatters.
rivets.formatters.moneyWithCurrency = rivets.formatters.money_with_currency;
rivets.formatters.weightWithUnit = rivets.formatters.weight_with_unit;
rivets.formatters.productImageSize = rivets.formatters.product_image_size;

// Additional formatters for ProductJS

/**
 * Formats a string into a handle.
 * @see https://help.shopify.com/themes/liquid/filters/string-filters#handle-handleize
 */
rivets.formatters.handleize = function (str) {
  str = jumplink.filter.strip(str);
  str = str.replace(/[^\w\s]/gi, '') // http://stackoverflow.com/a/4374890
  str = jumplink.filter.downcase(str);
  return str.replace(/ /g,"-");
}