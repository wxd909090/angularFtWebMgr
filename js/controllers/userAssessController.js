app
.controller('userAssessController',function ($scope,$timeout,$rootScope,$uibModal,Auth,$localStorage,SweetAlert,UserReviews,apiUrl) {
    var token = Auth.getLocalData("token");
    // 日期插件调用
    datePicker();
    datePicker2();

    // 请求门店列表
    GetStoreList();
    function GetStoreList(){
        var data = {
            token : token
        };
        UserReviews.GetStoreList(data).then(function(response){
            if(response.code  == 0){
                $scope.storeListData = response.data;
            }else{
                var msg = response.msg;
                SweetAlert.swal("",msg,"error");
            }
        })
    }

    function getStoreAssessSn(storeListData) {
        if($scope.storeAssessSn){
            return $scope.storeAssessSn;
        } else {
            if(storeListData){
                return storeListData[0]['store_sn'];
            } else {
                return '';
            }
        }
    }
    // 请求门店评分
    function GetStoreReviewList(){
        $scope.storeAssessSn = getStoreAssessSn($scope.storeListData)
        if(!$scope.storeAssessSn){
            SweetAlert.swal("",'暂无门店选择',"error");
            return;
        }
        var data = {
            // page : $scope.bigCurrentPage2,
            store_sn: $scope.storeAssessSn,
            token : token
        };
        UserReviews.GetStoreReviewList(data).then(function(response){
            if(response.code  == 0){
                // 评价列表  todo
                $scope.storeAssessList = response.data.roomData;
                $scope.storeAssessData =  response.data.storeData;
                // 获得总条数
                //$scope.bigTotalItems2 = response.data.total;
                //最大页数
                //$scope.maxPage2 = response.data.last_page;
                //$scope.perPage = response.data.per_page;
            }else{
                var msg = response.msg;
                SweetAlert.swal("",msg,"error");
            }
        })
    }
    // 用户评论默认选中
    $scope.checkModel = "btn btn-default active";
    $scope.checkMode2 = "btn btn-default";

    // 点击用户评论
    $scope.clickUserAssess = function(){
        $scope.checkModel = "btn btn-default active";
        $scope.checkMode2 = "btn btn-default";
    };

    // 点击门店评分
    $scope.clickStoreAssess = function(){
        $scope.checkModel = "btn btn-default";
        $scope.checkMode2 = "btn btn-default active";
        GetStoreReviewList();
    }

    //查询
    $scope.searchBtn = function(){
        $scope.bigCurrentPage = 1;
        $scope.getUserAssess();
    }

    //导出  user
    $scope.getDocBtn = function(){
        var beginTime = getTimeData($scope.checkDate);
        var endTime = getTimeData($scope.checkDate2);
        var data = {
            token : token,
            store_sn : $scope.store_sn,
            begin_time : beginTime,
            end_time : endTime,
            mobile : $scope.mobile,
            page : $scope.bigCurrentPage,
            is_show : $scope.isShow ? $scope.isShow : 0,
            type:1,//用户评论导出
        };
        deleteAttr(data)

        UserReviews.DownloadFile(data).then(function(response){

            if(response.code == 0){
                if(response.data.length == 0){
                    SweetAlert.swal({
                        title: "",
                        text: "下载列表为空！",
                        timer: 1000,
                        showConfirmButton: false,
                        type : "warning"
                    })
                }else{
                    var url = apiUrl.url + "/" + response.data.action + "?file_path=" + response.data.file_path + "&token=" + token;
                    window.open(url);
                }
            }else{
                SweetAlert.swal("",response.msg,"error");
            }
        })
    }

    $scope.getStoreAssessBySn = function(){
       GetStoreReviewList();
    }
    // 导出  store
    $scope.getStoreAssessDocBtn = function () {
        $scope.storeAssessSn = getStoreAssessSn($scope.storeListData)
        if(!$scope.storeAssessSn){
            SweetAlert.swal("",'暂无门店选择',"error");
            return;
        }
        var data = {
            type:2,//商家店面 包间 评论导出
            store_sn: $scope.storeAssessSn,
            token : token
        };
        UserReviews.DownloadFile(data).then(function(response){

            if(response.code == 0){
                if(response.data.length == 0){
                    SweetAlert.swal({
                        title: "",
                        text: "下载列表为空！",
                        timer: 1000,
                        showConfirmButton: false,
                        type : "warning"
                    })
                }else{
                    var url = apiUrl.url + "/" + response.data.action + "?file_path=" + response.data.file_path + "&token=" + token;
                    window.open(url);
                }
            }else{
                SweetAlert.swal("",response.msg,"error");
            }
        })
    }

    // 评论是否显示
    $scope.changeuserAssess = function(userAssess){
        console.log(userAssess);
        var data = {
            order_sn : userAssess.order_sn,
            is_show : Math.abs(userAssess.is_show - 1),
            token : token
        };
        UserReviews.ChangeReviews(data).then(function(response){
            console.log(response);
            if(response.code  == 0){
                userAssess.is_show = data.is_show;
                // SweetAlert.swal("",'修改成功',"success");
            }else{
                var msg = response.msg;
                SweetAlert.swal("",msg,"error");
            }
        })
    }


    // 获得时间
    function getTimeData(x){
        if(x){
            x = x / 1000;
            return x;
        }else{
            return "";
        }};


    // 选中的门店
    $scope.store_sn = "";

    // 日期框model
    $scope.dateDay = "";

    // 用户搜索框
    $scope.mobile = "";

    //评价列表
    $scope.userAssessList = [];

    //门店评分列表
    $scope.storeAssessList = [];
    // 分页配置
    
    // 当前页数
    $scope.bigCurrentPage = 1;
    $scope.bigCurrentPage2 = 1;
    // 中间显示按钮数
    $scope.maxSize = 5;
    $scope.perPage = 10;
    //总共的数目
    $scope.bigTotalItems = 0;
    $scope.bigTotalItems2 = 0;
    //最大页数
    $scope.maxPage = 0;
    $scope.maxPage2 = 0;
    // 跳转
    $scope.setPage = function(){
        if($scope.reqPage <= 0 || $scope.reqPage > $scope.maxPage){
            return;
        }
        // 设置当前页数
        $scope.bigCurrentPage = $scope.reqPage;
    }
    $scope.setPage2 = function(){
        if($scope.reqPage2 <= 0 || $scope.reqPage2 > $scope.maxPage2){
            return;
        }
        // 设置当前页数
        $scope.bigCurrentPage2 = $scope.reqPage2;
    }
    // 监听分页数值变化
    $scope.$watch(function() {
            return $scope.bigCurrentPage;
        },
        function(newValue,oldValue) {
            // 拉取数据
            $scope.getUserAssess(newValue)
        },
        true
    );
    // $scope.$watch(function() {
    //         return $scope.bigCurrentPage2;
    //     },
    //     function(newValue,oldValue) {
    //         // 拉取数据
    //         GetStoreReviewList()
    //     },
    //     true
    // );
    //默认拉取所有
    $scope.isShow = 0;
    $scope.showtData =[
        {
            "name" : "显示",
            "value" : 2,
        },
        {
            "name" : "不显示",
            "value" : 1,
        }
    ];
    $scope.changeisShow = function () {
        $scope.getUserAssess();
    }

    // 获得用户评价数据
    $scope.getUserAssess = function(){
        var beginTime = getTimeData($scope.checkDate);
        var endTime = getTimeData($scope.checkDate2);
        if(beginTime > endTime){
            SweetAlert.swal({
                title: "",
                text: "起始时间不能大于结束时间！",
                timer: 1000,
                showConfirmButton: false,
                type : "warning"
            })
            return ;
        }
        var data = {
            token : token,
            store_sn : $scope.store_sn,
            begin_time : beginTime,
            end_time : endTime,
            mobile : $scope.mobile,
            page : $scope.bigCurrentPage,
            is_show : $scope.isShow ? $scope.isShow : 0
        }
        deleteAttr(data)

        UserReviews.GetUserReviewsList(data).then(function(response){
            console.log(response)
            if(response.code == 0){
                // 评价列表
                $scope.userAssessList = response.data.data;
                // 获得总条数
                $scope.bigTotalItems = response.data.total;
                //最大页数
                $scope.maxPage = response.data.last_page;
                $scope.perPage = response.data.per_page;
            }else{
                SweetAlert.swal("",response.msg,"error");
            }
        })
    }
    // 参数过滤
    function deleteAttr(data){
        if(!data.store_sn){
            delete data.store_sn
        }
        if(!data.begin_time){
            delete data.begin_time
        }
        if(!data.end_time){
            delete data.end_time
        }
        if(!data.mobile){
            delete data.mobile
        }
    }

    // 日期插件封装
    function datePicker(){
        $scope.today = function() {
            $scope.checkDate = "";
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
    function datePicker2(){
        $scope.today = function() {
            $scope.checkDate2 = "";
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
        $scope.openDateBox2 = function() {
            $scope.popup2.opened = true;
        };
        $scope.setDate = function(year, month, day) {
            $scope.dt2 = new Date(year, month, day);
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

    $scope.clickReply = function(orderSn,type){
        var modalInstance = $uibModal.open({
            animation: true,
            backdrop : "static",
            templateUrl: 'reply.html',
            controller: 'replyModalInstanceCtrl',
            resolve: {
                orderSn:function () {
                    return orderSn;
                },
                type:function () {
                    return type;
                },
            },
        });
        modalInstance.result.then(function () {
            $scope.getUserAssess();
        });
    }
})
app.controller('replyModalInstanceCtrl',function ($scope,$localStorage,$uibModalInstance,apiUrl,ngVerify,$timeout,Auth,SweetAlert,UserReviews,orderSn,type) {
    $scope.replyInfo = '';
    $scope.clickReply = function() {
        var data = {
            order_sn:orderSn,
        };
        if(type == 1){
            data.reply1 = $scope.replyInfo;
        } else if(type == 2){
            data.reply2 = $scope.replyInfo;
        }
        ngVerify.check('replyForm',function (errEls) {
            if(errEls.length > 0){
                if(!$scope.replyInfo){
                    SweetAlert.swal({
                        title: "",
                        text: "回复信息不能为空",
                        timer: 1000,
                        showConfirmButton: false,
                        type : "error"
                    })
                } else {
                    SweetAlert.swal({
                        title: "",
                        text: "回复信息不能超过140字",
                        timer: 1000,
                        showConfirmButton: false,
                        type : "error"
                    })
                }
            }else{
                UserReviews.replyReviews(data).then( function (response){
                    if(response.code == 0){
                        SweetAlert.swal("",'回复评价成功',"success");
                        $scope.close();
                    }else{
                        SweetAlert.swal("",response.msg,"error");
                    }
                })
            }
        })
    }
    // 关闭
    $scope.close = function(){
        $uibModalInstance.close();
    }
})

