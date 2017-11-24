app
.controller('staffListController',function ($scope,$timeout,$rootScope,SweetAlert,Auth,ngVerify,$localStorage,$uibModal,StaffList) {
    var token = Auth.getLocalData("token");
    var data = {
        token : token
    }
    
    // 获取员工与门店关系
    $scope.getRelationList = function(data){
        StaffList.GetRelationList(data).then(function(response){
            getStaffList(data);
            if(response.code  == 0){
                $scope.getRelationListData = response.data
            }else{
                SweetAlert.swal("",response.msg,"error")
            }
        })
    }
    // 获取员工列表
    $scope.staffListData = [];
    function getStaffList(data){
        StaffList.GetStaffList(data).then(function(response){
            console.log(response)
            if(response.code  == 0){
                $scope.staffListData = response.data;
                // 为员工列表数组创建门店关系数组
                for(var m = 0;m <  $scope.staffListData.length;m++){
                    $scope.staffListData[m].relationList = []
                }

                // 将门店关系数组中的门店信息字符串转化为对象
                for(var n = 0;n < $scope.getRelationListData.length;n++){
                    if($scope.getRelationListData[n].store_info){
                        $scope.getRelationListData[n].store_info = JSON.parse($scope.getRelationListData[n].store_info);
                    } else {
                        $scope.getRelationListData[n].store_info = '';
                    }
                }

                // 将门店关系的数组添加到员工信息中
                for(var j = 0;j < $scope.staffListData.length;j++){
                    for(var k = 0;k < $scope.getRelationListData.length;k++){
                        if($scope.staffListData[j].staff_sn == $scope.getRelationListData[k].staff_sn){
                            $scope.staffListData[j].relationList.push({
                                store_info : $scope.getRelationListData[k].store_info
                            })
                        }
                    }
                }
            }else{
                SweetAlert.swal("",response.msg,"error")
            }
        })
    }

    // 获得门店列表
    $scope.getStoreList = function(data){
        StaffList.GetStoreList(data).then(function(response){
            $scope.storeListData = response.data;
            console.log($scope.storeListData);
        })
    }

    // 获取员工信息及对应的门店关系,将其放在$scope.staffListData上
    $scope.getRelationList(data);
    // 获得门店列表
    $scope.getStoreList(data);



    // var dataTest = {
    //     token : "sadasd",
    //     store_sn : "S170321118531",
    //     staff_sn : "SF170324128184"
    // }
    // StaffList.BindStaff(dataTest).then(function(response){
    //     console.log(response)
    // })
    // 添加员工
    $scope.addStaff = function(){
        var modalInstance = $uibModal.open({
            animation: true,
            backdrop : "static",
            templateUrl: 'addStaff.html',
            controller: 'addStaffModalInstanceCtrl',
            resolve: {
                staffListController: function () {
                    return $scope;
                }
            }
        });
        modalInstance.result.then(function () {
            console.log("添加员工成功！")
        });
    }
    //管理员编辑模态框
    $scope.editStaff = function (staff,$index) {
        var modalInstance = $uibModal.open({
            animation: true,
            backdrop : "static",
            templateUrl: 'editStaff.html',
            controller: 'editStaffModalInstanceCtrl',
            resolve: {
                staffListController: function () {
                    return $scope;
                },
                staff: function () {
                    return staff;
                },
                index: function () {
                    return $index;
                }
            }
        });
        modalInstance.result.then(function () {
            console.log("管理员编辑")
        });
    };
    // 删除员工
    $scope.delStaff = function(staff,$index){
        SweetAlert.swal({
            title:"",
            text: "是否删除该员工！",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "确定",
            cancelButtonText: "返回",
            closeOnConfirm: true,
            html: true,
        },function(isfirm){
            if(isfirm){
                var data = {
                    staff_sn : staff.staff_sn,
                    token : token
                }
                StaffList.DelStaff(data).then(function(response){
                    console.log(response)
                    if(response.code == 0){
                        $scope.staffListData.splice($index,1);
                        SweetAlert.swal({
                            title: "",
                            text: "删除员工成功！",
                            timer: 1000,
                            showConfirmButton: false,
                            type : "success"
                        })
                    }else{
                        SweetAlert.swal("",response.msg,"error");
                    }
                })
            }
        })
    }
    //查看记录
    $scope.getStaffLog = function (staff,$index) {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'getStaffLog.html',
            controller: 'getStaffLogModalInstanceCtrl',
            resolve: {
                staffListController: function () {
                    return $scope;
                },
                staff: function () {
                    return staff;
                },
                index: function () {
                    return $index;
                }
            }
        });
        modalInstance.result.then(function () {
            console.log("查看记录")
        });
    }

});

