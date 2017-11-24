app
.controller('goodsOrderStaController',function ($scope,$timeout,$rootScope,SweetAlert,$uibModal,$localStorage,Auth,$localStorage,apiUrl,GoodsOrderSta) {
    var token = Auth.getLocalData("token");
    // 分页设置
    $scope.maxSize = 5;
    $scope.bigCurrentPage = 1;    //当前页
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
    //初始化 类型  按天
    $scope.saleType = 1;
    
    // 请求门店列表
    function GetStoreList(){
        var data = {
        };
        GoodsOrderSta.GetStoreList(data).then(function(response){
            if(response.code  == 0){
                $scope.storeListData = response.data;
                $scope.store = $scope.storeListData[0] 
                //获取默认天和默认门店的统计
                //组合数据
                var data = {};
                data['store_sn'] =  $scope.store.store_sn;
                data['type'] =  $scope.saleType;
                //console.log(data);
                getOrderLists(data);
            }else{
                var msg = response.msg;
                SweetAlert.swal("",msg,"error");
            }
        })
    };
    GetStoreList();
    
    //获取数据函数
    function getOrderLists(data){
        GoodsOrderSta.getOrderLists(data).then(function(response){
            console.log(response);
            if(response.code  == 0){
                $scope.goodsOrderSta = response.data;
                $scope.goodsOrderStaLists = response.data.data;
                //$scope.newGoodsOrderStaLists = $scope.dealMess($scope.goodsOrderStaLists);
                console.log($scope.goodsOrderStaLists);
                // 获取最大页数，总条数，每页条数
                //最大页数
                $scope.maxPage = $scope.goodsOrderSta.total_page;
                // 总条数
                $scope.bigTotalItems = $scope.goodsOrderSta.total;
                // 每页条数
                $scope.perPage = $scope.goodsOrderSta.page_size;
            }else{
                SweetAlert.swal("",response.msg,"error");
            }
        })
    };
    $scope.copy = function(obj){
        var newObj = {};
      for (var item in obj){
        newObj[item] = obj[item];
      } 
      return newObj;
    }
    //businessStatistics();
    //切换门店
    $scope.changeStore = function(data){
        //组合数据
        var data = {};
        data['store_sn'] =  $scope.store.store_sn;
        data['type'] =  $scope.saleType;
        //console.log(data);
        getOrderLists(data);
    }
    //天周日切换
    $scope.changeSaleStatistic = function(){
        console.log($scope.saleType);
        //组合数据
        var data = {};
        data['store_sn'] =  $scope.store.store_sn;
        data['type'] =  $scope.saleType;
        // console.log(saleType);
        getOrderLists(data);
    }
    $scope.setPageSign = true;
    //分页
    $scope.$watch(function() {
            return $scope.bigCurrentPage;
        },
        function(newValue,oldValue) {
            if(newValue != oldValue){
                var data = {};
                data['store_sn'] =  $scope.store.store_sn;
                data['type'] =  $scope.saleType;;
                data['page'] =  $scope.bigCurrentPage;
                getOrderLists(data);
            }
        },
        true
    );
    //跳转页
    $scope.setPage = function(){
        if($scope.reqPage>$scope.maxPage || $scope.reqPage<1){

        }else{
            $scope.bigCurrentPage = $scope.reqPage;
        }
    }
    //导出
    $scope.getDocBtn = function () {
        
        var url = apiUrl.commonUrl+"/bz/store_retail_order/export_store_order_statistic?store_sn="+ $scope.store.store_sn +"&type=" +$scope.saleType+"&token="+token;
        window.open(url);

        // var data = {};
        // data['store_sn'] =  $scope.store.store_sn;
        // data['type'] =  $scope.saleType;
        // GoodsOrderSta.getOrderListsTable(data).then( function (response){
        //     if(response.code == 0){
        //         if(response.data.length == 0){
        //             SweetAlert.swal({
        //                 title: "",
        //                 text: "下载列表为空！",
        //                 timer: 1000,
        //                 showConfirmButton: false,
        //                 type : "warning"
        //             })
        //         // }else{
        //         //     var url = apiUrl.url + "/" + response.data.url + "?file_path=" + response.data.file_path;
        //         //     window.open(url);
        //         }
        //     }else{
        //         SweetAlert.swal("",response.msg,"error");
        //     }
        // })
    }

    //切换时间
    //绑定change事件
    // $scope.SelectChangeWeek = function(){
    //     console.log($scope.selectedWeek);
    //     $scope.selectedMoth = "";
    //     $scope.checkDate = "";
    // };
    // $scope.SelectChangeMoth = function(){
    //     console.log($scope.selectedMoth);
    //     $scope.selectedWeek = "";
    //     $scope.checkDate = "";
    // };
    // $scope.checkDateChange = function(checkDate){
    //     console.log($scope.checkDate);
    //     $scope.selectedMoth = "";
    //     $scope.selectedWeek = "";
    // }

    /*
    // 获得时间 
    //获取天
    function getTimeData(x){
        if(x){
            x = x / 1000;
            return x;
        }else{
            return "";
        }
    };
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
    datePicker();

    //获取周，月 
    var now = new Date(); //当前日期
    var nowDayOfWeek = now.getDay(); //今天本周的第几天
    var nowDay = now.getDate(); //当前日
    var nowMonth = now.getMonth(); //当前月
    var nowYear = now.getYear(); //当前年
    nowYear += (nowYear < 2000) ? 1900 : 0; //
    var lastMonthDate = new Date(); //上月日期
    lastMonthDate.setDate(1);
    lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
    var lastYear = lastMonthDate.getYear();
    var lastMonth = lastMonthDate.getMonth();

    //获得今天的日期
    function  getodayDate(){
        var toDate = new Date(nowYear, nowMonth, nowDay);
        return formatDate(toDate);
    }

    // 获取6个月的 年月列表
    function getMyMoth(){
        var myMoth = new Array;
        for(var i=1;i<= 6;i++){
            var year = nowYear;
            var moth = nowMonth - i+1;
            if (moth <= 0){
                year = nowYear-1;
                moth = 12+moth;
            }
            myMoth.push(year+'-'+(moth < 10 ? ('0' + moth) : moth));
        }
        return myMoth;
    }

    //获取26周的每周的起始日期、截止日期
    function getMyWeek(){
        var now = new Date();
        var AddDayCount = now.getDay();
        if (AddDayCount == 0 ){
            AddDayCount = 7;
        }
        now.setDate(now.getDate() - AddDayCount);//获取AddDayCount天后的日期
        var nowYear = now.getFullYear();
        var nowMonth = now.getMonth() + 1;
        var day = now.getDate();
        var endTime = nowYear + "-" + (nowMonth < 10 ? ('0' + nowMonth) : nowMonth) +"-" + (day < 10 ? ('0' + day) : day);
        //var begTime = getthedate(endTime,6);
        //console.log('周一:'+begTime+'周日:'+endTime);//周一做为下周的开始计算
        var weekDay = new Array;
        for (var i=0;i<26 ;i++){
            var weekEnd = endTime;
            var weekBeg = getthedate(endTime,6);
            var str = weekBeg+'—'+weekEnd;
            endTime = getthedate(weekBeg,1);
            weekDay.push(str);
        }
        return weekDay
    }
    // 获取某个月的起始日期、截止日期
    function getBegEndTime(selected){
        var selectedArr = selected.split('-');
        var year = parseInt(selectedArr[0]);
        var moth = parseInt(selectedArr[1]);
        var days = getDaysInMonth(year,moth);
        var begTime = year+'-'+moth+'-01';
        var endTime = year+'-'+moth+'-'+days;

        return [begTime,endTime];
    }
    // 获取指定年月的当月天数
    function getDaysInMonth(year,month){
        month = parseInt(month,10); //parseInt(number,type)这个函数后面如果不跟第2个参数来表示进制的话，默认是10进制。
        var temp = new Date(year,month,0);
        var days = temp.getDate();
        return days;
    }
    //获取某天的前n天的的日期
    function getthedate(day,n)
    {
        //可以加上错误处理
        var a = new Date(day);
        a = a.valueOf();
        a = a - n * 24 * 60 * 60 * 1000;
        a = new Date(a);
        var m = a.getMonth() + 1;
        if(m.toString().length == 1){
            m='0'+m;
        }
        var d = a.getDate();
        if(d.toString().length == 1){
            d='0'+d;
        }
        return a.getFullYear() + "-" + m + "-" + d;
    }
    //格式化日期：yyyy-MM-dd
    function formatDate(date) {
        var myyear = date.getFullYear();
        var mymonth = date.getMonth() + 1;
        var myweekday = date.getDate();

        if (mymonth < 10) {
            mymonth = "0" + mymonth;
        }
        if (myweekday < 10) {
            myweekday = "0" + myweekday;
        }
        return (myyear + "-" + mymonth + "-" + myweekday);
    }
    //获得某月的天数
    function getMonthDays(myMonth) {
        var monthStartDate = new Date(nowYear, myMonth, 1);
        var monthEndDate = new Date(nowYear, myMonth + 1, 1);
        var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
        return days;
    }
    //获得本季度的开始月份
    function getQuarterStartMonth() {
        var quarterStartMonth = 0;
        if (nowMonth < 3) {
            quarterStartMonth = 0;
        }
        if (2 < nowMonth && nowMonth < 6) {
            quarterStartMonth = 3;
        }
        if (5 < nowMonth && nowMonth < 9) {
            quarterStartMonth = 6;
        }
        if (nowMonth > 8) {
            quarterStartMonth = 9;
        }
        return quarterStartMonth;
    }
    //获得昨天的日期
    function  getYesterdayDate(){
        var yesterdayDate = new Date(nowYear, nowMonth, nowDay-1);
        return formatDate(yesterdayDate);
    }
    //获得本周的开始日期
    function getWeekStartDate() {
        var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek+1);
        return formatDate(weekStartDate);
    }
    //获得本周的结束日期
    function getWeekEndDate() {
        var weekEndDate = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek)+1);
        return formatDate(weekEndDate);
    }
    //获得本月的开始日期
    function getMonthStartDate() {
        var monthStartDate = new Date(nowYear, nowMonth, 1);
        return formatDate(monthStartDate);
    }
    //获得本月的结束日期
    function getMonthEndDate() {
        var monthEndDate = new Date(nowYear, nowMonth, getMonthDays(nowMonth));
        return formatDate(monthEndDate);
    }
    //获得上月开始时间
    function getLastMonthStartDate() {
        var lastMonthStartDate = new Date(nowYear, lastMonth, 1);
        return formatDate(lastMonthStartDate);
    }

    //获得上月结束时间
    function getLastMonthEndDate() {
        var lastMonthEndDate = new Date(nowYear, lastMonth, getMonthDays(lastMonth));
        return formatDate(lastMonthEndDate);
    }
    //获得本季度的开始日期
    function getQuarterStartDate() {
        var quarterStartDate = new Date(nowYear, getQuarterStartMonth(), 1);
        return formatDate(quarterStartDate);
    }
    //或的本季度的结束日期
    function getQuarterEndDate() {
        var quarterEndMonth = getQuarterStartMonth() + 2;
        var quarterStartDate = new Date(nowYear, quarterEndMonth, getMonthDays(quarterEndMonth));
        return formatDate(quarterStartDate);
    }
    $scope.myMoth = getMyMoth();
    $scope.myWeek = getMyWeek();
    */
});