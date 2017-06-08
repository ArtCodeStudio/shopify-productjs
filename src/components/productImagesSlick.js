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

    controller.inB2bcart = false;
    if(data.inB2bcart === true || data.inB2bcart === 'true') {
      controller.inB2bcart = true;
    }

    if(controller.inB2bcart) {
      controller.slickID = 'cart-product-images-slick-'+controller.product.handle;
      controller.modalID = 'cart-product-photo-modal-'+controller.product.handle;
    } else {
      controller.slickID = 'product-images-slick-'+controller.product.handle;
      controller.modalID = 'product-photo-modal-'+controller.product.handle;
    }
    controller.slickSelector = '#'+controller.slickID;
    controller.modalSelector = '#'+controller.modalID;

    controller.imageColClass = 'col-xs-12';

    // sync fullscreen slick with other slick modal
    controller.sync = false;
    controller.syncTarget = null;
    if(data.sync === true && data.syncTarget) {
      controller.sync = true;
      if(controller.inB2bcart) {
        controller.syncTarget = data.syncTarget || 'product-photo-modal-'+controller.product.handle;
      } else {
        controller.syncTarget = data.syncTarget || 'cart-product-photo-modal-'+controller.product.handle;
      }
    }

    /**
     * If hasColorcard is true the last image of the product images is markt as the colorcard
     * metafield namespace: c_f
     * metafield key: jumplink_enable_colorcard
     * value: Enable the Colorcard for this Product; 0: Colorcard is off; 1: Colorcard is on; default: Colorcard is on [p][_i]
     * 
     * @default: on
     */
    controller.hasColorcard = true;
    if(controller.product.metafields.c_f.jumplink_enable_colorcard === '0') {
      controller.hasColorcard = false;
    }

    controller.withFullscreenModal = false;
    if(data.withFullscreenModal === true ) {
      controller.withFullscreenModal = true;
    }

    controller.hasParentModal = false;
    if(data.hasParentModal === true) {
      controller.hasParentModal = true;
      controller.$parentModal = $(data.parentModalTarget);
      // console.log('productImagesSlickCtr hasParentModal', controller.hasParentModal, data.parentModalTarget, controller.$parentModal);
    }

    controller.backgroundClass = 'background-box ratio-1-2';
    if(typeof(data.backgroundClass) === 'string') {
      controller.backgroundClass = data.backgroundClass;
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

    initSlick = function () {
      var $slick = $(controller.slickSelector);
      var $slickThums = $(controller.slickThumsSelector);

      var slickOptions = {
        dots: false,
        arrows: false,
      }

      if(controller.sync) {
        options.asNavFor = controller.syncTarget;
      }

      // console.log('productImagesSlickCtr initSlick', slickOptions, $slick);

      // console.log("slick", $slick, $slickThums);
      // init main slick
      if(!$slick.hasClass('slick-initialized')) {
        // init slick
        $slick.slick(slickOptions);
        if(controller.hasColorcard) {
          // console.log("remove last image");
          if(data.product.images.length > 1) {
            $slick.slick('slickRemove', controller.product.images.length - 1, false); // remove last index, this is the colorcard
            $slickThums.last().hide(); // hide colorcard thumb
          }
        }

        if(controller.hasParentModal) {
          controller.$parentModal.on('shown.bs.modal', function (e) {
            console.log('productImagesSlickCtr shown.bs.modal', controller.$parentModal);
            $slick.slick('setPosition');
          });
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
        // initModal(controller.product, $slick);
      }
    };

    if(controller.inB2bcart === true ) {
      $(document).on('b2bcart.bind.after', initSlick);
    } else {
      $(document).on('product.bind.after', initSlick);
    }
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