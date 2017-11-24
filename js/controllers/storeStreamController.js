app
.controller('storeStreamController',function ($scope,$timeout,$rootScope,$localStorage,Auth,SweetAlert,$uibModal,StoreStream) {
    
    var token = Auth.getLocalData("token");
    //日期插件调用
    datePicker();
    //默认当天的时间戳
    var topAlldata = {};
    var dayStartTime = turnYMD($scope.start_time);
    topAlldata['start_time'] = turnYMD($scope.start_time);
    topAlldata['end_time'] = turnYMD($scope.end_time);
    topAlldata['is_today'] = 1;
    bigBusinessStatistics(topAlldata);
    //大后台营业统计
    function bigBusinessStatistics(data){
        StoreStream.bigBusinessStatistics(data).then(function(response){
            if(response.code  == 0){
                $scope.bigBusinessData = response.data;
            }else{
                var msg = response.msg;
                SweetAlert.swal("",msg,"error");
            }
        })
    }
    //监听start_time时间
    $scope.$watch(function() {
            return $scope.start_time;
        },
        function(newVal,oldVal) {
            if (newVal != oldVal) {
                var topAlldata = {};
                topAlldata['start_time'] = turnYMD($scope.start_time);
                topAlldata['end_time'] = turnYMD($scope.end_time);
                if(topAlldata['start_time'] == turnYMD($scope.startTimeSign) && topAlldata['end_time'] == turnYMD($scope.endTimeSign)){
                    topAlldata['is_today'] = 1;
                }else{
                    topAlldata['is_today'] = 0;
                }
                bigBusinessStatistics(topAlldata);
            }
        },
        true
    );
    //监听begin_time时间
    $scope.$watch(function() {
            return $scope.end_time;
        },
        function(newVal,oldVal) {
            if (newVal != oldVal) {
                var topAlldata = {};
                topAlldata['start_time'] = turnYMD($scope.start_time);
                topAlldata['end_time'] = turnYMD($scope.end_time);
                if(topAlldata['start_time'] == turnYMD($scope.startTimeSign) && topAlldata['end_time'] == turnYMD($scope.endTimeSign)){
                    topAlldata['is_today'] = 1;
                }else{
                    topAlldata['is_today'] = 0;
                }
                bigBusinessStatistics(topAlldata);
            }
        },
        true
    );
    //结算
    //决算分页
    //切换 统计  结算
    $scope.checkType = 1;
    $scope.storeSn = '';
    $scope.allStoreListData = [];
    $scope.clickTable = function(type){
        $scope.bigCurrentPage = 1;
        $scope.pageFlag = true;
        var m1= 'checkModel'+type;
        $scope.checkType = type;
        for(i=1;i<=2;++i){
            var m2 = 'checkModel'+i;
            if(m1 == m2){
                $scope[m2] = "btn btn-default active";
            } else {
                $scope[m2] = "btn btn-default";
            }
        }
    };
    //init
    $scope.clickTable($scope.checkType);
    $scope.getTodayData = function(){
        var topAlldata = {};
        topAlldata['start_time'] = turnYMD($scope.startTimeSign);
        topAlldata['end_time'] = turnYMD($scope.endTimeSign);
        topAlldata['is_today'] = 1;
        bigBusinessStatistics(topAlldata);
    }
    

    
    //日期插件
    
    function datePicker(){
        $scope.today = function() {
            $scope.start_time = new Date();
            $scope.end_time = new Date($scope.start_time.getTime() + 24*60*60*1000); 

            $scope.startTimeSign = $scope.start_time;
            $scope.endTimeSign = $scope.end_time; 

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
            maxDate: new Date(2030, 5, 22),
            minDate: new Date(2017,1,1),
            startingDay: 1
        };
        $scope.openDateBox = function() {
            $scope.popup1.opened = true;
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

        $scope.popup1 = {
            opened: false
        };
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
        };
    };
    //turnYMD
    function turnYMD(timeStamp){
        var day = timeStamp.getFullYear() + "-" + (timeStamp.getMonth() + 1) + "-" + timeStamp.getDate();
        var time = " 00:00:00";
        var newTime = day + time;
        return parseInt(new Date(newTime).getTime()/1000);
    }
})








