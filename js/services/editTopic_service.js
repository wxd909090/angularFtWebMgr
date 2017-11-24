angular.module('app')
.config(function() {
})
.factory('EditTopic', function(AuthHttp,$http,$q) {
    return {
        EditSpecial: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/special/editSpecial',reqPara)
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


