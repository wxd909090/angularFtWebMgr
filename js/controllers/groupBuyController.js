app
.controller('groupBuyController',function ($scope,$timeout,$rootScope,$localStorage,GroupBuy,SweetAlert,$uibModal) {
    $scope.isUsed = "";
    // 分页设置
    $scope.maxSize = 5;
    $scope.perPage = 10;
    $scope.bigCurrentPage = 1;
    $scope.maxPage = 2;
    $scope.bigTotalItems = 18;
    $scope.option1 = false;

    $scope.getGroupBuyCode = function(data){
        GroupBuy.GetGroupBuyCode(data).then(function (response) {
            if(response.code == 0){
                $scope.groupBuyList = response.data.data;
                for(var i = 0;i <　$scope.groupBuyList.length;i++){
                    $scope.groupBuyList[i].checked = false;
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
                is_used : $scope.isUsed,
                code : $scope.code,
                mobile : $scope.mobile,
                use_time : getTodayTime($scope.useTime),
                page_size : 10,
                page : newValue
            };
            delEmptyAttr(data);
            $scope.getGroupBuyCode(data)
        },
        true
    );

    // 选中所有团购码
    $scope.checkAllChoose = function(){
        for(var j = 0;j < $scope.groupBuyList.length;j++){
            $scope.groupBuyList[j].checked = $scope.option1;
        }
    }

    // 搜索
    $scope.searchBtn = function(){
        $scope.option1 = false;
        var data = {
            is_used : $scope.isUsed,
            code : $scope.code,
            mobile : $scope.mobile,
            use_time : getTodayTime($scope.useTime),
            page_size : 10,
            page : 1
        };
        delEmptyAttr(data);
        $scope.getGroupBuyCode(data)
    }

    //清空搜索条件
    $scope.emptySearch = function(){
        $scope.option1 = false;
        $scope.isUsed = 0;
        $scope.code = "";
        $scope.mobile = "";
        $scope.useTime = "";
        var data = {
            page : 1,
            page_size : 10
        }
        $scope.getGroupBuyCode(data)
    }

    // 添加
    $scope.addGroupBuy = function(){
        var modalInstance = $uibModal.open({
            animation: true,
            backdrop : "static",
            templateUrl: 'addGroupBuy.html',
            controller: 'addGroupBuyModalInstanceCtrl',
            resolve: {
                groupBuyController : function(){
                    return $scope
                }
            }
        });
        modalInstance.result.then(function () {

        });
    }

    // 删除
    $scope.delGroupBuy = function(){
        var delArr = [];
        for(var q = 0;q < $scope.groupBuyList.length;q++){
            if($scope.groupBuyList[q].checked){
                delArr.push($scope.groupBuyList[q].code)
            }
        }
        if(delArr.length == 0){
            SweetAlert.swal({
                title: "",
                text: "请选择要删除的团购码！",
                timer: 1000,
                showConfirmButton: false,
                type : "warning"
            })
            return;
        }
        var data = {
            code : delArr.join(",")
        }
        GroupBuy.DelCode(data).then(function (response) {
            if(response.code == 0){
                var data = {
                    page_size : 10,
                    page : $scope.bigCurrentPage
                };
                $scope.getGroupBuyCode(data)
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
});
// 添加团购码
app.controller('addGroupBuyModalInstanceCtrl',function($scope,$uibModalInstance,$location,SweetAlert,$uibModal,GroupBuy,$localStorage,groupBuyController){
    $scope.createGroupBuyCodeSub = function(){
        var data = {
            code_num : $scope.codeNum
        };
        GroupBuy.CreateGroupBuyCode(data).then(function (response) {
            if(response.code == 0){
                var data = {
                    page_size : 10,
                    page : groupBuyController.bigCurrentPage
                }
                groupBuyController.getGroupBuyCode(data);
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









