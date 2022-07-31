// File for your custom JavaScript

/*start of Add to Cart and Check out Now JS*/
var totalPrice,
    installationPrice,
    selector;
var
    standardSku = $("#checkout-form .sku").attr("value"),
    proSku = $("#checkout-form-pro .sku").attr("value"),
    standardName = $("#checkout-form .product-name").attr("value"),
    proName = $("#checkout-form-pro .product-name").attr("value"),
    originSku,
    originName
;

var currentHref;
//add checkout-now URL
currentHref = $("#add-to-cart-new #check-out-now a").attr("href");

//reset all product option when clicking add to cart button
$(".extension-meta-container #add-cart-standard, #add-cart-standard ").on("click", function () {
    //reset records
    selector = $("#checkout-form");
    resetAllOptionRecords(selector, standardSku, standardName);
    //price calculator
    getInstallationPrice(selector);
});

//reset all product option when clicking add to cart button
$(".extension-meta-container #add-cart-pro").on('click', function () {
    //reset records
    selector = $("#checkout-form-pro");
    resetAllOptionRecords(selector, proSku, proName);
    //price calculator
    getInstallationPrice(selector);
});

//perform action for the add to cart button
$("#checkout-form .add-to-cart").on('click', function () {
    //store add to cart product information
    getAddToCartProductInfo($("#checkout-form"));
    //get add to cart product params
    getAddToCartUrl($("#checkout-form"), currentHref);
    // auto close modal
    // autoCloseModalCountdown();
    totalPrice = null;
});

//perform action for the add to cart button
$("#checkout-form-pro .add-to-cart").on('click', function () {
    //store add to cart product information
    getAddToCartProductInfo($("#checkout-form-pro"));
    //get add to cart product params
    getAddToCartUrl($("#checkout-form-pro"),currentHref);
    // auto close modal
    // autoCloseModalCountdown();
    totalPrice = null;
});

function resetAllOptionRecords(selector, skuName, productName) {
    selector.find(".ce").prop("checked", true);
    selector.find(".installation-plus").prop("checked", false);
    selector.find("#add-to-cart-new-btn").removeClass("disabled");
    selector.find(".item-qty").val(1);
    selector.find(".grand-total").text("$" + selector.find(".ce").attr("title"));
    selector.find(".sku").attr("value", skuName);
    selector.find(".product-name").attr("value", productName);
    originSku = selector.find(".sku").attr("value");
    originName = selector.find(".product-name").attr("value");
    installationPrice = 0;
    selector.find("input[type=radio]").change(function () {
        editionSkuChange();
        priceCalculator(installationPrice, selector.find("input.item-qty").val());
    });
    //price change by qty
    selector.find("div.qty-change").on("click", function () {
        changeGrandTotalPrice(selector.find("input.item-qty").val());
    });
    selector.find(".item-qty").on("change", function () {
        changeGrandTotalPrice($(this).val());
    });
    /** Catch enter key on update image form */
    selector.find("input.item-qty").keypress(function (e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            changeGrandTotalPrice($(this).val());
        }
    });
}

//close cart when click outside
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
            var priceSelector = $(".top-cart-action .top-checkout-price");
            var currentItemNum = parseInt($("#item-num").text());
            var qty = parseInt($(this).parent().find(".top-cart-item-quantity").attr("title"));
            var price = parseInt($(this).parent().find(".top-cart-item-price").attr("title"));
            var totalPrice = qty * price;
            var originPrice = parseInt(priceSelector.attr("title"));
            if ((originPrice - totalPrice) === 0) {
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

            $(this).parent().parent().remove();

            var selectedSku = $(this).attr('id');

            for (var i = 0; i < products.length; i++) {
                if (selectedSku === products[i].sku) {
                    position = i;
                    $("#item-num").text(currentItemNum - products[i].qty);
                    break;
                }
            }
            if (position !== -1) {
                products.splice(position, 1);
            }
            localStorage.removeItem("products");
            localStorage.setItem("products", JSON.stringify(products));

        });
    });

    $('#shoppingCartDropdown').show();
});


