angular.module('app')
.config(function() {
})
.factory('SalingGoods', function(CommonHttp,AuthHttp,$http,$q) {
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
        // 获取套餐列表
        GetComboList: function(reqPara){
            var defer = $q.defer();
            CommonHttp.post('/bz/goods/combo/list/get',reqPara)
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
        // 下架商品
        DownGoods: function(reqPara){
            var defer = $q.defer();
            CommonHttp.post('/bz/goods/status/down',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
        // 删除商品
        DelGoods: function(reqPara){
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
        },
        //删除套餐
        DelCombo: function(reqPara){
            var defer = $q.defer();
            CommonHttp.post('/oss/goods/combo/delete',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
        //热销商品
        GetHotGoods: function(reqPara){
            var defer = $q.defer();
            CommonHttp.post('/oss/goods/hot/list/get',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
        // 拖拽排序请求
        ChangeSort: function(reqPara){
            var defer = $q.defer();
            CommonHttp.post('/bz/goods/store_retail/sort',reqPara)
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


