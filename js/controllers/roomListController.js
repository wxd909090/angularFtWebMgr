app.controller('roomListController',['$scope','$timeout','$rootScope','$location','SweetAlert','$uibModal','$localStorage','Room','apiUrl','Auth','$interval','$sessionStorage',
    function($scope,$timeout,$rootScope,$location,SweetAlert,$uibModal,$localStorage,Room,apiUrl,Auth,$interval,$sessionStorage){
    // 日期插件调用
    datePicker();
    var token = Auth.getLocalData("token");
    $scope.storeName = $localStorage.storeName;
    function getNowTime(){
        var date = new Date();
        var h = date.getHours();
        var m = date.getMinutes();
        var diffMins = Number(diffDate()) * 24 * 60;
        $scope.nowTime = h*60 + m + diffMins;
        $scope.clearTime = $rootScope.setTime.min/60;//分钟数
        // var clearId = $timeout(function() {getNowTime()}, 30000);
    }
    function diffDate() {
        var date = new Date();
        var dateA = new Date(date.getFullYear(),date.getMonth(),date.getDate());
        var dateB = new Date($scope.checkDate.getFullYear(),$scope.checkDate.getMonth(),$scope.checkDate.getDate());
        return (dateA.getTime() -dateB.getTime())/(24*60*60*1000);
    }
    getNowTime();


    $scope.todayTimeStrOrder = getTodayTime(new Date());
    $scope.checkDateOrder = getTodayTime($scope.checkDate);
    // 获取当前门店的store_sn
    var store_sn = $location.url().substr($location.url().lastIndexOf("/") + 1);
    $scope.reflushRoom = function()
    {
        getNowTime();
        $scope.getroomAllInfo(store_sn);
    }
    $scope.checkDateChange = function(checkDate){
        if(checkDate){
            getNowTime();
            $scope.checkDateOrder = getTodayTime(checkDate);
            $scope.getroomAllInfo(store_sn);
        }else{
        }
    }

    $scope.getOrderList = function(){
        // 将日期框日期转化为时间戳
        var TodayTime = getTodayTime($scope.checkDate);
        var getOrderData = {
            token : token,
            store_sn : store_sn,
            reserve_time : Number(TodayTime) + 28800 
        }
        // 发送订单列表请求
        Room.GetOrderList(getOrderData).then(function(response){
            if(response.code == 0){
                $scope.orderListData = response.data.items;
                for(var q = 0;q < $scope.orderListData.length;q++){
                    $scope.orderListData[q].info = JSON.parse($scope.orderListData[q].info);
                }
                for(var j = 0;j < $scope.orderListData.length;j++){
                    for(var k = 0;k < $scope.roomInfo.length;k++){
                        for(var m = 0;m < $scope.roomInfo[k].durationList.length;m++){
                            if($scope.orderListData[j].room_sn == $scope.roomInfo[k].durationList[m].room_sn && $scope.orderListData[j].duration_sn == $scope.roomInfo[k].durationList[m].duration_sn && $scope.orderListData[j].status !=5 &&  $scope.orderListData[j].status !=4){
                                $scope.orderListData[j]['create_time'] = Number($scope.orderListData[j]['create_time']);
                                $scope.orderListData[j]['damage'] = Number($scope.orderListData[j]['damage']);
                                $scope.orderListData[j]['is_set_damage'] = Number($scope.orderListData[j]['is_set_damage']);
                                $scope.roomInfo[k].durationList[m].orderInfo = $scope.orderListData[j];
                            }                            
                        }
                    }
                };
                console.log($scope.roomInfo)
            }else{
                SweetAlert.swal("",response.msg,"error");
            }
        })
    }
    
    // 提示框初始化
    $scope.tipBox = false;
    $scope.tipBoxText = "";

    // 房间所有信息
    $scope.roomAllInfo = [];

    $scope.getroomAllInfo = function(store_sn){
        getDurationList(store_sn);
        // 获得时间段信息
        function getDurationList(store_sn){
            var TodayTime = getTodayTime($scope.checkDate);
            var data = {
                token : token,
                store_sn : store_sn,
                reserve_time : Number(TodayTime) + 28800
            }
            Room.GetDurationList(data).then(function(response){
                if(response.code == 0){
                    // 获得时间段信息
                    $scope.durationList = response.data;
                    // 获得房间信息
                    getRoomInfo(store_sn);
                }else{
                    SweetAlert.swal("",response.msg,"error");
                    $scope.durationList = [];
                    getRoomInfo(store_sn);
                }
            })
        }

         // 获得房间信息
        function getRoomInfo(store_sn){
            var data = {
                type:2,
                store_sn : store_sn
            }
            Room.GetRoomInfo(data).then(function(response){
                if(response.code == 0){
                    $scope.roomInfo = response.data.data;
                    $scope.baseUrl = response.data.baseUrl;
                    for(var j = 0;j < $scope.roomInfo.length;j++){
                        $scope.roomInfo[j].durationList = $scope.durationList[$scope.roomInfo[j]['room_sn']];
                        for(var q = 0;q < $scope.roomInfo[j].durationList.length;q++){
                            $scope.roomInfo[j].durationList[q].begin_time = Number($scope.roomInfo[j].durationList[q].begin_time);
                            $scope.roomInfo[j].durationList[q].end_time = Number($scope.roomInfo[j].durationList[q].end_time);
                        }
                    }
                    $scope.getOrderList()
                }else{
                    SweetAlert.swal("",response.msg,"error")
                }
            })
        }
    }

    // 房间投影仪连接状态
    $scope.getRoomStatus = function(){
        var data = {
            store_sn : store_sn
        }
        Room.GetRoomStatus(data).then(function(response){
            if(response.code == 0){
                for(var i = 0;i < $scope.roomInfo.length;i++){
                    for (x in response.data){
                        if(x == $scope.roomInfo[i].room_sn){
                            $scope.roomInfo[i].online = response.data[x].online;
                        }
                    }
                }
            }else{
                SweetAlert.swal("",response.msg,"error");
            }
        })
    };
    
    // 5秒循环拉取房间投影仪状态
    $rootScope.statusTimer = $interval(function(){
        $scope.getRoomStatus();
    },10000);

    // 获得所有房间信息
    $scope.getroomAllInfo(store_sn);

    // 添加房间按钮
    $scope.addRoom = function(){
        var modalInstance = $uibModal.open({
            animation: true,
            backdrop : "static",
            templateUrl: 'createRoom.html',
            controller: 'createRoomModalInstanceCtrl',
            resolve: {
                durationList : function(){
                    return $scope.durationList;
                },
                roomInfo : function(){
                    return $scope.roomInfo
                },
                roomListController : function(){
                    return $scope
                }
            }
        });
        modalInstance.result.then(function () {

        });
    }

    delete $localStorage.storeRoomData;
    // 房间模板
    $scope.ediTemplet = function() {
        $rootScope.$state.go("app.timeTemplet",{store_sn:store_sn});
         $scope.$storage = $localStorage.$default({
            storeRoomData: $scope.roomInfo
        });
    }

    // 点击房间名,编辑房间
    $scope.editorRoom = function(sinRoom,$index){
        var modalInstance = $uibModal.open({
            animation: true,
            backdrop : "static",
            templateUrl: 'editorRoom.html',
            controller: 'editorRoomInstanceCtrl',
            resolve: {
                durationList : function(){
                    return $scope.durationList
                },
                roomInfo : function(){
                    return $scope.roomInfo
                },
                sinRoom : function(){
                    return sinRoom
                },
                roomListController : function(){
                    return $scope
                },
                index : function(){
                    return $index
                }
            }
        });
        modalInstance.result.then(function () {
        });
    }

    //点击过期房间
    $scope.checkTimeOut = function(){
        SweetAlert.swal({
            title:"",
            text: "该时间段已过期",
            type: "warning",
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "确定",
            html: true,
        });
    }
    // 点击清洁房间
    $scope.checkClear = function(){
        SweetAlert.swal({
            title:"",
            text: "正在清洁中",
            type: "warning",
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "确定",
            html: true,
        });
    }
    //点击房间时间段预约信息
    $scope.roomDurationInfo = function (roomOrderInfo,durationInfo,$idnex) {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'roomDurationInfo.html',
            controller: 'durationInfoModalInstanceCtrl',
            resolve: {
                roomListController : function(){
                    return $scope
                },
                durationInfo : function(){
                    return durationInfo
                },
                index : function(){
                    return $idnex
                },
                roomOrderInfo : function () {
                    return roomOrderInfo
                }
            }
        });
        modalInstance.result.then(function () {
        });
    };

    // 合并时间段
    $scope.mergeTime = function(room,durationTime,$index,$event){
        $event.stopPropagation();
        var data = {
            duration_sn : room.durationList[($index+1)].duration_sn,
            duration_name : room.durationList[($index+1)].duration_name,
            create_name:room.durationList[($index+1)].create_name,
            begin_time:room.durationList[($index+1)].begin_time,
            end_time:room.durationList[($index+1)].end_time,
            create_time:room.durationList[($index+1)].create_time,
            room_sn:room.durationList[($index+1)].room_sn,
            store_sn:room.durationList[($index+1)].store_sn,
            price:parseInt(room.durationList[($index+1)].price),
            status:room.durationList[($index+1)].status,
            reserve_time:room.durationList[($index+1)].reserve_time,
            lock:room.durationList[($index+1)].lock,
            token:token,
            duration_sn : room.durationList[($index+1)].duration_sn,
            type:1
        };
        if(room.durationList[($index+1)].orderInfo){
            if(room.durationList[($index+1)].orderInfo.status != 4 && room.durationList[($index+1)].orderInfo.status != 5){
                SweetAlert.swal({
                    title: "",
                    text: "合并时段有订单，不能合并！",
                    timer: 1000,
                    showConfirmButton: false,
                    type : "warning"
                })
                return;
            }
        }
        
        Room.EditDuration(data).then(function(response){
            if(response.code == 0){
                $scope.reflushRoom();
                SweetAlert.swal({
                    title: "",
                    text: "合并成功！",
                    timer: 1000,
                    showConfirmButton: false,
                    type : "success"
                })
            }else if(response.code == 1005){
                SweetAlert.swal({
                    title: "",
                    text: "暂无数据修改！",
                    timer: 1000,
                    showConfirmButton: false,
                    type : "warning"
                })
            }else{
                SweetAlert.swal("",response.msg,"error");
            }
        })
    };
    // 预约
    $scope.orderBtn = function(room,durationTime,$index,$event){
        $event.stopPropagation();
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'order.html',
            controller: 'orderModalInstanceCtrl',
            resolve: {
                durationTime : function(){
                    return durationTime
                },
                roomListController : function(){
                    return $scope
                }
            }
        });
        modalInstance.result.then(function () {

        });
    }
    //消费记录
    $scope.roomRecord = function(){
        var store_sn = $location.url().substr($location.url().lastIndexOf("/") + 1);
        $scope.getroomAllInfo(store_sn);
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'roomRecord.html',
            controller: 'orderRecordModalInstanceCtrl',
            size : 'lg',
            resolve: {
                durationList : function(){
                    return $scope.durationList;
                },
                roomInfo : function(){
                    return $scope.roomInfo
                },
                roomListController : function(){
                    return $scope
                }
            }
        });
        modalInstance.result.then(function () {

        });
    }
    // 打扫记录
    $scope.clearReord = function(){
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'clearReord.html',
            controller: 'clearReordModalInstanceCtrl',
            resolve: {
                roomListController : function(){
                    return $scope
                }
            }
        });
        modalInstance.result.then(function () {
        });
    }

    // 日期插件封装
    function datePicker(){
        $scope.today = function() {
            $scope.checkDate = new Date();
        };
        $scope.today();

        $scope.clear = function() {
            $scope.dt1 = null;
        };

        // 设置周六周日不可选，不使用
        function disabled(data) {
            var date = data.date,
            mode = data.mode;
            return mode === 'day' && (date.getDay() === 10 || date.getDay() === 11);
        }

        $scope.toggleMin = function() {
            $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
            $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
        };
        $scope.inlineOptions = {
            customClass: getDayClass,
            minDate: new Date(),
            showWeeks: true
        };

        $scope.dateOptions = {
            dateDisabled: disabled,
            formatYear: 'yy',
            maxDate: new Date(2020, 5, 22),
            minDate: new Date(2017,1,1),
            startingDay: 1
        };
        $scope.openDateBox = function() {
            $scope.popup1.opened = true;
        };
        $scope.setDate = function(year, month, day) {
            $scope.dt1 = new Date(year, month, day);
        };

        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
        $scope.altInputFormats = ['M!/d!/yyyy'];

        $scope.popup1 = {
            opened: false
        };

        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        var afterTomorrow = new Date();
        afterTomorrow.setDate(tomorrow.getDate() + 1);
        $scope.events = [
            {
              date: tomorrow,
              status: 'full'
            },
            {
              date: afterTomorrow,
              status: 'partially'
            }
        ];

        function getDayClass(data) {
            var date = data.date,
            mode = data.mode;
            if (mode === 'day') {
                var dayToCheck = new Date(date).setHours(0,0,0,0);

                for (var i = 0; i < $scope.events.length; i++) {
                    var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

                    if (dayToCheck === currentDay) {
                        return $scope.events[i].status;
                    }
                }
            }
            return '';
        }
    }
}])

