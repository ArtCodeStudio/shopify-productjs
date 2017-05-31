
if(typeof ProductJS !== 'object') {
    var ProductJS = {};
}
if(typeof ProductJS.templates !== 'object') {
    ProductJS.templates = {};
} 

if(typeof(ProductJS.templates.backbone) !== 'string') {
    ProductJS.templates.backbone = '<h1 rv-on-click="onClick">{product.title}</h1>';
}
if(typeof(ProductJS.templates.product) !== 'string') {
    ProductJS.templates.product = '<h1 rv-on-click="onClick">{product.title}</h1>';
}
if(typeof(ProductJS.templates.productB2bAdd) !== 'string') {
    ProductJS.templates.productB2bAdd = '<div class="form-add-to-cart form-group"><button rv-on-click="addListToCart" type="button" name="add" rv-class="addUpdateButtonClass"><span rv-show="product.variantInCart">{ updateLabel }</span> <span rv-hide="product.variantInCart">{ addLabel }</span></button></div>';
}
if(typeof(ProductJS.templates.productB2bButton) !== 'string') {
    ProductJS.templates.productB2bButton = '<div rv-hide="product.variants | size | lt 2" class="d-flex justify-content-center w-100 pt-4"><button rv-hide="showRemove" rv-on-click="add" type="button" class="btn btn-secondary">Add</button> <button rv-show="showRemove" rv-on-click="remove" type="button" class="btn btn-secondary">Remove</button></div>';
}
if(typeof(ProductJS.templates.productB2bList) !== 'string') {
    ProductJS.templates.productB2bList = '<div rv-hide="product.variants | size | lt 2"><table rv-hide="product.b2b_cart | empty" class="table table-hover"><thead><tr class="d-flex flex-row align-items-stretch"><th rv-each-select="product.selectOptions">{ select.title }</th><th>Quantity</th></tr></thead><tbody class="d-flex flex-column-reverse"><tr rv-each-variant="product.b2b_cart" rv-hide="variant.quantity | lt 1" rv-on-click="onClickRow" class="d-flex flex-row align-items-stretch"><td rv-each-option="variant.options" rv-data-value="option" rv-data-index="%option%" data-type="option">{ option }</td><td data-type="quantity">{ variant.quantity }</td></tr></tbody></table></div>';
}
if(typeof(ProductJS.templates.productImagesSlick) !== 'string') {
    ProductJS.templates.productImagesSlick = '<h1 rv-on-click="onClick">{product.title}</h1>';
}
if(typeof(ProductJS.templates.productQuantityButton) !== 'string') {
    ProductJS.templates.productQuantityButton = '<div class="input-group group-quantity-actions" role="group" aria-label="Adjust the quantity"><span class="input-group-btn"><button rv-on-click="onClickDecrease" type="button" class="btn btn-secondary">&minus;</button> </span><input rv-on-change="onValueChange" rv-value="product.variant.quantity | default start" type="text" name="quantity" class="form-control" min="0" aria-label="quantity" pattern="[0-9]*"> <span class="input-group-btn"><button rv-on-click="onClickIncrease" type="button" class="btn btn-secondary border-left-0">+</button></span></div>';
}
if(typeof(ProductJS.templates.productVariantDropdowns) !== 'string') {
    ProductJS.templates.productVariantDropdowns = '<div class="dropdown" rv-hide="product.variants | size | lt 2" rv-each-select="product.selectOptions" rv-data-index="%select%" rv-data-title="select.title"><button rv-id="select.title | handleize | append \'-dropdown-toggle\'" rv-class="dropdownButtonClass | append \' btn btn-secondary dropdown-toggle\'" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{ select.select }</button><div rv-class="select.title | handleize | append \' dropdown-menu\'" rv-aria-labelledby="select.title | handleize | append \'-dropdown-toggle\'"><h6 class="dropdown-header">{ select.title }</h6><div class="dropdown-item" rv-on-click="onOptionClick" rv-each-option="select.values" rv-data-index="%option%" rv-data-value="option">{ option }</div></div></div><product-quantity-button rv-if="showQuantityButton" product="product" start="start" min="min" decrease="decrease" increase="increase"></product-quantity-button>';
}
if(typeof(ProductJS.templates.productVariantSelectors) !== 'string') {
    ProductJS.templates.productVariantSelectors = '<select rv-hide="product.variants | size | lt 2" rv-on-change="onOptionChange" rv-each-select="product.selectOptions" rv-class="select.title | handleize | append \' custom-select form-control\'" rv-id="select.title | handleize | append \' custom-select form-control\'"><!--<option rv-value="false">{ select.title }</option>--><option rv-each-option="select.values" rv-value="option">{ option }</option></select>';
}