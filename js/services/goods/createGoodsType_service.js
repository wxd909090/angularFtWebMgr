angular.module('app')
.config(function() {
})
.factory('CreateGoodsType', function(CommonHttp,AuthHttp,$http,$q) {
    return {
        GetStoreList: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/store/getStoreInfo',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
        CreateGoodsType: function(reqPara){
            var defer = $q.defer();
            CommonHttp.post('/bz/goods/category/edit',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        }
    };
});