// 消费记录
app.controller('orderRecordModalInstanceCtrl', function($scope,$uibModalInstance,$location,$timeout,SweetAlert,Auth,$uibModal,ngVerify,Room,$localStorage,roomInfo,roomListController,Lightbox) {
    
    $scope.getNowTime = roomListController.nowTime;
    var token = Auth.getLocalData("token");
    var store_sn = $location.url().substr($location.url().lastIndexOf("/") + 1);
    // 阿里云路径
    $scope.baseUrl = roomListController.baseUrl;

    // 消费记录弹窗数据
    $scope.orderListData = roomListController.orderListData;
    for(var q = 0;q < $scope.orderListData.length;q++){
        $scope.orderListData[q].pay_price = Number($scope.orderListData[q].pay_price);
    }
    // 留下状态为1,2,3的订单状态
    for(var i = 0;i < $scope.orderListData.length;i++){
        if($scope.orderListData[i].status == 0 || $scope.orderListData[i].status == 4 || $scope.orderListData[i].status == 5){
            $scope.orderListData.splice(i,1);
            i--;
        }
    };

    // 每页显示数目
    $scope.maxPageSize = 10;
    // 页数选择最大数目
    $scope.maxSize = 3;
    // 总共多少条数
    $scope.bigTotalItems = $scope.orderListData.length;
    // 最大页数
    $scope.maxPage = Math.ceil($scope.orderListData.length/$scope.maxPageSize);
    // 当前页数
    $scope.bigCurrentPage = 1;
    $scope.showOrderListData = [];
    // 监听分页数值变化
    $scope.$watch(function() {
            return $scope.bigCurrentPage;
        },
        function(newValue,oldValue) {
            $scope.showOrderListData = $scope.orderListData.slice((newValue - 1)*$scope.maxPageSize,newValue*$scope.maxPageSize);
            if($scope.showOrderListData.length > 0){
                for(var q = 0;q < $scope.showOrderListData.length;q++){
                    $scope.showOrderListData[q].getOutTime = parseInt($scope.showOrderListData[q].reserve_time) - 8 * 60 * 60 + parseInt($scope.showOrderListData[q].begin_time) * 60 - Date.parse(new Date()) / 1000
                }

            }
            console.log($scope.showOrderListData);
        },
        true
    );
    $scope.setPage = function(){
        if($scope.reqPage <= 0 || !$scope.reqPage){
            return
        }
        if($scope.reqPage > $scope.maxPage ){
            return
        }else{
            $scope.bigCurrentPage = $scope.reqPage
        }
    }

    // 退款
    $scope.refundOrder = function(order,$index){
        SweetAlert.swal({
            title:"",
            text: "确定是否退单？",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "确定",
            cancelButtonText: "返回",
            closeOnConfirm: false,
            html:true
        },function(isConfirm){
            if(isConfirm){
                var data = {
                    token : token,
                    order_sn : order.order_sn
                };
                Room.RefundOrder(data).then(function(response){
                    if(response.code == 0){
                        SweetAlert.swal({
                            title: "",
                            text: "退单成功！",
                            timer: 1000,
                            showConfirmButton: false,
                            type : "success"
                        })
                        $scope.showOrderListData.splice($index,1);
                        roomListController.getroomAllInfo(store_sn);
                    }else{
                        SweetAlert.swal("",response.msg,"error");
                    }
                })
            }else{
            }
        })
    }

    // 图片点击查看
    $scope.openLightboxModal = function (order) {
        var damageImages = order.damage_image_urls.split(",");
        if(damageImages.length == 1 && damageImages[0] == ""){
            damageImages[0] ='img/title/no_has_pic2.gif';
        }
        for(var m = 0;m < damageImages.length;m++){
            damageImages[m] = $scope.baseUrl + damageImages[m]
        }

        Lightbox.openModal(damageImages, 0);
    };
    // 点击设置罚金
    $scope.showSetRealDamage = function (order,$index) {
        // for(var m = 0;m < $scope.orderListData.length;m++){
        //     $scope.orderListData[m].setRealDamageFlag = false;
        // }
        // order.setRealDamageFlag = true;
        // $timeout(function(){
        //     $(".realDamageInput")[$index].focus();
        //     $scope.$apply();
        // },1000)
        var modalInstance = $uibModal.open({
            animation: true,
            backdrop : "static",
            templateUrl: 'changeRealDamage.html',
            controller: 'changeRealDamageCtrl',
            resolve: {
                roomListController : function(){
                    return $scope
                },
                order : function(){
                    return order
                }
            }
        });
        modalInstance.result.then(function () {

        });
    }
    $scope.changeRealDamage = function (order) {
        
        var re = /^[0-9]+([.]{1}[0-9]{1,2})?$/; 
        var result = re.test(order.newReal_damage);
        if(!result){
            SweetAlert.swal({
                title: "",
                text: "请输入大于0的数(最多2位小数)！",
                timer: 1000,
                showConfirmButton: false,
                type : "warning"
            })
            return;
        }
        var data = {
            token : token,
            real_damage : order.newReal_damage,
            order_sn : order.order_sn
        }
        Room.SetRealDamage(data).then(function(response){
            if(response.code == 0){
                order.real_damage = order.newReal_damage;
                order.setRealDamageFlag = false;
                SweetAlert.swal({
                    title: "",
                    text: "修改成功！",
                    timer: 1000,
                    showConfirmButton: false,
                    type : "success"
                })
            }else{
                SweetAlert.swal("",response.msg,"error");
            }
        })
    }
    $scope.return = function(){
        for(var m = 0;m < $scope.orderListData.length;m++){
            $scope.orderListData[m].setRealDamageFlag = false;
        }
    }

    // 初始化添加房间Data
    $scope.createRoomData = {
        create_time : "",
        mesh_name : "灯光1",
        password : "123456789",
    }
    $scope.roomInfo = roomListController.roomInfo;

    // 日期插件调用
    datePicker()

    // 添加房间
    // $scope.createRoomSubmit = function(){
    //     //转换日期
    //     console.log($scope.createRoomData)
    //     $scope.createRoomData.create_time = dateFilter($scope.createRoomData.create_time);
    //     $scope.createRoomData.store_sn = store_sn;
    //     $scope.createRoomData.token = token;
    //
    //     console.log($scope.createRoomData);
    //     // 表单验证
    //     ngVerify.check('addForm',function (errEls) {
    //         if(errEls.length > 0){
    //             SweetAlert.swal("","请完善正确的房间信息！","error");
    //         }else{
    //             // 发送添加房间请求
    //             $scope.createRoomData.imei = $scope.createRoomData.imei.imei;
    //             Room.CreateRoom($scope.createRoomData).then(function(response){
    //                 if(response.code == 0){
    //                     $uibModalInstance.close();
    //                     roomListController.getroomAllInfo(store_sn);
    //                     SweetAlert.swal({
    //                         title:"",
    //                         text: "创建房间成功！",
    //                         type: "success",
    //                         showCancelButton: false,
    //                         confirmButtonColor: "#DD6B55",
    //                         confirmButtonText: "确定",
    //                     },function(isConfirm){
    //                         if(isConfirm){
    //                             console.log("添加成功");
    //                         }
    //                     })
    //                 }else{
    //                     SweetAlert.swal("",response.msg,"error")
    //                 }
    //             })
    //         }
    //         $scope.createRoomData.create_time = new Date();
    //     });
    //
    // }

    $scope.close = function(){
        $uibModalInstance.close();
    }


    // 时间段选择参数
    $scope.startTime = new Date();
    $scope.stopTime = new Date();
    $scope.hstep = 1;
    $scope.mstep = 15;  // 时间跳度
    $scope.ismeridian = false; // 12小时制
    $scope.changed = function () {
        console.log("changed")
    };
    // 日期框model
    $scope.dateDay = { startDate: moment().subtract(1, 'day'), endDate: moment().subtract(1, 'day') };
    // 配置日期功能按钮
    $scope.rangesDate = {
        '今天': [moment(), moment()],
        '昨天': [moment().subtract(1,'days'), moment().subtract(1,'days')],
        '最近7天': [moment().subtract(7,'days'), moment()],
        '最近一个月': [moment().subtract(30,'days'), moment()],
        '这个月': [moment().startOf('month'), moment().endOf('month')]
    };

    // 日期插件封装
    function datePicker(){
        $scope.today = function() {
            $scope.createRoomData.create_time = new Date();
        };
        $scope.today();

        $scope.clear = function() {
            $scope.dt1 = null;
        };

        // 设置周六周日不可选，不使用
        function disabled(data) {
            var date = data.date,
            mode = data.mode;
            return mode === 'day' && (date.getDay() === 10 || date.getDay() === 11);
        }

        $scope.toggleMin = function() {
            $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
            $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
        };
        $scope.inlineOptions = {
            customClass: getDayClass,
            minDate: new Date(),
            showWeeks: true
        };

        $scope.dateOptions = {
            dateDisabled: disabled,
            formatYear: 'yy',
            maxDate: new Date(2020, 5, 22),
            minDate: new Date(2017,1,1),
            startingDay: 1
        };
        $scope.openDateBox = function() {
            $scope.popup1.opened = true;
        };
        $scope.setDate = function(year, month, day) {
            $scope.dt1 = new Date(year, month, day);
        };

        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
        $scope.altInputFormats = ['M!/d!/yyyy'];

        $scope.popup1 = {
            opened: false
        };

        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        var afterTomorrow = new Date();
        afterTomorrow.setDate(tomorrow.getDate() + 1);
        $scope.events = [
            {
              date: tomorrow,
              status: 'full'
            },
            {
              date: afterTomorrow,
              status: 'partially'
            }
        ];

        function getDayClass(data) {
            var date = data.date,
            mode = data.mode;
            if (mode === 'day') {
                var dayToCheck = new Date(date).setHours(0,0,0,0);

                for (var i = 0; i < $scope.events.length; i++) {
                    var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

                    if (dayToCheck === currentDay) {
                        return $scope.events[i].status;
                    }
                }
            }
            return '';
        }
    }
});

