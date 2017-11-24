angular.module('app')
.config(function() {
})
.factory('NewTopic', function(AuthHttp,$http,$q) {
    return {
        AddSpecial: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/special/addSpecial',reqPara)
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


