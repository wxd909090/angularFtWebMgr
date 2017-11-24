app
.controller('userAnalysisController',function ($scope,$timeout,$rootScope,Auth,$localStorage,UserAnalysis,SweetAlert) {

    var token = Auth.getLocalData("token");
    // 日期框model
    $scope.dateDay = { startDate: moment().subtract(1, 'day'), endDate: moment().subtract(0, 'day') };
        // 配置日期功能按钮
    $scope.rangesDate = {
        '今天': [moment(), moment()],
        '昨天': [moment().subtract(1,'days'), moment().subtract(1,'days')],
        '最近7天': [moment().subtract(7,'days'), moment()],
        '最近一个月': [moment().subtract(30,'days'), moment()],
        '这个月': [moment().startOf('month'), moment().endOf('month')]
    };

    function  getNowTime(){
        var nowDate = $scope.dateDay.startDate._d
        nowDate.setHours(0,0,0,0)
        var localTime = (nowDate.getTime())/1000;
        return localTime
    }
    var todayTime = getNowTime();

    //获取用户列表
    $scope.GetUserNumber = function(begin_time,end_time){
        var data = {
            token : token,
            begin_time : begin_time,
            end_time : todayTime + 86400
        }
        UserAnalysis.GetUserNumber(data).then(function(response){
            console.log(response)
            if(response.code == 0){
                
            }else{
                SweetAlert.swal("",response.msg,"error");
            }
        })
    }
    $scope.GetUserNumber();
    // UserAnalysis.GetUserNumber(dataQ).then(function(response){
    //     console.log(response);
    // })
    // UserAnalysis.GetOrderTotle(dataQ).then(function(response){
    //     console.log(response);
    // })


	$scope.formDataType = "新增人数";
	$scope.changeSel = function(formDataType){
		$scope.optionUserAnalysis.legend.data[0] = formDataType;
		$scope.optionUserAnalysis.series[0].name = formDataType;
	}

	$scope.themes = ['vintage','default'];
    $scope.baseConfig = {
        theme:'vintage',
        dataLoaded:true
    };
    $scope.themeChanged = function(tn){
        $scope.theme = tn;
    };
    function onClick(params){
        console.log(params);
    };

    $scope.lineConfig = {
        theme:'default',
        event: [{click:onClick}],
        dataLoaded:true
    };
	// 初始化数据
    $scope.optionUserAnalysis = {
        tooltip : {
            trigger: 'axis'
        },
        // title : {
        //     x : "140px",
        //     y : "top",
        //     backgroundColor: 'rgba(0,0,0,0)',
        //     textStyle: {
        //         fontSize: 18,
        //         fontWeight: 'bolder',
        //         color: '#333'          // 主标题文字颜色
        //     },
        //     text : "用户分析"
        // },
        legend: {
            data:['用户数量']
        },
        toolbox: {
            show : true,
            feature : {
                mark : {show: true},
                dataView : {show: true, readOnly: false},
                magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                restore : {show: true},
                saveAsImage : {show: true}
            }
        },
        calculable : true,
        xAxis : [
            {
                type : 'category',
                boundaryGap : true,
                data : ['2017-1-1','2017-1-2','2017-1-3','2017-1-4','2017-1-5','2017-1-6','2017-1-7','2017-1-8','2017-1-9','2017-1-10']
            }
        ],
        yAxis : [
            {
                type : 'value'
            }
        ],
        series : [
            {
                name:'用户数量',
                type:'line',
                stack: '总量',
                data:[2, 5, 8, 2, 4, 6, 11, 23, 1, 11, 2, 5, 8, 2, 4, 6, 11, 23, 1, 11]
            },
        ]
    };








})