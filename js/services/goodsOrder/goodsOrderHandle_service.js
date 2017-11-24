angular.module('app')
.config(function() {
})
.factory('GoodsOrderHandle', function(CommonHttp,AuthHttp,$http,$q) {
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
        GetStoreOrderList: function(reqPara){
            var defer = $q.defer();
            CommonHttp.post('/oss/store_retail_order/get_store_retail_order',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
        // 配送订单
        DistributionOrder: function(reqPara){
            var defer = $q.defer();
            CommonHttp.post('/bz/store_retail_order/distribution_order',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
        // 商家直接退单退款
        RefundOrder: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/storeorder/refundOrder',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
        // 商家确认退单
        SetRefundReqResult: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/storeorder/setRefundReqResult',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
        // 获取待处理订单数量
        GetCountOrder: function(reqPara){
            var defer = $q.defer();
            CommonHttp.post('/bz/store_retail_order/get_count_of_store_order',reqPara)
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


