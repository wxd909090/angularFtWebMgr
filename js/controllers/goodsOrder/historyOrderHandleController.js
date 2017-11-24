app
.controller('historyOrderHandleController',function ($scope,$timeout,$rootScope,SweetAlert,$uibModal,$localStorage,Auth,HistoryOrderHandle,$localStorage,apiUrl) {
    //var token = Auth.getLocalData("token");

    //获取列表的默认数据
    $scope.type = 2;
    $scope.status_list = "3,4,5,7,8";
    $scope.phoneNumber="";
    //先获取时间
    datePicker();
    
    // 请求门店列表
    function GetStoreList(){
        var data = {
        };
        HistoryOrderHandle.GetStoreList(data).then(function(response){
            if(response.code  == 0){
                $scope.storeListData = response.data;//所有门店数据
                $scope.store = $scope.storeListData[0];//默认第一个门店
                console.log($scope.store) ;
                //获取默认store_sn
                $scope.store_sn = $scope.storeListData[0].store_sn;
                var newData = {};
                newData['type'] = $scope.type;
                newData['store_sn'] = $scope.store_sn;
                newData['status_list'] = $scope.status_list;
                newData['begin_time'] = $scope.begin_time_stamp;
                newData['end_time'] = $scope.end_time_stamp;
                //获取对应store_sn列表
                getGoodsTypeList(newData);
            }else{
                var msg = response.msg;
                SweetAlert.swal("",msg,"error");
            }
        })
    };
    GetStoreList();

    //请求对应门店的订单列表
    function getGoodsTypeList(data){
        HistoryOrderHandle.getGoodsTypeList(data).then(function(response){
            console.log(response);
            if(response.code == 0){
                $scope.goodsOrderData = response.data.data;
                console.log($scope.goodsOrderData);
            }else{
                $scope.goodsOrderData = [];
                var msg = response.msg;
                SweetAlert.swal("",msg,"error");
            }
        })
    };

    //手机号搜索
    $scope.serachUser = function(){
        //拼数据
        var data = {};
        data['type'] = $scope.type;
        data['store_sn'] = $scope.store.store_sn;
        data['status_list'] = $scope.status_list;
        data['begin_time'] = parseInt($scope.start_time.getTime() / 1000);
        data['end_time'] = parseInt($scope.end_time.getTime() / 1000);
        data['mobile'] = $scope.phoneNumber; 
        console.log(data);
        //请求对应门店列表
        getGoodsTypeList(data)
    }
    //切换门店搜索
    $scope.changeStore = function(newData){
        console.log(newData);
        //拼数据
        var data = {};
        data['type'] = $scope.type;
        data['store_sn'] = $scope.store.store_sn;
        data['status_list'] = $scope.status_list;
        data['begin_time'] = parseInt($scope.start_time.getTime() / 1000);
        data['end_time'] = parseInt($scope.end_time.getTime() / 1000);
        if(!!$scope.phoneNumber){
           data['mobile'] = $scope.phoneNumber; 
        }
        console.log(data);
        //请求对应门店列表
        getGoodsTypeList(data)
    }
    //切换时间
    //监听start_time时间
    $scope.$watch(function() {
            return $scope.start_time;
        },
        function(newVal,oldVal) {
            if (newVal != oldVal) {
               console.log(parseInt(newVal.getTime()/1000));
               console.log(parseInt(oldVal.getTime()/1000));
               //拼数据
                var data = {};
                data['type'] = $scope.type;
                data['store_sn'] = $scope.store.store_sn;
                data['status_list'] = $scope.status_list;
                data['begin_time'] = parseInt($scope.start_time.getTime() / 1000);
                data['end_time'] = parseInt($scope.end_time.getTime() / 1000);
                if(!!$scope.phoneNumber){
                   data['mobile'] = $scope.phoneNumber; 
                }
                console.log(data);
                //请求对应门店列表
                getGoodsTypeList(data)
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
               console.log(parseInt(newVal.getTime()/1000));
               console.log(parseInt(oldVal.getTime()/1000));
               //拼数据
                var data = {};
                data['type'] = $scope.type;
                data['store_sn'] = $scope.store.store_sn;
                data['status_list'] = $scope.status_list;
                data['begin_time'] = parseInt($scope.start_time.getTime() / 1000);
                data['end_time'] = parseInt($scope.end_time.getTime() / 1000);
                if(!!$scope.phoneNumber){
                   data['mobile'] = $scope.phoneNumber; 
                }
                console.log(data);
                //请求对应门店列表
                getGoodsTypeList(data)
            }
        },
        true
    );


    //调用模态框
    $scope.checkHistoryOrder = function (goodsOrder) {
        var modalInstance = $uibModal.open({
            animation: true,
            backdrop : "static",
            templateUrl: 'checkHistoryOrder.html',
            controller: 'checkHistoryOrderCtrl',
            resolve: {
                historyOrderHandleController: function () {
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

    
    
    // 日期插件调用
    function datePicker(){
        $scope.today = function() {
            // $scope.start_time = new Date();
            // $scope.end_time = new Date();

            $scope.end_time = new Date();
            $scope.start_time = new Date($scope.end_time.getTime() - 24*60*60*1000); //前一天   
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
        //获取时间
        // $scope.begin_time = parseInt($scope.start_time.getTime() / 1000);
        // $scope.end_time = parseInt(new Date().getTime() / 1000);
        //时间戳
        $scope.begin_time_stamp = parseInt($scope.start_time.getTime() / 1000);
        $scope.end_time_stamp = parseInt(new Date().getTime() / 1000);
    };


    
});



//将父控制器传入进来当着父级的$scope可以调用父级的数据使用
// 历史订单模态框控制器
app.controller('checkHistoryOrderCtrl', function($scope,$uibModalInstance,$timeout,SweetAlert,HistoryOrderHandle,Auth,$localStorage,goodsOrder,historyOrderHandleController,apiUrl,ngVerify) {
    var token = Auth.getLocalData("token");
    var store_sn = Auth.getLocalData("store_sn");
    console.log(goodsOrder);

    //店名
    $scope.seeName = historyOrderHandleController.store.store_name;
    //订单用户
    $scope.seePhoneNumber = goodsOrder.ft_order.info.mobile;
    //配送包间
    $scope.seePrivateRoom = goodsOrder.ft_order.info.room_name;
    //配送时段
    //时段
    $scope.seeDay = goodsOrder.ft_order.reserve_time;
    $scope.seeDeliveryTime = goodsOrder.ft_order.info.duration_time;
    //商品
    $scope.seeOrderGoods = goodsOrder.order_goods;
    //总金额 
    $scope.seeAllMoney = goodsOrder.ft_order.price;
    //优惠
    $scope.seeFreeMoney = goodsOrder.ft_order.free_price;
    //实付金额
    $scope.seePayMoney = goodsOrder.ft_order.price;



    //订单状态
    $scope.status = goodsOrder.status;
    if(goodsOrder.status == 3){
        $scope.status = "订单用户已退单";
    }
    
    // 关闭
    $scope.close = function(){
        $uibModalInstance.close();
    }
});