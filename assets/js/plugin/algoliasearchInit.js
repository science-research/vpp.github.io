var siteUrl = 'https://www.mageplaza.com';

const search = instantsearch({
    indexName: 'products',
    searchClient: algoliasearch('U1R0YS9CZ3', '0cc8f365448ba3e4086abff86aa2dfe5'),
    routing: true,
    searchFunction: function (helper) {
        var searchResults = $('#hits'),
            resultContainer = $('.search-result');

        if (helper.state.query === '') {
            searchResults.hide();
            resultContainer.hide();

            return;
        }
        helper.search();
        searchResults.show();
        resultContainer.show();
    }
});

search.addWidget(
    instantsearch.widgets.searchBox({
        container: '#searchbox',
        cssClasses: {
            form: 'input-group',
            input: 'form-control form-control-sm rounded-pill pl-5 pr-5'
        },
    })
);
search.addWidget(
    instantsearch.widgets.configure({
        hitsPerPage: 4
    })
);

search.addWidget(
    instantsearch.widgets.hits({
        container: '#hits',
        templates: {
            item: '<div class="row">' +
                '<div class="col-3 col-md-2 col-lg-2 p-3 center"><a href="' + siteUrl + '{{permalink}}">' +
                '{{#discount_percent}}<span class="badge badge-pill badge-danger discounted-label position-absolute font-size-0 right-0" style="z-index: 99;top:0">-{{discount_percent}}%</span>{{/discount_percent}}<img class="card-img-top rounded" src="' + siteUrl + '{{image}}" alt="{{title}}" /> </a>' +
                '</div><div class="col-9 col-lg-10 col-md-10 p-3"><a href="' + siteUrl + '{{permalink}}"><div class="ext-name"><h3>{{#helpers.highlight}}{ "attribute": "title" }{{/helpers.highlight}} {{#free_label}} <span class="badge badge-pill text-white" style="background-color: #25b9f6">Free</span> {{/free_label}} {{#hotdeal_label}} <span class="badge badge-pill text-white" style="background-color: #de4437">Hot deal</span> {{/hotdeal_label}} {{#bestseller_label}} <span class="badge badge-pill text-white" style="background-color: #994AFF">Best seller</span> {{/bestseller_label}} {{#pwa_label}} <span class="badge badge-pill text-dark" style="background-color: #FEE75C">PWA-ready</span> {{/pwa_label}} {{#apigraphql_label}} <span class="badge badge-pill text-dark" style="background-color: #FEE75C">API-GraphQL</span> {{/apigraphql_label}} </h3></div> </a>' +
                '<div class="ext-description"><span>{{#helpers.highlight}}{ "attribute": "description" }{{/helpers.highlight}}</span></div><div class="price font-size-1">{{#discount_percent}}<div class="card-text mt-3"><div><div class="float-left"><span class="special-price-list">{{#helpers.highlight}}{ "attribute": "discount_price" }{{/helpers.highlight}}</span> (<span class="old-price-list">{{#helpers.highlight}}{ "attribute": "price" }{{/helpers.highlight}}</span>)</div></div></div></div>{{/discount_percent}}{{^discount_percent}}<div class="card-text mt-4"><div><div class="float-left"><span>{{#helpers.highlight}}{ "attribute": "price" }{{/helpers.highlight}}</span></div></div></div></div>{{/discount_percent}}\n</div></div>' +
                '</div>',
            empty: 'No results for <q>{{ query }}</q>',
        },
        cssClasses: {
            root: 'hits-desktop pb-3',
            list: ['hits-desktop-list'],
            item: ['hits-desktop-item border-bottom w-100'],
        },
    })
);
search.start();