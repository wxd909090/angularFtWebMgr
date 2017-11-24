angular.module('app')
.config(function() {
})
.factory('FilmMgr', function(AuthHttp,$http,$q) {
    return {
        // 获取电影列表
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


        // 获取热映电影列表
        GetHighPlayList: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/film/getHighPlayList',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },

        // 获取最近更新电影列表
        GetNewFilmList: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/film/getNewFilmList',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
        // 删除电影
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
        // 添加电影
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
        // 编辑电影
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
        // 豆瓣电影搜索
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
        // 添加电影到合集
        AddSpecialFilm: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/special/addSpecialFilm',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },

        //搜索名人列表
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

        // 添加名人电影关联
        AddRelation: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/celebrity/addRelation',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },

        // 删除该电影的名人列表
        DelRelation: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/celebrity/delRelation',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },

        // 获取该电影的名人列表
        GetCelebrityInFilm: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/celebrity/getCelebrityInFilm',reqPara)
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


