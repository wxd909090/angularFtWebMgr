angular.module('app')
.config(function() {
})
.factory('StoreList', function(AuthHttp,$http,$q) {
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
        CreateStore: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/store/createStore',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
        ForbidStore: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/store/forbidStore',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
        EditorStore: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/store/editStore',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
        GetStoreLocation: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/store/getStoreLocation',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
        ProjectorAdd: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/projector/add',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
        ProjectorDel: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/projector/del',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
        // 获取没有被任何房间绑定的设备列表
        GetUnbind: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/projector/getUnbind',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
        // 获取订单列表
        GetOrderList: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/order/getOrderList',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise; 
        },
        // 所有设备管理
        GetProjectorByImeiAndStoreSn: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/projector/getProjectorByImeiAndStoreSn',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise; 
        },
        // 创建门店电影表
        createFilm : function (reqPara) {
            var defer = $q.defer();
            AuthHttp.post('/store/createFilmTable',reqPara)
                .success(function (response) {
                    defer.resolve(response);
                })
                .error(function(){
                    defer.reject();
                });
            return defer.promise;
        },
        agentUnbind : function (reqPara) {
            var defer = $q.defer();
            AuthHttp.post('/agentstore/unbindAgentStore',reqPara)
                .success(function (response) {
                    defer.resolve(response);
                })
                .error(function(){
                    defer.reject();
                });
            return defer.promise;
        },
        agentBind : function (reqPara) {
            var defer = $q.defer();
            AuthHttp.post('/agentstore/bindAgentStore',reqPara)
                .success(function (response) {
                    defer.resolve(response);
                })
                .error(function(){
                    defer.reject();
                });
            return defer.promise;
        },
        isBind : function (reqPara) {
            var defer = $q.defer();
            AuthHttp.post('/agentstore/isBind',reqPara)
                .success(function (response) {
                    defer.resolve(response);
                })
                .error(function(){
                    defer.reject();
                });
            return defer.promise;
        },

        // 添加门店海报
        AddPoster : function (reqPara) {
            var defer = $q.defer();
            AuthHttp.post('/store/poster/add',reqPara)
                .success(function (response) {
                    defer.resolve(response);
                })
                .error(function(){
                    defer.reject();
                });
            return defer.promise;
        },
        // 获取门店海报
        GetPosterList : function (reqPara) {
            var defer = $q.defer();
            AuthHttp.post('/store/poster/list',reqPara)
                .success(function (response) {
                    defer.resolve(response);
                })
                .error(function(){
                    defer.reject();
                });
            return defer.promise;
        },
        // 删除门店海报
        DelPoster : function (reqPara) {
            var defer = $q.defer();
            AuthHttp.post('/store/poster/del',reqPara)
                .success(function (response) {
                    defer.resolve(response);
                })
                .error(function(){
                    defer.reject();
                });
            return defer.promise;
        },

        // 使用默认海报
        UseDefault : function (reqPara) {
            var defer = $q.defer();
            AuthHttp.post('/store/poster/default/use',reqPara)
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


