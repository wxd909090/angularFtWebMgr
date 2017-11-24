angular.module('app')
.factory('Room', function(AuthHttp,$http,$q) {
    return {
        // 获得房间信息
        GetRoomInfo: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/room/getRoomInfo',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        }, 
        // 获得时间段信息
        GetDurationList: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/duration/getDurationList',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
        // 添加房间
        CreateRoom: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/room/createRoom',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
        // 删除房间
        DelRoom: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/room/delRoom',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
        // 编辑房间
        EditRoom: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/room/editRoom',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
        // 添加时间段
        AddDuration: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/duration/addDuration',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
        // 删除时间段
        DelDuration: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/duration/delDuration',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
        // 编辑时间段时间段
        EditDuration: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/duration/editDuration',reqPara)
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
            AuthHttp.post('/order/getOrderListForWeb',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
         // 获取订单列表
        SetRealDamage: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/order/setRealDamage',reqPara)
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
        // 获取系统拷贝天数
        GetRoomCopyDaily: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/setting/getRoomCopyDaily',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
        // 设置系统拷贝天数
        SetRoomCopyDaily: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/setting/setRoomCopyDaily',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
        // 获取营业统计
        GetOrderTotle: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/statistics/getOrderTotle',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
        // 退款
        RefundOrder: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/order/refundOrder',reqPara)
            .success(function (response) {
                defer.resolve(response);
            })
            .error(function(){
                defer.reject();
            });
            return defer.promise;
        },
        // 拉取房间投影仪状态
        GetRoomStatus: function(reqPara){
            var defer = $q.defer();
            AuthHttp.post('/room/getRoomStatus',reqPara)
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