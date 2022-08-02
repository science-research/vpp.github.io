$(document).ready(function() {
    //Start: bundle product JS
    discountCalculation();

    function discountCalculation() {
        var benefit = getDiscountInformation(),
            total = 0,
            discount = 0,
            grantTotal = 0,
            defaultHref = $('#add-cart-bundle').attr('href'),
            additionalUrl = '';
        $("#chosen-product-list-container").sortable({
            items: "li",
            receive: function (event, ui) {
                var urlString = '';
                if ($('#chosen-product-list-container li').length > 0) {
                    $('#drag-notify').hide();

                    $('#chosen-product-list-container li').find('.product-sku').each(function () {
                        urlString += 'sku[' + $(this).text()+ ']=1&';
                    });
                    total += parseInt(ui.item.find('.product-price').attr('data-price'));
                    grantTotal = total - discount;
                    $('#bundle-total-price').find('.price-value').text('$' + total);
                    for (var i = 0; i < Object.keys(benefit).length; i++) {
                        if ($('#chosen-product-list-container li').length == parseInt(Object.keys(benefit)[i])) {
                            $('#discount-text-box').text(Object.values(benefit)[i] + '%');
                            $('#discount-text-box').attr('data-discount' , Object.values(benefit)[i]);
                            discount = total * Object.values(benefit)[i] / 100;
                            grantTotal = total - discount;
                        }
                        if ($('#chosen-product-list-container li').length > parseInt(Object.keys(benefit)[Object.keys(benefit).length - 1])) {
                            $('#discount-text-box').text(Object.values(benefit)[i] + '%');
                            $('#discount-text-box').attr('data-discount' , Object.values(benefit)[i]);
                            discount = total * Object.values(benefit)[i] / 100;
                            grantTotal = total - discount;
                        }
                    }
                    $('#bundle-total-discount').find('.price-value b').text('$' + discount);
                    $('#bundle-grand-total').find('.price-value b').text('$' + grantTotal);
                }
                additionalUrl = 'adds?' + urlString + 'submit=Checkout+now&mprc=default';
                $('#add-cart-bundle').attr('href',defaultHref + additionalUrl);
            },
            remove: function (event, ui) {
                var urlString = '';
                if ($('#chosen-product-list-container li').length == 0) {
                    $('#drag-notify').show();
                }
                $('#chosen-product-list-container li').find('.product-sku').each(function () {
                    urlString += 'sku[' + $(this).text()+ ']=1&';
                });
                total -= parseInt(ui.item.find('.product-price').attr('data-price'));
                $('#bundle-total-price').find('.price-value').text('$' + total);
                for (var i = 0; i < Object.keys(benefit).length; i++) {
                    if ($('#chosen-product-list-container li').length < parseInt(Object.keys(benefit)[0])) {
                        $('#discount-text-box').text('0%');
                        $('#discount-text-box').attr('data-discount' , 0);
                        discount = 0;
                        grantTotal = total - discount;
                    }
                    if ($('#chosen-product-list-container li').length == parseInt(Object.keys(benefit)[i])) {
                        $('#discount-text-box').text(Object.values(benefit)[i] + '%');
                        $('#discount-text-box').attr('data-discount' , Object.values(benefit)[i]);
                        discount = total * Object.values(benefit)[i] / 100;
                        grantTotal = total - discount;
                    }
                    if ($('#chosen-product-list-container li').length > parseInt(Object.keys(benefit)[Object.keys(benefit).length - 1])) {
                        $('#discount-text-box').text(Object.values(benefit)[i] + '%');
                        $('#discount-text-box').attr('data-discount' , Object.values(benefit)[i]);
                        discount = total * Object.values(benefit)[i] / 100;
                        grantTotal = total - discount;
                    }
                }
                $('#bundle-total-discount').find('.price-value b').text('$' + discount);
                $('#bundle-grand-total').find('.price-value b').text('$' + grantTotal);
                if (urlString != '') {
                    additionalUrl = 'adds?' + urlString + 'submit=Checkout+now&mprc=default';
                }else{
                    additionalUrl ='';
                }
                $('#add-cart-bundle').attr('href',defaultHref + additionalUrl);
            }
        });
        initSortableList();
    }

    function initSortableList() {
        $(".connected-sortable").sortable({
            connectWith: ".connected-sortable",
            dropOnEmpty: true,
            placeholder: "highlight",
            items: "li"
        });
    }

    function getDiscountInformation() {
        var item = {};
        if ($('#product-bundle-behaviour li').length > 0) {
            $('#product-bundle-behaviour li').each(function () {
                item[$(this).attr('data-qty')] = $(this).attr('data-discount');
            });
        }
        return item;
    }

//change bundle edition function
    $('#bundle-edition-selector button').each(function () {
        $(this).on('click',function () {
            var totalPrice = 0,
                additionalUrl ='';
            if ($(this).hasClass('grey')){
                $('#bundle-edition-selector button').removeClass('active');
                $('#bundle-edition-selector button').addClass('grey');
                $(this).removeClass('grey');
                $(this).addClass('active');
                if ($('#bundle-ee-edition').hasClass('active')) {
                    var urlString ='';
                    $('#product-list-container li').find('.product-sku').each(function () {
                        $(this).text($(this).attr('data-sku')+'-ee');
                    });
                    $('#chosen-product-list-container li').find('.product-sku').each(function () {
                        $(this).text($(this).attr('data-sku')+'-ee');
                        urlString += 'sku[' + $(this).text()+ ']=1&';
                    });
                    additionalUrl = 'adds?' + urlString + 'submit=Checkout+now&mprc=default';
                    $('#add-cart-bundle').attr('href','https://dashboard.mageplaza.com/onestepcheckout/index/' + additionalUrl);
                    $('#product-list-container li').find('.product-price').each(function () {
                        var eePrice = parseInt($(this).attr('data-price')) + 200;
                        $(this).attr('data-price',eePrice);
                        $(this).text('$'+eePrice);
                    });
                    $('#chosen-product-list-container li').find('.product-price').each(function () {
                        var eePrice = parseInt($(this).attr('data-price')) + 200;
                        totalPrice += eePrice;
                        $(this).attr('data-price',eePrice);
                        $(this).text('$'+eePrice);
                    });
                    $('#bundle-total-price').find('.price-value').text('$' + totalPrice);
                    $('#bundle-total-discount').find('.price-value b').text('$' + totalPrice*parseInt($('#discount-text-box').attr('data-discount'))/100);
                    $('#bundle-grand-total').find('.price-value b').text('$' + (totalPrice-totalPrice*parseInt($('#discount-text-box').attr('data-discount'))/100));
                }else{
                    var urlString ='';
                    $('#product-list-container li').find('.product-sku').each(function () {
                        $(this).text($(this).attr('data-sku'));
                    });
                    $('#chosen-product-list-container li').find('.product-sku').each(function () {
                        $(this).text($(this).attr('data-sku'));
                        urlString += 'sku[' + $(this).text()+ ']=1&';
                    });
                    additionalUrl = 'adds?' + urlString + 'submit=Checkout+now&mprc=default';
                    $('#add-cart-bundle').attr('href','https://dashboard.mageplaza.com/onestepcheckout/index/' + additionalUrl);
                    $('#product-list-container li').find('.product-price').each(function () {
                        var cePrice = parseInt($(this).attr('data-price')) - 200;
                        $(this).attr('data-price',cePrice);
                        $(this).text('$'+cePrice);
                    });
                    $('#chosen-product-list-container li').find('.product-price').each(function () {
                        var cePrice = parseInt($(this).attr('data-price')) - 200;
                        totalPrice += cePrice;
                        $(this).attr('data-price',cePrice);
                        $(this).text('$'+cePrice);
                    });
                    $('#bundle-total-price').find('.price-value').text('$' + totalPrice);
                    $('#bundle-total-discount').find('.price-value b').text('$' + totalPrice*parseInt($('#discount-text-box').attr('data-discount'))/100);
                    $('#bundle-grand-total').find('.price-value b').text('$' + (totalPrice-totalPrice*parseInt($('#discount-text-box').attr('data-discount'))/100));
                }
            }
        });
    });


//filter extensions function
    $('#product-search').on('keyup',function () {
        var value =  $(this).val().toLowerCase();
        $('#product-list-container li').filter(function () {
            console.log($(this).length);
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    });

    $('#product-bundle-list .filter-product a').on('click',function () {
        $('#product-list-container li').show();
    });
//End : bundle product JS
});

