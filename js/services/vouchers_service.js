angular.module('app')
.config(function() {
})
.factory('Vouchers', function(AuthHttp,$http,$q) {
    return {
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
        GetActivityList: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/activity/getActivityList',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
        CreateActivity: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/activity/createActivity',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
        EditActivity: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/activity/editActivity',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
        GetActivityStoreList: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/activity/getActivityStoreList',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
        GetCouponList: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/coupon/getCouponList',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
        GetCouponOrderInfo: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/coupon/getCouponOrderInfo',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
        GetActivityDayDetail: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/activity/getActivityDayDetail',reqPara)
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


