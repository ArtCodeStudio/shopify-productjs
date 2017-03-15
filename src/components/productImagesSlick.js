/**
 * product-images-slick
 * 
 * @template <product-images-slick product="product"></product-images-slick>
 */

if(typeof ProductJS !== 'object') {
    var ProductJS = {};
}

if(typeof ProductJS.Components !== 'object') {
  ProductJS.Components = {};
}

ProductJS.Components.productImagesSlickCtr = function (element, data) {
  var controller = this;
  controller.product = data.product;
  controller.$element = $(element);
  controller.slickID = 'product-images-slick-'+controller.product.handle;
  controller.slickSelector = '#'+controller.slickID;
  controller.slickThumsID = 'product-thumbs-'+controller.product.handle;
  controller.slickThumsSelector = '#'+controller.slickThumsID+' .thumb';

  var slickOptions = {
    dots: false,
    arrows: false,
  }

  $(document).on('b2bcart.bind.after', function(event) {

    var $slick = $(controller.slickSelector);
    var $slickThums = $(controller.slickThumsSelector);

    var $modal = $('#cart-modal');
    $modal.on('shown.bs.modal', function (e) {
      $slick.slick('setPosition');
    });

    console.log("slick", $slick, $slickThums);
    // init main slick
    if(!$slick.hasClass('slick-initialized')) {
      // init slick
      $slick.slick(slickOptions);

      // set slick thumb click actions
      $slickThums.each(function(index, value) {
        $thumb = $(this);
        $thumb.click(function(){
          $thumb = $(this);
          $slick.slick('slickGoTo', $thumb.data().index);
        });
      });
    }
  });

  console.log("productImagesSlickCtr", controller);
}

rivets.components['product-images-slick'] = {
  template: function() {
    return ProductJS.templates.productImagesSlick;
  },

  initialize: function(el, data) {
    console.log("init product-images-slick", el, data);
    if(!data.product) {
      console.error(new Error("product attribute is required"));
    }
    return new ProductJS.Components.productImagesSlickCtr(el, data);
  }
}