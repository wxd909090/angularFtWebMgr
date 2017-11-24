app
.controller('storeListController',function ($scope,$timeout,$rootScope,SweetAlert,$uibModal,$localStorage,apiUrl,Auth,StoreList,$location,ngVerify) {
    var token = Auth.getLocalData("token");
    var store_sn = Auth.getLocalData("storeSn");
    var data =  {
        token : token
    }

    // 请求门店列表
    GetStoreList();
    function GetStoreList(){
        StoreList.GetStoreList(data).then(function(response){
            console.log(response);
            if(response.code  == 0){
                $scope.storeListData = response.data;
            }else{
                var msg = response.msg;
                SweetAlert.swal("",msg,"error");
            }
        })
    }


    // 进来显示使用中的门店   0为使用中  1为禁用中 2 暂停营业
    $scope.showStatusArr =[
        {name:'正在营业',value:0},
        {name:'暂停营业',value:2},
        {name:'禁用使用',value:1},
    ]
    $scope.showStatus = 0;
    
    // 点击查看所有设备
    $scope.checkAllDevice = function(){
        var modalInstance = $uibModal.open({
            animation: true,
            backdrop : "static",
            templateUrl: 'allDevice.html',
            controller: 'allDeviceModalInstanceCtrl',
            resolve: {
                storeListController: function () {
                    return $scope;
                }
            }
        });
        modalInstance.result.then(function () {
            // console.log("关闭查看所有设备")
        });
    };

    // 查看所有订单管理
    $scope.allOrderMgr = function(){
        var modalInstance = $uibModal.open({
            animation: true,
            backdrop : "static",
            templateUrl: 'allOrderMgr.html',
            controller: 'allOrderMgrModalInstanceCtrl',
            size : 'lg',
            resolve: {
                storeListController: function () {
                    return $scope;
                }
            }
        });
        modalInstance.result.then(function () {
            // console.log("关闭查看所有设备")
        });
    }

    // 门店默认海报
    $scope.defaultPoster = function(){
        var modalInstance = $uibModal.open({
            animation: true,
            backdrop : "static",
            templateUrl: 'defaultPoster.html',
            controller: 'defaultPosterModalInstanceCtrl',
            size:'lg',
            resolve: {
                storeListController: function () {
                    return $scope;
                }
            }
        });
        modalInstance.result.then(function () {
        });
    }

    // 进入门店
    $scope.enterStore = function(storeName){
        var storeName = storeName;
        $scope.$storage = $localStorage.$default({
            storeName: storeName
        });
    }
    // 删除门店名localStorage
    delete $localStorage.storeName;

    //新增门店
    $scope.animationsEnabled = true;
    $scope.addStore = function (store) {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            backdrop : "static",
            templateUrl: 'addStoreModal.html',
            controller: 'addStoreListModalInstanceCtrl',
            resolve: {
                storeListController: function () {
                    return $scope;
                }
            }
        });
        modalInstance.result.then(function () {
            // 关闭模态框之后拉取门店列表
            GetStoreList();
            console.log("新增门店成功！")
        });
    };
    // 编辑门店
    $scope.editorStore = function (store) {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            backdrop : "static",
            templateUrl: 'editorStore.html',
            controller: 'editorStoreModalInstanceCtrl',
            resolve: {
                editorStore: function () {
                    return store;
                },
                storeListController: function () {
                    return $scope;
                }
            }
        });
        modalInstance.result.then(function () {
            console.log("编辑门店关闭");
        });
    };

    // 商家海报管理
    $scope.posterMgr = function(store){
        var modalInstance = $uibModal.open({
            animation: true,
            backdrop : "static",
            templateUrl: 'storePoster.html',
            controller: 'storePosterModalInstanceCtrl',
            size:'lg',
            resolve: {
                storeListController: function () {
                    return $scope;
                },
                storeData: function () {
                    return store;
                }
            }
        });
        modalInstance.result.then(function () {
        });
    };

    // 商家编辑  添加
    $scope.agentAddOrEdit = function (storeSn) {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            backdrop : "static",
            templateUrl: 'agent.html',
            controller: 'agentModalInstanceCtrl',
            resolve: {
                storeListController: function () {
                    return $scope;
                },
                storeSn : function () {
                    return storeSn;
                },
            }
        });
        modalInstance.result.then(function () {
        });
    };

    // 添加设备
    $scope.addDevice = function (store,index) {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            backdrop : "static",
            templateUrl: 'addDevice.html',
            controller: 'addDeviceModalInstanceCtrl',
            resolve: {
                storeListController: function () {
                    return $scope;
                },
                store : function () {
                    return store;
                },
                index : function () {
                    return index;
                }
            }
        });
        modalInstance.result.then(function () {
            console.log("添加设备关闭");
        });
    };

	// 门店暂停使用
	$scope.forbidStore = function(store){
		SweetAlert.swal({
			title:"",
			text: "是否确定暂停该门店的使用！",
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "确定",
			cancelButtonText: "返回",
			closeOnConfirm: false,
			html: true,
		}, function(isConfirm){
            // 确认暂停
            if (isConfirm) {
                var data = {
                    store_sn : store.store_sn,
                    token : token,
                    staff_sn : "admin"
                }
                StoreList.ForbidStore(data).then(function(response){
                    console.log(response);
                    if(response.code == 0){
                        SweetAlert.swal({
                            title: "成功",
                            text: "禁用门店成功！",
                            type: "success",
                            showCancelButton: false,
                            confirmButtonColor: "#DD6B55",
                            confirmButtonText: "返回",
                            closeOnConfirm: true,
                        }, 
                        function(isConfirm){ 
                            if (isConfirm) {
                                // 关闭弹框之后拉取门店列表
                                GetStoreList();
                            }
                        });
                    }else{
                        var msg = response.msg;
                        SweetAlert.swal("",msg,"error");
                    }
                })
            }
		});
	}
});

