app
.controller('celebrityController',function ($scope,$timeout,$rootScope,SweetAlert,$uibModal,$localStorage,Auth,Celebrity,$localStorage,apiUrl) {
    var token = Auth.getLocalData("token");

    // 分页配置
    $scope.showPagination = true;
    $scope.bigCurrentPage = 1;
    $scope.maxSize = 5;
    $scope.bigTotalItems = 0;
    $scope.maxPage = 1;

    // 图片前缀地址
    $scope.imgBaseUrl = "";


    // 列表跳转页数
    $scope.setPage = function () {
        if($scope.reqPage > $scope.maxPage){
            return;
        }
        $scope.bigCurrentPage = $scope.reqPage;
    }

    // 获取名人列表
    $scope.getCelebrityList = function(page){
        var data = {
            page : page
        }
        Celebrity.GetCelebrityList(data).then(function(response){
            if(response.code == 0){
                $scope.celebrityListData = response.data.data;
                $scope.imgBaseUrl = response.data.path + "/";
                // 分页配置
                $scope.maxSize = 5;
                $scope.bigTotalItems = response.data.total;
                $scope.maxPage = response.data.last_page;
            }else{
                SweetAlert.swal("",response.msg,"error");
            }
        });
    }

    // 监听分页数值变化
    $scope.$watch(function() {
            return $scope.bigCurrentPage;
        },
        function(value) {
            if (value) {
                $scope.getCelebrityList(value);
            }
        },
        true
    );

    // 添加名人模态框open
    $scope.addCelebrity = function(){
        var modalInstance = $uibModal.open({
            animation: true,
            backdrop : "static",
            templateUrl: 'addCelebrity.html',
            controller: 'addCelebrityModalInstanceCtrl',
            resolve: {
                celebrityController: function () {
                    return $scope;
                },
                getCelebrityList : function () {
                    return $scope.getCelebrityList
                }
            }
        });
        modalInstance.result.then(function () {
            // console.log("关闭查看所有设备")
        });
    }

    // 编辑名人模态框open
    $scope.editCelebrity = function(celebrityList){
        var modalInstance = $uibModal.open({
            animation: true,
            backdrop : "static",
            templateUrl: 'editCelebrity.html',
            controller: 'editCelebrityModalInstanceCtrl',
            resolve: {
                celebrityController: function () {
                    return $scope;
                },
                celebrityData: function(){
                    return celebrityList;
                }
            }
        });
        modalInstance.result.then(function () {
            // console.log("关闭查看所有设备")
        });
    }

    // 删除名人
    $scope.delCelebrity = function(celebrityList,index){
        SweetAlert.swal({
            title:"",
            text: "是否删除该名人！",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "确定",
            cancelButtonText: "返回",
            closeOnConfirm: false,
            html: true,
        }, function(isConfirm){
            if (isConfirm) {
                // 确认删除
                var data = {
                    celebrity_sn : celebrityList.celebrity_sn
                }
                Celebrity.DelCelebrity(data).then(function(response){
                    if(response.code == 0){
                        SweetAlert.swal({
                            title: "",
                            text: "删除名人成功！",
                            timer: 1000,
                            showConfirmButton: false,
                            type : "success"
                        });
                        $scope.celebrityListData.splice(index,1);
                    }else{
                        SweetAlert.swal("",response.msg,"error");
                    }
                })
            }
        });
    }
});
// 添加名人列表模态框控制器
app.controller('addCelebrityModalInstanceCtrl', function($scope,$timeout,$uibModalInstance,SweetAlert,Celebrity,Auth,celebrityController,getCelebrityList,apiUrl) {
    var token = Auth.getLocalData("token");
    $scope.addCelebrity = {
        birthday : ""
    };

    $scope.close = function(){
        $uibModalInstance.close();
    }
    datePicker()
    // 日期插件封装
    function datePicker(){
        // $scope.checkDate = new Date($scope.editFilmData.screen_time * 1000);
        $scope.today = function() {
            $scope.addCelebrity.birthday = new Date();
        };
        $scope.today();

        $scope.clear = function() {
            $scope.dt1 = null;
        };

        // 设置周六周日不可选，不使用
        function disabled(data) {
            var date = data.date,
                mode = data.mode;
            return false;
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
            maxDate: new Date(2099, 11, 31),
            minDate: new Date(1899,12,1),
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


    //图片上传事件
    $scope.upfileSubmit = function(){
        var  file= document.getElementById('fileInput').files[0];
        if(!file){alert('请选择图片');return ;}

        // 打开上传中提示框
        celebrityController = $scope;
        tipBoxController(celebrityController,"上传中，请等待！",true)

        // 将文件转化为FormData
        var data = new FormData();
        data.append('image', file);
        data.append('name',file.name);  
        data.append('token',token);     

        // 发送文件上传请求
        $.ajax({
            url: apiUrl.url +  "/film/uploadImage",
            type: "POST",
            processData: false,
            contentType: false,
            data: data,
            success: function(response) {
                if(response.code == 0){
                    // 提示上传成功，1秒之后自动关闭
                    tipBoxController(celebrityController,"上传成功！",true)
                    $timeout(function(){
                        tipBoxController(celebrityController,"",false)
                    },1000)

                    // 获得OSS图片返回的地址，将图片显示在页面上
                    $scope.addCelebrity.image = response.data.oss_name;

                    // 调用remove事件，清空文件上传
                    document.getElementsByClassName("fileinput-remove-button")[0].click();
                    $scope.$apply();
                }else{
                    SweetAlert.swal("",response.msg,"error");
                }
            }
        });
    };

    // 提交添加名人
    $scope.addCelebritySub = function(){
        console.log($scope.addCelebrity);
        var data = $scope.addCelebrity;
        if(data.gender != 0 && data.gender != 1){
            SweetAlert.swal({
                title: "",
                text: "请选择性别！",
                timer: 1000,
                showConfirmButton: false,
                type : "warning"
            });
            return;
        }

        // 是否有上传图片
        // if(!data.image){
        //     SweetAlert.swal({
        //         title: "",
        //         text: "请上传图片！",
        //         timer: 1000,
        //         showConfirmButton: false,
        //         type : "warning"
        //     });
        //     return;
        // }
        if(data.image){
            var index = data.image.indexOf("ftang");
            data.image = data.image.substring(index);
        };

        if(data.birthday){
            data.birthday = getTodayTime(data.birthday);
        }

        Celebrity.AddCelebrity(data).then(function(response){
            if(response.code == 0){
                $scope.close();
                SweetAlert.swal({
                    title: "",
                    text: "添加名人成功！",
                    timer: 1000,
                    showConfirmButton: false,
                    type : "success"
                });
                $scope.close();
                celebrityController.bigCurrentPage = 1;
                getCelebrityList(1);
            }else{
                SweetAlert.swal("",response.msg,"error");
            }
        })
    }
});
// 编辑名人列表模态框控制器
app.controller('editCelebrityModalInstanceCtrl', function($scope,$timeout,$uibModalInstance,SweetAlert,Celebrity,Auth,celebrityController,apiUrl,celebrityData) {
    var token = Auth.getLocalData("token");
    $scope.newImage = "";
    $scope.editCelebrity = angular.copy(celebrityData);
    $scope.imgBaseUrl = celebrityController.imgBaseUrl;
    $scope.close = function(){
        $uibModalInstance.close();
    }

    //图片上传事件
    $scope.upfileSubmit = function(){
        var  file= document.getElementById('fileInput').files[0];
        if(!file){alert('请选择图片');return ;}

        // 打开上传中提示框
        tipBoxController(celebrityController,"上传中，请等待！",true)

        // 将文件转化为FormData
        var data = new FormData();
        data.append('image', file);
        data.append('name',file.name);  
        data.append('token',token);     

        // 发送文件上传请求
        $.ajax({
            url: apiUrl.url +  "/film/uploadImage",
            type: "POST",
            processData: false,
            contentType: false,
            data: data,
            success: function(response) {
                if(response.code == 0){
                    // 提示上传成功，1秒之后自动关闭
                    tipBoxController(celebrityController,"上传成功！",true)
                    $timeout(function(){
                        tipBoxController(celebrityController,"",false)
                    },1000)

                    // 获得OSS图片返回的地址，将图片显示在页面上
                    $scope.editCelebrity.image = response.data.oss_name;
                    $scope.newImage = response.data.oss_name;
                    var index = $scope.editCelebrity.image.indexOf("ftang");
                    $scope.editCelebrity.image = $scope.editCelebrity.image.substring(index);

                    // 调用remove事件，清空文件上传
                    document.getElementsByClassName("fileinput-remove-button")[0].click();
                    $scope.$apply();
                }else{
                    SweetAlert.swal("",response.msg,"error");
                }
            }
        });
    };

    // 提交修改名人
    $scope.editCelebritySub = function(){
        var data = $scope.editCelebrity;
        delEmptyAttr(data);
        delete data.birthday;
        if(!data.image){
            SweetAlert.swal({
                title: "",
                text: "请上传图片！",
                timer: 1000,
                showConfirmButton: false,
                type : "warning"
            });
            return;
        }
        Celebrity.EditCelebrity(data).then(function(response){
            if(response.code == 0){
                SweetAlert.swal({
                    title: "",
                    text: "编辑名人成功！",
                    timer: 1000,
                    showConfirmButton: false,
                    type : "success"
                });
                $scope.newImage="";
                $scope.close();
                celebrityController.getCelebrityList(celebrityController.bigCurrentPage)
            }else{
                SweetAlert.swal("",response.msg,"error");
            }
        })
    }
});