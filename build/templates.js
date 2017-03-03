
if(typeof ProductJS !== 'object') {
    var ProductJS = {};
}
if(typeof ProductJS.templates !== 'object') {
    ProductJS.templates = {};
} 

ProductJS.templates.backbone = '<h1>{product.title}</h1>';

ProductJS.templates.productB2bButton = '<div class="d-flex justify-content-center w-100 pt-4"><button rv-hide="product.b2b_cart | contains \'id\' product.variant.id" rv-on-click="add" type="button" class="btn btn-secondary">Add</button> <button rv-show="product.b2b_cart | contains \'id\' product.variant.id" rv-on-click="remove" type="button" class="btn btn-secondary">Remove</button></div>';

ProductJS.templates.productB2bList = '<table rv-hide="product.b2b_cart | empty" class="table table-hover"><thead><tr class="d-flex flex-row align-items-stretch"><th rv-each-select="product.selectOptions">{ select.title }</th><th>Quantity</th></tr></thead><tbody class="d-flex flex-column-reverse"><tr rv-each-variant="product.b2b_cart" class="d-flex flex-row align-items-stretch"><td rv-each-option="variant.options">{ option }</td><td>{ variant.quantity }</td></tr></tbody></table>';

ProductJS.templates.productQuantityButton = '<div class="input-group group-quantity-actions" role="group" aria-label="Adjust the quantity"><span class="input-group-btn"><button rv-on-click="onClickDecrease" type="button" class="btn btn-secondary">&minus;</button> </span><input rv-on-change="onValueChange" rv-value="product.variant.quantity | default start" type="text" name="quantity" class="form-control" min="0" aria-label="quantity" pattern="[0-9]*"> <span class="input-group-btn"><button rv-on-click="onClickIncrease" type="button" class="btn btn-secondary border-left-0">+</button></span></div>';

ProductJS.templates.productVariantDropdowns = '<div class="dropdown" rv-each-select="product.selectOptions" rv-data-index="%select%" rv-data-title="select.title"><button rv-id="select.title | handleize | append \'-dropdown-toggle\'" rv-class="dropdownButtonClass | append \' btn btn-secondary dropdown-toggle\'" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{ select.select }</button><div rv-class="select.title | handleize | append \' dropdown-menu\'" rv-aria-labelledby="select.title | handleize | append \'-dropdown-toggle\'"><h6 class="dropdown-header">{ select.title }</h6><a class="dropdown-item" rv-on-click="onOptionClick" rv-each-option="select.values" rv-data-index="%option%" rv-data-value="option" href="#">{ option }</a></div></div><product-quantity-button rv-if="showQuantityButton" product="product" start="start" min="0" decrease="10" increase="10"></product-quantity-button>';

ProductJS.templates.productVariantSelectors = '<select rv-on-change="onOptionChange" rv-each-select="product.selectOptions" rv-class="select.title | handleize | append \' custom-select form-control\'" rv-id="select.title | handleize | append \' custom-select form-control\'"><!--<option rv-value="false">{ select.title }</option>--><option rv-each-option="select.values" rv-value="option">{ option }</option></select>';
