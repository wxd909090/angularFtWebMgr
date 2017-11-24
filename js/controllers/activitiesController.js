app
.controller('activitiesController',function ($scope,$timeout,$rootScope,SweetAlert,$uibModal,$localStorage,Auth,Activities,$localStorage,apiUrl) {
    var token = Auth.getLocalData("token");
    $scope.group_numArr = [];
    $scope.group_num = 1;
    // 生成优惠码
	$scope.creatNewCode = function () {
        var flag = $scope.expire_time;
		$scope.expire_time = Number(getTodayTime($scope.expire_time));
        var data = {
            expire_time : $scope.expire_time,
            code_num : $scope.code_num,
            group_num : $scope.creatGroup_num,
            token : token
        }
        Activities.CreateActivityCode(data).then(function(response){
            console.log(response)
            if(response.code == 0){
                SweetAlert.swal({
                    title: "",
                    text: "生成成功！",
                    timer: 1000,
                    showConfirmButton: false,
                    type : "success"
                })
                $scope.checkCode()
            }else{
                SweetAlert.swal("",response.msg,"error");
            }
        })
		$scope.expire_time = flag;
	}

    // 查询优惠码
    $scope.checkCode = function(){
        var flag = $scope.expire_time;
        $scope.bigCurrentPage = 1;
        $scope.GetActivityCode(1);
        $scope.expire_time = flag;
    }

    // 导出优惠码
    $scope.exportActivityCode = function(){
        var data = {
            group_num : $scope.group_num,
            token : token
        }
        Activities.ExportActivityCode(data).then(function(response){
            console.log(response)
            if(response.code == 0){
                var url = apiUrl.url + "/" + response.data.action + "?file_path=" + response.data.file_path
                window.open(url);
            }else{
                SweetAlert.swal("",response.msg,"error");
            }
        })
    }
	//获取优惠码
    $scope.GetActivityCode = function(page){
        var data = {
            group_num : $scope.group_num,
            page : page,
            token : token
        }
        Activities.GetActivityCode(data).then(function(response){
            console.log(response)
            if(response.code == 0){
                $scope.codeArr = response.data.data;
                $scope.bigTotalItems = response.data.total;
                $scope.maxPage = response.data.last_page;
                response.data.group_total = Number(response.data.group_total)
                $scope.group_numArr = [];
                for(var q = 0;q < response.data.group_total;q++){
                    $scope.group_numArr.push(q + 1)
                }
            }else{
                SweetAlert.swal("",response.msg,"error");
            }
        })
    }
	// 日期插件调用
	datePicker()
	// 页数选择最大数目
    $scope.maxSize = 5;
    // 总共多少条数
    $scope.bigTotalItems = 100;
    // 最大页数
    $scope.maxPage = 0;
    // 当前页数
    $scope.bigCurrentPage = 1;
    // 跳转页数
    $scope.setPage = function(){
        if($scope.reqPage > $scope.maxPage ){
            return
        }else{
            $scope.bigCurrentPage = $scope.reqPage
        }
    }
    // 监听分页数值变化
    $scope.$watch(function() {
            return $scope.bigCurrentPage;
        },
        function(newValue,oldValue) {
            $scope.GetActivityCode(newValue)
        },
        true
    );

        // 监听分页数值变化
    $scope.$watch(function() {
            return $scope.group_num;
        },
        function(newValue,oldValue) {
            $scope.expire_time = ""
        },
        true
    );

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
});