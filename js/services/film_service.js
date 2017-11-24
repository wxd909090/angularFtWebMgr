angular.module('app')
.config(function() {
})
.factory('Film', function(AuthHttp,$http,$q) {
    return {
        GetFilmList: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/film/getFilmList',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
        DelFilm: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/film/delFilm',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
        AddFilm: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/film/addFilm',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
        EditFilm: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/film/editFilm',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
        EditFilm: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/film/editFilm',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
        SearchDouBanMovie: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/film/searchDouBanMovie',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
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
            AuthHttp.post('/film/editFilmBlackList ',reqPara)
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


