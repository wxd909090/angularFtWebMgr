app
.controller('vouchersController',function ($scope,$timeout,$rootScope,SweetAlert,$uibModal,$localStorage,Vouchers) {
    // 分页设置
    $scope.maxSize = 5;
    $scope.perPage = 20;
    $scope.bigCurrentPage = 1;
    $scope.maxPage = 1;
    $scope.bigTotalItems = 0;
	// 切换导航
	$scope.checkModel1 = "btn btn-default active";
	$scope.checkModel2 = "btn btn-default";
	$scope.clickTable = function(type){
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

    // 统计
    $scope.activityDayDetailArr = []

    // 获取门店列表
    $scope.getStoreList = function(data){
        var data = {}
        Vouchers.GetStoreList(data).then(function(response){
            $scope.storeListData = response.data;
            console.log($scope.storeListData);
        })
    }

    // 拉取统计
    $scope.getActivityDayDetail = function(){
        if($scope.activityList.length == 0){
            return;
        }
        var data = {
            activity_sn : $scope.activityList[0].activity_sn
        }
        Vouchers.GetActivityDayDetail(data).then(function(response){
            if(response.code == 0){
                $scope.activity_sn = $scope.activityList[0].activity_sn;
                $scope.activityDayDetailArr = response.data;
            }else{
                SweetAlert.swal("",response.msg,"error");
            }

        })
    };

    $scope.changeActivety = function(){
        var data = {
            activity_sn : $scope.activity_sn
        }
        Vouchers.GetActivityDayDetail(data).then(function(response){
            if(response.code == 0){
                $scope.activityDayDetailArr = response.data;
            }else{
                SweetAlert.swal("",response.msg,"error");
            }

        })
    };

    // 获取抵用券列表
    $scope.getActivityList = function(data){
        var data = {}
        Vouchers.GetActivityList(data).then(function (response) {
            if(response.code == 0){
                $scope.activityList = response.data;
                console.log($scope.activityList)
                //最大页数
                $scope.maxPage = response.data.last_page
                // 总条数
                $scope.bigTotalItems = response.data.total
                // 每页条数
                $scope.perPage = response.data.per_page;
                $scope.getActivityDayDetail();
            }else{
                SweetAlert.swal("",response.msg,"error");
            }
        })
    }



    $scope.getActivityList();
    $scope.getStoreList();
    // 发布抵用券
    $scope.createActivity = function(){
    	var modalInstance = $uibModal.open({
            animation: true,
            backdrop : "static",
            templateUrl: 'createActivity.html',
            controller: 'createActivityModalInstanceCtrl',
            resolve: {
                vouchersController:function () {
                    return $scope;
                },
            }
        });
        modalInstance.result.then(function () {

        });
    }

    // 编辑抵用券
    $scope.ediActivity = function(activity){
    	var modalInstance = $uibModal.open({
            animation: true,
            backdrop : "static",
            templateUrl: 'ediActivity.html',
            controller: 'ediActivityModalInstanceCtrl',
            resolve: {
                vouchersController:function () {
                    return $scope;
                },
                activityInfo : function(){
                	return activity
                }
            }
        });
        modalInstance.result.then(function () {

        });
    };
    // 领取记录
	$scope.getRecord = function(activity){
		var modalInstance = $uibModal.open({
            animation: true,
            backdrop : "static",
            templateUrl: 'getRecord.html',
            controller: 'getRecordModalInstanceCtrl',
            resolve: {
                vouchersController:function () {
                    return $scope;
                },
                activityInfo:function () {
                    return activity;
                }
            },
            size : 'lg'
        });
        modalInstance.result.then(function () {

        });
	};



});
//发布抵用券
app.controller('createActivityModalInstanceCtrl',function ($scope,$localStorage,$uibModalInstance,apiUrl,Vouchers,vouchersController,SweetAlert) {
    $scope.close = function(){
        $uibModalInstance.close();
    };
    // 获取门店列表
    $scope.storeListData = vouchersController.storeListData;

    // 选中的门店列表
    $scope.chooseStoreList = [],

    // 添加门店
    $scope.addChooseStore = function(){
        $scope.store = JSON.parse($scope.store)
    	for(var i = 0;i < $scope.chooseStoreList.length;i++){
    		if($scope.chooseStoreList[i].store_sn == $scope.store.store_sn){
    			SweetAlert.swal({
	                title: "",
	                text: "请勿重复添加门店！",
	                timer: 1000,
	                showConfirmButton: false,
	                type : "warning"
	            })
	            return;
    		}
    	}
    	$scope.chooseStoreList.push($scope.store);
    };
    // 删除门店
    $scope.deletChooseStore = function(index,chooseStore){
    	$scope.chooseStoreList.splice(index,1);
    };
    $scope.createActivity = function(){
    	// var store_list = [];
    	// for(var q = 0;q < $scope.chooseStoreList.length;q++){
    	// 	store_list.push({
    	// 		store_sn : $scope.chooseStoreList[q].store_sn
    	// 	})
    	// }
    	var data = {
    		activity_name : $scope.activity_name,
    		min_price : $scope.min_price,
    		max_price : $scope.max_price,
    		number : $scope.number,
    		total : $scope.total,
    		user_type : $scope.user_type,
    		publish_begin : $scope.publish_begin,
    		publish_end : $scope.publish_end,
    		use_begin : $scope.use_begin,
    		use_end : $scope.use_end,
    		min_price : $scope.min_price,
    		// store_list : store_list,
    		status : 1
    	}
    	// 转换成时间戳
    	data.publish_begin = getTodayTime(data.publish_begin);
    	data.publish_end = getTodayTime(data.publish_end);
    	data.use_begin = getTodayTime(data.use_begin);
    	data.use_end = getTodayTime(data.use_end);
    	// data.store_list = JSON.stringify(data.store_list);
    	Vouchers.CreateActivity(data).then(function (response) {
            if(response.code == 0){
                $scope.close();
                SweetAlert.swal({
	                title: "",
	                text: "创建抵用券成功！",
	                timer: 1000,
	                showConfirmButton: false,
	                type : "success"
	            });
	            vouchersController.getActivityList();
            }else{
                SweetAlert.swal("",response.msg,"error");
            }
        })
    };	
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
        $scope.openDateBox1 = function() {
            $scope.popup1.opened = true;
        };
        $scope.openDateBox2 = function() {
            $scope.popup2.opened = true;
        };
        $scope.openDateBox3 = function() {
            $scope.popup3.opened = true;
        };
        $scope.openDateBox4 = function() {
            $scope.popup4.opened = true;
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
        $scope.popup3 = {
            opened: false
        };
        $scope.popup4 = {
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
//编辑抵用券
app.controller('ediActivityModalInstanceCtrl',function ($scope,$localStorage,$uibModalInstance,apiUrl,Vouchers,vouchersController,SweetAlert,activityInfo) {
    $scope.close = function(){
        $uibModalInstance.close();
    };
    // 获取活动信息
    $scope.activityInfo = angular.copy(activityInfo);

    $scope.activityInfo.publish_begin = getDate($scope.activityInfo.publish_begin);
    $scope.activityInfo.publish_end = getDate($scope.activityInfo.publish_end);
    $scope.activityInfo.use_begin = getDate($scope.activityInfo.use_begin);
    $scope.activityInfo.use_end = getDate($scope.activityInfo.use_end);
    // 获取门店列表
    $scope.storeListData = vouchersController.storeListData

    // 获取活动参与的门店
    $scope.activityStoreList = [];
    $scope.getActivityStoreList = function(){
        var data = {
            activity_sn : $scope.activityInfo.activity_sn,
        }
        Vouchers.GetActivityStoreList(data).then(function (response) {
            if(response.code == 0){
                $scope.activityStoreList = response.data;
            }else{
                SweetAlert.swal({
                    title: "",
                    text: response.msg,
                    timer: 1000,
                    showConfirmButton: false,
                    type : "warning"
                })
            }
        })
    }

    // 获取活动参与门店
    $scope.getActivityStoreList()

    $scope.ediSubmit = function(){
        $scope.activityInfo.publish_begin = getTodayTime($scope.activityInfo.publish_begin);
        $scope.activityInfo.publish_end = getTodayTime($scope.activityInfo.publish_end);
        $scope.activityInfo.use_begin = getTodayTime($scope.activityInfo.use_begin);
        $scope.activityInfo.use_end = getTodayTime($scope.activityInfo.use_end);
        $scope.activityInfo.min_price = parseInt($scope.activityInfo.min_price);
        $scope.activityInfo.max_price = parseInt($scope.activityInfo.max_price);
        var data = $scope.activityInfo;
        Vouchers.EditActivity(data).then(function (response) {
            if(response.code == 0){
                $scope.close();
                SweetAlert.swal({
                    title: "",
                    text: "修改成功！",
                    timer: 1000,
                    showConfirmButton: false,
                    type : "success"
                });
                vouchersController.getActivityList();
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
        $scope.openDateBox1 = function() {
            $scope.popup1.opened = true;
        };
        $scope.openDateBox2 = function() {
            $scope.popup2.opened = true;
        };
        $scope.openDateBox3 = function() {
            $scope.popup3.opened = true;
        };
        $scope.openDateBox4 = function() {
            $scope.popup4.opened = true;
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
        $scope.popup3 = {
            opened: false
        };
        $scope.popup4 = {
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
//领取抵用券记录
app.controller('getRecordModalInstanceCtrl',function ($scope,$localStorage,$uibModalInstance,$uibModal,apiUrl,Vouchers,vouchersController,SweetAlert,activityInfo) {
    // 分页设置
    $scope.maxSize = 5;
    $scope.perPage = 20;
    $scope.bigCurrentPage = 1;
    $scope.maxPage = 1;
    $scope.bigTotalItems = 0;

    // 默认显示已使用
    $scope.isUsed = "";

    $scope.activityInfo = angular.copy(activityInfo);

    $scope.total_count = 0;
    $scope.total_price = 0;
    $scope.total_user = 0;


    $scope.getCouponList = function(data){
        Vouchers.GetCouponList(data).then(function (response) {
            if(response.code == 0){
                console.log(response)
                $scope.couponList = response.data.data;
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
            var data = {
                activity_sn : $scope.activityInfo.activity_sn,
                is_used : $scope.isUsed,
                obtain_begin : getTodayTime($scope.obtainBegin),
                obtain_end : getTodayTime($scope.obtainEnd),
                mobile : $scope.mobile,
                page_size : 10,
                page : newValue,
            };
            delEmptyAttr(data);
            if(data.obtain_end){
                data.obtain_end = Number(data.obtain_end) + 86400
            }
            $scope.getCouponList(data)
        },
        true
    );

    $scope.setPage = function(){
        if($scope.reqPage > 0 && $scope.reqPage <= $scope.maxPage){
            $scope.bigCurrentPage = $scope.reqPage
        }else{
            return;
        }
    };
    // 搜索领取记录
    $scope.searchBtn = function(){
        var data = {
            activity_sn : $scope.activityInfo.activity_sn,
            is_used : $scope.isUsed,
            obtain_begin : getTodayTime($scope.obtainBegin),
            obtain_end : getTodayTime($scope.obtainEnd),
            mobile : $scope.mobile,
            page_size : 10,
            page : 1,
        }
        delEmptyAttr(data);
        if(data.obtain_end){
            data.obtain_end = Number(data.obtain_end) + 86400
        }
        $scope.getCouponList(data)
    }

    // 清空搜索条件
    $scope.emptySearch = function(){
        $scope.isUsed = 1;
        $scope.obtainBegin = "";
        $scope.obtainEnd = "";
        $scope.mobile = "";
        var data = {
            activity_sn : $scope.activityInfo.activity_sn,
            page : 1,
            page_size : 10
        }
        $scope.getCouponList(data)
    }


    $scope.getCouponOrder = function(coupon){
    	// $scope.close();
    	var modalInstance = $uibModal.open({
            animation: true,
            backdrop : "static",
            templateUrl: 'getVouchersInfo.html',
            controller: 'getVouchersInfoModalInstanceCtrl',
            resolve: {
                vouchersController:function () {
                    return vouchersController;
                },
                couponInfo:function () {
                    return coupon;
                }
            }
        });
        modalInstance.result.then(function () {

        });
    }
    // 关闭模态框
    $scope.close = function(){
        $uibModalInstance.close();
    };
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
        $scope.openDateBox1 = function() {
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
        }
    }
})
// 抵用券使用详情
app.controller('getVouchersInfoModalInstanceCtrl',function ($scope,$localStorage,$uibModalInstance,apiUrl,Vouchers,vouchersController,SweetAlert,couponInfo) {
    // 分页设置
    $scope.maxSize = 5;
    $scope.perPage = 20;
    $scope.bigCurrentPage = 1;
    $scope.maxPage = 1;
    $scope.bigTotalItems = 1;

    $scope.couponInfo = couponInfo;
    var data = {
        coupon_sn : $scope.couponInfo.coupon_sn,
    }

    $scope.getCouponOrderInfo = function(data){
        Vouchers.GetCouponOrderInfo(data).then(function (response) {
            if(response.code == 0){
                if(response.data.length > 0){
                    $scope.couponInfoList = response.data[0];
                    if($scope.couponInfoList.info){
                        $scope.couponInfoList.info = JSON.parse($scope.couponInfoList.info)
                    }
                }
            }else{
                SweetAlert.swal({
                    title: "",
                    text: response.msg,
                    timer: 1000,
                    showConfirmButton: false,
                    type : "error"
                })
            }
        })
    }
    $scope.getCouponOrderInfo(data)
    // 关闭模态框
    $scope.close = function(){
        $uibModalInstance.close();
    }; 
})