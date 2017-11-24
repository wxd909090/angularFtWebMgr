angular.module('app')
.config(function() {
})
.factory('Celebrity', function(AuthHttp,$http,$q) {
    return {
        GetCelebrityList: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/celebrity/getCelebrityList',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
        AddCelebrity: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/celebrity/addCelebrity',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
        DelCelebrity: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/celebrity/delCelebrity',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
        EditCelebrity: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/celebrity/editCelebrity',reqPara)
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


