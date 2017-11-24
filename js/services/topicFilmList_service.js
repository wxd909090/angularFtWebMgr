angular.module('app')
.config(function() {
})
.factory('TopicFilmList', function(AuthHttp,$http,$q) {
    return {
        // 获取合集里面的电影
        GetSpecialFilmList: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/special/getSpecialFilmList',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
        DelSpecialFilm: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/special/delSpecialFilm',reqPara)
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


