angular.module('app')
.config(function() {
})
.factory('StoreStream', function(AuthHttp,$http,$q) {
    return {
         // ���̨�ŵ�Ӫҵͳ��
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
        // ��ȡ�ŵ��б�
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
        // ��ȡ�����б�
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
        //��ѯ�����¼
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


