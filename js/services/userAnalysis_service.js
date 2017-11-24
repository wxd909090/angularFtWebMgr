angular.module('app')
.factory('UserAnalysis', function(AuthHttp,$http,$q) {
    return {
        // 获得订单总数和总额
        GetOrderTotle: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/statistics/getOrderTotle',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
        // 获得用户数
        GetUserNumber: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/statistics/getUserNumber',reqPara)
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