app
.controller('filmXfController',function ($scope,$timeout,$rootScope,$localStorage,FilmXf,SweetAlert,$uibModal) {
    $scope.filmXfList = [];
    // 分页设置
    $scope.maxSize = 5;
    $scope.perPage = 10;
    $scope.bigCurrentPage = 1;

    $scope.getVideoList = function(page){
        var data = {
            page : page
        }
        FilmXf.GetVideoList(data).then(function (response) {
            if(response.code == 0){
                $scope.filmXfList = response.data.data;

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
    $scope.getVideoList(1);



    // 监听分页数值变化
    $scope.$watch(function() {
            return $scope.bigCurrentPage;
        },
        function(value) {
            if (value) {
                $scope.bigCurrentPage = value;
                value = Number(value);
                $scope.getVideoList(value);
            }
        },
        true
    );

    // 跳转
    $scope.setPage = function () {
        if($scope.reqPage <= 0 || $scope.reqPage > $scope.maxPage){
            return;
        }
        // 设置当前页数
        $scope.bigCurrentPage = $scope.reqPage;
    }


    // 打开新增视频模态框
    $scope.addVideo = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            backdrop : "static",
            templateUrl: 'addVideo.html',
            controller: 'addVideoModalInstanceCtrl',
            resolve: {
                filmXfController : function(){
                    return $scope
                }
            }
        });
        modalInstance.result.then(function () {
        });
    }
    // 编辑视频模态框
    $scope.editVideo = function(filmXf) {
        var modalInstance = $uibModal.open({
            animation: true,
            backdrop : "static",
            templateUrl: 'editVideo.html',
            controller: 'editVideoModalInstanceCtrl',
            resolve: {
                filmXfController : function(){
                    return $scope
                },
                filmXfData : function () {
                    return filmXf
                }
            }
        });
        modalInstance.result.then(function () {
        });
    }
});

app.controller('addVideoModalInstanceCtrl',function($scope,$uibModalInstance,$location,SweetAlert,$uibModal,Auth,$localStorage,FilmXf,filmXfController){
    var token = Auth.getLocalData("token");
    
    $scope.addVideoData = {};

    // 关闭模态框
    $scope.close = function(){
        $uibModalInstance.close();
    }

    $scope.addVideoSub = function(){
        var beginTime = getTodayTime($scope.begin_time);
        var endTime = getTodayTime($scope.end_time);
        if(!$scope.issue || !$scope.url){
            SweetAlert.swal({
                title: "",
                text: "请输入完整信息！",
                timer: 1000,
                showConfirmButton: false,
                type : "warning"
            })
            return;
        }
        var data = {
            issue : $scope.issue,
            begin_time : beginTime,
            end_time : endTime,
            url : $scope.url,
        };
        FilmXf.AddVideo(data).then(function (response) {
            if(response.code == 0){
                SweetAlert.swal({
                    title: "",
                    text: "添加成功！",
                    timer: 1000,
                    showConfirmButton: false,
                    type : "success"
                })
                filmXfController.bigCurrentPage = 1;
                if(filmXfController.bigCurrentPage == 1){
                    filmXfController.getVideoList(1);
                }else{
                    filmXfController.bigCurrentPage = 1;
                }
                $uibModalInstance.close();
            }else{
                SweetAlert.swal("",response.msg,"error");
            }
        })
    }


    datePicker();
    datePicker2();
    // 日期插件封装
    function datePicker(){
        $scope.today = function() {
            $scope.begin_time = new Date();
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
            $scope.dateOptions2.minDate = $scope.inlineOptions.minDate;
        };
        $scope.inlineOptions = {
            customClass: getDayClass,
            minDate: new Date(),
            showWeeks: true
        };

        $scope.dateOptions2 = {
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
     // 日期插件封装
    function datePicker2(){
        $scope.today = function() {
            $scope.end_time = new Date();
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
        $scope.openDateBox2 = function() {
            $scope.popup2.opened = true;
        };
        $scope.setDate = function(year, month, day) {
            $scope.dt1 = new Date(year, month, day);
        };

        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
        $scope.altInputFormats = ['M!/d!/yyyy'];

        $scope.popup2 = {
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

app.controller('editVideoModalInstanceCtrl',function($scope,$uibModalInstance,$location,SweetAlert,$uibModal,Auth,$localStorage,FilmXf,filmXfData,filmXfController){
    var token = Auth.getLocalData("token");
    $scope.editVideoData = angular.copy(filmXfData);
    $scope.editVideoData.issue = Number($scope.editVideoData.issue);
    $scope.editVideoData.begin_time = getNewData($scope.editVideoData.begin_time);
    $scope.editVideoData.end_time = getNewData($scope.editVideoData.end_time);


    function getNewData(time) {
       return new Date(parseInt(time) * 1000)
    }
    // 关闭模态框
    $scope.close = function(){
        $uibModalInstance.close();
    }

    $scope.editVideoSub = function(){
        var beginTime = getTodayTime($scope.editVideoData.begin_time);
        var endTime = getTodayTime($scope.editVideoData.end_time);
        if(!$scope.editVideoData.issue || !$scope.editVideoData.url){
            SweetAlert.swal({
                title: "",
                text: "请输入完整信息！",
                timer: 1000,
                showConfirmButton: false,
                type : "warning"
            })
            return;
        }
        var data = {
            id :  $scope.editVideoData.id,
            issue : $scope.editVideoData.issue,
            begin_time : beginTime,
            end_time : endTime,
            url : $scope.editVideoData.url,
        }
        FilmXf.EditVideo(data).then(function (response) {
            if(response.code == 0){
                SweetAlert.swal({
                    title: "",
                    text: "修改成功！",
                    timer: 1000,
                    showConfirmButton: false,
                    type : "success"
                })
                filmXfController.getVideoList(filmXfController.bigCurrentPage);
                $uibModalInstance.close();
            }else{
                SweetAlert.swal("",response.msg,"error");
            }
        })
    }


    datePicker();
    datePicker2();
    // 日期插件封装
    function datePicker(){
        $scope.today = function() {
            $scope.begin_time = new Date();
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
            $scope.dateOptions2.minDate = $scope.inlineOptions.minDate;
        };
        $scope.inlineOptions = {
            customClass: getDayClass,
            minDate: new Date(),
            showWeeks: true
        };

        $scope.dateOptions2 = {
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
     // 日期插件封装
    function datePicker2(){
        $scope.today = function() {
            $scope.end_time = new Date();
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
        $scope.openDateBox2 = function() {
            $scope.popup2.opened = true;
        };
        $scope.setDate = function(year, month, day) {
            $scope.dt1 = new Date(year, month, day);
        };

        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
        $scope.altInputFormats = ['M!/d!/yyyy'];

        $scope.popup2 = {
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







