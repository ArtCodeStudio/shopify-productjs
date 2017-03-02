
if(typeof ProductJS !== 'object') {
    var ProductJS = {};
}
if(typeof ProductJS.templates !== 'object') {
    ProductJS.templates = {};
} 

ProductJS.templates.productVariantDropdowns = '<div class="dropdown" rv-each-select="product.selectOptions" rv-data-index="%select%" rv-data-title="select.title"><button rv-id="select.title | handleize | append \'-dropdown-toggle\'" rv-class="dropdownButtonClass | append \' btn btn-secondary dropdown-toggle\'" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{ select.title } - { select.select }</button><div rv-class="select.title | handleize | append \' dropdown-menu\'" rv-aria-labelledby="select.title | handleize | append \'-dropdown-toggle\'"><h6 class="dropdown-header">{ select.title }</h6><a class="dropdown-item" rv-on-click="onOptionClick" rv-each-option="select.values" rv-data-index="%option%" rv-data-value="option" href="#">{ option }</a></div></div>';

ProductJS.templates.productVariantSelectors = '<select rv-on-change="onOptionChange" rv-each-select="product.selectOptions" rv-class="select.title | handleize | append \' custom-select form-control\'" rv-id="select.title | handleize | append \' custom-select form-control\'"><!--<option rv-value="false">{ select.title }</option>--><option rv-each-option="select.values" rv-value="option">{ option }</option></select>';
