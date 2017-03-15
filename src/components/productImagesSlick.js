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

if(!ProductJS.Utilities.isFunction(ProductJS.Components.productImagesSlickCtr)) {
  ProductJS.Components.productImagesSlickCtr = function (element, data) {
    var controller = this;
    controller.product = data.product;
    controller.$element = $(element);
    controller.slickID = 'product-images-slick-'+controller.product.handle;
    controller.slickSelector = '#'+controller.slickID;
    controller.imageColClass = 'col-xs-12';
  

    /**
     * If hasColorcard is true the last image of the product images is markt as the colorcard
     * 
     * @default: false
     */
    controller.hasColorcard = false;
    if(typeof(data.hasColorcard) !== 'undefined') {
      controller.hasColorcard = (data.hasColorcard === true || data.hasColorcard === 'true');
    }

    /**
     * Show thumnails of each product image, click on it to swith to this image
     * 
     * @default: true
     */
    controller.showThums = true;
    if(typeof(data.showThums) !== 'undefined') {
      controller.showThums = (data.showThums === true || data.showThums === 'true');
    }


    if(controller.showThums) {
      controller.slickThumsID = 'product-thumbs-'+controller.product.handle;
      controller.slickThumsSelector = '#'+controller.slickThumsID+' .thumb';
      controller.thumColClass = 'hidden-sm-down col-sm-2';
      controller.imageColClass = 'col-xs-12 col-sm-10';
    }

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

      // console.log("slick", $slick, $slickThums);
      // init main slick
      if(!$slick.hasClass('slick-initialized')) {
        // init slick
        $slick.slick(slickOptions);

        if(controller.hasColorcard && controller.product.images.length > 0) {
           $slick.slick('slickRemove', controller.product.images.length - 1, false); // remove last index
        }
       

        // set slick thumb click actions
        if(controller.showThums) {
          $slickThums.each(function(index, value) {
            $thumb = $(this);
            $thumb.click(function(){
              $thumb = $(this);
              $slick.slick('slickGoTo', $thumb.data().index);
            });
          });
        }
      }

    });

    // console.log("productImagesSlickCtr", controller);
  }
}

rivets.components['product-images-slick'] = {
  template: function() {
    return ProductJS.templates.productImagesSlick;
  },

  initialize: function(el, data) {
    // console.log("init product-images-slick", el, data);
    if(!data.product) {
      console.error(new Error("product attribute is required"));
    }
    return new ProductJS.Components.productImagesSlickCtr(el, data);
  }
}