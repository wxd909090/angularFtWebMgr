function getDurationTime(date){
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    if(hours < 10){
        hours = "0" + hours
    }
    if(minutes < 10){
        minutes = "0" + minutes
    }
    return {
        hoursMinutes : Number(hours*60) + Number(minutes)
    }
}

// 日期转化为yyyy-mm-dd
function dateFilter(date){
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    if(month < 10){
        month = "0" + month
    };
    var day = date.getDate();
    var newDate = year + "-" + month + "-" + day;
    return newDate;
}

// 提示框
function tipBoxController(scope,text,display){
    scope.tipBox = display;
    scope.tipBoxText = text;
}

// 对象之间赋值,更新数据使用
function upDateInfo(objInput,objOut){
    for(var i = 0;i < Object.getOwnPropertyNames(objInput).length;i++){
        var attr = Object.getOwnPropertyNames(objInput)[i];
        objOut[attr] = objInput[attr]
    }
}

// 日期戳返回
function getTodayTime(date){
    if(!date){
        return ""
    }
    var getDate = new Date(date);
    var year = getDate.getFullYear();
    var month = getDate.getMonth();
    var day = getDate.getDate();
    getDate = new Date(year,month,day);
    // 返回今日时间戳
    return parseInt(getDate.getTime()/1000);
}

// 日期戳返回    +8小时
function getTodayTime8(date){
    if(!date){
        return ""
    }
    var getDate = new Date(date);
    var year = getDate.getFullYear();
    var month = getDate.getMonth();
    var day = getDate.getDate();
    getDate = (new Date(year,month,day).setHours(8,0,0,0))/1000;
    return parseInt(getDate);
}

//检查表单是否改变
function formCheckChange(scope,data) {
    scope.$watch(function() {
            return data;
        },
        function(newValue,oldValue) {
            if(newValue !== oldValue){
                scope.flagSubmit =  true;
            }else{
                scope.flagSubmit =  false;
            }
        },
        true
    );
}

//检查表单是否改变
function formCheckChange2(scope,x,y) {
    scope.$watch(function() {
            return x;
        },
        function(newValue,oldValue) {
            if(newValue !== oldValue){
                scope.flagSubmit =  true;
            }
        },
        true
    );
    scope.$watch(function() {
            return y;
        },
        function(newValue,oldValue) {
            if(newValue !== oldValue){
                scope.flagSubmit =  true;
            }else{
                scope.flagSubmit =  false;
            }
        },
        true
    );
}


// 编辑参数转换
// obj1原始数据
// obj2修改后提交的数据
// obj3返回修改的数据
function getDiffObj(obj1,obj2) {
    // body...
    var obj3 = {};
    for(var i in obj1){
        if(obj1[i] != obj2[i]){
            obj3[i] = obj2[i]
        }
    }
    return obj3
}
function delEmptyAttr(obj) {
    for(var x in obj){
        if(obj[x] === "" || obj[x] === null || obj[x] === undefined){
            delete obj[x]
        }
    }
}


function getDurationTime2(input){
    input = input.split(":");
    input = Number(input[0]*60) + Number(input[1]);
    return input;
}

function getDurationTime3(input){
    var inputGet = Number(input);
    if(inputGet >= 1440){
        inputGet = inputGet - 1440;
    }
    var hours = parseInt(inputGet/60);
    var min = parseInt(inputGet%60);
    if(min < 10){
        min = "0" + min;
    }
    var out = hours + ":" + min;
    return out;
}

// 删除数组中的某个元素
function removeByValue(arr, val) {
    for(var i=0; i<arr.length; i++) {
        if(arr[i] == val) {
            arr.splice(i, 1);
            break;
        }
    }
}

// 时间模板
function getDateType(input){
    var out = "";
    switch (input) {
        case "平日":
            out = 0
            break;
        case "周末":
            out = 1
            break;
        default: 
            out = 0
    }
    return out;
}


// 日期插件调用
function datePicker($scope){
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
function delEmptyAttr(obj) {
    for(var x in obj){
        if(obj[x] === "" || obj[x] === null || obj[x] === undefined){
            delete obj[x]
        }
    }
}
function getDurationTime2(input){
    input = input.split(":");
    input = Number(input[0]*60) + Number(input[1]);
    return input;
}

function getDurationTime3(input){
    var inputGet = Number(input);
    if(inputGet >= 1440){
        inputGet = inputGet - 1440;
    }
    var hours = parseInt(inputGet/60);
    var min = parseInt(inputGet%60);
    if(min < 10){
        min = "0" + min;
    }
    var out = hours + ":" + min;
    return out;
}

// 删除数组中的某个元素
function removeByValue(arr, val) {
    for(var i=0; i<arr.length; i++) {
        if(arr[i] == val) {
            arr.splice(i, 1);
            break;
        }
    }
}

// 时间模板
function getDateType(input){
    var out = "";
    switch (input) {
        case "平日":
            out = 0
            break;
        case "周末":
            out = 1
            break;
        default: 
            out = 0
    }
    return out;
}


// 日期插件调用
function datePicker($scope){
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
function delEmptyAttr(obj) {
    for(var x in obj){
        if(obj[x] === "" || obj[x] === null || obj[x] === undefined){
            delete obj[x]
        }
    }
}

//时间戳转js日期
function getDate(tm){ 
    var tt=new Date(parseInt(tm) * 1000); 
    return tt; 
}

// 判断是否是空对象
function isEmpty(obj)
{
    for (var name in obj)
    {
    return false;
    }
    return true;
};

//手机号码

//验证规则：11位数字，以1开头。

function checkMobile(str) {
    var re = /^1\d{10}$/
    if (re.test(str)) {
        return true;
    } else {
        return false;
    }
}