// 添加房间信息控制器
app.controller('createRoomModalInstanceCtrl', function($scope,$uibModalInstance,$location,$timeout,SweetAlert,Auth,$uibModal,ngVerify,Room,$localStorage,roomInfo,roomListController) {
    var token = Auth.getLocalData("token");
    var store_sn = $location.url().substr($location.url().lastIndexOf("/") + 1);
    // 获得未绑定的设备
    getUnbind()

    function getUnbind(argument) {
        var data = {
            store_sn : store_sn
        }
        Room.GetUnbind(data).then(function(response){
            if(response.code == 0){
                $scope.deviceArr = response.data
                if(!$scope.deviceArr.length){
                    $scope.close();
                    SweetAlert.swal({
                        title: "",
                        text: "暂无可用的设备串号,请先添加设备!",
                        timer: 1000,
                        showConfirmButton: false,
                        type : "warning"
                    })
                }
            }else{
                SweetAlert.swal("",response.msg,"error")
            }
        })
    }

    // 初始化添加房间Data
    $scope.createRoomData = {
        create_time : "",
        password : "",
    }
    $scope.roomInfo = roomListController.roomInfo;


    // 日期插件调用
    datePicker()

    // 添加房间
    $scope.createRoomSubmit = function(){
        //转换日期
        $scope.createRoomData.create_time = dateFilter($scope.createRoomData.create_time);
        $scope.createRoomData.store_sn = store_sn;
        $scope.createRoomData.token = token;

        // 表单验证
        ngVerify.check('addForm',function (errEls) {
            if(errEls.length > 0){
                SweetAlert.swal({
                    title: "",
                    text: "请完善正确的房间信息！",
                    timer: 1000,
                    showConfirmButton: false,
                    type : "warning"
                })
            }else{
                // 发送添加房间请求
                $scope.createRoomData.imei = $scope.createRoomData.imei.imei;
                Room.CreateRoom($scope.createRoomData).then(function(response){
                    if(response.code == 0){
                        $uibModalInstance.close();
                        roomListController.getroomAllInfo(store_sn);
                        SweetAlert.swal({
                            title:"",
                            text: "创建房间成功！",
                            type: "success",
                            showCancelButton: false,
                            confirmButtonColor: "#DD6B55",
                            confirmButtonText: "确定",
                        },function(isConfirm){
                            if(isConfirm){
                                console.log("添加成功");
                            }
                        })
                    }else{
                        SweetAlert.swal("",response.msg,"error")
                    }
                })
            }
            $scope.createRoomData.create_time = new Date();
        });

    }

    $scope.close = function(){
        $uibModalInstance.close();
    }

    // 时间段选择参数
    $scope.startTime = new Date();
    $scope.stopTime = new Date();
    $scope.hstep = 1;
    $scope.mstep = 15;  // 时间跳度
    $scope.ismeridian = false; // 12小时制
    $scope.changed = function () {
        console.log("changed")
    };

    // 日期插件封装
    function datePicker(){
        $scope.today = function() {
            $scope.createRoomData.create_time = new Date();
        };
        $scope.today();

        $scope.clear = function() {
            $scope.dt1 = null;
        };

        // 设置周六周日不可选，不使用
        function disabled(data) {
            var date = data.date,
                mode = data.mode;
            return mode === 'day' && (date.getDay() === 10 || date.getDay() === 11);
        }

        $scope.toggleMin = function() {
            $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
            $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
        };
        $scope.inlineOptions = {
            customClass: getDayClass,
            minDate: new Date(),
            showWeeks: true
        };

        $scope.dateOptions = {
            dateDisabled: disabled,
            formatYear: 'yy',
            maxDate: new Date(2020, 5, 22),
            minDate: new Date(2017,1,1),
            startingDay: 1
        };
        $scope.openDateBox = function() {
            $scope.popup1.opened = true;
        };
        $scope.setDate = function(year, month, day) {
            $scope.dt1 = new Date(year, month, day);
        };

        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
        $scope.altInputFormats = ['M!/d!/yyyy'];

        $scope.popup1 = {
            opened: false
        };

        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        var afterTomorrow = new Date();
        afterTomorrow.setDate(tomorrow.getDate() + 1);
        $scope.events = [
            {
                date: tomorrow,
                status: 'full'
            },
            {
                date: afterTomorrow,
                status: 'partially'
            }
        ];

        function getDayClass(data) {
            var date = data.date,
                mode = data.mode;
            if (mode === 'day') {
                var dayToCheck = new Date(date).setHours(0,0,0,0);

                for (var i = 0; i < $scope.events.length; i++) {
                    var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

                    if (dayToCheck === currentDay) {
                        return $scope.events[i].status;
                    }
                }
            }
            return '';
        }
    }
})
// 编辑房间信息控制器
app.controller('editorRoomInstanceCtrl', function($scope,$uibModalInstance,$timeout,$rootScope,$location,Auth,SweetAlert,$uibModal,ngVerify,Room,sinRoom,$localStorage,roomListController,index,apiUrl) {
    var token = Auth.getLocalData("token");
    $scope.checkDate = roomListController.checkDate;
    // 默认关闭时间段编辑
    $scope.showDurationEdit = false;
    $scope.editDurationClick = function(){
        $scope.showDurationEdit = !$scope.showDurationEdit;
        $scope.showUpFile = false;
    }
    // 获得未绑定的设备
    getUnbind()

    // 获取单个房间系统拷贝时间
    // getRoomCopyDaily()

    function getUnbind(argument) {
        var data = {
            store_sn : sinRoom.store_sn
        }
        Room.GetUnbind(data).then(function(response){
            if(response.code == 0){
                $scope.deviceArr = response.data;
                // 判断设备是否为空
                if($scope.deviceArr.length){
                    $scope.deviceArr.unshift({imei:sinRoom.imei})
                }else{
                    $scope.deviceArr = [{imei:sinRoom.imei}];
                }
            }else{
                SweetAlert.swal("",response.msg,"error")
            }
        })
    }
    // function getRoomCopyDaily(argument) {
    //     var data = {
    //         room_sn : sinRoom.room_sn
    //     }
    //     Room.GetRoomCopyDaily(data).then(function(response){
    //         if(response.code == 0){
    //             $scope.room_max_reserve_day = response.data.room_max_reserve_day;
    //             $scope.room_max_reserve_day = JSON.parse($scope.room_max_reserve_day)[sinRoom.room_sn]
    //         }else{
    //             SweetAlert.swal("",response.msg,"error")
    //         }
    //     })
    // }

    // 二维码修改
    $scope.qrCodeDis = true;
    // 点击修改二维码
    $scope.changQrCode = function(){
        $scope.qrCodeDis = false;
    }
    // $scope.letQrCodeDis = function(){
    //     $scope.qrCodeDis = true;
    //     SweetAlert.swal("","新的二维码已生成","success")
    // }

    // 修改房间更新时间
    $scope.changeReserve_day = function(){
        var room_sn = sinRoom.room_sn
        var json = '{"' + room_sn + '":' + $scope.room_max_reserve_day + ' }';
        var data = {
            token : token,
            list : json,
        }
        var re = /^\+?[0-9][0-9]*$/;
        if(re.test($scope.room_max_reserve_day)){
            Room.SetRoomCopyDaily(data).then(function(response){
                if(response.code == 0){
                    SweetAlert.swal({
                        title: "",
                        text: "修改更新时间成功！",
                        timer: 1000,
                        showConfirmButton: false,
                        type : "success"
                    })
                }else{
                    SweetAlert.swal("",response.msg,"error")
                }
            })
        }else{
            SweetAlert.swal({
                title: "",
                text: "请填写价格(大于0的整数)！",
                timer: 1000,
                showConfirmButton: false,
                type : "warning"
            })
        }
        
    }


    //默认关闭文件上传
    $scope.showUpFile = false;
    $scope.showUpFileClick = function(){
        $scope.showUpFile = !$scope.showUpFile;
        $scope.showDurationEdit = false;
    }

    
    // 时间段数组初始化
    $scope.showTimer = [];

    // 初始化编辑房间模态框
    $scope.editorRoomData = angular.copy(sinRoom);

    // 监听表单是否有改变,返回$scope.flagSubmit
    formCheckChange($scope,$scope.editorRoomData)

    // 当前房间图片
    if(sinRoom.picture == "" || sinRoom.picture == "none.png"){
        // 当没有图片给一张默认暂无图片
        $scope.currentRoomImg = "./img/title/no_has_pic2.gif";
    }else{
        $scope.currentRoomImg = sinRoom.picture;
    }

    // angular.forEach(roomListController.durationList, function(data,index,array){
    //     if(data.room_sn == $scope.editorRoomData.room_sn){
    //         $scope.showTimer.push(data);
    //     }
    // });
    $scope.showTimer= $scope.editorRoomData.durationList;

    // 增加时间段
    $scope.addDuration = function(){
        var TodayTime = getTodayTime($scope.checkDate);
        var re = /^\+?[0-9][0-9]*$/;
        // 检测价格是否是大于0的整数
        if(re.test($scope.roomPrice)){
            var data = {
                begin_time : getDurationTime($scope.begin_time).hoursMinutes,
                end_time : getDurationTime($scope.end_time).hoursMinutes,
                duration_name : "中午",
                room_sn : sinRoom.room_sn,
                store_sn : sinRoom.store_sn,
                status : 0,
                create_name : "admin",
                create_time : new Date(),
                token : token,
                price : $scope.roomPrice,
                reserve_time : Number(TodayTime) + 28800
            };
            Room.AddDuration(data).then(function(response){
                if(response.code == 0){
                    // 页面更新新添加的时间段
                    data.duration_sn = response.data.duration_sn;
                    roomListController.roomInfo[index].durationList.push(data);
                    // 模态框更新添加的时间段
                    $scope.showTimer.push(data);
                    // SweetAlert.swal("","添加时间段成功！","success");
                    changeTime($scope.end_time);
                }else{
                    SweetAlert.swal("",response.msg,"error");
                }
            })
        }else{
            SweetAlert.swal({
                title: "",
                text: "请填写价格(大于0的整数)！",
                timer: 1000,
                showConfirmButton: false,
                type : "warning"
            })
        }
    }
    function changeTime(baseTime){
        $scope.begin_time = new Date(parseInt(((Date.parse(baseTime)/1000) + $rootScope.setTime.min )) *1000);
        $scope.end_time = new Date(parseInt(((Date.parse($scope.begin_time)/1000) + $rootScope.setTime.max )) *1000);
    }

    // 删除时间段
    $scope.delDuration = function(duration,$index){
        var data = {
            token : token,
            duration_sn : duration.duration_sn
        }
        Room.DelDuration(data).then(function(response){
            if(response.code ==  0){
                // 页面更新新添加的时间段
                roomListController.roomInfo[index].durationList.splice($index,1);
                // 模态框更新添加的时间段
                $scope.showTimer.splice($index,1);
                // SweetAlert.swal("","删除时间段成功！","success");
            }else{
                SweetAlert.swal("",response.msg,"error");
            }
        })
    }

    // 关闭模态框
    $scope.close = function(){
        $uibModalInstance.close();
    }

    $scope.baseUrl = roomListController.baseUrl;
 
    //图片上传事件
    $scope.upfileSubmit = function(){
        var  file= document.getElementById('fileInput').files[0];
        if(!file){alert('请选择图片');return ;}

        // 打开上传中提示框
        tipBoxController(roomListController,"上传中，请等待！",true)

        // 将文件转化为FormData
        var data = new FormData();
        data.append(' room_image', file);
        data.append('name',file.name);  
        data.append('token',token);     

        // 发送文件上传请求
        $.ajax({
            url: apiUrl.url + "/room/uploadRoomImage",
            type: "POST",
            processData: false,
            contentType: false,
            data: data,
            success: function(response) {
                if(response.code == 0){
                    // 提示上传成功，1秒之后自动关闭
                    tipBoxController(roomListController,"上传成功！",true)
                    $timeout(function(){
                        tipBoxController(roomListController,"",false)
                    },1000)

                    // 获得OSS图片返回的地址，将图片显示在页面上
                    $scope.currentRoomImg = response.data.oss_name;
                    $scope.editorRoomData.picture = response.data.oss_name;

                    // 调用remove事件，清空文件上传
                    document.getElementsByClassName("fileinput-remove-button")[0].click();
                    $scope.$apply();
                }else{
                    SweetAlert.swal("",response.msg,"error");
                }
            }
        });
    };

    // 保存房间编辑信息
    $scope.editorRoomSubmit = function(){

        // 表单是否有改变
        if(!$scope.flagSubmit){
            SweetAlert.swal({
                title: "",
                text: "没有修改的信息",
                timer: 1000,
                showConfirmButton: false,
                type : "warning"
            })
            return;
        }


        $scope.editorRoomData.picture = $scope.currentRoomImg;
        var data = $scope.editorRoomData;

        // 表单验证
        ngVerify.check('editorForm',function (errEls) {
            if(errEls.length > 0){
                SweetAlert.swal({
                    title: "",
                    text: "请填写正确的房间信息！",
                    timer: 1000,
                    showConfirmButton: false,
                    type : "warning"
                })
            }else{
                Room.EditRoom(data).then(function(response){
                    if(response.code == 0){
                        $uibModalInstance.close();

                        // 更新传进来的数据参数
                        upDateInfo($scope.editorRoomData,sinRoom);
                        SweetAlert.swal({
                            title: "",
                            text: "修改房间信息成功！",
                            timer: 1000,
                            showConfirmButton: false,
                            type : "success"
                        })
                    }else{
                        SweetAlert.swal("",response.msg,"error")
                    }
                })
            }
        });

    }

    // 删除房间
    $scope.delRoom = function(){
        SweetAlert.swal({
            title:"",
            text: "是否确定删除该房间！",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "确定",
            cancelButtonText: "返回",
            closeOnConfirm: false,
            html: true,
        },
        function(isConfirm){
            if (isConfirm) {
                var data = {
                    store_sn: sinRoom.store_sn,
                    room_sn: sinRoom.room_sn,
                    token: token
                }
                Room.DelRoom(data).then(function (response) {
                    if (response.code == 0) {
                        roomListController.roomInfo.splice(index, 1);
                        SweetAlert.swal({
                            title: "",
                            text: "删除房间成功！",
                            type: "success",
                            showCancelButton: false,
                            confirmButtonColor: "#DD6B55",
                            confirmButtonText: "确定",
                        })
                        $scope.close();
                    } else {
                        SweetAlert.swal("", response.msg, "error")
                    }
                })
            }
        });
    }


    // 时间段选择参数
    var duraDate = new Date();
    $scope.begin_time = new Date(duraDate.getFullYear(),duraDate.getMonth(),duraDate.getDate(),8,0,0);
    $scope.end_time = new Date(duraDate.getFullYear(),duraDate.getMonth(),duraDate.getDate(),10,10,0);
    $scope.hstep = 1;
    $scope.mstep = 15;  // 时间跳度
    $scope.ismeridian = false; // 12小时制
    $scope.changed = function () {
        console.log("changed")
    };
})

