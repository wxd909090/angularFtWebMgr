app
.controller('busMgrStatisticController',function ($scope,$timeout,$localStorage,$uibModal,Auth,SweetAlert,BusMgrStatistic) {
    var token = Auth.getLocalData("token");
    var store_sn = Auth.getLocalData("store_sn");


    $scope.store = {
        store_name : "",
        store_sn : store_sn
    }
    //默认当天的时间戳
    $scope.startTimeStamp = parseInt(new Date().getTime()/1000);
    $scope.endTimeStamp = parseInt(new Date().getTime()/1000);
    var topAlldata = {};
    topAlldata['start_time'] = $scope.startTimeStamp;
    topAlldata['end_time'] = $scope.endTimeStamp;
    topAlldata['is_today'] = 1;
    topAlldata['store_sn'] = $scope.store.store_sn;
    // topAlldata['token'] = token;
    // bigBusinessStatistics(topAlldata);

    //大后台营业统计
    // function bigBusinessStatistics(data){
    //     BusMgrStatistic.bigBusinessStatistics(data).then(function(response){
    //         if(response.code  == 0){
    //             $scope.bigBusinessData = response.data;
    //         }else{
    //             var msg = response.msg;
    //             SweetAlert.swal("",msg,"error");
    //         }
    //     })
    // }
    //监听start_time时间
    $scope.$watch(function() {
            return $scope.start_time;
        },
        function(newVal,oldVal) {
            if (newVal != oldVal) {
                var topAlldata = {};
                topAlldata['start_time'] = parseInt($scope.start_time.getTime() / 1000);
                topAlldata['end_time'] = parseInt($scope.end_time.getTime() / 1000);
                topAlldata['is_today'] = 1;
                console.log(topAlldata);
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
                topAlldata['start_time'] = parseInt($scope.start_time.getTime() / 1000);
                topAlldata['end_time'] = parseInt($scope.end_time.getTime() / 1000);
                topAlldata['is_today'] = 1;
                console.log(topAlldata);
                bigBusinessStatistics(topAlldata);
            }
        },
        true
    );
    //结算
    //决算分页
    $scope.pageFlag = false;
    $scope.bigCurrentPage = 1;//当前页
    $scope.maxSize = 5;// 中间显示按钮数
    //获取结算门店
    function GetStoreList(){
        var data = {};
        BusMgrStatistic.GetStoreList(data).then(function(response){
            if(response.code  == 0){
                $scope.allStoreListData = response.data;
            }else{
                var msg = response.msg;
                SweetAlert.swal("",msg,"error");
            }
        })
    }
    GetStoreList();
    //获取结算第一页
    $scope.getSettleRecord = function (data){
        BusMgrStatistic.getSettleRecord(data).then(function(response){
            if(response.code  == 0){
                $scope.recordDataList = response.data;
                $scope.recordDataLists = response.data.list;

                $scope.perPage = $scope.recordDataList.page_size;//每页条数
                $scope.bigTotalItems = $scope.recordDataList.total;//总共的数目
                $scope.maxPage = $scope.recordDataList.total_page;//最大页数
                $scope.bigCurrentPage = $scope.recordDataList.page;
            }else{
                var msg = response.msg;
                SweetAlert.swal("",msg,"error");
            }
        })
    }
     //获取结算第一页
    function getSettleRecord(data){
        BusMgrStatistic.getSettleRecord(data).then(function(response){
            if(response.code  == 0){
                $scope.recordDataList = response.data;
                $scope.recordDataLists = response.data.list;

                $scope.perPage = $scope.recordDataList.page_size;//每页条数
                $scope.bigTotalItems = $scope.recordDataList.total;//总共的数目
                $scope.maxPage = $scope.recordDataList.total_page;//最大页数
                $scope.bigCurrentPage = $scope.recordDataList.page;
            }else{
                var msg = response.msg;
                SweetAlert.swal("",msg,"error");
            }
        })
    }
    var recordData = {};
    recordData['page'] = $scope.bigCurrentPage;
    if($scope.storeSn == ""){

    }else{
        recordData['store_sn'] = $scope.storeSn;
    }
    getSettleRecord(recordData);
    //切换门店
    $scope.changeStore = function(){
        var recordData = {};
        recordData['page'] = $scope.bigCurrentPage;
        if($scope.storeSn == ""){

        }else{
            recordData['store_sn'] = $scope.storeSn;
        }
        getSettleRecord(recordData);
    };
    //跳转页
    $scope.setPage = function(){
        if($scope.reqPage <= 0 || $scope.reqPage > $scope.maxPage){
            return;
        }
        $scope.bigCurrentPage = $scope.reqPage;
        var recordData = {};
        recordData['page'] = $scope.bigCurrentPage;
        if($scope.storeSn == ""){

        }else{
            recordData['store_sn'] = $scope.storeSn;
        }
        getSettleRecord(recordData);
    }
    // 监听分页数值变化
    $scope.$watch(
        function(){
            return $scope.bigCurrentPage;
        },
        function(newValue,oldValue) {
            if(newValue != oldValue){
                // $scope.bigCurrentPage = $scope.reqPage;
                // var recordData = {};
                // if($scope.bigCurrentPage == 0){
                //     recordData['page'] = 1;
                // }
                recordData['page'] = $scope.bigCurrentPage;
                if($scope.storeSn == ""){

                }else{
                    recordData['store_sn'] = $scope.storeSn;
                }
                getSettleRecord(recordData);
            }
        },
        true
    );

    // $scope.allTotalPage = false;
    // // 分页配置
    // $scope.pageFlag = false;
    // $scope.bigCurrentPage = 1;//当前页
    // $scope.maxSize = 5;// 中间显示按钮数
    // $scope.perPage = 10;//每页条数
    // $scope.bigTotalItems = 40;//总共的数目
    // $scope.maxPage = 2;//最大页数

    // // 跳转
    // $scope.setPage = function(){
    //     if($scope.reqPage <= 0 || $scope.reqPage > $scope.maxPage){
    //         return;
    //     }
    //     // 设置当前页数
    //     $scope.bigCurrentPage = $scope.reqPage;
    // }
    // // 监听分页数值变化
    // $scope.$watch(
    //     function(){
    //         return $scope.bigCurrentPage;
    //     },
    //     function(newValue,oldValue) {
    //         // 拉取数据
    //         if($scope.pageFlag == true && $scope.bigCurrentPage == 1){
    //             $scope.pageFlag = false;
    //             return ;
    //         }
    //         $scope.pageFlag = false;
    //         getData();
    //     },
    //     true
    // );
    // //拉取数据   分页
    // function getData() {
    //     if($scope.checkType == 1){
    //         GetStoreList();
    //     } else if($scope.checkType == 2){
    //         GetStoreList();
    //         getSettleStatistic();
    //     }
    // }
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
        if(type == 1){
            // $scope.clickSale(type);
            //GetStoreList();
        } else if(type == 2){
            $scope.storeSn = '';
            //getSettleStatistic();
        }
    };
    //store分页
    // function storePage(data) {
    //     $scope.bigTotalItems = data.length;
    //     $scope.maxPage = Math.ceil($scope.bigTotalItems/$scope.perPage);
    //     $scope.storeListData = data.slice(($scope.bigCurrentPage-1)*$scope.perPage,($scope.bigCurrentPage*$scope.perPage))
    // }
     
     
    
    //get store_name
    // function getStoreName(storeSn,storeData,res) {
    //     if(storeSn){
    //         var storeName = '';
    //         for(var i = 0;i < storeData.length; ++i){
    //             if(storeData[i].store_sn == storeSn){
    //                 storeName = storeData[i].store_name;
    //                 break;
    //             }
    //         }
    //         for(var i = 0;i < res.length; ++i){
    //             res[i].store_name = storeName;
    //         }
    //         return res;
    //     }
    //     else {
    //         for(var i = 0;i < res.length; ++i){
    //             for(var j = 0;j < storeData.length; ++j) {
    //                 if (res[i].store_sn == storeData[j].store_sn) {
    //                     res[i].store_name = storeData[j].store_name;
    //                     break;
    //                 }
    //             }
    //         }
    //         return res;
    //     }
    // }
    // //获取 商家 列表

    // //获取 结算 信息
    // function getSettleStatistic() {
    //     if($scope.storeSn){
    //         var data = {
    //             store_sn:$scope.storeSn,
    //             page:$scope.bigCurrentPage
    //         }
    //     } else {
    //         var data = {
    //             page:$scope.bigCurrentPage
    //         }
    //     }


    //     StoreStream.getSettleStatistic(data).then( function (response){
    //         if(response.code == 0){
    //             $scope.settleData = response.data.data;
    //             $scope.settleCharge = response.data.settleCharge;
    //             // if($scope.settleData.length){
    //                 $scope.settleData = getStoreName($scope.storeSn,$scope.allStoreListData,$scope.settleData);
    //             // }
    //             //最大页数
    //             $scope.maxPage = response.data.last_page;
    //             // 总条数
    //             $scope.bigTotalItems = response.data.total;
    //             // 每页条数
    //             $scope.perPage = response.data.per_page;
    //         }else{
    //             SweetAlert.swal("",response.msg,"error");
    //         }
    //     })
    // }
    // //点击查询 按钮 结算 信息
    // $scope.clickSettleStatistic = function () {
    //     $scope.pageFlag = true;
    //     $scope.bigCurrentPage = 1;
    //     getSettleStatistic();
    // }
    //init
    $scope.clickTable($scope.checkType);

    //模态框
    //营业统计
    $scope.clickSaleStatistic = function(storeName,storeSn){
        var modalInstance = $uibModal.open({
            animation: true,
            backdrop : "static",
            templateUrl: 'saleBus.html',
            controller: 'saleModalInstanceCtrlBus',
            resolve: {
                storeSn:function () {
                    return storeSn;
                },
                storeName:function () {
                    return storeName;
                }
            },
            size:'lg'
        });
        modalInstance.result.then(function () {

        });
    }

    //包间统计
    $scope.clickRoomStatistic = function(storeName,storeSn){
        var modalInstance = $uibModal.open({
            animation: true,
            backdrop : "static",
            templateUrl: 'roomBus.html',
            controller: 'roomModalInstanceCtrlBus',
            resolve: {
                storeSn:function () {
                    return storeSn;
                },
                storeName:function () {
                    return storeName;
                }
            },
            size:'lg'
        });
        modalInstance.result.then(function () {

        });
    }
    //包间统计
    $scope.clickRecordStatistic = function(storeName,storeSn){
        var modalInstance = $uibModal.open({
            animation: true,
            backdrop : "static",
            templateUrl: 'recordBus.html',
            controller: 'recordModalInstanceCtrlBus',
            resolve: {
                storeSn:function () {
                    return storeSn;
                },
                storeName:function () {
                    return storeName;
                }
            },
            size:'lg'
        });
        modalInstance.result.then(function () {

        });
    }
    //结算
    $scope.clickSettle = function(storeName,storeSn){
        var modalInstance = $uibModal.open({
            animation: true,
            backdrop : "static",
            templateUrl: 'settleBus.html',
            controller: 'settleModalInstanceCtrl',
            resolve: {
                storeSn:function () {
                    return storeSn;
                },
                storeName:function () {
                    return storeName;
                },
                storeStatisticController:function(){
                    return $scope;
                }
            },
        });
        modalInstance.result.then(function () {

        });
    };

    
    //日期插件
    //日期插件调用
    datePicker();
    function datePicker(){
        $scope.today = function() {
            $scope.start_time = new Date();
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
})








//营业统计
app.controller('saleModalInstanceCtrlBus',function ($scope,$localStorage,$uibModalInstance,apiUrl,storeSn,storeName,SweetAlert,BusMgrStatistic) {
    //>>>默认参数设置
    $scope.storeName = storeName;//门店名字
    $scope.storeSn = storeSn;//门店sn
    //营业统计类型
    $scope.saleTypeData = [
        {
            type:1,
            name:'天统计'
        },
        {
            type:2,
            name:'周统计'
        },
        {
            type:3,
            name:'月统计'
        },
    ];
    //全部，微信，会员
    $scope.saleType = 1;
    //营业统计类型
    $scope.allTypeData = [
        {
            type:0,
            name:'全部'
        },
        {
            type:1,
            name:'微信'
        },
        {
            type:2,
            name:'会员'
        },
    ];
    //初始化 类型  按天
    $scope.defaultType = 0;
    //总数据 显示 开关
    $scope.allDataShow = false;
    // 分页配置
    $scope.pageFlag = false;
    $scope.bigCurrentPage = 1;
    // 中间显示按钮数
    $scope.maxSize = 5;

    //页跳转
    $scope.setPage = function(){
        if($scope.reqPage <= 0 || $scope.reqPage > $scope.maxPage){
            return;
        }
        // 设置当前页数
        $scope.bigCurrentPage = $scope.reqPage;
        //拼数据
        var data = {};
        data['store_sn'] = $scope.storeSn;
        data['page'] = $scope.bigCurrentPage;
        data['count_type'] = $scope.saleType;
        if($scope.defaultType == 0){

        }else{
            if($scope.defaultType == 1){
                data['pay_type'] = 0;
            }else{
                data['pay_type'] = 1;
            }
            
        }
        storeBusinessStatistics(data);

    }
    // 监听分页数值变化
    $scope.$watch(function() {
            return $scope.bigCurrentPage;
        },
        function(newValue,oldValue) {
            // 拉取数据
            if($scope.pageFlag == true && $scope.bigCurrentPage == 1){
                $scope.pageFlag = false;
                return ;
            }
            //拼数据
            var data = {};
            data['store_sn'] = $scope.storeSn;
            data['page'] = $scope.bigCurrentPage;
            data['count_type'] = $scope.saleType;
            if($scope.defaultType == 0){

            }else{
                if($scope.defaultType == 1){
                    data['pay_type'] = 0;
                }else{
                    data['pay_type'] = 1;
                }
                
            }
            storeBusinessStatistics(data);
        },
        true
    );

    function storeBusinessStatistics(data) {
        
        BusMgrStatistic.storeBusinessStatistics(data).then( function (response){
            if(response.code == 0){
                $scope.storeBusinessAllData = response.data;
                $scope.storeBusinessDataList = response.data.list;

                $scope.perPage = $scope.storeBusinessAllData.page_size;//每页条数
                $scope.bigTotalItems = $scope.storeBusinessAllData.total;//总共的数目
                $scope.maxPage = $scope.storeBusinessAllData.total_page;//最大页数
                $scope.bigCurrentPage = $scope.storeBusinessAllData.page;
            }else{
                SweetAlert.swal("",response.msg,"error");
            }
        })
    }
    //结算汇总
    function getSettleSummary(data){
        BusMgrStatistic.getSettleSummary(data).then( function (response){
            if(response.code == 0){
               $scope.saleTotalData = response.data;
               $scope.allDataShow = true;
            }else{
                $scope.allDataShow = false;
                $scope.allDataShow = false;
                SweetAlert.swal("",response.msg,"error");
            }
        })
    }
    //拼数据
    var data = {};
    data['store_sn'] = $scope.storeSn;
    data['page'] = 1;
    data['count_type'] = $scope.saleType;
    storeBusinessStatistics(data);
    var getSettleSummaryData = {};
    getSettleSummaryData['store_sn'] = $scope.storeSn;

    getSettleSummary(getSettleSummaryData)
    //切换微信会员
    $scope.changeAllType = function () {
        console.log($scope.defaultType);
        //拼数据
        var data = {};
        data['store_sn'] = $scope.storeSn;
        data['page'] = $scope.bigCurrentPage;
        data['count_type'] = $scope.saleType;
        if($scope.defaultType == 0){

        }else{
            if($scope.defaultType == 1){
                data['pay_type'] = 0;
            }else{
                data['pay_type'] = 1;
            }
            
        }
        storeBusinessStatistics(data);
    }
    //切换天周月
    $scope.changeSaleStatistic = function(){
        var data = {};
        data['store_sn'] = $scope.storeSn;
        data['page'] = $scope.bigCurrentPage;
        data['count_type'] = $scope.saleType;
        if($scope.defaultType == 0){

        }else{
            if($scope.defaultType == 1){
                data['pay_type'] = 0;
            }else{
                data['pay_type'] = 1;
            }
            
        }
        console.log(data);
        storeBusinessStatistics(data);
    }
    //获取导出地址
    function exportStatistic(data){
        BusMgrStatistic.exportSaleStatistic(data).then( function (response){
            if(response.code == 0){
                $scope.file_path = response.data.file_path;
                var url = apiUrl.url+"/count/downloadFile?file_path="+$scope.file_path;
                window.open(url);
            }else{
                $scope.allDataShow = false;
                SweetAlert.swal("",response.msg,"error");
            }
        })
    };
    $scope.exportSaleStatistic = function(){
        var data = {};
        data['store_sn'] = $scope.storeSn;
        data['type'] = 1;
        data['count_type'] = $scope.saleType;
        console.log(data);

        exportStatistic(data);
    }
    // 关闭
    $scope.close = function(){
        $uibModalInstance.close();
    };
})







//包间统计
app.controller('roomModalInstanceCtrlBus',function ($scope,$localStorage,$uibModalInstance,apiUrl,storeSn,storeName,SweetAlert,BusMgrStatistic) {
    //>>>默认参数设置
    $scope.storeName = storeName;
    $scope.storeSn = storeSn;
    //包间统计  默认值  排序  1升序   2 降序 0 无排序
    $scope.roomCount = '';
    $scope.roomMoney = '';


    //日期插件调用
    datePicker();
    //包间统计
    function privateRoomBusinessStatistics(data){
        BusMgrStatistic.privateRoomBusinessStatistics(data).then( function (response){
            if(response.code == 0){
               $scope.roomData = response.data;
            }else{
                SweetAlert.swal("",response.msg,"error");
            }
        })
    }
    //拼数据
    var data = {};
    data['store_sn'] = $scope.storeSn;
    data['start_time'] = turnYMD($scope.start_time);
    data['end_time'] = turnYMD($scope.end_time);
    privateRoomBusinessStatistics(data);

    //监听start_time时间
    $scope.$watch(function() {
            return $scope.start_time;
        },
        function(newVal,oldVal) {
            if (newVal != oldVal) {
                var data = {};
                data['store_sn'] = $scope.storeSn;
                data['start_time'] = turnYMD($scope.start_time);
                data['end_time'] = turnYMD($scope.end_time);
                privateRoomBusinessStatistics(data);
            }
        },
        true
    );
    //监听end_time时间
    $scope.$watch(function() {
            return $scope.end_time;
        },
        function(newVal,oldVal) {
            if (newVal != oldVal) {
                var data = {};
                data['store_sn'] = $scope.storeSn;
                data['start_time'] = turnYMD($scope.start_time);
                data['end_time'] = turnYMD($scope.end_time);
                privateRoomBusinessStatistics(data);
            }
        },
        true
    );


    //排序
    function selectionSort(arr) {
        var len = arr.length;
        var minIndex, temp;
        for (var i = 0; i < len - 1; i++) {
            minIndex = i;
            for (var j = i + 1; j < len; j++) {
                if (Number(arr[j].split(':')[0]) < Number(arr[minIndex].split(':')[0])) {     //寻找最小的数
                    minIndex = j;                 //将最小数的索引保存
                }
            }
            temp = arr[i];
            arr[i] = arr[minIndex];
            arr[minIndex] = temp;
        }
        return arr;
    }
    // 二位数组 排序  按字段
    function listSortBy(arr, field, order){
        var refer = [], result=[], order = order=='asc'?'asc':'desc', index;
        for(i=0; i<arr.length; i++){
            refer[i] = arr[i][field] + ":" + i;
        }
        //升序
        refer = selectionSort(refer);
        //降序
        if(order=='desc') refer.reverse();

        for(i=0;i<refer.length;i++){
            index = refer[i].split(':')[1];
            result[i] = arr[index];
        }
        return result;
    }
     $scope.orderByMoney = function (type) {
        if($scope.roomMoney == type){
            return ;
        }
        $scope.roomMoney = type;
        $scope.roomCount = '';
        if(type == 1){
            var order = 'asc';
        } else if(type == 2){
            var order = 'desc';
        }
        $scope.roomData = listSortBy($scope.roomData,'pay_price',order);

        // $scope.getRoomStatistic();
    }
    //排序
   $scope.orderByCount = function (type) {
        if($scope.roomCount == type){
            return ;
        }
        $scope.roomCount = type;
        $scope.roomMoney = '';
        if(type == 1){
            var order = 'asc';
        } else if(type == 2){
            var order = 'desc';
        }
        $scope.roomData = listSortBy($scope.roomData,'count_duration',order);

        // $scope.getRoomStatistic();
    }
    //日期插件
    function datePicker(){
        $scope.today = function() {
            $scope.end_time = new Date();
            $scope.start_time  = new Date($scope.end_time.getTime() - 24*60*60*1000); 

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
    //获取导出地址
    function exportStatistic(data){
        BusMgrStatistic.exportSaleStatistic(data).then( function (response){
            if(response.code == 0){
                $scope.file_path = response.data.file_path;
                // var newData = {};
                // newData['file_path'] = $scope.file_path;
                $scope.file_path = response.data.file_path;
                var url = apiUrl.url+"/count/downloadFile?file_path="+$scope.file_path;
                window.open(url);
                //$scope.url = response.data.url;
            }else{
                $scope.allDataShow = false;
                SweetAlert.swal("",response.msg,"error");
            }
        })
    };
    $scope.exportSaleStatistic = function(){
        var data = {};
        data['store_sn'] = $scope.storeSn;
        data['type'] = 2;
        data['start_time'] = parseInt($scope.start_time.getTime() / 1000);
        data['end_time'] = parseInt($scope.end_time.getTime() / 1000);
        
        exportStatistic(data);
    }
   
    //turnYMD
    function turnYMD(timeStamp){
        var day = timeStamp.getFullYear() + "-" + (timeStamp.getMonth() + 1) + "-" + timeStamp.getDate();
        var time = " 00:00:00";
        var newTime = day + time;
        return parseInt(new Date(newTime).getTime()/1000);
    };
    // 关闭
    $scope.close = function(){
        $uibModalInstance.close();
    }
})




//消费统计
app.controller('recordModalInstanceCtrlBus',function ($scope,$localStorage,$uibModalInstance,storeSn,storeName,SweetAlert,BusMgrStatistic) {
    //>>>默认参数设置
    $scope.storeName = storeName;
    $scope.storeSn = storeSn;
    //消费记录
    $scope.recordMobile = '';

    //日期插件调用
    datePicker();
   
    //决算分页
    $scope.pageFlag = false;
    $scope.bigCurrentPage = 1;//当前页
    $scope.maxSize = 5;// 中间显示按钮数

    function getOrderRecords(data){
        BusMgrStatistic.getOrderRecords(data).then( function (response){
            if(response.code == 0){
                $scope.recordsLists = response.data.list;

                $scope.perPage = response.data.page_size;//每页条数
                $scope.bigTotalItems = response.data.total;//总共的数目
                $scope.maxPage = response.data.total_page;//最大页数
                $scope.bigCurrentPage = response.data.page;

            }else{
                SweetAlert.swal("",response.msg,"error");
            }
        })
    }
    //拼数据
    var data = {};
    data['store_sn'] = $scope.storeSn;
    data['start_time'] = turnYMD($scope.start_time);
    data['end_time'] = turnYMD($scope.end_time);
    data['page'] = 1;
    if(!!$scope.recordMobile){
        data['mobile'] = $scope.recordMobile;
    }else{

    }
    getOrderRecords(data);
    // 跳转
    $scope.setPage = function(){
        if($scope.reqPage <= 0 || $scope.reqPage > $scope.maxPage){
            return;
        }
        // 设置当前页数
        $scope.bigCurrentPage = $scope.reqPage;
        var data = {};
        data['store_sn'] = $scope.storeSn;
        data['start_time'] = turnYMD($scope.start_time);
        data['end_time'] = turnYMD($scope.end_time);
        data['page'] = $scope.bigCurrentPage;
        if(!!$scope.recordMobile){
            data['mobile'] = $scope.recordMobile;
        }else{
            
        }
        getOrderRecords(data);
    }
    // 监听分页数值变化
    $scope.$watch(function() {
            return $scope.bigCurrentPage;
        },
        function(newValue,oldValue) {
            // 拉取数据
            if($scope.pageFlag == true && $scope.bigCurrentPage == 1){
                $scope.pageFlag = false;
                return ;
            }
            $scope.pageFlag = false;
            var data = {};
            data['store_sn'] = $scope.storeSn;
            data['start_time'] = turnYMD($scope.start_time);
            data['end_time'] = turnYMD($scope.end_time);
            data['page'] = $scope.bigCurrentPage;
            if(!!$scope.recordMobile){
                data['mobile'] = $scope.recordMobile;
            }else{
                
            }
            getOrderRecords(data);
        },
        true
    );
    //监听start_time时间
    $scope.$watch(function() {
            return $scope.start_time;
        },
        function(newVal,oldVal) {
            if (newVal != oldVal) {
                var data = {};
                data['store_sn'] = $scope.storeSn;
                data['start_time'] = turnYMD($scope.start_time);
                data['end_time'] = turnYMD($scope.end_time);
                data['page'] = $scope.bigCurrentPage;
                if(!!$scope.recordMobile){
                    data['mobile'] = $scope.recordMobile;
                }else{
                    
                }
                getOrderRecords(data);
            }
        },
        true
    );
    //监听end_time时间
    $scope.$watch(function() {
            return $scope.end_time;
        },
        function(newVal,oldVal) {
            if (newVal != oldVal) {
                var data = {};
                data['store_sn'] = $scope.storeSn;
                data['start_time'] = turnYMD($scope.start_time);
                data['end_time'] = turnYMD($scope.end_time);
                data['page'] = $scope.bigCurrentPage;
                if(!!$scope.recordMobile){
                    data['mobile'] = $scope.recordMobile;
                }else{
                    
                }
                getOrderRecords(data);
            }
        },
        true
    );
    //改变既搜索
    $scope.enterEvent = function(e){
        var keycode = window.event?e.keyCode:e.which;
        if(keycode==13){
            $scope.clickEvent();
        }
    };
    $scope.clickEvent = function(){
        var data = {};
        if(!!$scope.recordMobile && $scope.recordMobile.length == 11){
            data['mobile'] = $scope.recordMobile;
            data['store_sn'] = $scope.storeSn;
            data['start_time'] = turnYMD($scope.start_time);
            data['end_time'] = turnYMD($scope.end_time);
            data['page'] = $scope.bigCurrentPage;
            getOrderRecords(data);
        }else if(!$scope.recordMobile){
            data['store_sn'] = $scope.storeSn;
            data['start_time'] = turnYMD($scope.start_time);
            data['end_time'] = turnYMD($scope.end_time);
            data['page'] = $scope.bigCurrentPage;
            getOrderRecords(data);
        }else{}  
    };
    $scope.changeMobile = function(){
        var data = {};
        if(!!$scope.recordMobile && $scope.recordMobile.length == 11){
            data['mobile'] = $scope.recordMobile;
            data['store_sn'] = $scope.storeSn;
            data['start_time'] = turnYMD($scope.start_time);
            data['end_time'] = turnYMD($scope.end_time);
            data['page'] = $scope.bigCurrentPage;
            getOrderRecords(data);
        }else if(!$scope.recordMobile){
            data['store_sn'] = $scope.storeSn;
            data['start_time'] = turnYMD($scope.start_time);
            data['end_time'] = turnYMD($scope.end_time);
            data['page'] = $scope.bigCurrentPage;
            getOrderRecords(data);
        }else{}   
        
    };

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
    };
    //<<<消费记录
    // 关闭
    $scope.close = function(){
        $uibModalInstance.close();
    }

   
})
//结算
app.controller('settleModalInstanceCtrlBus',function ($scope,$localStorage,$uibModalInstance,storeSn,storeName,SweetAlert,BusMgrStatistic,storeStatisticController) {
    //>>>默认参数设置
    $scope.storeName = storeName;
    $scope.storeSn = storeSn;
    //结算
    $scope.price = 0;
    $scope.settlePrice = 0;
    $scope.settleCharge = 0;
    $scope.operator = '';
    $scope.notice = '';
    $scope.readOnly = true;

    //日期插件调用
    datePicker();

    //获取 上次 结算 时间
    function getSettleSummary(data){
        BusMgrStatistic.getSettleSummary(data).then( function (response){
            if(response.code == 0){
               $scope.saleTotalData = response.data;
               $scope.start_time = new Date($scope.saleTotalData.last_settlement_date);
               
            }else{
                SweetAlert.swal("",response.msg,"error");
            }
        })
    }
    //上次结算时间
    var settleData = {};
    settleData['store_sn'] = $scope.storeSn;
    getSettleSummary(settleData);
    //获取结算金额
    function getSettlePrice(data){
        BusMgrStatistic.getSettlePrice(data).then( function (response){
            if(response.code == 0){
               $scope.allTotalMoney = response.data;

               $scope.price = $scope.allTotalMoney.price;
               $scope.settleCharge = $scope.allTotalMoney.settleCharge;
               $scope.settlePrice = $scope.allTotalMoney.settlePrice;
            }else{
                SweetAlert.swal("",response.msg,"error");
            }
        })
    };
    //新增结算
    function addSettleRecords(data){
        BusMgrStatistic.addSettleRecords(data).then( function (response){
            if(response.code == 0){
               $scope.allTotalMoney = response.data;
               $scope.price = $scope.allTotalMoney.price;
               $scope.settleCharge = $scope.allTotalMoney.settleCharge;
               $scope.settlePrice = $scope.allTotalMoney.settlePrice;
               $uibModalInstance.close();
               var recordData = {};
               recordData['page'] = 1;
               storeStatisticController.getSettleRecord(recordData);
            }else{
                SweetAlert.swal("",response.msg,"error");
            }
        });


    };
    //结算
    $scope.settle = function(){
        var data = {};
        data['store_sn'] = $scope.storeSn;
        data['start_time'] = turnYMD($scope.start_time);
        data['end_time'] = turnYMD($scope.end_time);
        data['price'] = $scope.price;
        data['settle_price'] = $scope.settlePrice;
        data['operator'] = $scope.operator;
        data['notice'] = $scope.notice;
        if(!!$scope.operator && !!$scope.notice){
            addSettleRecords(data)
        }else{
            SweetAlert.swal("","结算人或备注不能为空","error");
        }
        
    };
    //监听end_time时间
    $scope.$watch(function() {
            return $scope.end_time;
        },
        function(newVal,oldVal) {
            if (newVal != oldVal) {
                var yesterday = new Date(new Date().getTime()-86400000);
                var youngday = $scope.start_time;
                console.log(youngday);
                if(turnYMD(newVal) > turnYMD(yesterday)){
                    $scope.end_time = yesterday;
                    SweetAlert.swal("","结算时间不能超过今天","error");
                }else if(turnYMD(newVal) < turnYMD(youngday)){
                    $scope.end_time = "";
                    SweetAlert.swal("","结算时间小于上次结算时间","error");
                }else{
                    var data = {};
                    data['store_sn'] = $scope.storeSn;
                    //console.log($scope.start_time);
                    data['start_time'] = turnYMD($scope.start_time);
                    data['end_time'] = turnYMD($scope.end_time);
                    getSettlePrice(data);
                }
                
            }
        },
        true
    );

    //turnYMD
    function turnYMD(timeStamp){
        var day = timeStamp.getFullYear() + "-" + (timeStamp.getMonth() + 1) + "-" + timeStamp.getDate();
        var time = " 00:00:00";
        var newTime = day + time;
        return parseInt(new Date(newTime).getTime()/1000);
    };
    //日期插件   
    function datePicker(){
        $scope.today = function() {
            $scope.start_time = "";
            $scope.end_time = "";  
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

    // 关闭
    $scope.close = function(){
        $uibModalInstance.close();
    }
    //init
    //getLastSettleTime();
})