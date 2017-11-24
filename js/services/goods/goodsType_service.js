angular.module('app')
.config(function() {
})
.factory('GoodsType', function(CommonHttp,AuthHttp,$http,$q) {
    return {
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
        // 编辑商品分类
        EditGoodsType: function(reqPara){
            var defer = $q.defer();
            CommonHttp.post('/bz/goods/category/edit',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
        // 删除商品分类
        DelGoodsType: function(reqPara){
            var defer = $q.defer();
            CommonHttp.post('/bz/goods/category/delete',reqPara)
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


