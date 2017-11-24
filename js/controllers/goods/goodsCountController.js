app
.controller('goodsCountController',function ($scope,$timeout,$rootScope,SweetAlert,$uibModal,$localStorage,Auth,myService,GoodsCount,$localStorage,apiUrl) {
    var token = Auth.getLocalData("token");
    var store_sn = Auth.getLocalData("store_sn");
    $scope.test = "goodsCount";
    var token = Auth.getLocalData("token");



    datePicker();//获取初始时间
    GetStoreList();//获取门店列表
    // 请求门店列表
    function GetStoreList(){
        var data = {
        };
        GoodsCount.GetStoreList(data).then(function(response){
            if(response.code  == 0){
                $scope.storeListData = response.data;
                $scope.store = $scope.storeListData[0]  
                //获取列表
                var data = {};
                data['start_time'] = parseInt($scope.start_time.getTime()/1000);
                data['end_time'] = parseInt($scope.end_time.getTime()/1000);
                data['store_sn'] = $scope.store.store_sn;
                data['page'] = 1;
                businessStatistics(data);
            }else{
                var msg = response.msg;
                SweetAlert.swal("",msg,"error");
            }
        })
    };
    // 分页设置
    $scope.maxSize = 5;
    // $scope.perPage = 10;          //每页十条
    // $scope.bigCurrentPage = 1;    //初始化开始最大页数  当前页
    // //获取最大页数，总条数，每页条数
    // //最大页数
    // $scope.maxPage = 10;
    // // 总条数
    // $scope.bigTotalItems = 100;
    // // 每页条数
    // $scope.perPage = 10;

    //获取数据函数
    function businessStatistics(data){   	
        GoodsCount.getCountLists(data).then(function(response){
            console.log(response);
            if(response.code  == 0){
                $scope.goodCountLists = response.data;
                $scope.goodCountList = response.data.data;
                console.log($scope.goodsOrderSta);

                // $scope.bigCurrentPage = $scope.goodCountLists.bigCurrentPage;//当前页
                // $scope.maxPage = $scope.goodCountLists.total_page;//最大页数
                // $scope.bigTotalItems = $scope.goodCountLists.total;//总条数
                // $scope.perPage = $scope.goodCountLists.page_size;//每页条数

                $scope.bigCurrentPage = $scope.goodCountLists.current_page;//当前页
                $scope.maxPage = $scope.goodCountLists.total_page;//最大页数
                $scope.bigTotalItems = $scope.goodCountLists.total;//总条数
                $scope.perPage = $scope.goodCountLists.page_size;//每页条数
                
                
                
            }else{
                SweetAlert.swal("",response.msg,"error");
            }
        })
    };
    // var data = {};
    // data['start_time'] = $scope.start_time;
    // data['end_time'] = $scope.start_time;
    // data['store_sn'] = $scope.store;
    //businessStatistics();

    //监听start_time时间
    $scope.$watch(function() {
            return $scope.start_time;
        },
        function(newVal,oldVal) {
            if(newVal != oldVal){
                var newData = {};
                newData['start_time'] = parseInt($scope.start_time.getTime()/1000);
                newData['end_time'] = parseInt($scope.end_time.getTime()/1000);
                newData['store_sn'] = $scope.store.store_sn;
                newData['page'] = $scope.bigCurrentPage;
                businessStatistics(newData);
            }
        },
        true
    );
    //监听begin_time时间
    $scope.$watch(function() {
            return $scope.end_time;
        },
        function(newVal,oldVal) {
            if(newVal != oldVal){
                var newData = {};
                newData['start_time'] = parseInt($scope.start_time.getTime()/1000);
                newData['end_time'] = parseInt($scope.end_time.getTime()/1000);
                newData['store_sn'] = $scope.store.store_sn;
                newData['page'] = $scope.bigCurrentPage;
                businessStatistics(newData);
            }
        },
        true
    );
    //切换门店
    $scope.changeStore = function(){
        //获取列表
        var newData = {};
        newData['start_time'] = parseInt($scope.start_time.getTime()/1000);
        newData['end_time'] = parseInt($scope.end_time.getTime()/1000);
        newData['store_sn'] = $scope.store.store_sn;
        newData['page'] = $scope.bigCurrentPage;
        businessStatistics(newData);
    };
    $scope.setPageChange = true;
    //分页跳转
    $scope.setPage = function(){
        if($scope.reqPage>$scope.maxPage || $scope.reqPage<1){

        }else{
            console.log(1111);
            $scope.bigCurrentPage = $scope.reqPage;
            $scope.setPageChange = false;
            var newData = {};
            newData['start_time'] = parseInt($scope.start_time.getTime()/1000);
            newData['end_time'] = parseInt($scope.end_time.getTime()/1000);
            newData['store_sn'] = $scope.store.store_sn;
            newData['page'] = $scope.bigCurrentPage;
            businessStatistics(newData);
        }
    }
    //监听分页
    $scope.$watch(function() {
            return $scope.bigCurrentPage;
        },
        function(newVal,oldVal) {
            if(newVal != oldVal){
                if(!!$scope.setPageChange){
                    var newData = {};
                    newData['start_time'] = parseInt($scope.start_time.getTime()/1000);
                    newData['end_time'] = parseInt($scope.end_time.getTime()/1000);
                    newData['store_sn'] = $scope.store.store_sn;
                    newData['page'] = $scope.bigCurrentPage;
                    businessStatistics(newData);
                }else{
                    $scope.setPageChange = true;
                }
            }
        },
        true
    );
    //导出  user
    $scope.getDocBtn = function(){
        var url = apiUrl.commonUrl+"/bz/goods/count/list/excel/get?store_sn="+ $scope.store.store_sn +"&start_time=" +parseInt($scope.start_time.getTime()/1000)+"&end_time="+parseInt($scope.end_time.getTime()/1000)+"&token="+token;
        window.open(url);
    };
    



    //日期插件
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
    };
});