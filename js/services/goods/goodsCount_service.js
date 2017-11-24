angular.module('app')
.config(function() {
})
.factory('GoodsCount', function(AuthHttp,$http,$q,CommonHttp) {
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
        // 统计
        getCountLists: function(reqPara){
            var defer = $q.defer();
            CommonHttp.post('/bz/goods/count/list/get',reqPara)
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


