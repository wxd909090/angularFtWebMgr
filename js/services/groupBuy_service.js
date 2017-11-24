angular.module('app')
.config(function() {
})
.factory('GroupBuy', function(AuthHttp,$http,$q) {
    return {
        CreateGroupBuyCode: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/activity/createGroupBuyCode',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
        GetGroupBuyCode: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/activity/getGroupBuyCode',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
        DelCode: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/activity/delCode',reqPara)
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


