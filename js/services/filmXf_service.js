angular.module('app')
.config(function() {
})
.factory('FilmXf', function(AuthHttp,$http,$q) {
    return {
        // 得到视频信息
        GetVideoList: function(reqPara){
            var defer = $q.defer();
            AuthHttp.get('/vanvideo/getVideoList',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
        // 添加视频
        AddVideo: function(reqPara){
            var defer = $q.defer();
            AuthHttp.get('/vanvideo/addVideo',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
        // 编辑视频
        EditVideo: function(reqPara){
            var defer = $q.defer();
            AuthHttp.get('/vanvideo/editVideo',reqPara)
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


