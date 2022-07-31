// File for your custom JavaScript

var currentHref;
//add checkout-now URL
currentHref = $(".add-to-cart-new .check-out-now a").attr("href");


// //close cart when click outside
$('body').click(function (e) {
    if (!$(e.target).closest('#shoppingCartDropdown').length && !$(e.target).closest('a#shoppingCartDropdownInvoker').length && !$(e.target).hasClass('remove-item')) {
        $('#shoppingCartDropdown').hide();
    }
});

//Open shopping cart
$('#shoppingCartDropdownInvoker').on('click', function () {
    var products = [];
    if (JSON.parse(localStorage.getItem("products"))) {
        products = JSON.parse(localStorage.getItem("products"));
    }
    initProductCartItems($('#shoppingCartDropdown'), products);

    //remove items from cart
    $(".top-cart-item .top-cart-item-desc i").each(function () {
        $(this).on("click", function () {
            var position;
            var finalPrice = 0;
            var totalExtension = 0;
            var priceSelector = $(".top-cart-action .top-checkout-price");
            var currentItemNum = parseInt($("#item-num").text());
            var qty = parseInt($(this).parent().find(".top-cart-item-quantity").attr("title"));
            var price = parseInt($(this).parent().find(".top-cart-item-price").attr("title"));
            var totalPrice = qty * price;
            var originPrice = parseInt(priceSelector.attr("title"));
            var currentQty;
            var selectedSku = $(this).attr('id');

            for (var i = 0; i < products.length; i++) {
                if (selectedSku === products[i].sku) {
                    position = i;
                    currentQty = currentItemNum - products[i].qty;
                    $("#item-num").text(currentQty);
                    if (currentQty === 0) {
                        $(".top-cart-action").html('');
                        $('#shoppingCartDropdown .shopping-cart-content').html('<span class="btn btn-icon btn-soft-primary rounded-circle mb-3">' +
                            '                <span class="fas fa-shopping-basket btn-icon__inner"></span>' +
                            '              </span>' +
                            '              <span class="d-block">Your Cart is Empty</span>');
                        $("#item-num").hide();
                    } else {
                        priceSelector.attr("title", (originPrice - totalPrice));
                        priceSelector.text("$" + (originPrice - totalPrice));
                    }

                    break;
                }
            }
            $(this).parent().parent().remove();
            if (position !== -1) {
                products.splice(position, 1);
            }
            localStorage.removeItem("products");
            localStorage.setItem("products", JSON.stringify(products));
            if (products != null) {
                for (var j = 0; j < products.length; j++) {
                    finalPrice += products[j].price * products[j].qty;
                    if (products[j].price > 0) {
                        totalExtension += products[j].qty;
                    }
                }
            }
            mpGlobalScript.checkPromoCondition(finalPrice, totalExtension);
        });
    });

    $('#shoppingCartDropdown').show();
});


//remove items from storage while added to store
function removeCart() {
    localStorage.removeItem("products");
}

function initProductCartItems(cartSelector, products) {
    var totalPrice = 0;
    var currentHref;
    var url = getAddToCartUrlFromProducts(products);
    var mprc = 'default';

    cartSelector.find('.shopping-cart-content').html('');
    if (products.length) {
        for (var i = 0; i < products.length; i++) {

            $(".shopping-cart-content").add('<div class="top-cart-item clearfix"><div class="top-cart-item-image">' +
                '<a href="#">' +
                '<img src="' + products[i].logo + '" ' +
                'alt="' + products[i].name + '"></a></div>' +
                '<div class="top-cart-item-desc text-left">' +
                '<a href="#">' + products[i].name + '</a>' +
                '<span class="top-cart-item-price" title="' + products[i].price + '">$' + products[i].price + '</span>' +
                '<i id="' + products[i].sku + '" class="fas fa-trash-alt remove-item"></i>' +
                '<span class="top-cart-item-quantity" title="' + products[i].qty + '">x ' + products[i].qty + '</span></div></div>').appendTo($(".shopping-cart-content"));

            totalPrice += (products[i].qty) * (products[i].price);
            // url += "sku[" + products[i].sku + "]=" + products[i].qty + "&";

        }
        $('.top-cart-action').html('<span class="float-left top-checkout-price h5" title="' + totalPrice + '">$' + totalPrice + '</span>\n' +
            '            <div class="top-cart-checkout float-right">\n' +
            '              <a id="check-out-now" onclick="removeCart()" class="btn btn-soft btn-sm-primary mp-bg-primary-green transition-3d-hover text-white pt-1 pb-1"\n' +
            '                  href="https://dashboard.mageplaza.com/onestepcheckout/index/">Checkout</a>\n' +
            '            </div>');

        currentHref = $(".top-cart-checkout a").attr("href");

        var additionalUrl = "adds?" + url + "submit=Checkout+now&mprc=" + mprc;
        $(".top-cart-checkout a").attr("href", currentHref + additionalUrl);
    } else {
        cartSelector.find('.shopping-cart-content').html('<span class="btn btn-icon btn-soft-primary rounded-circle mb-3">' +
            '                <span class="fas fa-shopping-basket btn-icon__inner"></span>' +
            '              </span>' +
            '              <span class="d-block">Your Cart is Empty</span>');
        cartSelector.find('.top-cart-action').html('');
    }
}

