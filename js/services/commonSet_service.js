angular.module('app')
.factory('CommonSet',function(AuthHttp,$http,$q){
     return {
        // 获得押金
        getSetting: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/setting/getSetting',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
        // 设置押金
        setSetting: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/setting/setSetting',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
        // 获取系统拷贝天数
        getSysCopyDaily: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/setting/getSysCopyDaily',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
        // 设置系统拷贝天数
        setSysCopyDaily: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/setting/setSysCopyDaily',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },

        // 模板拷贝天数获取门店的拷贝时间
        GetStoreMaxCopyTime: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/setting/getStoreMaxCopyTime',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
        // 设置门店时段模板拷贝天数
        SetStoreMaxCopyTime: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/setting/setStoreMaxCopyTime',reqPara)
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