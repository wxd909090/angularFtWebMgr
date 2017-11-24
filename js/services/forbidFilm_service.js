angular.module('app')
.config(function() {
})
.factory('ForbidFilm', function(AuthHttp,$http,$q) {
    return {
        getBlackFilm: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/film/getFilmBlackList',reqPara)
                .success(function (response) {
                    defer.resolve(response);
                })
                .error(function(){
                    defer.reject();
                });
            return defer.promise;
        },
        editBlackFilm: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/film/editFilmBlackList',reqPara)
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


