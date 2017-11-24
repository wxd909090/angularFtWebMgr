angular.module('app')
.config(function() {
})
.factory('StaffList', function(AuthHttp,$http,$q) {
    return {
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
        GetStaffList: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/staff/getStaffList',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
        GetRelationList: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/staff/getRelationList',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
        DelStaff: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/staff/delStaff',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
        AddStaff: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/staff/addStaff',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
        EditStaff: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/staff/editStaff',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
        BindStaff: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/staff/bindStaff',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
        UnBindStaff: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/staff/unbindStaff',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
        GetClearList: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/staff/getClearListByStaffSn',reqPara)
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


