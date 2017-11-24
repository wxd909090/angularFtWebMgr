angular.module('app')
.config(function() {
})
.factory('StoreMaster', function(AuthHttp,$http,$q) {
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
        GetMachineList: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/machine/getMachineList',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
        CrateMachineImei: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/machine/crateMachineImei',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
        DelMachineImei: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/machine/delMachineImei',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
        BindStore: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/machine/bindStore',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
        UnbindStore: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/machine/unbindStore',reqPara)
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


