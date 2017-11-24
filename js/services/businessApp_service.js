angular.module('app')
.config(function() {
})
.factory('BusinessApp', function(AuthHttp,$http,$q) {
    return {
        GetStoreAppVersion: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/store/getStoreAppVersion',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
        AddStoreAppVersion: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/store/addStoreAppVersion',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
        CheckStoreAppVersionExist: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/store/checkStoreAppVersionExist',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
        UpdateStoreAppVersion: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/store/updateStoreAppVersion',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
        DelStoreAppVersion: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/store/delStoreAppVersion',reqPara)
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


