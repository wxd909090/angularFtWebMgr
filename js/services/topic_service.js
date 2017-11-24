angular.module('app')
.config(function() {
})
.factory('Topic', function(AuthHttp,$http,$q) {
    return {
        // 获取合集列表
        GetSpecialList: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/special/getSpecialList',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },

        // 删除合集
        DelSpecial: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/special/delSpecial',reqPara)
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


