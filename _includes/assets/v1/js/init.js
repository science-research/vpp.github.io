(function ($) {
    $(function () {

        var window_width = $(window).width();

        // convert rgb to hex value string
        function rgb2hex(rgb) {
            if (/^#[0-9A-F]{6}$/i.test(rgb)) {
                return rgb;
            }

            rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);

            if (rgb === null) {
                return "N/A";
            }

            function hex(x) {
                return ("0" + parseInt(x).toString(16)).slice(-2);
            }

            return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
        }

        $('.dynamic-color .col').each(function () {
            $(this).children().each(function () {
                var color = $(this).css('background-color'),
                    classes = $(this).attr('class');
                $(this).html(rgb2hex(color) + " " + classes);
                if (classes.indexOf("darken") >= 0 || $(this).hasClass('black')) {
                    $(this).css('color', 'rgba(255,255,255,.9');
                }
            });
        });


        // Floating-Fixed table of contents
        setTimeout(function () {
            var tocWrapperHeight = 500; // Max height of ads.
            var tocHeight = $('.toc-wrapper .table-of-contents').length ? $('.toc-wrapper .table-of-contents').height() : 0;
            var socialHeight = 100; // Height of unloaded social media in footer.
            var footerOffset = $('footer').first().length ? $('footer').first().offset().top : 0;
            var bottomOffset = footerOffset - socialHeight - tocHeight - tocWrapperHeight;

            if ($('nav').length) {
                $('.toc-wrapper').pushpin({
                    top: $('nav').height(),
                    bottom: bottomOffset
                });
            }
            else if ($('#index-banner').length) {
                $('.toc-wrapper').pushpin({
                    top: $('#index-banner').height(),
                    bottom: bottomOffset
                });
            }
            else {
                $('.toc-wrapper').pushpin({
                    top: 0,
                    bottom: bottomOffset
                });
            }
        }, 100);


        // Github Latest Commit
        // if ($('.github-commit').length) { // Checks if widget div exists (Index only)
        //   $.ajax({
        //     url: "https://api.github.com/repos/dogfalo/materialize/commits/master",
        //     dataType: "json",
        //     success: function (data) {
        //       var sha = data.sha,
        //           date = jQuery.timeago(data.commit.author.date);
        //       if (window_width < 1120) {
        //         sha = sha.substring(0,7);
        //       }
        //       $('.github-commit').find('.date').html(date);
        //       $('.github-commit').find('.sha').html(sha).attr('href', data.html_url);
        //     }
        //   });
        // }

        // Toggle Flow Text
        var toggleFlowTextButton = $('#flow-toggle');
        toggleFlowTextButton.click(function () {
            $('#flow-text-demo').children('p').each(function () {
                $(this).toggleClass('flow-text');
            });
        });

//    Toggle Containers on page
        var toggleContainersButton = $('#container-toggle-button');
        toggleContainersButton.click(function () {
            $('body .browser-window .container, .had-container').each(function () {
                $(this).toggleClass('had-container');
                $(this).toggleClass('container');
                if ($(this).hasClass('container')) {
                    toggleContainersButton.text("Turn off Containers");
                }
                else {
                    toggleContainersButton.text("Turn on Containers");
                }
            });
        });

        // Detect touch screen and enable scrollbar if necessary
        function is_touch_device() {
            try {
                document.createEvent("TouchEvent");
                return true;
            } catch (e) {
                return false;
            }
        }

        if (is_touch_device()) {
            $('#nav-mobile').css({overflow: 'auto'});
        }

        // Set checkbox on forms.html to indeterminate
        var indeterminateCheckbox = document.getElementById('indeterminate-checkbox');
        if (indeterminateCheckbox !== null)
            indeterminateCheckbox.indeterminate = true;


        // Plugin initialization
        $('.carousel.carousel-slider').carousel({full_width: true});
        $('.carousel').carousel();
        $('.slider').slider({full_width: true});
        $('.parallax').parallax();
        $('.scrollspy').scrollSpy();
        $('.button-collapse').sideNav({'edge': 'left'});
        $('.datepicker').pickadate({selectYears: 20});
        $('select').not('.disabled').material_select();
        $(".dropdown-button").dropdown();
        //Add responsive image class to all images in #page-content div
        $("#page-content img").addClass("responsive-img");

        $('input#input_text, textarea#review_content').characterCounter();


        $("div.lazy").lazyload({
            effect: "fadeIn"
        });
        $("img.lazy").lazyload({
            effect: "fadeIn"
        });


        $("#review-form").submit(function () {
            event.preventDefault();

            var data = $('form#review-form').serialize(),
                ratingValue = $('form#review-form input#rating-star').val(),
                submitBtn = $('form#review-form button#submit-button');
            if (ratingValue === '0') {
                Materialize.toast('Please fill out the rating', 3000, 'red');
            } else {
                submitBtn.prop('disabled', true);
                $.ajax({
                    type: 'POST',
                    url: 'https://dashboard.mageplaza.com/mageplaza/review/ajaxSubmit',
                    data: data,
                    dataType: "json",
                    success: function (response) {
                        if (response.alert == 'success') {
                            Materialize.toast(response.msg, 3000, 'green');
                            $('#review-form')[0].reset();
                        } else {
                            Materialize.toast(response.msg, 3000, 'red');
                        }
                    },
                    complete: function () {
                        submitBtn.prop('disabled', false);
                    }
                });
            }
        });


        $("#subscribe-form").submit(function () {

            event.preventDefault();

            var data = $('form#subscribe-form').serialize() + '&isAjax=true';
            $.ajax({
                type: 'POST',
                url: 'https://dashboard.mageplaza.com/mageplaza/subscribe/ajaxSubscribe',
                data: data,
                dataType: "json",
                success: function (response) {
                    if (response.alert == 'success') {
                        Materialize.toast(response.msg, 3000, 'green');
                        // $('#subscribe-form')[0].reset();
                    } else {
                        Materialize.toast(response.msg, 3000, 'red');
                    }
                }
            });

        });

        $("#notifyme-form").submit(function () {

            event.preventDefault();

            $('#notify-error-msg').html(''); //clean up msg

            var data = $('form#notifyme-form').serialize();
            $.ajax({
                type: 'POST',
                url: 'https://services.mageplaza.com/email/notifyme.php',
                data: data,
                dataType: "json",
                success: function (response) {
                    if (response.status == '200') {
                        $('#notify-me-modal').modal('close');
                        Materialize.toast(response.msg, 3000, 'green');
                    } else {

                        $('#notify-error-msg').html(response.msg);

                        Materialize.toast(response.msg, 3000, 'red');
                    }
                }
            });

        });


        jQuery('#kb-content > h2:eq(0)').before(jQuery('#top-ads'));
        // jQuery('#m2md-content > h2:eq(0)').before(jQuery('#m2md-series'));
        jQuery('#m2md-series').appendTo('#m2md-content > p:eq(1)');

        $('.modal-trigger').leanModal();
        $('.materialboxed').materialbox();
        $('.collapsible').collapsible({
            accordion: false
        });
        $('ul.tabs').tabs();

        if ($('#review-section .card-content li').size() == 0) {
            $('#review-section').hide();
        }

        $("#toTop").scrollTop(300);

        $('.dropdown-button').dropdown({
                inDuration: 300,
                outDuration: 225,
                constrain_width: true, // Does not change width of dropdown to that of the activator
                hover: true, // Activate on hover
                gutter: 0, // Spacing from edge
                belowOrigin: true, // Displays dropdown below the button
                alignment: 'left' // Displays dropdown with edge aligned to the left of button
            }
        );

        // Fly nav
        // show/hide nav
        function mpFlyNav() {
            if ($('.mp-offset-flynav').offset()) { //check the flynav is exist
                if ($(window).scrollTop() > $('.mp-offset-flynav').offset().top) {
                    $('.mp-fly-nav').fadeIn(500);
                } else {
                    $('.mp-fly-nav').fadeOut(500);
                }
            }

        }

        mpFlyNav();
        $(window).scroll(function () {
            mpFlyNav();
        });

        // collapse nav button
        // $(".button-collapse").sideNav();


        // JS cookie produce

        function getParameterByName(name, url) {
            if (!url) url = window.location.href;
            name = name.replace(/[\[\]]/g, "\\$&");
            var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return '';
            return decodeURIComponent(results[2].replace(/\+/g, " "));
        }

        var affCode = getParameterByName('u');

        if (affCode) {
            Cookies.set('mprc', affCode, {expires: 7});
        }

        //check is product page && has cookie mprc
        if ($('#mprc').val() && Cookies.get('mprc')) {
            $('#mprc').val(Cookies.get('mprc')); //add refer code to submit form
        }

        /* -------------------------------------------------- START LIVESITE development --------------------------------------------------*/

        getRatingPoint();
        reviewListTree("#review-section li", "#review-section .load-more", 5);
        reviewListTree(".simple-release-note .collection", ".simple-release-note .load-more", 3);
        screenshotSlider();

        // show rating point
        function getRatingPoint() {
            var rating,
                ratingPoint
            ;
            rating = $(".rating-css-light-stars").attr('title');
            ratingPoint = (rating / 20).toFixed(1);
            // $("#review-stars span").text(ratingPoint);

            $('.review-rate-box').raterater({
                allowChange: true,
                starWidth: 10,
                spaceWidth: 1,
                numStars: 5,
                isStatic: true,
            });

        }

        // show more,back review list
        function reviewListTree(selector, load, recordNum) {
            var reviewCount;
            reviewCount = $(selector).length;
            $(selector).slice(0, recordNum).show();
            if (reviewCount <= recordNum) {
                $(load).hide();
            } else {
                // $(".back-to-top").hide('fast');
                $(load).on('click', function () {
                    if ($(this).hasClass("load-more")) {
                        $(selector + ":hidden").slideDown('fast');
                        $(this).removeClass('load-more').addClass('back-to-top');
                        $(this).text('Collapse');
                    } else {
                        $(selector).slice(recordNum, reviewCount).slideUp('fast');
                        $(this).removeClass('back-to-top').addClass('load-more');
                        $(this).text('Load More');
                    }
                });
            }
        }

        //init screenshots slider view
        function screenshotSlider() {
            $("#screenshots-carousel a").fancybox();
            $("#screenshots-carousel").owlCarousel({
                nav: true,
                navText: ["<span class='nav-button nav-prev'></span>", "<span class='nav-button nav-next'></span>"],
                autoplay: false,
                center: false,
                lazyLoad: true,
                responsiveClass: true,
                responsive: {
                    0: {items: 1},
                    360: {items: 2},
                    540: {items: 3},
                    720: {items: 4},
                    900: {items: 5}
                }
            });
        }


        //init mageplaza rating submit form
        $(".mageplaza-rating-stars").stars({
            color: '#e7711b',
            value: 0,
            click: function (i) {
                $("#review-form").find("input[id=rating-star]").val(i);
            }
        });


        //start CART JS
        getCartItemNum();

        //open cart action
        $(".nav-wrapper #cart").on("click", function () {
            var products = [];
            if (JSON.parse(localStorage.getItem("products"))) {
                products = JSON.parse(localStorage.getItem("products"));
            }
            if ($(".cart-items li")) {
                $(".cart-items li").remove();
                $(".shopping-cart-footer").remove();
            }
            if ($(".cart-items p")) {
                $(".cart-items p").remove();
            }
            addProductsAction(products);
            $(".shopping-cart").toggle();

            //remove items from cart
            $(".cart-items li i").each(function () {
                $(this).on("click", function () {
                    var position;
                    var priceSelector = $(".shopping-cart-footer .price");
                    var currentItemNum = parseInt($("#item-num").text());
                    var qty = parseInt($(this).first().parent().parent().find(".item-qty").attr("title"));
                    var price = parseInt($(this).first().parent().parent().find(".item-price").attr("title"));
                    var totalPrice = qty * price;
                    var originPrice = parseInt(priceSelector.attr("title"));
                    if ((originPrice - totalPrice) === 0) {
                        $(".shopping-cart-footer").remove();
                        $(".shopping-cart").toggle();
                        $("#item-num").hide();
                        $("#item-num-mobile").hide();
                    } else {
                        priceSelector.attr("title", (originPrice - totalPrice));
                        priceSelector.text("$" + (originPrice - totalPrice));
                    }

                    $(this).parent().parent().parent().remove();

                    var selectedSku = $(this).attr('id');

                    for (var i = 0; i < products.length; i++) {
                        if (selectedSku === products[i].sku) {
                            position = i;

                            $("#item-num").text(currentItemNum - products[i].qty);
                            $("#item-num-mobile").text(currentItemNum - products[i].qty);
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

            //remove all product from storage when clicking checkout button
            $(".shopping-cart-submit a").on("click", function () {
                localStorage.removeItem("products");
            });

        });

        //close cart when click outside
        $('body').click(function (e) {

            if (!$(e.target).closest('.shopping-cart').length && !$(e.target).closest('a#cart').length && !$(e.target).hasClass('remove-item')) {
                $('.shopping-cart').hide();
            }
        });

        //get cart item number function
        function getCartItemNum() {
            var products = [],
                itemNumSelector = $("#item-num"),
                itemNumMobileSelector = $("#item-num-mobile")
            ;

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
                itemNumMobileSelector.show();
                itemNumSelector.show();
            } else {
                itemNumMobileSelector.hide();
                itemNumSelector.hide();
            }
            itemNumSelector.text(addedProduct);
            itemNumMobileSelector.text(addedProduct);
        }

        //generate cart html
        function addProductsAction(products) {
            var totalPrice = 0;
            var currentHref;
            var url = "";
            var mprc = (Cookies.get('mprc')) ? Cookies.get('mprc') : 'default';
            if (products.length) {
                for (var i = 0; i < products.length; i++) {

                    $(".cart-items").add('<li class="clearfix">\n' +
                        '                    <img src="' + products[i].logo + '"/>\n' +
                        '                    <div class="item-info">\n' +
                        '                        <span class="item-name">' + products[i].name + '<i id="' + products[i].sku + '" class="material-icons remove-item">clear</i></span>\n' +
                        '                        <span class="item-qty" title="' + products[i].qty + '">' + products[i].qty + ' X </span>\n' +
                        '                        <span class="item-price" title ="' + products[i].price + '">$' + products[i].price + '</span>\n' +
                        '\n' +
                        '                    </div>\n' +
                        '                </li>').appendTo($(".cart-items"));

                    totalPrice += (products[i].qty) * (products[i].price);
                    url += "sku[" + products[i].sku + "]=" + products[i].qty + "&";

                }
                $('<div class="shopping-cart-footer clearfix">\n' +
                    '            <div class="shopping-cart-total">\n' +
                    '                <span class="total-price-cart">Total:</span>\n' +
                    '                <span class="price" title="' + totalPrice + '">$' + totalPrice + '</span>\n' +
                    '            </div>\n' +
                    '            <div class="shopping-cart-submit center-align">\n' +
                    '                <a href="https://dashboard.mageplaza.com/onestepcheckout/index/" class="waves-effect waves-light btn green">Checkout</a>\n' +
                    '            </div>\n' +
                    '        </div>').appendTo($(".shopping-cart-content"));
                currentHref = $(".shopping-cart-submit a").attr("href");

                var additionalUrl = "adds?" + url + "submit=Checkout+now&mprc="+ mprc;
                $(".shopping-cart-submit a").attr("href", currentHref + additionalUrl);
            } else {
                $('<p>There are no items in your cart.</p>').appendTo($(".cart-items"));
            }
        }// END Cart JS


        /*start of Add to Cart and Check out Now JS*/
        var totalPrice,
            installationPrice,
            selector
        ;
        var standardSku = $("#checkout-form .sku").attr("value"),
            proSku = $("#checkout-form-pro .sku").attr("value"),
            standardName = $("#checkout-form .product-name").attr("value"),
            proName = $("#checkout-form-pro .product-name").attr("value"),
            originSku,
            originName
        ;

        //reset all product option when clicking add to cart button
        $(".extension-meta-container #add-cart-standard, #add-cart-standard ").on('click', function () {
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

        function resetAllOptionRecords(selector, skuName, productName) {
            selector.find(".ce").prop("checked", true);
            selector.find(".installation-plus").prop("checked", false);
            selector.find(".item-qty").val(1);

            selector.find(".grand-total").text('$' + selector.find(".ce").attr("title"));
            selector.find(".sku").attr("value", skuName);
            selector.find(".product-name").attr("value", productName);
            originSku = selector.find(".sku").attr("value");
            originName = selector.find(".product-name").attr("value");
            installationPrice = 0;
            selector.find("input[type=radio]").change(function () {
                editionSkuChange();
                priceCalculator(installationPrice, selector.find("input[type=number]").val());
            });
            //price change by qty
            selector.find("input[type=number]").change(function () {
                priceCalculator(getInstallationPrice(selector), $(this).val())
            });
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

        //price calculator function ( origin price * qty )
        function priceCalculator(installationPrice, qty) {

            totalPrice = selector.find("input[type=radio]:checked").attr("title");
            totalPrice = (parseInt(totalPrice) + installationPrice) * qty;
            selector.find(".grand-total").text('$' + totalPrice);
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
                    priceCalculator(installationPrice, selector.find("input[type=number]").val());
                } else {
                    installationPrice = 0;
                    priceCalculator(installationPrice, selector.find("input[type=number]").val());
                }
            });
            return installationPrice;
        }

        //remove items from storage while added to store
        $("#check-out-now a").on('click', function () {
            localStorage.removeItem("products");
        });

        var currentHref;
        //add checkout-now URL
        currentHref = $("#add-to-cart-new #check-out-now a").attr("href");

        //perform action for the add to cart button
        $("#checkout-form .add-to-cart").on('click', function () {
            //store add to cart product information
            getAddToCartProductInfo($("#checkout-form"));
            //get add to cart product params
            getAddToCartUrl($("#checkout-form"),currentHref);
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

        //set time out auto close popup modal
        function autoCloseModalCountdown() {
            var timeLeft = 10;
            $("#countdown").text(timeLeft);
            var loadedTime = setInterval(function () {
                timeLeft--;
                $("#countdown").text(timeLeft);
                if (timeLeft <= 0) {
                    clearInterval(loadedTime);
                    $('#add-to-cart-new').closeModal();
                }
            }, 1000);
        }

        //get add to cart product params
        function getAddToCartUrl(selector,currentHref) {
            var currentHref;
            var itemNum;
            var totalItems = parseInt($("#item-num").text());
            var products = JSON.parse(localStorage.getItem("products"));
            var url = "";
            var itemNumSelector = $("#item-num");
            var itemNumMobileSelector = $("#item-num-mobile");
            if (products != null) {
                for (var i = 0; i < products.length; i++) {
                    url += "sku[" + products[i].sku + "]=" + products[i].qty + "&";
                }
            }

            var additionalUrl = "adds?" + url + "submit=Checkout+now&mprc="+ selector.find("input[name=mprc]").val();
            //show item num on cart
            itemNum = parseInt(selector.find("input[type=number]").val());
            totalItems += itemNum;

            //check if there are installation products
            if (selector.find("input[type=checkbox]").is(":checked")) {
                itemNum = parseInt(selector.find("input[type=number]").val());
                totalItems += itemNum;
            }
            itemNumSelector.show();
            itemNumMobileSelector.show();
            itemNumSelector.text(totalItems);
            itemNumMobileSelector.text(totalItems);

            $("#add-to-cart-new #check-out-now a").attr("href", currentHref + additionalUrl);
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
                    price = (productPrice / selector.find("input[type=number]").val()) - selector.find("input[type=checkbox]").attr("title");
                    isInstallation = true;
                } else {
                    price = productPrice / selector.find("input[type=number]").val();
                    isInstallation = false;
                }
                products = getExtensionsInfo(products, price);
                products = getInstallationServiceInfo(products, isInstallation);
                localStorage.setItem("products", JSON.stringify(products));
                $("#add-to-cart-new h3").text(selector.find(".product-name").attr("value"));
            }
        }

        //store the extensions information
        function getExtensionsInfo(products, price) {
            var isDuplicated = false;
            //check extensions product duplicate
            for (var id in products) {
                if (products[id].sku === selector.find(".sku").attr("value")) {
                    products[id].qty = products[id].qty + parseInt(selector.find("input[type=number]").val());
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
                    qty: parseInt(selector.find("input[type=number]").val()),
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
                        products[id].qty = products[id].qty + parseInt(selector.find("input[type=number]").val());
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
                    qty: parseInt(selector.find("input[type=number]").val()),
                    price: 50
                });
            }
            return products;
        }

       /**
         *  add to cart by sku function
         *  var item = [{sku:"m2-shop-by-brand-ee",qty:2},{sku:"m2-shop-by-brand",qty:2}];
         *
         */
        function addToCartbySku(item) {
            var totalItems = parseInt($("#item-num").text());
            var itemNumSelector = $("#item-num");
            var itemNumMobileSelector = $("#item-num-mobile");

            for (var i in mpExtensions) {
                for (var y in item) {
                    if (mpExtensions[i].sku == item[y].sku || mpExtensions[i].sku + '-ee' == item[y].sku) {
                        if (localStorage) {
                            var productPrice;
                            var products = [];
                            if (JSON.parse(localStorage.getItem("products"))) {
                                products = JSON.parse(localStorage.getItem("products"));
                            }
                            if (item[y].sku.lastIndexOf('-ee')>= 0) {
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
                            itemNumMobileSelector.show();
                            itemNumSelector.text(totalItems);
                            itemNumMobileSelector.text(totalItems);
                        }
                    }
                }
            }
        }

        /** Frequently Bought Together add cart */
        $('#fbt-add-cart').on('click',function () {
            var fbtItem = $('#fbt-container-plus-item');
            var fbtSku = fbtItem.find('.fbt-item-title').attr('data-sku');
            item = [{sku:fbtSku,qty:1}];
            addToCartbySku(item);
        });

        // end of Add to cart and Check out now JS


        /* -------------------------------------------------- End of LIVESITE development --------------------------------------------------*/


    }); // end of document ready
})(jQuery); // end of jQuery name space

