angular.module('app')
.config(function() {
})
.factory('CreateRecommend', function(CommonHttp,AuthHttp,$http,$q) {
    return {
        // 获取门店列表
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

        // 获取商品列表
        GetGoodsList: function(reqPara){
            var defer = $q.defer();
            CommonHttp.post('/bz/goods/store_retail/list/get',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },

        // 创建套餐
        createCombo: function(reqPara){
            var defer = $q.defer();
            CommonHttp.post('/bz/goods/combo/create',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
    };
});


