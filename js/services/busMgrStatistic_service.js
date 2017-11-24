angular.module('app')
.config(function() {
})
.factory('BusMgrStatistic', function(AuthHttp,$http,$q) {
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
        //门店营业统计
        storeBusinessStatistics: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/count/getStoreBusinessList',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
        //门店营业统计导出
        // storeBusinessStatisticsDownloadFile: function(reqPara){
        //     var defer = $q.defer();
        //     AuthHttp.post('/count/downloadFile',reqPara)
        //     .success(function (response) {
        //         defer.resolve(response);
        //     })
        //     .error(function(){
        //         defer.reject();
        //     });
        //     return defer.promise;
        // },
        //包间统计
        privateRoomBusinessStatistics: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/count/getRoomCount',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
        //消费统计
        getOrderRecords: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/count/getOrderRecords',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
        //结算汇总
        getSettleSummary: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/count/getSettleSummary',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
        //结算金额
        getSettlePrice: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/count/getSettlePrice',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
        //新增结算
        addSettleRecords: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/count/addSettleRecords',reqPara)
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
        //统计导出获取data
        exportSaleStatistic: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/count/exportData',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
        //导出
        downloadFile: function(reqPara){
            var defer = $q.defer();
            AuthHttp.get('/count/downloadFile',reqPara)
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
        }
    };
});


