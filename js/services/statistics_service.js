angular.module('app')
    .factory('statistics', function(AuthHttp,$http,$q) {
        return {
            // 获得天统计
            getUserStatisticsByDay: function(reqPara){
                var defer = $q.defer();
                AuthHttp.post('/statistics/getUserStatisticsByDay',reqPara)
                    .success(function (response) {
                        defer.resolve(response);
                    })
                    .error(function(){
                        defer.reject();
                    });
                return defer.promise;
            },
            // 获得周统计
            getUserStatisticsByWeek: function(reqPara){
                var defer = $q.defer();
                AuthHttp.post('/statistics/getUserStatisticsByWeek',reqPara)
                    .success(function (response) {
                        defer.resolve(response);
                    })
                    .error(function(){
                        defer.reject();
                    });
                return defer.promise;
            },
            // 获取月统计
            getUserStatisticsByMonth: function(reqPara){
                var defer = $q.defer();
                AuthHttp.post('/statistics/getUserStatisticsByMonth',reqPara)
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
