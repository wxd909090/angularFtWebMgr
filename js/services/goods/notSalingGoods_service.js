angular.module('app')
.config(function() {
})
.factory('NotSalingGoods', function(AuthHttp,CommonHttp,$http,$q) {
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
        // 获取下家中的商品列表
        getOffShelfGoodsList: function(reqPara){
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
        // 删除商品
        deleteShelfGoods: function(reqPara){
            var defer = $q.defer();
            CommonHttp.post('/bz/goods/store_retail/delete',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
        // 上架
        onShelfGoods: function(reqPara){
            var defer = $q.defer();
            CommonHttp.post('/bz/goods/status/up',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
        //修改信息
        changeShelfGoodsMess: function(reqPara){
            var defer = $q.defer();
            CommonHttp.post('/bz/goods/store_retail/edit',reqPara)
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


