angular.module('app')
// 方糖api
.factory('AuthHttp',function($http,$q,apiUrl){
    var authHttp = {};
    var ExtendUrl = function(url) {
        url = apiUrl.url + url
        return url;
    };
    authHttp.post = function(url,data){
        url = ExtendUrl(url);
        return $.post(url,data);
    };
    authHttp.get = function(url,data){
        url = ExtendUrl(url);
        return $.get(url,data);
    };
    return authHttp;
});
// 公共api
angular.module('app')
.factory('CommonHttp',function($http,$q,apiUrl){
    
    var authHttp = {};
    var ExtendUrl = function(url) {
        url = apiUrl.commonUrl + url
        return url;
    };
    authHttp.post = function(url,data){
        url = ExtendUrl(url);
        return $.post(url,data);
    };
    authHttp.get = function(url,data){
        url = ExtendUrl(url);
        return $.get(url,data);
    };
    return authHttp;
});









// 测试pi
angular.module('app')
.factory('TestHttp',function($http,$q,apiUrl){
    var authHttp = {};
    var ExtendUrl = function(url) {
        url = apiUrl.testUrl + url
        return url;
    };
    authHttp.post = function(url,data){
        url = ExtendUrl(url);
        return $.post(url,data);
    };
    authHttp.get = function(url,data){
        url = ExtendUrl(url);
        return $.get(url,data);
    };
    return authHttp;
});