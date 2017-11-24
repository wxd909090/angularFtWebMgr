angular.module('app')
.config(function() {
})
.factory('VersionMgr', function(AuthHttp,$http,$q) {
    return {
        CreateApp: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/store/createApp',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
        DelApp: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/store/delApp',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
        UpdateApp: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/store/updateApp',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
        GetAppList: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/store/getAppList',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
        DisableApp: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/store/disableApp',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
        EnableApp: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/store/enableApp',reqPara)
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