// app.controller('commonModalInstanceCtrl', function($scope,$uibModalInstance,$localStorage,SweetAlert) {
//     var token = $localStorage.ftLoginData.token;
// });

// 编辑模态框控制器
app.controller('editStaffModalInstanceCtrl', function($scope,$uibModalInstance,SweetAlert,ngVerify,Auth,$localStorage,StaffList,staff,index,staffListController) {
    var token = Auth.getLocalData("token");
    $scope.editStaffData = {};
    $scope.editStaffData.token = token;
    $scope.editStaffData.staff_sn = staff.staff_sn;
    $scope.editStaffData.staff_name = staff.staff_name;
    $scope.editStaffData.mobile = staff.mobile;
    // $scope.editStaffData.nick_name = staff.nick_name;
    // $scope.editStaffData.info = staff.info;
    $scope.editStaffData.status = staff.status;

    
    // 门店列表信息
    $scope.storeListData = [];
    chooseStore()
    function chooseStore(){
        for(var q = 0;q < staffListController.storeListData.length;q++){
            $scope.storeListData.push(staffListController.storeListData[q]);
        }
    }

    // 获取员工与门店关系列表
    console.log(staffListController)
    $scope.staffInfo = staff;

    // 剔除掉该员工管理的门店
    for(var j = 0;j < staff.relationList.length;j++){
        for(var k = 0;k < $scope.storeListData.length;k++){
            if(staff.relationList[j].store_info.store_name == $scope.storeListData[k].store_name){
                $scope.storeListData.splice(k,1)
            }
        }
    }

    // 监听表单是否有改变,返回flagSubmit
    formCheckChange2($scope,$scope.editStaffData,$scope.staffInfo.relationList)

    //绑定门店
    $scope.bindStaff = function(){
        var data = {
            token : token,
            store_sn : $scope.selectedStore.store_sn,
            staff_sn : staff.staff_sn
        };
        // 发送绑定门店请求
        StaffList.BindStaff(data).then(function(response){
            console.log(response)
            if(response.code == 0){
                staffListController.getRelationList({token:data.token});
                $scope.staffInfo.relationList.push({
                    store_info : {
                        store_name : $scope.selectedStore.store_name,
                        store_sn : $scope.selectedStore.store_sn
                    }
                });
                SweetAlert.swal({
                    title: "",
                    text: "绑定门店成功！",
                    timer: 1000,
                    showConfirmButton: false,
                    type : "success"
                })
            }else{
                SweetAlert.swal("",response.msg,"error");
            }
        })
    }

    // 解绑门店
    $scope.unbindStaff = function(storeList,$index,store_sn){
        // var thisStore_name = storeList.store_info.store_name;
        var store_sn = store_sn;
        // // 寻找到解绑门店的store_sn
        // for(var n = 0;n < staffListController.storeListData.length;n++){
        //     if(staffListController.storeListData[n].store_name == thisStore_name){
        //         store_sn = staffListController.storeListData[n].store_sn
        //     }
        // };
        var data = {
            token : token,
            store_sn : store_sn,
            staff_sn : staff.staff_sn
        }
        // 发送解绑门店请求
        StaffList.UnBindStaff(data).then(function(response){
            if(response.code == 0){
                staffListController.getRelationList({token : token});
                $scope.staffInfo.relationList.splice($index,1)
                SweetAlert.swal({
                    title: "",
                    text: "解绑门店成功！",
                    timer: 1000,
                    showConfirmButton: false,
                    type : "success"
                })
            }else{
                SweetAlert.swal("",response.msg,"error");
            }
        })
    }

    // 发送编辑成功请求
    $scope.editStaffSubmit = function () {

        // 表单是否有改变
        if(!$scope.flagSubmit){
            SweetAlert.swal({
                title: "",
                text: "没有修改的信息!",
                timer: 1000,
                showConfirmButton: false,
                type : "warning"
            })
            return;
        }
        var data = $scope.editStaffData;
         ngVerify.check('staffEditorForm',function (errEls) {
            if(errEls.length > 0){
                SweetAlert.swal({
                    title: "",
                    text: "请完善正确的员工信息!",
                    timer: 1000,
                    showConfirmButton: false,
                    type : "warning"
                })
            }else{
                StaffList.EditStaff(data).then(function(response){
                    if(response.code == 0){
                        $uibModalInstance.close();
                        // 添加员工之后再次获得员工列表
                        SweetAlert.swal({
                            title: "",
                            text: "修改员工信息成功!",
                            timer: 1000,
                            showConfirmButton: false,
                            type : "success"
                        })
                        staffListController.staffListData[index].staff_name = $scope.editStaffData.staff_name;
                        staffListController.staffListData[index].mobile = $scope.editStaffData.mobile;
                        staffListController.staffListData[index].nick_name = '';
                        staffListController.staffListData[index].info = '';
                        staffListController.staffListData[index].status = $scope.editStaffData.status;

                    }else{
                        SweetAlert.swal("",response.msg,"error");
                    }
                    console.log(response)
                })
            }
        });
    }
    $scope.close = function(){
        $uibModalInstance.close();
    }
});

