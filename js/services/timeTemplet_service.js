angular.module('app')
.factory('TimeTemplet', function(AuthHttp,$http,$q) {
    return {
        // 添加时间模板
        AddTemplate: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/template/addTemplate',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        }, 
        // 获得时间模板
        GetTemplate: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/template/getTemplate',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        }, 
         // 删除时间模板
        RemoveTemplate: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/template/removeTemplate',reqPara)
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
        },
        // 时间模板应用
        ApplyTemplate: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/template/applyTemplate',reqPara)
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