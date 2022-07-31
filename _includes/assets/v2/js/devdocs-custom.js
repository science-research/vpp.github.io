var docsContent = $('.mp-docs-content h2,.mp-docs-content h3'),
    sectionNavHtml = '<ul class="js-scroll-nav hd-doc-section-nav">',
    count = 0;

docsContent.each(function () {
    count++;
    if ($(this).prop('tagName') === 'H2') {
        if (count === 1) {
            sectionNavHtml += '<li class="hd-doc-section-nav-item active"><a href="#' + $(this).attr('id') + '">' + $(this).text() + '</a>';
        } else {
            sectionNavHtml += '<li class="hd-doc-section-nav-item"><a href="#' + $(this).attr('id') + '">' + $(this).text() + '</a>';
        }

    } else {
        sectionNavHtml += '<li class="hd-doc-section-nav-item pl-3"><a href="#' + $(this).attr('id') + '">' + $(this).text() + '</a>';
    }
    sectionNavHtml += '</li>';
});
sectionNavHtml += '</ul>';
$('#mp-docs-section-nav').html(sectionNavHtml);

$(window).scroll(function () {
    sidebarScroll();
});

function sidebarScroll() {
    docsContent.each(function () {
        var scrollTop = $(window).scrollTop();
        var offset = $(this).offset().top;
        if ((offset - scrollTop) <= 220 && (offset - scrollTop) >= 150) {
            $('ul.hd-doc-section-nav li').removeClass('active');
            $('ul.hd-doc-section-nav li a[href=#' + $(this).attr('id') + ']').parent().addClass('active');
        }
    });
}

$('li.hd-doc-section-nav-item').on('click', function () {
    var elementId = $(this).find('a').attr('href');
    var location = docsContent.parent().find(elementId);

    $('html, body').animate({
        scrollTop: location.offset().top - 190
    }, 500);
});