// 时间段控制器
app.controller('durationInfoModalInstanceCtrl',function($scope,$window,$uibModalInstance,$location,SweetAlert,Auth,$uibModal,$localStorage,ngVerify,Room,roomListController,roomOrderInfo,durationInfo,index){
    var token = Auth.getLocalData("token");
    
    $scope.nowTime =  roomListController.nowTime;
    // 获得房间订单信息
    $scope.checkedOrderInfo = durationInfo.orderInfo;

    $scope.roomOrderInfo = roomOrderInfo;

    var dataOrder = angular.copy($scope.roomOrderInfo.durationList[index]);

    if(!$scope.roomOrderInfo.durationList[index].orderInfo){
        if(durationInfo.mobile){
            $scope.mobile = durationInfo.mobile;
        }
        $scope.filmName = "";
        $scope.roomPrice = "";
        $scope.real_damage = "";
    }else{
        if(typeof $scope.roomOrderInfo.durationList[index].orderInfo.info == "string"){
            $scope.roomOrderInfo.durationList[index].orderInfo.info = JSON.parse($scope.roomOrderInfo.durationList[index].orderInfo.info);
        }
        $scope.filmName = $scope.roomOrderInfo.durationList[index].orderInfo.info.film_name;
        $scope.roomPrice = $scope.roomOrderInfo.durationList[index].price;
        $scope.real_damage = $scope.roomOrderInfo.durationList[index].orderInfo.real_damage;
        $scope.mobile = $scope.roomOrderInfo.durationList[index].orderInfo.info.mobile;
    }
    $scope.setRealDamage = function () {
        var re = /^[0-9]+([.]{1}[0-9]{1,2})?$/; 
        var result = re.test($scope.real_damage);
        if(!result){
            SweetAlert.swal({
                title: "",
                text: "请输入大于0的数！",
                timer: 1000,
                showConfirmButton: false,
                type : "warning"
            })
            return;
        }
        var data = {
            token : token,
            real_damage : $scope.real_damage,
            order_sn : $scope.roomOrderInfo.durationList[index].orderInfo.order_sn
        }
        Room.SetRealDamage(data).then(function(response){
            if(response.code == 0){
                SweetAlert.swal({
                    title: "",
                    text: "修改成功！",
                    timer: 1000,
                    showConfirmButton: false,
                    type : "success"
                })
            }else{
                SweetAlert.swal("",response.msg,"error");
            }
        })
    }

    // var date2 = new Date();
    function turnTime(time){
        var out = "";
        var hours = parseInt(time/60);
        var minutes = time%60;
        out = {
            hours : hours,
            minutes : minutes
        };
        return out;
    }

    $scope.editDurationData = {};
    // 初始化编辑时间段信息

    $scope.editDurationData = angular.copy(durationInfo);
    $scope.editDurationData.price = parseInt(Number($scope.editDurationData.price));
    //转为时间obj
    function turntimeData(){
        var beginTime = $scope.editDurationData.begin_time;
        var endTime = $scope.editDurationData.end_time;
        $scope.editDurationData.begin_time = new Date();
        $scope.editDurationData.end_time = new Date();
        $scope.editDurationData.begin_time.setHours(turnTime(beginTime).hours);
        $scope.editDurationData.begin_time.setMinutes(turnTime(beginTime).minutes);
        $scope.editDurationData.end_time.setHours(turnTime(endTime).hours);
        $scope.editDurationData.end_time.setMinutes(turnTime(endTime).minutes);
    }
    turntimeData();
    $scope.editDurationData.token = token;

    $scope.editDuration = function(){
        var data =  $scope.editDurationData;
        data.begin_time = getDurationTime(data.begin_time).hoursMinutes;
        data.end_time = getDurationTime(data.end_time).hoursMinutes;

        ngVerify.check('roomInfoForm',function (errEls) {
            if(errEls.length > 0){
                SweetAlert.swal({
                    title: "",
                    text: "请填写时段价格(整数)！",
                    timer: 1000,
                    showConfirmButton: false,
                    type : "warning"
                })
                // 更新模态框上的数据
                // turntimeData(durationInfo.begin_time,durationInfo.end_time);
                return;
            }else{
                delete data.mobile;
                // delete data.begin_time;
                // delete data.end_time;
                Room.EditDuration(data).then(function(response){
                    if(response.code == 0){
                        // 更新传进来的数据参数
                        SweetAlert.swal({
                            title: "",
                            text: "修改成功！",
                            type: "success",
                            showCancelButton: false,
                            confirmButtonColor: "#DD6B55",
                            confirmButtonText: "确定",
                            closeOnConfirm: false}, 
                        function(){ 
                            $window.location.reload();
                        });
                    }else if(response.code == 1005){
                        SweetAlert.swal("","暂无数据修改！","error");
                    }else{
                        SweetAlert.swal("",response.msg,"error");
                    }
                })
                // turntimeData();
            }
        });
    }

    $scope.close = function () {
        $uibModalInstance.close();
    }
    // 时间段选择参数
    $scope.hstep = 1;
    $scope.mstep = 15;  // 时间跳度
    $scope.ismeridian = false; // 24小时制
    $scope.changed = function () {
        console.log("changed")
    };
})

