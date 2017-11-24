app.controller('statisticsController',
    function ($scope, $timeout, $rootScope, $localStorage,Auth, statistics, SweetAlert) {
        $scope.userStatisticsListData = [];
        $scope.userStatisticsListAllData = [];
        $scope.total_consume_number = 0;
        $scope.total_register_number = 0;
        $scope.total_activity_number = 0;

        // 页数选择最大数目
        $scope.maxSize = 5;
        // 总共多少条数
        $scope.bigTotalItems = 100;
        // 每一页显示的条数
        $scope.perPage = 10;
        // 当前页数
        $scope.bigCurrentPage = 1;

        var token = Auth.getLocalData("token");

        //获取用户列表
        $scope.getUserStatisticsByDay = function (begin_time) {
            var data = {
                token: token,
                begin_time: begin_time
            };
            statistics.getUserStatisticsByDay(data).then(function (response) {
                console.log(response);
                if (response.code == 0) {
                    calculateData(response.data)
                } else {
                    SweetAlert.swal("", response.msg, "error");
                }
            })
        };
        //$scope.getUserStatisticsByDay();

        //获取周
        $scope.getUserStatisticsByWeek = function (begin_time) {
            var data = {
                token: token,
                begin_time: begin_time
            };
            statistics.getUserStatisticsByWeek(data).then(function (response) {
                console.log(response);
                if (response.code == 0) {
                    calculateData(response.data)
                } else {
                    SweetAlert.swal("", response.msg, "error");
                }
            })
        };
        //$scope.getUserStatisticsByWeek();

        //获取月
        $scope.getUserStatisticsByMonth = function (begin_time) {
            var data = {
                token: token,
                begin_time: begin_time
            };
            statistics.getUserStatisticsByMonth(data).then(function (response) {
                console.log(response);
                if (response.code == 0) {
                    calculateData(response.data);
                    //计算总数
                    getTotal($scope.userStatisticsListData);
                } else {
                    SweetAlert.swal("", response.msg, "error");
                }
            })
        };
        $scope.getUserStatisticsByMonth();


        //计算数据
        function calculateData(statisticsData){
            var timeTemp = {};
            statisticsData.forEach(function(val1, index1, arr1){
                if(timeTemp[val1.time]){
                    return;
                }
                timeTemp[val1.time] = {
                    consume_number : 0,
                    register_number : 0,
                    activity_number : 0,
                    time : 0
                };
                statisticsData.forEach(function(val2, index2, arr2){
                    if(val1.time == val2.time){
                        if(val2.type == 1){
                            timeTemp[val1.time].consume_number = val2.number;
                        }else if(val2.type == 2){
                            timeTemp[val1.time].register_number = val2.number;
                        }else{
                            timeTemp[val1.time].activity_number = val2.number;
                        }

                        timeTemp[val1.time].time = val1.time;
                    }
                })
            });

            $scope.userStatisticsListData = [];
            for(var i in timeTemp){
                $scope.userStatisticsListData.push(timeTemp[i]);
            }
            if($scope.formDataType == "日统计"){
                $scope.userStatisticsListAllData = $scope.userStatisticsListData;
                $scope.bigTotalItems = $scope.userStatisticsListAllData.length;
                $scope.userStatisticsListData = $scope.userStatisticsListAllData.slice(($scope.bigCurrentPage-1)*$scope.perPage,($scope.bigCurrentPage*$scope.perPage))
            }
        }
        $scope.$watch(function() {
                return $scope.bigCurrentPage
            },
            function(newValue,oldValue) {
                $scope.userStatisticsListData = $scope.userStatisticsListAllData.slice((newValue-1)*$scope.perPage,(newValue*$scope.perPage))
            },
            true
        );
        //通过月来获取总数
        function getTotal(data){
            $scope.total_consume_number = 0;
            $scope.total_register_number = 0;
            $scope.total_activity_number = 0;
            for(var i in data) {
                $scope.total_consume_number += parseInt(data[i].consume_number);
                $scope.total_register_number += parseInt(data[i].register_number);
                $scope.total_activity_number += parseInt(data[i].activity_number);
            }
        }

        //切换统计类型
        $scope.formDataType = "月统计";
        $scope.changeSel = function(formDataType){
            // $scope.optionUserAnalysis.legend.data[0] = formDataType;
            // $scope.optionUserAnalysis.series[0].name = formDataType;
            if(formDataType == "月统计"){
                $scope.getUserStatisticsByMonth();
            }else if(formDataType == "周统计"){
                $scope.getUserStatisticsByWeek();
            }else{
                $scope.getUserStatisticsByDay();
            }
        };

    });
