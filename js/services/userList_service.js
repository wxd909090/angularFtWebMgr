angular.module('app')
.config(function() {
})
.factory('UserList', function(AuthHttp,$http,$q) {
    return {
        // 得到用户信息
        GetUserInfo: function(reqPara){
            var defer = $q.defer();
            AuthHttp.get('/user/getUserInfo',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
        // 得到罚款记录
        GetOrderList: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/compensate/getOrderList',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
        // 得到押金记录
        GetDepositList: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/deposit/getDepositList',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
        // 得到用户状态
        ChangeUserStatus: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/user/changeUserStatus',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
        // 获取观看记录
        GetWatchRecord: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/user/getUserOrderListByUserSn',reqPara)
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