// 打扫记录
app.controller('clearReordModalInstanceCtrl',function($scope,$uibModalInstance,$location,Auth,SweetAlert,$uibModal,$localStorage,roomListController){
    var token = Auth.getLocalData("token");
    // 打扫记录
    $scope.clearReords = roomListController.orderListData;
})
app.controller('changeRealDamageCtrl',function($scope,$uibModalInstance,$location,SweetAlert,$uibModal,Auth,$localStorage,$window,roomListController,order,Room){
    var token = Auth.getLocalData("token");
    // var re = /^[0-9]+([.]{1}[0-9]{1,2})?$/; 
    // var result = re.test(order.newReal_damage);
    // if(!result){
    //     SweetAlert.swal("","请输入大于0的数(最多2位小数)！","error");
    //     return;
    // }
    $scope.changeRealDamageData = {
        newReal_damage : order.damage,
        damage_info : ""
    };

    $scope.changeRealDamage = function(){
        var data = {
            token : token,
            real_damage : $scope.changeRealDamageData.newReal_damage,
            damage_info : $scope.changeRealDamageData.damage_info,
            order_sn :  order.order_sn
        }
        Room.SetRealDamage(data).then(function(response){
            if(response.code == 0){
                // order.real_damage = order.newReal_damage;
                // order.setRealDamageFlag = false;
                $uibModalInstance.close();
                SweetAlert.swal({
                    title: "",
                    text: "修改成功！",
                    type: "success",
                    showCancelButton: false,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "确定",
                    closeOnConfirm: false}, 
                function(){ 
                    $window.location.reload();
                });
                return;
                SweetAlert.swal({
                    title: "",
                    text: "修改成功！",
                    timer: 1000,
                    showConfirmButton: false,
                    type : "success"
                })
            }else{
                SweetAlert.swal("",response.msg,"error");
            }
        })
    }


    // 关闭模态框
    $scope.close = function(){
        $uibModalInstance.close();
    }

})

// 预约
app.controller('orderModalInstanceCtrl',function($scope,$window,$uibModalInstance,$location,SweetAlert,$uibModal,Auth,$localStorage,Room,roomListController,durationTime){
    var token = Auth.getLocalData("token");
    var data = angular.copy(durationTime);
    if(durationTime.mobile){
        $scope.mobile = durationTime.mobile;
    }
    $scope.subOrderBtn = function(){
        if($scope.mobile == ""){
            $scope.mobile = 0
        }
        data.type = 2;
        data.mobile = $scope.mobile;
        data.price = parseInt(data.price);
        if(data.begin_time >= 1440){
            data.begin_time = data.begin_time - 1440
        }
        if(data.end_time >= 1440){
            data.end_time = data.end_time - 1440
        }
        Room.EditDuration(data).then(function(response){
            if(response.code == 0){
                SweetAlert.swal({
                    title: "",
                    text: "操作成功！",
                    type: "success",
                    showCancelButton: false,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "确定",
                    closeOnConfirm: false}, 
                function(){ 
                    $window.location.reload();
                });
            }else{
                SweetAlert.swal("",response.msg,"error");
            }
        })
    };
})







