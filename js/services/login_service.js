angular.module('app')
.config(function() {
})
.factory('Login', function(AuthHttp,$http,$q) {
    return {
        Login: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/common/login',reqPara)
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