// 增加员工模态框控制器
app.controller('addStaffModalInstanceCtrl', function($scope,$uibModalInstance,SweetAlert,ngVerify,Auth,$localStorage,StaffList,staffListController) {
    var token = Auth.getLocalData("token");
    $scope.addStaffData = {}
    $scope.addStaffSubmit = function () {
        $scope.addStaffData.type = 1;
        $scope.addStaffData.token = token;
        $scope.addStaffData.nick_name = '';
        $scope.addStaffData.info = '';
        $scope.addStaffData.password = '123456';
        $scope.addStaffData.mobile = Number($scope.addStaffData.mobile);
        var data = $scope.addStaffData;
        ngVerify.check('staffAddForm',function (errEls) {
            if(errEls.length > 0){
                SweetAlert.swal({
                    title: "",
                    text: "请完善正确的员工信息！",
                    timer: 1000,
                    showConfirmButton: false,
                    type : "warning"
                })
            }else{
                StaffList.AddStaff(data).then(function(response){
                    if(response.code == 0){
                        $uibModalInstance.close();
                        data.create_time = Date.parse(new Date())/1000;
                        // if(staffListController.staffListData.length){
                        //     staffListController.staffListData.push(data);
                        // }
                        // else {
                        //     staffListController.staffListData[0]=data;
                        // }
                        // 添加员工之后再次获得员工列表
                        var dataToken = {
                            token : token
                        }
                        staffListController.getRelationList(dataToken);
                        SweetAlert.swal({
                            title: "",
                            text: "添加员工成功！",
                            timer: 1000,
                            showConfirmButton: false,
                            type : "success"
                        })
                    }else{
                        SweetAlert.swal("",response.msg,"error");
                    }
                })
            }
        });
    }
    $scope.close = function () {
        $uibModalInstance.close();
    }
});

// getclearlist模态框控制器
app.controller('getStaffLogModalInstanceCtrl', function($scope,$uibModalInstance,SweetAlert,ngVerify,$localStorage,Auth,StaffList,staff,index,staffListController) {
    var token = Auth.getLocalData("token");
    // $scope.staffLog = [
    //     {
    //         finish_time : "0",
    //         info : {
    //             staff_name : "软件园店",
    //             room_name : "102",
    //             duration_time : '17:00-19:10'
    //         }
    //     }
    // ];
    $scope.getStaffLog = function () {
        var TodayTime = getTodayTime($scope.checkDate);
        var data = {
            token:token,
            staff_sn:staff.staff_sn,
            page:1,
            reserve_time : Number(TodayTime) + 28800
        };
        StaffList.GetClearList(data).then(function(response){
            if(response.code == 0){
                console.log(response);
                $scope.staffLog = response.data.items;
            }else{
                $scope.close();
                SweetAlert.swal("",response.msg,"error");
            }
        })
    }
    $scope.close = function () {
        $uibModalInstance.close();
    }
    $scope.checkDateChange = function(checkDate){
        console.log("日期更改！");
        if(checkDate){
            $scope.getStaffLog();
        }else{
            console.log("未选择时间！")
        }
    }
    // 日期插件调用
    datePicker();
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
    $scope.getStaffLog();
});

