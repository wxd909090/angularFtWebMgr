angular.module('app')
.config(function() {
})
.factory('Activities', function(AuthHttp,$http,$q) {
    return {
        GetActivityCode: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/activity/getActivityCode',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
        CreateActivityCode: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/activity/createActivityCode',reqPara)
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