function initProductCartItems(cartSelector, products) {
    var totalPrice = 0;
    var currentHref;
    var url = "";
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
            url += "sku[" + products[i].sku + "]=" + products[i].qty + "&";

        }
        $('.top-cart-action').html('<span class="float-left top-checkout-price h5" title="' + totalPrice + '">$' + totalPrice + '</span>\n' +
            '            <div class="top-cart-checkout float-right">\n' +
            '              <a class="btn btn-soft btn-sm-primary mp-bg-primary-green transition-3d-hover text-white pt-1 pb-1"\n' +
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

// disable add to cart button when qty <= 0
function changeGrandTotalPrice(qty) {
    if (parseInt(qty) > 0) {
        selector.find("#add-to-cart-new-btn").removeClass("disabled");
        priceCalculator(getInstallationPrice(selector), qty);
    } else {
        selector.find(".grand-total").text("$0");
        selector.find("#add-to-cart-new-btn").addClass("disabled");
    }
}

//get the installation price while checking the installation check-box
function getInstallationPrice(selector) {

    if (selector.find("input[type=checkbox]").is(":checked")) {
        installationPrice = 50;
    } else {
        installationPrice = 0;
    }
    selector.find("input[type=checkbox]").change(function () {
        if ($(this).is(":checked")) {
            installationPrice = 50;
            priceCalculator(installationPrice, selector.find("input.item-qty").val());
        } else {
            installationPrice = 0;
            priceCalculator(installationPrice, selector.find("input.item-qty").val());
        }
    });
    return installationPrice;
}

//price calculator function ( origin price * qty )
function priceCalculator(installationPrice, qty) {

    totalPrice = selector.find("input[type=radio]:checked").attr("title");
    totalPrice = (parseInt(totalPrice) + installationPrice) * qty;
    selector.find(".grand-total").text("$" + totalPrice);
}

//sku installation change function
function editionSkuChange() {

    if (selector.find("input[type=radio]:checked").attr("value") === "0") {
        selector.find(".sku").attr("value", originSku + "-ee");
        selector.find(".product-name").attr("value", originName + " EE");
    } else {
        selector.find(".sku").attr("value", originSku);
        selector.find(".product-name").attr("value", originName);
    }
}

//store the product info to local-storage function
function getAddToCartProductInfo(selector) {
    if (localStorage) {
        var productPrice;
        var products = [];
        var isInstallation = false;
        var price;

        if (JSON.parse(localStorage.getItem("products"))) {
            products = JSON.parse(localStorage.getItem("products"));
        }
        productPrice = (totalPrice != null) ? totalPrice : selector.find(".ce").attr("title");

        //check installation service
        if (selector.find("input[type=checkbox]").is(":checked")) {
            price = (productPrice / selector.find("input.item-qty").val()) - selector.find("input[type=checkbox]").attr("title");
            isInstallation = true;
        } else {
            price = productPrice / selector.find("input.item-qty").val();
            isInstallation = false;
        }
        products = getExtensionsInfo(products, price);
        products = getInstallationServiceInfo(products, isInstallation);
        localStorage.setItem("products", JSON.stringify(products));
        $("#add-to-cart-new h3").text(selector.find(".product-name").attr("value"));
    }
}

getCartItemNum();

//get cart item number function
function getCartItemNum() {
    var products = [],
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
        }
        itemNumSelector.show();
        itemNumSelector.text(addedProduct);
    } else {
        itemNumSelector.hide();
        itemNumSelector.text(0);
    }
}

//store the extensions information
function getExtensionsInfo(products, price) {
    var isDuplicated = false;
    //check extensions product duplicate
    for (var id in products) {
        if (products[id].sku === selector.find(".sku").attr("value")) {
            products[id].qty = products[id].qty + parseInt(selector.find("input.item-qty").val());
            isDuplicated = true;
            break;
        } else {
            isDuplicated = false;
        }
    }

    if (isDuplicated === false) {
        products.push({
            sku: selector.find(".sku").attr("value"),
            name: selector.find(".product-name").attr("value"),
            logo: selector.find(".product-logo").attr("value"),
            qty: parseInt(selector.find("input.item-qty").val()),
            price: price
        });
    }
    return products;
}

//store the installation service information
function getInstallationServiceInfo(products, isInstallation) {
    var isInstallationDuplicated = false;
    //check installation service product duplicate
    for (var id in products) {
        if (isInstallation === true) {
            if (products[id].sku === "installation-service") {
                products[id].qty = products[id].qty + parseInt(selector.find("input.item-qty").val());
                isInstallationDuplicated = true;
                break;
            } else {
                isInstallationDuplicated = false;
            }
        }
    }

    if (isInstallationDuplicated === false && isInstallation === true) {
        products.push({
            sku: "installation-service",
            name: "Installation Service",
            logo: selector.find(".installation-logo").attr("value") + '/assets/img/extensions/installation-service.png',
            qty: parseInt(selector.find("input.item-qty").val()),
            price: 50
        });
    }
    return products;
}

//get add to cart product params
function getAddToCartUrl(selector, currentHref) {
    var itemNum;
    var totalItems = parseInt($("#item-num").text());
    var products = JSON.parse(localStorage.getItem("products"));
    var url = "";
    var itemNumSelector = $("#item-num");

    if (products != null) {
        for (var i = 0; i < products.length; i++) {
            url += "sku[" + products[i].sku + "]=" + products[i].qty + "&";
        }
    }

    var additionalUrl = "adds?" + url + "submit=Checkout+now&mprc=" + selector.find("input[name=mprc]").val();
    //show item num on cart
    itemNum = parseInt(selector.find("input.item-qty").val());
    totalItems += itemNum;

    //check if there are installation products
    if (selector.find("input[type=checkbox]").is(":checked")) {
        itemNum = parseInt(selector.find("input.item-qty").val());
        totalItems += itemNum;
    }
    itemNumSelector.show();
    itemNumSelector.text(totalItems);

    $("#add-to-cart-new #check-out-now a").attr("href", currentHref + additionalUrl);
}