// 添加门店
app.controller('addStoreListModalInstanceCtrl', function($scope,$rootScope,$uibModalInstance,$localStorage,SweetAlert,StoreList,apiUrl,Auth,storeListController,ngVerify) {
    // 日期插件调用
    datePicker();
    var token = Auth.getLocalData("token");
    var store_sn = Auth.getLocalData("storeSn");

    // 添加门店
    $scope.formData = {
        token : token
    };
    // 获得门店经纬度
    $scope.getStoreoLcation = function(){
        if($scope.formData.address == ""){
            return;
        }
        var data = {
            token : $scope.formData.token,
            address : $scope.formData.address
        }
        StoreList.GetStoreLocation(data).then(function(response){
            if(response.code == 0){
                $scope.formData.path_x = response.data.location.lat;
                $scope.formData.path_y = response.data.location.lng;
                $scope.formData.province = response.data.address_components.province;
                $scope.formData.city = response.data.address_components.city;
                $scope.formData.district = response.data.address_components.district + response.data.title
            }else{
                SweetAlert.swal("",response.msg,"error");
            }
        })
    }
    // 提交添加门店
    $scope.formSubmit = function(){
        ngVerify.check('addForm',function (errEls) {
            if(errEls.length > 0){
                SweetAlert.swal({
                    title: "",
                    text: "请完善表单信息！",
                    timer: 1000,
                    showConfirmButton: false,
                    type : "warning"
                })
            }else{
                // if($scope.formData.mobile){
                //     var f = /^1[345789][0-9]{9}$/;
                //     if(!f.test($scope.formData.mobile)) {
                //         SweetAlert.swal({
                //             title: "",
                //             text: "手机格式不正确！",
                //             timer: 1000,
                //             showConfirmButton: false,
                //             type : "warning"
                //         });
                //         return;
                //     }
                // } else {
                //     delete $scope.formData.mobile;
                // }
                StoreList.CreateStore($scope.formData).then(function(response){
                    if(response.code == 0){
                        $uibModalInstance.close();
                        SweetAlert.swal({
                            title: "成功",
                            text: "创建门店成功！",
                            type: "success",
                            showCancelButton: false,
                            confirmButtonColor: "#DD6B55",
                            confirmButtonText: "返回",
                            closeOnConfirm: true,
                        });
                    }else{
                        var msg = response.msg;
                        SweetAlert.swal("",msg,"error");
                    }
                })
            }
        });

    }
    $scope.close = function(){
        $uibModalInstance.close();
    }
    $scope.colors = [
        {name:'black'},
        {name:'white'},
        {name:'red'},
        {name:'blue'},
        {name:'yellow'}
    ];



	// //删除广告
	// $scope.removeAdverBtn = function(){
	// 	SweetAlert.swal({
	// 		title:"",
	// 		text: "是否确定删除该门店！",
	// 		type: "warning",
	// 		showCancelButton: true,
	// 		confirmButtonColor: "#DD6B55",
	// 		confirmButtonText: "确定",
	// 		cancelButtonText: "返回",
	// 		closeOnConfirm: false,
	// 		html: true,
	// 	}, function(){
	// 		SweetAlert.swal("","删除门店成功！","success");
	// 	});
	// }

    // 日期插件封装
    function datePicker(){
        $scope.today = function() {
            $scope.dt1 = new Date();
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
            minDate: new Date(),
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
// 编辑门店
app.controller('editorStoreModalInstanceCtrl',function($scope,$rootScope,$uibModalInstance,$localStorage,SweetAlert,StoreList,apiUrl,Auth,storeListController,editorStore,ngVerify){
    // 编辑门店
    var token = Auth.getLocalData("token");
    var store_sn = Auth.getLocalData("storeSn");
    $scope.createFilm = function () {
        var data={
            store_sn:editorStore.store_sn,
            token:token
        }
        StoreList.createFilm(data).then(function(response){
            if(response.code == 0){
                SweetAlert.swal({
                    title: "",
                    text: "创建门店电影表成功!",
                    timer: 1000,
                    showConfirmButton: false,
                    type : "warning"
                })
            }else{
                var msg = response.msg;
                SweetAlert.swal("",msg,"error");
            }
        })
    }
    // 初始化编辑门店模态框
    $scope.editorStoreData = angular.copy(editorStore);
    // $scope.editorStoreData.username = $scope.editorStoreData.adminInfo ? $scope.editorStoreData.adminInfo.username : '';
    // $scope.editorStoreData.mobile = $scope.editorStoreData.adminInfo ? $scope.editorStoreData.adminInfo.mobile : '';
    // $scope.editorStoreData.password = '';
    // console.log($scope.editorStoreData.store_sn)
    // 获得未绑定的设备
    getUnbind()

    // 获取单个房间系统拷贝时间
    // getRoomCopyDaily()

    function getUnbind() {
        var data = {
            store_sn : $scope.editorStoreData.store_sn
        }
        StoreList.GetUnbind(data).then(function(response){
            if(response.code == 0){
                $scope.deviceArr = response.data;
                if($scope.editorStoreData.imei != ""){
                    $scope.deviceArr.unshift({imei : $scope.editorStoreData.imei})
                }
                console.log($scope.deviceArr)
            }else{
                SweetAlert.swal("",response.msg,"error")
            }
        })
    }


    if($scope.editorStoreData.qr_code)
    {
        $scope.qr_code_data = JSON.parse($scope.editorStoreData.qr_code).data;
    }
    else
    {
        $scope.qr_code_data = '';
    }

    $scope.editorStoreData.token = token;

    // 监听表单是否有改变,返回flagSubmit
    formCheckChange($scope,$scope.editorStoreData)
    // 获得门店经纬度
    $scope.getStoreoLcation = function(){
        if($scope.editorStoreData.address == ""){
            return;
        }
        var data = {
            token : $scope.editorStoreData.token,
            address : $scope.editorStoreData.address
        }
        StoreList.GetStoreLocation(data).then(function(response){
            if(response.code == 0){
                $scope.editorStoreData.path_x = response.data.location.lat;
                $scope.editorStoreData.path_y = response.data.location.lng;
                $scope.editorStoreData.province = response.data.address_components.province;
                $scope.editorStoreData.city = response.data.address_components.city;
                $scope.editorStoreData.district = response.data.address_components.district + response.data.title
            }else{
                SweetAlert.swal("",response.msg,"error");
            }
        })
    }


    // 二维码修改
    $scope.qr_code_type = 1001;
    $scope.qrCodeDis = true;
    // 点击修改二维码
    $scope.changQrCode = function(){
        $scope.qrCodeDis = false;
    }
    // $scope.editorStoreData.qr_code = '{"type":1001,"data":1002}';
    //编辑二维码信息
    $scope.changeQrType = function(){
        $scope.editorStoreData.qr_code = '{"type":"'+ $scope.qr_code_type + '","data":"'+ $scope.qr_code_data +'"}';
        console.log($scope.editorStoreData.qr_code)
    }
    // $scope.letQrCodeDis = function(){
    //     $scope.qrCodeDis = true;
    //     SweetAlert.swal("","新的二维码已生成","success")
    // }



    //保存编辑信息
    $scope.editorStoreSubmit = function(){
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
        // 表单验证
        ngVerify.check('editorForm',function (errEls) {
            if(errEls.length > 0){
                SweetAlert.swal({
                    title: "",
                    text: "请填写正确的门店信息！",
                    timer: 1000,
                    showConfirmButton: false,
                    type : "warning"
                });
                return;
            }else{
                // if($scope.editorStoreData.mobile){
                    // var f = /^1[345789][0-9]{9}$/;
                    // if(!f.test($scope.editorStoreData.mobile)) {
                    //     SweetAlert.swal({
                    //         title: "",
                    //         text: "手机格式不正确！",
                    //         timer: 1000,
                    //         showConfirmButton: false,
                    //         type : "warning"
                    //     });
                    //     return;
                    // }
                // } else {
                //     delete $scope.editorStoreData.mobile;
                // }
                StoreList.EditorStore($scope.editorStoreData).then(function(response){

                    if(response.code == 0){
                        $uibModalInstance.close();
                        
                        // 更新传进来的数据参数
                        upDateInfo($scope.editorStoreData,editorStore);
                       
                        SweetAlert.swal({
                            title: "成功",
                            text: "修改门店信息成功！",
                            type: "success",
                            showCancelButton: false,
                            confirmButtonColor: "#DD6B55",
                            confirmButtonText: "返回",
                            closeOnConfirm: true,
                        }, 
                        function(isConfirm){ 
                            if (isConfirm) {
                            }
                        });
                    }else{
                        var msg = response.msg;
                        SweetAlert.swal("",msg,"error");
                    }
                })
            }
        });
    }
    $scope.close = function(){
        $uibModalInstance.close();
    }
})
// 添加设备
app.controller('addDeviceModalInstanceCtrl',function($scope,$rootScope,$uibModalInstance,$localStorage,SweetAlert,StoreList,storeListController,store,index){
    $scope.store = store;
    // 获取设备
    $scope.devices =  $scope.store.device;
    console.log($scope.device)
    $scope.close = function(){
        $uibModalInstance.close();
    }
    // 添加设备
    $scope.addDeviceBtn = function(){
        if($scope.newDeviceData == ""){
            return;
        }
        var data = {
            imei : $scope.newDeviceData,
            store_sn : store.store_sn
        }
        StoreList.ProjectorAdd(data).then(function(response){
            if(response.code  == 0){
                storeListController.storeListData[index].device.push($scope.newDeviceData);
                $scope.newDeviceData = "";
                SweetAlert.swal({
                    title: "",
                    text: "添加设备成功！",
                    timer: 1000,
                    showConfirmButton: false,
                    type : "success"
                })
            }else{
                SweetAlert.swal("",response.msg,"error");
            }
        })
    }
    var deletIndex = index;
    $scope.deletDevice = function(device,index){
        var data = {
            imei : device,
            store_sn : store.store_sn
        }
        StoreList.ProjectorDel(data).then(function(response){
            if(response.code  == 0){
                storeListController.storeListData[deletIndex].device.splice(index,1);
                SweetAlert.swal({
                    title: "",
                    text: "删除设备成功！",
                    timer: 1000,
                    showConfirmButton: false,
                    type : "warning"
                })
            }else{
                SweetAlert.swal("",response.msg,"error");
            }
        })
    }


    // $scope.devices
})
// 查看所有设备
app.controller('allDeviceModalInstanceCtrl',function($scope,$rootScope,$uibModalInstance,$localStorage,SweetAlert,StoreList,storeListController){
    $scope.allDeviceData = []
    $scope.store_sn = "";
    $scope.searchDevice = "";

    // 分页设置
    $scope.maxSize = 3;
    $scope.bigCurrentPage =  1;
    $scope.bigTotalItems = 0;
    $scope.maxPage = 1;
    $scope.flag = false;

    // 获得门店列表
    $scope.storeListData = [];
    for(var i = 0;i < storeListController.storeListData.length;i++){
        if(storeListController.storeListData[i].status == 0 || storeListController.storeListData[i].status == 2){
            $scope.storeListData.push(storeListController.storeListData[i])
        }
    }
    $scope.checkDevice = function () {
        var data = getData();

        $scope.flag = true;
        $scope.bigCurrentPage = 1;
        getProjectorByImeiAndStoreSn(data)
    }

    // 监听分页数值变化
    $scope.$watch(function() {
            return $scope.bigCurrentPage;
        },
        function(value) {
            if($scope.flag == true && $scope.bigCurrentPage == 1){
                $scope.flag = false;
                return;
            }
            $scope.flag = false;
            var data = getData();
            data.page = value;
            getProjectorByImeiAndStoreSn(data)
        },
        true
    );

    function getData() {
        var data = {
            imei : $scope.searchDevice,
            store_sn : $scope.store_sn
        };
        if(!data.imei){
            delete data.imei
        }
        if(!data.store_sn){
            delete data.store_sn
        }
        return data;
    };

    function getProjectorByImeiAndStoreSn(data) {
        StoreList.GetProjectorByImeiAndStoreSn(data).then(function(response){
            if(response.code == 0){
                $scope.allDeviceData = response.data.data;

                //最大页数
                $scope.maxPage = response.data.last_page
                // 总条数
                $scope.bigTotalItems = response.data.total
                // 每页条数
                $scope.perPage = response.data.per_page;
            }
        })
    }
    // 关闭模态框
    $scope.close = function(){
        $uibModalInstance.close();
    }

    // 分页跳转
    $scope.setPage = function () {
        if($scope.reqPage > 0 && $scope.reqPage <= $scope.maxPage){
            $scope.bigCurrentPage = $scope.reqPage
        }else{
            return;
        }
    }
})
// 查看所有订单管理
app.controller('allOrderMgrModalInstanceCtrl',function($scope,$rootScope,$uibModalInstance,$localStorage,SweetAlert,apiUrl,Auth,StoreList,storeListController){
    var token = Auth.getLocalData("token");
    var store_sn = Auth.getLocalData("storeSn");
    $scope.orderFormData = {};
    // 关闭模态框
    $scope.close = function(){
        $uibModalInstance.close();
    }

    // 进入门店
    $scope.enterStore = function(storeName){
        var storeName = storeName;
        $scope.$storage = $localStorage.$default({
            storeName: storeName
        });
        $uibModalInstance.close();
    }

    // 拉取到的所有订单数据
    $scope.allOrderListData = [];
    // 分页显示的数据
    $scope.showOrderListData = [];
    // 分页监听、查询
    $scope.flag = false;

    $scope.payType = [
        {name:'微信',value:0},
        {name:'优惠码',value:8},
        {name:'团购码',value:1},
    ]

    datePicker();
    // 日期插件封装
    function datePicker(){
        $scope.today = function() {
            $scope.order_reserve_time = new Date();
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
    };

    // 获得门店列表
    $scope.storeListData = [];
    for(var i = 0;i < storeListController.storeListData.length;i++){
        if(storeListController.storeListData[i].status == 0 || storeListController.storeListData[i].status == 2){
            $scope.storeListData.push(storeListController.storeListData[i])
        }
    }

    // 第一次传参数，默认获取全部订单
    
    // 获得订单信息
    $scope.getOrderList = function(data) {
        data.type = 5;
        StoreList.GetOrderList(data).then(function(response){
            if(response.code == 0){

                // $scope.allOrderListData = response.data.items
                $scope.bigTotalItems = response.data.total;
                $scope.maxPage = response.data.last_page;
                $scope.showOrderListData = response.data.data;
                $scope.totalNum = $scope.bigTotalItems;
            }else{
                SweetAlert.swal("",response.msg,"error");
            }
        })
    }
    // function firstGetData(argument) {
    //     var time = $scope.order_reserve_time;
    //     var TodayTime = getTodayTime(time);
    //     getLocalTime = Number(TodayTime) + 28800;
    //     var data = {
    //         token : token,
    //         reserve_time : getLocalTime,
    //         page:1
    //     }
    //     $scope.getOrderList(data);
    // }

    // 点击查询订单信息
    $scope.checkOrder = function(){
        var getLocalTime = "";
        if($scope.order_reserve_time){
            var time = $scope.order_reserve_time;
            var TodayTime = getTodayTime(time);
            getLocalTime = Number(TodayTime) + 28800; 
        }else{
            SweetAlert.swal({
                title: "",
                text: "请选择时间!",
                timer: 1000,
                showConfirmButton: false,
                type : "warning"
            })
            return;
        }
        $scope.flag = true;
        $scope.bigCurrentPage = 1
        var data = {
            token : token,
            store_sn : $scope.order_store_sn,
            reserve_time : getLocalTime,
            status : $scope.order_status,
            pay_type : $scope.order_pay_type
        }
        // 删除为空的参数
        deleteAttr(data);
        $scope.getOrderList(data);
    }



    // 分页配置
    $scope.maxSize = 5;  //中间显示个数
    $scope.bigCurrentPage = 1;  //当前页数

    // 监听分页数值变化
    $scope.$watch(function() {
            return $scope.bigCurrentPage;
        },
        function(value) {
            if($scope.flag == true && $scope.bigCurrentPage == 1){
                $scope.flag = false;
                return;
            }
            $scope.flag = false;
            var getLocalTime = "";
            if($scope.order_reserve_time){
                var time = $scope.order_reserve_time;
                var TodayTime = getTodayTime(time);
                getLocalTime = Number(TodayTime) + 28800; 
            }else{
                SweetAlert.swal({
                    title: "",
                    text: "请选择时间!",
                    timer: 1000,
                    showConfirmButton: false,
                    type : "warning"
                })
                return;
            }
            var data = {
                token : token,
                store_sn : $scope.order_store_sn,
                reserve_time : getLocalTime,
                status : $scope.order_status,
                pay_type : $scope.order_pay_type,
                page:value
            }
             // 删除为空的参数
            deleteAttr(data);
            $scope.getOrderList(data);
        },
        true
    );

    // 分页跳转
    $scope.setPage = function () {
        if($scope.reqPage > 0 && $scope.reqPage <= $scope.maxPage){
            $scope.bigCurrentPage = $scope.reqPage
        }else{
            return;
        }
    }


    // 参数过滤
    function deleteAttr(data){
        if(!data.store_sn){
            delete data.store_sn
        }
        if(!data.reserve_time){
            delete data.reserve_time
        }
        if(!data.status){
            delete data.status
        }
        if(!data.pay_type){
            delete data.pay_type
        }
    }
})
// 家编辑  添加
app.controller('agentModalInstanceCtrl',function($scope,$rootScope,$uibModalInstance,$localStorage,SweetAlert,StoreList,storeListController,storeSn){
    $scope.account_name = '';
    $scope.isBind = false;
    $scope.agentBind = function () {
        if(!$scope.account_name){
            SweetAlert.swal("",'账户必填',"error");
            return;
        }
        var data = {
            store_sn:storeSn,
            account_name : $scope.account_name,
        }

        StoreList.agentBind(data).then(function(response){
            if(response.code == 0){
                $scope.close();
                SweetAlert.swal("",'绑定成功',"success");
            }else if(response.code == 1034){
                SweetAlert.swal({
                    title:"",
                    text: response.msg +"是否 继续绑定！",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "确定",
                    cancelButtonText: "返回",
                    closeOnConfirm: true,
                    html: true,
                },function(isfirm){
                    if(isfirm){
                        SweetAlert.close();//关闭确认弹框
                        //继续绑定
                        data.type = 2;
                        StoreList.agentBind(data).then(function(response){
                            if(response.code == 0){
                                $scope.close();
                                SweetAlert.swal("",'绑定成功',"success");
                            }else{
                                SweetAlert.swal("",response.msg,"error");
                            }
                        })
                    }
                })
            } else {
                SweetAlert.swal("",response.msg,"error");
            }
        })
    }
    $scope.agentUnbind = function () {
        var data = {
            store_sn:storeSn,
        }
        SweetAlert.swal({
            title:"",
            text: "确定解绑门店吗？",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "确定",
            cancelButtonText: "返回",
            closeOnConfirm: true,
            html: true,
        },function(isfirm){
            if(isfirm){
                SweetAlert.close();//关闭确认弹框
                StoreList.agentUnbind(data).then(function(response){
                    if(response.code == 0){
                        $scope.close();
                        SweetAlert.swal("",'解绑成功',"success");
                    } else {
                        SweetAlert.swal("",response.msg,"error");
                    }
                })
            }
        })
    }
    function isBind() {
        var data = {
            store_sn:storeSn,
        }
        StoreList.isBind(data).then(function(response){
            if(response.code == 0){
                //SweetAlert.swal("",'绑定成功',"success");
                $scope.isBind = response.data.isBind;
                $scope.accountName = response.data.accountName;
            } else {
                console.log('get bind status fail');
            }
        })
    }
    // 关闭模态框
    $scope.close = function(){
        $uibModalInstance.close();
    }
    isBind();
})
// 门店默认海报
app.controller('defaultPosterModalInstanceCtrl',function($scope,$rootScope,$uibModalInstance,$localStorage,Auth,$timeout,apiUrl,SweetAlert,StoreList,storeListController){
    var token = Auth.getLocalData("token");
    var storeListController = storeListController;
    // 默认隐藏图片上传工具
    $scope.showUpFile = false;

    $scope.upLoadIndex = 1;
    $scope.baseUrl = "";
    // 获取默认图片列表
    $scope.getPosterList = function(){
        $scope.showPosterList = [
            {
                sort : "1"
            },
            {
                sort : "2"
            },
            {
                sort : "3"
            },
            {
                sort : "4"
            },
            {
                sort : "5"
            },
            {
                sort : "6"
            },
            {
                sort : "7"
            },
            {
                sort : "8"
            }
        ];
        var data = {};
        StoreList.GetPosterList(data).then(function(response){
            if(response.code  == 0){
                console.log(response);
                $scope.baseUrl = response.data.base_url;
                $scope.posterList = response.data.data;
                for(var i = 0;i < $scope.posterList.length;i++){
                    for(var t = 0;t < $scope.showPosterList.length;t++){
                        if($scope.showPosterList[t].sort == $scope.posterList[i].sort){
                            $scope.showPosterList[t] = $scope.posterList[i]
                        }
                    }
                }
            }else{
                var msg = response.msg;
                SweetAlert.swal("",msg,"error");
            }
        })
    };
    $scope.getPosterList();
    // 关闭模态框
    $scope.close = function(){
        $uibModalInstance.close();
    }

    $scope.addPoster = function(x){
        $scope.upLoadIndex = x;
        $scope.showUpFile = true;
    };
        //图片上传事件
    $scope.upfileSubmit = function(){
        var file= document.getElementById('fileInput').files[0];
        if(!file){
            SweetAlert.swal({
                title: "",
                text: "请选择图片！",
                timer: 1000,
                showConfirmButton: false,
                type : "error"
            })
            return ;
        }

        // 打开上传中提示框
        tipBoxController(storeListController,"上传中，请等待！",true)

        // 将文件转化为FormData
        var data = new FormData();
        data.append('poster_image', file);
        data.append('name',file.name);   
        data.append('token',token);     
        // 发送文件上传请求
        $.ajax({
            url: apiUrl.url + "/store/poster/image/upload",
            type: "POST",
            processData: false,
            contentType: false,
            data: data,
            success: function(response) {
                if(response.code == 0){
                    // 提示上传成功，1秒之后自动关闭
                    // tipBoxController(storeListController,"上传成功！",true)
                    $timeout(function(){
                        tipBoxController(storeListController,"",false)
                    },10)

                    // 获得OSS图片返回的地址，将图片显示在页面上
                    var url = response.data.oss_name;
                    $scope.addPosterSub(url)

                    // var index = $scope.upLoadIndex;
                    // $scope.posterList[index].image =  response.data.oss_name;

                    // 调用remove事件，清空文件上传
                    document.getElementsByClassName("fileinput-remove-button")[0].click();
                    $scope.$apply();
                }else{
                    SweetAlert.swal("",response.msg,"error");
                }
            }
        });
    };

    // 添加海报
    $scope.addPosterSub = function(url){
        var data = {
            img_url : url,
            sort : Number($scope.upLoadIndex) + 1
        };
        StoreList.AddPoster(data).then(function(response){
            if(response.code  == 0){
                SweetAlert.swal({
                    title: "",
                    text: "图片添加成功！",
                    timer: 1000,
                    showConfirmButton: false,
                    type : "success"
                })
                $scope.getPosterList();
                $scope.showUpFile = false;
            }else{
                var msg = response.msg;
                SweetAlert.swal("",msg,"error");
            }
        })
    }

    // 删除海报
    $scope.delPoster = function(x){
        var index = x;
        var data = {
            id : $scope.showPosterList[index].id
        };
        StoreList.DelPoster(data).then(function(response){
            if(response.code  == 0){
                SweetAlert.swal({
                    title: "",
                    text: "图片删除成功！",
                    timer: 1000,
                    showConfirmButton: false,
                    type : "success"
                })
                $scope.getPosterList();
            }else{
                var msg = response.msg;
                SweetAlert.swal("",msg,"error");
            }
        })
    }
})
// 商家海报管理
app.controller('storePosterModalInstanceCtrl',function($scope,$rootScope,$uibModalInstance,$localStorage,Auth,$timeout,apiUrl,SweetAlert,StoreList,storeListController,storeData){
    var token = Auth.getLocalData("token");
    var storeListController = storeListController;
    var store_sn = storeData.store_sn;
    $scope.store_name = storeData.store_name;
    // 默认隐藏图片上传工具
    $scope.showUpFile = false;

    $scope.upLoadIndex = 1;
    $scope.baseUrl = "";
    // 获取默认图片列表
    $scope.getPosterList = function(){
        $scope.showPosterList = [
            {
                sort : "1"
            },
            {
                sort : "2"
            },
            {
                sort : "3"
            },
            {
                sort : "4"
            },
            {
                sort : "5"
            },
            {
                sort : "6"
            },
            {
                sort : "7"
            },
            {
                sort : "8"
            },
        ];
        var data = {
            store_sn : store_sn
        };
        StoreList.GetPosterList(data).then(function(response){
            if(response.code  == 0){
                $scope.baseUrl = response.data.base_url;
                $scope.posterList = response.data.data;
                for(var i = 0;i < $scope.posterList.length;i++){
                    for(var t = 0;t < $scope.showPosterList.length;t++){
                        if($scope.showPosterList[t].sort == $scope.posterList[i].sort){
                            $scope.showPosterList[t] = $scope.posterList[i]
                        }
                    }
                }
            }else{
                var msg = response.msg;
                SweetAlert.swal("",msg,"error");
            }
        })
    };
    $scope.getPosterList();


    // 关闭模态框
    $scope.close = function(){
        $uibModalInstance.close();
    }

    $scope.addPoster = function(x){
        $scope.upLoadIndex = x;
        $scope.showUpFile = true;
    };
    //图片上传事件
    $scope.upfileSubmit = function(){
        var file= document.getElementById('fileInput').files[0];
        if(!file){
            SweetAlert.swal({
                title: "",
                text: "请选择图片！",
                timer: 1000,
                showConfirmButton: false,
                type : "error"
            })
            return ;
        }

        // 打开上传中提示框
        tipBoxController(storeListController,"上传中，请等待！",true)

        // 将文件转化为FormData
        var data = new FormData();
        data.append('poster_image', file);
        data.append('name',file.name);   
        data.append('token',token);     
        // 发送文件上传请求
        $.ajax({
            url: apiUrl.url + "/store/poster/image/upload",
            type: "POST",
            processData: false,
            contentType: false,
            data: data,
            success: function(response) {
                if(response.code == 0){
                    // 提示上传成功，1秒之后自动关闭
                    // tipBoxController(storeListController,"上传成功！",true)
                    $timeout(function(){
                        tipBoxController(storeListController,"",false)
                    },10)

                    // 获得OSS图片返回的地址，将图片显示在页面上
                    var url = response.data.oss_name;
                    $scope.addPosterSub(url)

                    // var index = $scope.upLoadIndex;
                    // $scope.posterList[index].image =  response.data.oss_name;

                    // 调用remove事件，清空文件上传
                    document.getElementsByClassName("fileinput-remove-button")[0].click();
                    $scope.$apply();
                }else{
                    SweetAlert.swal("",response.msg,"error");
                }
            }
        });
    };

    // 添加海报
    $scope.addPosterSub = function(url){
        var data = {
            store_sn : store_sn,
            img_url : url,
            sort : Number($scope.upLoadIndex) + 1
        };
        StoreList.AddPoster(data).then(function(response){
            if(response.code  == 0){
                SweetAlert.swal({
                    title: "",
                    text: "图片添加成功！",
                    timer: 1000,
                    showConfirmButton: false,
                    type : "success"
                })
                $scope.getPosterList();
                $scope.showUpFile = false;
            }else{
                var msg = response.msg;
                SweetAlert.swal("",msg,"error");
            }
        })
    }

    // 删除海报
    $scope.delPoster = function(x){
        var index = x;
        var data = {
            id : $scope.showPosterList[index].id
        };
        StoreList.DelPoster(data).then(function(response){
            if(response.code  == 0){
                SweetAlert.swal({
                    title: "",
                    text: "图片删除成功！",
                    timer: 1000,
                    showConfirmButton: false,
                    type : "success"
                })
                $scope.getPosterList();
            }else{
                var msg = response.msg;
                SweetAlert.swal("",msg,"error");
            }
        })
    }
    

    // 使用默认海报
    $scope.useDefault = function(){
        var data = {
            store_sn : store_sn
        }
        StoreList.UseDefault(data).then(function(response){
            if(response.code  == 0){
                SweetAlert.swal({
                    title: "",
                    text: "下载成功！",
                    timer: 1000,
                    showConfirmButton: false,
                    type : "success"
                })
                $scope.getPosterList();
            }else{
                var msg = response.msg;
                SweetAlert.swal("",msg,"error");
            }
        })
    }
})
