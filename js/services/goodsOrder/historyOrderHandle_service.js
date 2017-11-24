angular.module('app')
.config(function() {
})
.factory('HistoryOrderHandle', function(AuthHttp,CommonHttp,$http,$q) {
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
        // 获取获取对应门店的订单列表
        getGoodsTypeList: function(reqPara){
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



        HistoryOrderHandle: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/activity/getActivityCode',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
        CreateActivityCode: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/activity/createActivityCode',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
        ExportActivityCode: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/activity/exportActivityCode',reqPara)
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


