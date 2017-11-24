angular.module('app')
.config(function() {
})
.factory('EditRecommend', function(CommonHttp,AuthHttp,$http,$q) {
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
        // 获取商品分类列表
        GetGoodsTypeList: function(reqPara){
            var defer = $q.defer();
            CommonHttp.post('/bz/goods/category/list/get',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
        // 添加商品
        AddGoods: function(reqPara){
            var defer = $q.defer();
            CommonHttp.post('/bz/goods/store_retail/creat',reqPara)
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


