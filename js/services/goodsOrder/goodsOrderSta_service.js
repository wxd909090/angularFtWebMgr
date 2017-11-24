angular.module('app')
.config(function() {
})
.factory('GoodsOrderSta', function(AuthHttp,CommonHttp,$http,$q) {
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
        // 获取订单列表
        getOrderLists: function(reqPara){
            var defer = $q.defer();
            CommonHttp.post('/bz/store_retail_order/get_store_order_statistic',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                
                defer.reject();
            });
            return defer.promise;
        },
        //导出
        //  getOrderListsTable: function(reqPara){
        //     var defer = $q.defer();
        //     CommonHttp.post('/bz/store_retail_order/export_store_order_statistic',reqPara)
        //     .success(function (response) {
        //         defer.resolve(response);
        //     })
        //     .error(function(){
                
        //         defer.reject();
        //     });
        //     return defer.promise;
        // }
    };
});


