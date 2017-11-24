'use strict';


angular.module('app', [
    'ngStorage',
    'ui.router',
    'ui.load',
    'ui.jq',
    'ui.validate',
    'oc.lazyLoad',
    'ui.bootstrap',
    'oitozero.ngSweetAlert',
    'ngBootstrap',
    'ngVerify',
    'bootstrapLightbox',
    'ng-sortable',
    // 'chart.js'
])
.factory('myService', function() {
    var savedData = {}
    function set(data) {
        savedData = data;
    }
    function get() {
        return savedData;
    }

    return {
        set: set,
        get: get
    }

});




// .config(['ChartJsProvider', function (ChartJsProvider) {
//     // Configure all charts
//     ChartJsProvider.setOptions({
//       colors : [ '#803690', '#00ADF9', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'],
//       responsive: true
//     });
//     // Configure all line charts
//     ChartJsProvider.setOptions('line', {
//       showLines: false
//     });
//   }]);

