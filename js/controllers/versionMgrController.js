app
.controller('versionMgrController',function ($scope,$timeout,$rootScope,SweetAlert,$uibModal,$localStorage,apiUrl,Auth,VersionMgr,$localStorage) {
    // 分页设置
    $scope.maxSize = 5;
    $scope.perPage = 10;
    $scope.bigCurrentPage = 1;
    $scope.maxPage = 1;
    $scope.bigTotalItems = 0;
    $scope.option1 = false;

    datePicker();
    // 日期插件调用
    function datePicker(){
        $scope.today = function() {
            $scope.checkDate = new Date();
        };
        // $scope.today();

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
    // 获取APP列表
    $scope.getAppList = function(data){
        VersionMgr.GetAppList(data).then(function (response) {
            if(response.code == 0){
                $scope.option1 = false;
                $scope.appList = response.data.data;
                if(!$scope.appList){
                    return;
                }
                for(var i = 0;i <　$scope.appList.length;i++){
                    $scope.appList[i].checked = false;
                }
                //最大页数
                $scope.maxPage = response.data.last_page
                // 总条数
                $scope.bigTotalItems = response.data.total
                // 每页条数
                $scope.perPage = response.data.per_page;
            }else{
                SweetAlert.swal("",response.msg,"error");
            }
        })
    }

    // 监听分页数值变化
    $scope.$watch(function() {
            return $scope.bigCurrentPage;
        },
        function(newValue,oldValue) {
            $scope.option1 = false;
            var data = {
                enable : $scope.enable,
                app_name : $scope.app_name,
                app_id : $scope.app_id,
                create_time : getTodayTime($scope.create_time),
                page : newValue
            };
            delEmptyAttr(data);
            $scope.getAppList(data)
        },
        true
    );
    var data = {}
    $scope.getAppList();


    // 搜索
    $scope.searchBtn = function(){
        $scope.option1 = false;
        var data = {
            enable : $scope.enable,
            app_id : $scope.app_id,
            app_name : $scope.app_name,
            create_time : getTodayTime($scope.create_time)
        };
        delEmptyAttr(data);
        $scope.getAppList(data)
    }

    //清空搜索条件
    $scope.emptySearch = function(){
        $scope.option1 = false;
        $scope.enable = "";
        $scope.app_id = "";
        $scope.app_name = "";
        $scope.create_time = "";
        var data = {
            page : 1
        }
        $scope.getAppList(data)
    }

    // 点击程序名称编辑
    $scope.updateApp = function(app){
        var modalInstance = $uibModal.open({
            animation: true,
            backdrop : "static",
            templateUrl: 'updateApp.html',
            controller: 'updateAppModalInstanceCtrl',
            resolve: {
                versionMgrController : function(){
                    return $scope
                },
                appInfo : function(){
                    return app
                }
            }
        });
        modalInstance.result.then(function () {

        });
    }

    // 选中所有
    $scope.checkAllChoose = function(){
        for(var j = 0;j < $scope.appList.length;j++){
            $scope.appList[j].checked = $scope.option1;
        }
    }


    // 添加App
    $scope.createApp = function(){
        var modalInstance = $uibModal.open({
            animation: true,
            backdrop : "static",
            templateUrl: 'createApp.html',
            controller: 'createAppModalInstanceCtrl',
            resolve: {
                versionMgrController : function(){
                    return $scope
                }
            }
        });
        modalInstance.result.then(function () {

        });
    };

    // 删除App
    $scope.delApp = function(){
        var delArr = [];
        for(var q = 0;q < $scope.appList.length;q++){
            if($scope.appList[q].checked){
                delArr.push($scope.appList[q].id)
            }
        }
        if(delArr.length == 0){
            SweetAlert.swal({
                title: "",
                text: "请选择要删除的App！",
                timer: 1000,
                showConfirmButton: false,
                type : "warning"
            })
            return;
        }
        var data = {
            id : delArr.join(",")
        }
        VersionMgr.DelApp(data).then(function (response) {
            if(response.code == 0){
                var data = {
                    page : $scope.bigCurrentPage
                };
                $scope.getAppList(data)
                SweetAlert.swal({
                    title: "",
                    text: "删除成功！",
                    timer: 1000,
                    showConfirmButton: false,
                    type : "success"
                })
            }else{
                SweetAlert.swal("",response.msg,"error");
            }
        })
    }

    // 禁用
    $scope.disableApp = function(){
        var disableArr = [];
        for(var q = 0;q < $scope.appList.length;q++){
            if($scope.appList[q].checked){
                disableArr.push($scope.appList[q].id)
            }
        }
        if(disableArr.length == 0){
            SweetAlert.swal({
                title: "",
                text: "请选择要禁用的App！",
                timer: 1000,
                showConfirmButton: false,
                type : "warning"
            })
            return;
        }
        var data = {
            id : disableArr.join(",")
        }
        VersionMgr.DisableApp(data).then(function (response) {
            if(response.code == 0){
                var data = {
                    page : $scope.bigCurrentPage
                };
                $scope.getAppList(data)
                SweetAlert.swal({
                    title: "",
                    text: "禁用成功！",
                    timer: 1000,
                    showConfirmButton: false,
                    type : "success"
                })
            }else{
                SweetAlert.swal("",response.msg,"error");
            }
        })
    }

    // 启用
    $scope.enableApp = function(){
        var enableArr = [];
        for(var q = 0;q < $scope.appList.length;q++){
            if($scope.appList[q].checked){
                enableArr.push($scope.appList[q].id)
            }
        }
        if(enableArr.length == 0){
            SweetAlert.swal({
                title: "",
                text: "请选择要启用的App！",
                timer: 1000,
                showConfirmButton: false,
                type : "warning"
            })
            return;
        }
        var data = {
            id : enableArr.join(",")
        }
        VersionMgr.EnableApp(data).then(function (response) {
            if(response.code == 0){
                var data = {
                    page : $scope.bigCurrentPage
                };
                $scope.getAppList(data)
                SweetAlert.swal({
                    title: "",
                    text: "启用成功！",
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
// 添加App
app.controller('createAppModalInstanceCtrl',function($scope,$uibModalInstance,$location,Auth,SweetAlert,$uibModal,VersionMgr,$localStorage,versionMgrController){
    var token = Auth.getLocalData("token");
    $scope.enable = 1;
    $scope.createAppSub = function(){
        var data = {
            app_name : $scope.appName,
            enable : $scope.enable,
            app_id : $scope.appId
        };
        VersionMgr.CreateApp(data).then(function (response) {
            if(response.code == 0){
                var data = {
                    page : versionMgrController.bigCurrentPage
                }
                versionMgrController.getAppList(data);
                $scope.close();
                SweetAlert.swal({
                    title: "",
                    text: "创建成功！",
                    timer: 1000,
                    showConfirmButton: false,
                    type : "success"
                })
            }else{
                SweetAlert.swal("",response.msg,"error");
            }
        })
    };
    $scope.close = function(){
        $uibModalInstance.close();
    }
})
// 编辑App
app.controller('updateAppModalInstanceCtrl',function($scope,$uibModalInstance,$location,Auth,SweetAlert,$uibModal,VersionMgr,$localStorage,versionMgrController,appInfo){
    $scope.appInfo = angular.copy(appInfo);
    $scope.updateAppSub = function(){
        var data = $scope.appInfo;
        VersionMgr.UpdateApp(data).then(function (response) {
            if(response.code == 0){
                var data = {
                    page : versionMgrController.bigCurrentPage
                }
                versionMgrController.getAppList(data);
                $scope.close();
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
    };
    $scope.close = function(){
        $uibModalInstance.close();
    }
})