reviewListTree("#review-section div.review-content", "#review-section .load-more", 5);
reviewListTree(".simple-release-note ul.list-group", ".simple-release-note .load-more", 3);

// show more,back review list
function reviewListTree(selector, load, recordNum) {
    var reviewCount;
    reviewCount = $(selector).length;
    $(selector).slice(0, recordNum).show();
    if (reviewCount <= recordNum) {
        $(load).hide();
    } else {
        // $(".back-to-top").hide('fast');
        $(load).on("click", function () {
            if ($(this).hasClass("load-more")) {
                $(selector + ":hidden").slideDown("fast");
                $(this).removeClass("load-more").addClass("back-to-top");
                $(this).text("Collapse");
            } else {
                $(selector).slice(recordNum, reviewCount).slideUp("fast");
                $(this).removeClass("back-to-top").addClass("load-more");
                $(this).text("Load More");

            }
        });
    }
}

/**
 *  add to cart by sku function
 *  var item = [{sku:"m2-shop-by-brand-ee",qty:2},{sku:"m2-shop-by-brand",qty:2}];
 *
 */
function addToCartbySku(item) {
    var itemNum;
    var totalItems = parseInt($("#item-num").text());
    var itemNumSelector = $("#item-num");

    for (var i in mpExtensions) {
        for (var y in item) {
            if (mpExtensions[i].sku == item[y].sku || mpExtensions[i].sku + '-ee' == item[y].sku) {
                if (localStorage) {
                    var productPrice;
                    var productName;
                    var products = [];
                    if (JSON.parse(localStorage.getItem("products"))) {
                        products = JSON.parse(localStorage.getItem("products"));
                    }
                    if (item[y].sku.lastIndexOf('-ee') >= 0) {
                        productPrice = parseInt(mpExtensions[i].price) + 200;
                        productName = mpExtensions[i].name + ' EE';
                    } else {
                        productPrice = parseInt(mpExtensions[i].price);
                        productName = mpExtensions[i].name;
                    }

                    var isDuplicated = false;
                    //check extensions product duplicate
                    for (var id in products) {
                        if (products[id].sku === item[y].sku) {
                            products[id].qty = products[id].qty + item[y].qty;
                            isDuplicated = true;
                            break;
                        } else {
                            isDuplicated = false;
                        }
                    }

                    if (isDuplicated === false) {
                        products.push({
                            sku: item[y].sku,
                            name: productName,
                            logo: mpExtensions[i].logo,
                            qty: item[y].qty,
                            price: productPrice
                        });
                    }
                    localStorage.setItem("products", JSON.stringify(products));
                    //show item num on cart
                    itemNum = item[y].qty;
                    totalItems += itemNum;
                    itemNumSelector.show();
                    // itemNumMobileSelector.show();
                    itemNumSelector.text(totalItems);
                    // itemNumMobileSelector.text(totalItems);
                }
            }
        }
    }
}

/** Frequently Bought Together add cart */
$('#fbt-add-cart').on('click', function () {
    var fbtItem = $('#fbt-container-plus-item');
    var fbtSku = fbtItem.find('.fbt-item-title').attr('data-sku');
    item = [{sku: fbtSku, qty: 1}];
    addToCartbySku(item);
});

/**
 * Rating star for rating form
 * File: ../assets/js/plugin/starrr.js
 * Source: https://github.com/dobtco/starrr
 */
$("#mageplaza-rating-stars").starrr({
    emptyClass: "far fa-star",
    fullClass: "fas fa-star",
    change: function (e, value) {
        $("#review-form").find("input[id=rating-star]").val(value);
    }
});

/**
 * Ajax submit review form
 */
$("#review-form").submit(function (event) {
    event.preventDefault();

    var data = $("form#review-form").serialize(),
        ratingValue = $("form#review-form input#rating-star").val(),
        submitBtn = $("form#review-form button#submit-button");
    if (ratingValue === "0") {
        alert("Please fill out the rating");
    } else {
        submitBtn.prop("disabled", true);
        $.ajax({
            type: "POST",
            url: "https://dashboard.mageplaza.com/mageplaza/review/ajaxSubmit",
            data: data,
            dataType: "json",
            success: function (response) {
                if (response.alert === "success") {
                    alert(response.msg);
                    $("#review-form")[0].reset();
                } else {
                    alert(response.msg);
                }
            },
            complete: function () {
                submitBtn.prop("disabled", false);
            }
        });
    }
});

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

$(document).ready(function () {
    var owl = $('.owl-carousel');
    owl.owlCarousel({
        margin: 10,
        nav: false,
        items: 1,
        loop: true,
        autoplay: true,
        autoplayTimeout: 5000
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
    $('.autocomplete-suggestions').hide();
});
