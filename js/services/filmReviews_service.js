angular.module('app')
.config(function() {
})
.factory('FilmReviews', function(AuthHttp,$http,$q) {
    return {
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

        // 获取电影评价
        GetFilmReviewsList: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/reviews/getFilmReviewsList',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },


        // 屏蔽评价
        SetShowReviews: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/reviews/setShowReviews',reqPara)
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


