angular.module('app')
.config(function() {
})
.factory('StoreStream', function(AuthHttp,$http,$q) {
    return {
         // 大后台门店营业统计
        bigBusinessStatistics: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/count/getCountSurvey',reqPara)
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
        //查询结算记录
        getSettleRecord: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/count/getSettleRecord',reqPara)
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


