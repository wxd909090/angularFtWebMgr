app
.controller('goodsOrderHandleController',function ($scope,$timeout,$rootScope,SweetAlert,$uibModal,$interval,$localStorage,Auth,GoodsOrderHandle,$localStorage,apiUrl) {
    var token = Auth.getLocalData("token");
    $scope.showGoodsSend = true;
    $scope.showChargeback = false;
    $scope.showTodayOrders = false;
    $scope.mobile = "";
    $scope.goodsOrderData =[];

    // 订单分页设置
    $scope.bigCurrentPage = 1;
    $scope.maxSize = 5;
    $scope.bigTotalItems = 0;
    $scope.maxPage = 1;

    // type=2
    // 历史订单 status_list = 3,4,5,7,8
    // 待配送 status= 3
    // 申请退单 status= 7
    // 今日完成 status= 5


     // $scope.distributionNum 待配送
     // $scope.refunsReqtNum 待配送
     // $scope.completeNum 待配送

     // 获取订单数量状态
    $scope.getCountOrder = function(){
        var data = {
            store_sn : $scope.store.store_sn
        }
        GoodsOrderHandle.GetCountOrder(data).then(function(response){
            if(response.code  == 0){
                $scope.distributionNum = response.data.distributionNum;
                $scope.refunsReqtNum = response.data.refunsReqtNum;
                $scope.completeNum = response.data.completeNum;
            }else{
                var msg = response.msg;
                SweetAlert.swal("",msg,"error");
            }
        });
    };

    // 10秒循环拉取订单状态
    $rootScope.getCountOrderTimer = $interval(function(){
        $scope.getCountOrder();
        $scope.GetStoreOrderList();
    },60000);

    $scope.status = 3;
    $scope.reserve_time = getTodayTime8(new Date());

    // 请求门店列表
    $scope.getStoreList = function(){
        var data = {
        };
        GoodsOrderHandle.GetStoreList(data).then(function(response){
            if(response.code  == 0){
                $scope.storeListData = response.data;
                $scope.store = $scope.storeListData[0];
                $scope.GetStoreOrderList();
                $scope.getCountOrder();
            }else{
                var msg = response.msg;
                SweetAlert.swal("",msg,"error");
            }
        });
    };
    $scope.getStoreList();

    // 切换门店
    $scope.changeStore = function(){
        $scope.GetStoreOrderList();
    };


    $scope.serachOrder = function(){
        $scope.bigCurrentPage = 1;
        if($scope.mobile.length == 11){
            var reselut = checkMobile($scope.mobile);
            if(reselut){
                $scope.GetStoreOrderList();
            }else{
                SweetAlert.swal({
                    title: "",
                    text: "请输入正确的手机号码",
                    timer: 1000,
                    showConfirmButton: false,
                    type : "warning"
                });
            }
        }else{
            // SweetAlert.swal({
            //     title: "",
            //     text: "请输入正确的手机号码",
            //     timer: 1000,
            //     showConfirmButton: false,
            //     type : "warning"
            // });
        }
    };


    // 获取订单列表
    $scope.GetStoreOrderList = function(){
        var data = {
            type : 2,
            store_sn : $scope.store.store_sn,
            page : $scope.bigCurrentPage,
            status: $scope.status
        };
        if($scope.reserve_time){
            data.reserve_time = $scope.reserve_time
        };
        if($scope.mobile){
            var reselut = checkMobile($scope.mobile);
            if(reselut){
                data.mobile = $scope.mobile;
            }else{
                SweetAlert.swal({
                    title: "",
                    text: "请输入正确的手机号码",
                    timer: 1000,
                    showConfirmButton: false,
                    type : "warning"
                });
                $scope.mobile = "";
                return;
            }
        }
        GoodsOrderHandle.GetStoreOrderList(data).then(function(response){
            if(response.code  == 0){
                $scope.bigTotalItems = response.data.total;
                $scope.maxPage = response.data.total_page;
                $scope.goodsOrderData = response.data.data;
                for(var z = 0;z < $scope.goodsOrderData.length;z++){
                    $scope.goodsOrderData[z].totalAllGoodsPrice = 0;
                    $scope.goodsOrderData[z].price = Number($scope.goodsOrderData[z].price);
                    for(var a = 0;a < $scope.goodsOrderData[z].order_goods.length;a++){
                        $scope.goodsOrderData[z].totalAllGoodsPrice = ($scope.goodsOrderData[z].totalAllGoodsPrice*1000 + Number($scope.goodsOrderData[z].order_goods[a].total_price)*1000) / 1000
                    }
                };
            }else{
                var msg = response.msg;
                SweetAlert.swal("",msg,"error");
            }
        });
    };
    // 切换订单显示状态
    $scope.changeStatus = function (x) {
    	$scope.showGoodsSend = false;
    	$scope.showChargeback = false;
    	$scope.showTodayOrders = false;
        $scope.goodsOrderData =[];
        $scope.reserve_time = null;
        $scope.checkDate = new Date();
        $scope.mobile = "";
    	if(x == 0){
            $scope.status = 3;
    		$scope.showGoodsSend = true;
            var getDate = $scope.checkDate;
            getDate = getTodayTime8(getDate);
            $scope.reserve_time = getDate;
    	}else if(x == 1){
            $scope.status = 7;
    		$scope.showChargeback = true;
    	}else{
            $scope.status = 5;
    		$scope.showTodayOrders = true;
            var getDate = new Date();
            getDate = getTodayTime8(getDate);
            $scope.reserve_time = getDate;
    	};
        $scope.bigCurrentPage = 1;
        $scope.GetStoreOrderList();
    };

    // 切换日期列表
    $scope.checkDateChange = function(checkDate){
        if(checkDate){
            var getDate = checkDate;
            getDate = getTodayTime8(getDate);
            $scope.reserve_time = getDate;
            $scope.bigCurrentPage = 1;
            $scope.GetStoreOrderList()
        }else{
        }
    }
    // 查看订单详情
    $scope.checkGoodsOrder = function (goodsOrder) {
        var modalInstance = $uibModal.open({
            animation: true,
            backdrop : "static",
            templateUrl: 'checkGoodsOrder.html',
            controller: 'checkGoodsOrderCtrl',
            resolve: {
                goodsOrderHandleController: function () {
                    return $scope;
                },
                goodsOrder : function () {
                	return goodsOrder;
                }
            }
        });
        modalInstance.result.then(function () {
        });
    };
    // 监听订单分页数值变化
    $scope.$watch(function() {
            return $scope.bigCurrentPage;
        },
        function(value) {
            if (value) {
                $scope.bigCurrentPage = value;
                value = Number(value);
                if($scope.store){
                    $scope.GetStoreOrderList()
                }else{
                    $scope.getStoreList()
                }
            }
        },
        true
    );

    datePicker();
    // 日期插件调用
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
// 查看商品订单详情模态框控制器
app.controller('checkGoodsOrderCtrl', function($scope,$uibModalInstance,$timeout,SweetAlert,GoodsOrderHandle,Auth,$localStorage,goodsOrder,goodsOrderHandleController,apiUrl,ngVerify) {
    var token = Auth.getLocalData("token");
    var store_sn = Auth.getLocalData("store_sn");
    $scope.showGoodsSend = goodsOrderHandleController.showGoodsSend;
    $scope.showChargeback = goodsOrderHandleController.showChargeback;
    $scope.showTodayOrders = goodsOrderHandleController.showTodayOrders;
    $scope.goodsOrder = goodsOrder;

    // 配送商品
    $scope.sendGoods = function () {
        var data = {
            store_sn : goodsOrder.ft_order.store_sn,
            o_sn : goodsOrder.ft_order.o_sn,
            go_sn : goodsOrder.ft_order.go_sn,
        };
        GoodsOrderHandle.DistributionOrder(data).then(function(response){
            if(response.code  == 0){
                SweetAlert.swal({
                    title: "",
                    text: "配送订单成功！",
                    timer: 1000,
                    showConfirmButton: false,
                    type : "success"
                });
                $scope.close();
                goodsOrderHandleController.GetStoreOrderList();
            }else{
                var msg = response.msg;
                SweetAlert.swal("",msg,"error");
            }
        });
    };

    // 商家直接退单并退款
    $scope.refundOrder = function (){
        var data = {
            o_sn : $scope.goodsOrder.o_sn,
            type : 2,
            store_sn : $scope.goodsOrder.ft_order.store_sn,
            user_sn : $scope.goodsOrder.ft_order.user_sn,
            go_sn : $scope.goodsOrder.ft_order.go_sn,
        };
        GoodsOrderHandle.RefundOrder(data).then(function(response){
            if(response.code == 0){
                SweetAlert.swal({
                    title: "",
                    text: "退单成功！",
                    timer: 1000,
                    showConfirmButton: false,
                    type : "success"
                });
                $scope.close();
                goodsOrderHandleController.GetStoreOrderList();
            }else{
                SweetAlert.swal("",response.msg,"error")
            }
        })
    };
    // 同意申请退单
    $scope.sureRefoundOrder = function (input) {
        var rfo_sn = "";
        for(var q = 0;q < goodsOrder.refund_order.length;q++){
            if(goodsOrder.refund_order[q].status == 1){
                rfo_sn = goodsOrder.refund_order[q].rfo_sn;
            };
        };
        if(!rfo_sn){
            for(var z = 0;z < goodsOrder.refund_order.length;z++){
                if(goodsOrder.refund_order[z].status == 3){
                    rfo_sn = goodsOrder.refund_order[z].rfo_sn;
                };
            };
        }
        var is_ok = "";
        var is_distribute = "";
        if(input == 3){
            is_ok = 2
        }else if(input == 1){
            is_ok = 1;
            is_distribute = 2;
        }else if(input == 2){
            is_ok = 1;
            is_distribute = 1;
        };
        var data = {
            store_sn : goodsOrder.ft_order.store_sn,
            o_sn : goodsOrder.ft_order.o_sn,
            go_sn : goodsOrder.ft_order.go_sn,
            rfo_sn: rfo_sn,
            is_ok : is_ok
        };
        if(is_distribute){
            data.is_distribute = is_distribute
        }
        GoodsOrderHandle.SetRefundReqResult(data).then(function(response){
            if(response.code  == 0){
                var text = ""
                if(input == 1){
                    text = "拒绝申请并配送！"
                }else if(input == 2){
                    text = "拒绝申请不配送！"
                }else if(input == 3){
                    text = "同意申请并退款！"
                }
                SweetAlert.swal({
                    title: "",
                    text: text,
                    timer: 1000,
                    showConfirmButton: false,
                    type : "success"
                })
                $scope.close();
                goodsOrderHandleController.GetStoreOrderList();
            }else{
                var msg = response.msg;
                SweetAlert.swal("",msg,"error");
            }
        });
    };

    // 关闭
    $scope.close = function(){
        $uibModalInstance.close();
    };
});