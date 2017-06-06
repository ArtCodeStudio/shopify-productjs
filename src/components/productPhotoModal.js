/**
 * product-photo-modal
 * 
 * @template <product-photo-modal product="product"></product-photo-modal>
 */

if(typeof ProductJS !== 'object') {
    var ProductJS = {};
}

if(typeof ProductJS.Components !== 'object') {
  ProductJS.Components = {};
}

if(!ProductJS.Utilities.isFunction(ProductJS.Components.productPhotoModalCtr)) {
  ProductJS.Components.productPhotoModalCtr = function (element, data) {
    var controller = this;
    controller.product = data.product;
    controller.$element = $(element);

    controller.inB2bcart = false;
    if(data.inB2bcart === true) {
      controller.inB2bcart = true;
    }

    if(controller.inB2bcart) {
       controller.modalID = data.modalID || 'cart-product-photo-modal-'+controller.product.handle;
    } else {
      controller.modalID = data.modalID || 'product-photo-modal-'+controller.product.handle;

    }
    controller.modalSelector = '#'+controller.modalID;
    controller.slickSelector = controller.modalSelector + ' .slick-slider';
    
    // sync fullscreen slick with other slick modal
    controller.sync = false;
    controller.syncTarget = null;
    if(data.sync === true && data.syncTarget) {
      controller.sync = true;
      controller.syncTarget = data.syncTarget;
    }

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

    var initModal = function () {
      // init product photo modal
      var $modal = $(controller.modalSelector);
      var $syncSlick = $(controller.syncTarget )
      $modal.$slick = $modal.find('.slick-slider');

      $modal.on('show.bs.modal', function (e) {
        $this = $(this);
        
        // init modal slick
        if(!$modal.$slick.hasClass('slick-initialized')) {
          var options = {
            dots: false,
          }

          if(controller.sync) {
            options.asNavFor = controller.syncTarget;
          }

          // init slick
          console.log('productPhotoModalCtr init slick', options)
          $modal.$slick.slick(options);

          if(controller.hasColorcard) {
            $modal.$slick.slick('slickRemove', controller.product.images.length - 1, false); // remove last index, this is the colorcard
          }
        }

        // Go to current product slide
        $modal.$slick.slick('slickGoTo', $syncSlick.slick('slickCurrentSlide'), true);
      });

      $modal.on('shown.bs.modal', function (e) {
        $modal.$slick.slick('setPosition');
      });

      // destory bindings on modal hides
      $modal.on('hide.bs.modal', function (e) {
        // if($modal.$slick.hasClass('slick-initialized')) {
        //   $modal.$slick.slick('unslick'); // WORAROUND until gotoslide bug is fixed
        // }
      });

      $modal.on('hiden.bs.modal', function (e) {

      });
    }

    if(controller.inB2bcart === true ) {
      $(document).on('b2bcart.bind.after', initModal);
    } else {
      $(document).on('product.bind.after', initModal);
    }

    console.log("productPhotoModalCtr controller", controller);

  }
}

rivets.components['product-photo-modal'] = {
  template: function() {
    return ProductJS.templates.productPhotoModal;
  },

  initialize: function(el, data) {
    // console.log("init product-photo-modal", el, data);
    if(!data.product) {
      console.error(new Error("product attribute is required"));
    }
    return new ProductJS.Components.productPhotoModalCtr(el, data);
  }
}