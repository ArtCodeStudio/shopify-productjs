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
     * metafield namespace: c_f
     * metafield key: jumplink_enable_colorcard
     * value: Enable the Colorcard for this Product; 0: Colorcard is off; 1: Colorcard is on; default: Colorcard is on [p][_i]
     * 
     * @default: true
     */
    controller.hasColorcard = true;
    if(controller.product.metafields.c_f.jumplink_enable_colorcard === '0') {
      controller.hasColorcard = false;
    }
    console.log('hasColorcard', controller.hasColorcard);

    controller.withFullscreenModal = false;
    if(data.withFullscreenModal === true || data.withFullscreenModal === 'true') {
      controller.withFullscreenModal = true;
    }
    console.log('withFullscreenModal', controller.withFullscreenModal, data.withFullscreenModal);

    controller.waitForB2bcart = false;
    if(data.waitForB2bcart === true || data.waitForB2bcart === 'true') {
      controller.waitForB2bcart = true;
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

    var initModal = function (product, $slick) {
      // init product photo modal
      var $modal = $('#product-photo-modal-'+product.handle);
      $modal.$slick = $modal.find('.slick-slider');

      var onModalSlickChanges = function(event, slickModal, slickModalCurrentSlide) {
        var currentSlide = $slick.slick('slickCurrentSlide')
        if( currentSlide !== slickModalCurrentSlide) {
          $slick.slick('slickGoTo', slickModalCurrentSlide, true);
        }
        var newSlide = $slick.slick('slickCurrentSlide')
      };

      $modal.on('show.bs.modal', function (e) {
        $this = $(this);
        
        // init modal slick
        if(!$modal.$slick.hasClass('slick-initialized')) {
          // init slick
          $modal.$slick.slick({
            dots: false,
            // variableWidth: true,
            // centerMode: true,
            // centerPadding: 0,
            // appendArrows: $(productHandle+' .product-photo-carousel-arrows'),
            initialSlide: $slick.slick('slickCurrentSlide'),
          });
        } else {
          if( $slick.slick('slickCurrentSlide') !==  $modal.$slick.slick('slickCurrentSlide')) {
            $modal.$slick.slick('slickGoTo', $slick.slick('slickCurrentSlide'), true);
          }
        }

      });

      $modal.on('shown.bs.modal', function (e) {
        $modal.$slick.slick('setPosition');
      });

      // destory bindings on modal hides
      $modal.on('hide.bs.modal', function (e) {
        $modal.$slick.unbind('afterChange', onModalSlickChanges);

        if( $modal.$slick.hasClass('slick-initialized')) {
          $modal.$slick.slick('unslick'); // WORAROUND until gotoslide bug is fixed
        }
      });

      $modal.on('hiden.bs.modal', function (e) {

      });
    }

    initSlick = function () {
      var $slick = $(controller.slickSelector);
      var $slickThums = $(controller.slickThumsSelector);

      console.log("initSlick", $slick );

      var $modal = $('#cart-modal');
      $modal.on('shown.bs.modal', function (e) {
        $slick.slick('setPosition', controller.product.images);
      });

      // console.log("slick", $slick, $slickThums);
      // init main slick
      if(!$slick.hasClass('slick-initialized')) {
        // init slick
        $slick.slick(slickOptions);
        if(controller.hasColorcard) {
          console.log("remove last image");
          $slick.slick('slickRemove', controller.product.images.length - 1, false); // remove last index, this is the colorcard
          $slickThums.last().hide(); // hide colorcard thumb
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

      if(controller.withFullscreenModal) {
        initModal(controller.product, $slick);
      }
    };

    if(controller.waitForB2bcart === true ) {
      $(document).on('b2bcart.bind.after', initSlick);
    } else {
      $(document).on('product.bind.after', initSlick);
      initSlick();
    }

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