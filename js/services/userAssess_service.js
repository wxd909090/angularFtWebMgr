angular.module('app')
.config(function() {
})
.factory('UserReviews', function(AuthHttp,$http,$q) {
    return {
        // 得到用户信息
        GetUserReviewsList: function(reqPara){
            var defer = $q.defer();
            AuthHttp.get('/reviews/getUserReviewsList',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
        // 得到门店列表
        GetStoreList: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/store/getStoreInfo',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
        // 文件导出
        DownloadFile: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/reviews/exportUserReviewsList',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;

        },
        // 文件导出
        GetStoreReviewList: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/reviews/getStoreReviewsListForWeb',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
        // 是否显示
        ChangeReviews: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/reviews/changeReviews',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
        replyReviews: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/reviews/operateReviews',reqPara)
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