getCartItemNum();

//get cart item number function
function getCartItemNum() {
    var products = [],
        totalPrice = 0,
        totalExtension = 0,
        itemNumSelector = $("#item-num");

    if (localStorage) {
        if (JSON.parse(localStorage.getItem("products"))) {
            products = JSON.parse(localStorage.getItem("products"));
        }
    }
    var addedProduct = 0;

    if (products.length) {
        for (var i = 0; i < products.length; i++) {
            addedProduct += products[i].qty;
            totalPrice += products[i].price * products[i].qty;
            if (products[i].price > 0) {
                totalExtension += products[i].qty;
            }
        }
        itemNumSelector.show();
        itemNumSelector.text(addedProduct);
    } else {
        itemNumSelector.hide();
        itemNumSelector.text(0);
    }

    mpGlobalScript.checkPromoCondition(totalPrice, totalExtension);
}

function getAddToCartUrlFromProducts(products) {
    var url = '';
    if (products != null) {
        for (var i = 0; i < products.length; i++) {
            url += "sku[" + products[i].sku + "]=" + products[i].qty + "&";

            if (products[i].hasOwnProperty('options')) {
                for (var j in products[i].options) {
                    if (products[i].options.hasOwnProperty(j)) {
                        url += "options[" + products[i].sku + "][" + j + "]=" + encodeURI(products[i].options[j]) + "&";
                    }
                }
            }
        }
    }

    return url;
}

$("#subscribe-form").submit(function (event) {

    event.preventDefault();

    var data = $('form#subscribe-form').serialize();
    $.ajax({
        type: 'POST',
        url: 'https://dashboard.mageplaza.com/mageplaza/subscribe/ajaxSubscribe',
        data: data,
        dataType: "json",
        success: function (response) {
            if (response.alert === 'success') {
                $('form#subscribe-form .mp-message-box').html('<div class="success-message">' + response.msg + '</div>');
                $('form#subscribe-form')[0].reset();
            } else {
                $('form#subscribe-form .mp-message-box').html('<div class="error-message">' + response.msg + '</div>');
            }
        }
    });
});

$("#stay-in-know-form").submit(function (event) {

    event.preventDefault();

    var data = $('form#stay-in-know-form').serialize();
    $.ajax({
        type: 'POST',
        url: 'https://dashboard.mageplaza.com/mageplaza/subscribe/ajaxSubscribe',
        data: data,
        dataType: "json",
        success: function (response) {
            if (response.alert === 'success') {
                $('form#stay-in-know-form .mp-message-box').html('<div class="success-message">' + response.msg + '</div>');
                $('form#stay-in-know-form')[0].reset();
            } else {
                $('form#stay-in-know-form .mp-message-box').html('<div class="error-message">' + response.msg + '</div>');
            }
        }
    });

});
// Fly nav
// show/hide nav
function mpFlyNav() {
    if ($('.mp-offset-flynav').offset()) { //check the flynav is exist
        if ($(window).scrollTop() > $('.mp-offset-flynav').offset().top) {
            $('.fly-nav-wrapper').fadeIn(500);
        } else {
            $('.fly-nav-wrapper').fadeOut(500);
        }
    }

}

mpFlyNav();
$(window).scroll(function () {
    mpFlyNav();
});

$('a#mp-search-button').on('click', function () {
    $('#searchPushTop').slideToggle('fast');
    if ($(this).hasClass('active')) {
        $(this).removeClass('active');
    } else {
        $('#searchPushTop input').focus();
        $(this).addClass('active');
    }
});
