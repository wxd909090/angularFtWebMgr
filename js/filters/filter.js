app.filter("turnTime",function(){
    return function(input){
        if(input > 1440){
            input = input - 1440
        };
        var out = "";
        var hours = parseInt(input/60);
        var minutes = (input % 60);
        if(minutes <10){
        	minutes = "0" + "" + minutes
        }
        out = hours + ":" + minutes;
        return out;
    }
});
app.filter("turnDate",function(){
    return function(input){
        var out = "0";
        out = getLocalTime(input)
        function getLocalTime(time) {     
            return new Date(parseInt(time) * 1000).getFullYear() + "." + (new Date(parseInt(time) * 1000).getMonth() + 1) + "." + new Date(parseInt(time) * 1000).getDate()
        } 
        return out;
    }
});
app.filter("turnDateMD",function(){
    return function(input){
        var out = "0";
        var weekday=new Array(7)
        weekday[0]="星期天";
        weekday[1]="星期一";
        weekday[2]="星期二";
        weekday[3]="星期三";
        weekday[4]="星期四";
        weekday[5]="星期五";
        weekday[6]="星期六";
        var week = weekday[new Date(parseInt(input) * 1000).getDay()]
        out = getLocalTime(input);
        function getLocalTime(time) {     
            return (new Date(parseInt(time) * 1000).getMonth() + 1) + "月" + new Date(parseInt(time) * 1000).getDate() + "号" + "-" + week;
        } 
        return out;
    }
});
app.filter("turnDateYM",function(){
    return function(input){
        var out = "0";
        out = getLocalTime(input)
        function getLocalTime(time) {     
            return new Date(parseInt(time) * 1000).getFullYear() + "." + (new Date(parseInt(time) * 1000).getMonth() + 1) 
        } 
        return out;
    }
});
app.filter("turnText",function(){
    return function(input){
        var out = "";
        if(input == 1){
            out = "推荐"
        }else{
            out = "不推荐"
        }
        return out;
    }
})
app.filter("turnDateYMD",function(){
    return function(input){
        if(input == 0){
            return ""
        }
        var out = "0";
        out = getLocalTime(input)
        function getLocalTime(time) {
            var date = new Date(parseInt(time) * 1000);
            return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        } 
        return out;
    }
});
app.filter("turnDateHMS",function(){
    return function(input){
        if(!input || input == "0" || input == 0){
            return ""
        }
        var out = "0";
        out = getLocalTime(input)
        function getLocalTime(nS) {     
           return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');     
        }   
        return out;
    }
});
app.filter("getStatus",function(){
    return function(input){
        var out = "";
        switch (input) {
            case '0': 
                out = "未付款"
                break;
            case '1': 
                out = "已付款"
                break;
            case '2':
                out = "观影中"
                break;
            case '3':
                out = "已完成"
                break;
            case '4':
                out = "已退款"
                break;
            case '5':
                out = "已过期"
                break;
            case '6':
                out = "未观影"
                break;
            case '7':
                out = "未打扫"
                break;
            default: 
                out = "暂无"
        }
        return out;
    }
});
app.filter("getStatus2",function(){
    return function(input){
        var out = "";
        switch (input) {
            case '0': 
                out = "未支付"
                break;
            case '1': 
                out = "已支付"
                break;
            case '2':
                out = "已过期"
                break;
            default: 
                out = "暂无"
        }
        return out;
    }
});
// 管理员状态过滤器
app.filter("turnStaffStatus",function(){
    return function(input){
        var out = "";
        switch (Number(input)) {
            case 0:
                out = "正常"
                break;
            case 1:
                out = "禁用"
                break;
            default: 
                out = "正常"
        }
        return out;
    }
});
// 优惠码是否使用过滤器
app.filter("codeStatus",function(){
    return function(input){
        var out = "";
        switch (Number(input)) {
            case 0:
                out = "未使用"
                break;
            case 1:
                out = "已使用"
                break;
            default: 
                out = "未使用"
        }
        return out;
    }
})
// 消费方式过滤器
app.filter("payTypeStatus",function(){
    return function(input){
        var out = "";
        switch (Number(input)) {
            case 0:
                out = "微信"
                break;
            case 8:
                out = "优惠码"
                break;
            case 1:
                out = "会员卡"
                break;
            default: 
                out = "微信"
        }
        return out;
    }
})
// 优惠码第几期过滤器
app.filter("group_numStatus",function(){
    return function(input){
        var out = "";
        out = "第" + input + "期";
        return out;
    }
})


// 模板
app.filter("dateStatus",function(){
    return function(input){
        var out = "";
        switch (Number(input)) {
            case 0:
                out = "平日"
                break;
            case 1:
                out = "周末"
                break;
            default: 
                out = "平日"
        }
        return out;
    }
})

app.filter("getRecordStatus",function(){
    return function(input){
        var out = "";
        switch (Number(input)) {
            case 1:
                out = "未完成"
                break;
            case 2:
                out = "已完成"
                break;
            case 3:
                out = "已完成"
                break;
            case 4:
                out = "已退款"
                break;
            case 6:
                out = "已完成"
                break;
            case 7:
                out = "已完成"
                break;
            default:
                out = "暂无"
        }
        return out;
    }
});

// 模板
app.filter("appType",function(){
    return function(input){
        var out = "";
        switch (input) {
            case "movie_sync":
                out = "电影同步"
                break;
            case "upgrade":
                out = "更新APP"
                break;
            default: 
                out = "电影同步"
        }
        return out;
    }
})
// 模板
app.filter("isBindStatus",function(){
    return function(input){
        var out = "";
        switch (Number(input)) {
            case 1:
                out = "未绑定"
                break;
            case 2:
                out = "已绑定"
                break;
            default: 
                out = "未绑定"
        }
        return out;
    }
})

// app状态
app.filter("appStatus",function(){
    return function(input){
        var out = "";
        switch (Number(input)) {
            case 1:
                out = "禁用中"
                break;
            case 2:
                out = "启用中"
                break;
            default: 
                out = "禁用中"
        }
        return out;
    }
})

// 男女
app.filter("sexStatus",function(){
    return function(input){
        var out = "";
        switch (Number(input)) {
            case 0:
                out = "男"
                break;
            case 1:
                out = "女"
                break;
            default: 
                out = "男"
        }
        return out;
    }
})

// 商品上下架状态
app.filter("goodsStatus",function(){
    return function(input){
        var out = "";
        switch (Number(input)) {
            case 1:
                out = "上架"
                break;
            case 2:
                out = "下架"
                break;
            default: 
                out = "上架"
        }
        return out;
    }
})

// 商品是否热销状态
app.filter("goodsHot",function(){
    return function(input){
        var out = "";
        switch (Number(input)) {
            case 1:
                out = "热销"
                break;
            case 2:
                out = "不热销"
                break;
            default: 
                out = "热销"
        }
        return out;
    }
})
// 支付方式
app.filter("payMethod",function(){
    return function(input){
        var out = "";
        switch (input) {
            case "0":
                out = "微信"
                break;
            case "1":
                out = "会员卡"
                break;
            case "2":
                out = "优惠抵用卷"
                break;
            case "3":
                out = "充值金额"
                break;
            case "4":
                out = "积分"
                break;
            case "5":
                out = "系统赠送"
                break;
            default: 
                out = "微信"
        }
        return out;
    }
})
// 配送方式
app.filter("distributionMethod",function(){
    return function(input){
        var out = "";
        switch (Number(input)) {
            case 1:
                out = "商家配送"
                break;
            case 2:
                out = "前台自取"
                break;
            default: 
                out = "前台自取"
        }
        return out;
    }
})
//时间戳转时间
app.filter("turnYMDHMS",function(){
    return function(input){
        if(input == 0){
            return ""
        }
        var out = "0";
        out = getLocalTime(input)
        function getLocalTime(time) {
            var date = new Date(parseInt(time) * 1000);
            var hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
            var minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
            var second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
            return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()+" "+hour+":"+minute+":"+second;
        } 
        return out;
    }
})
//状态
app.filter("turnState",function(){
    return function(data){
        var out = "";
        if(data == 1){
            out = "未支付";
        }else if(data == 2){
            out = "支付中";
        }else if(data == 3){
            out = "已支付";
        }else if(data == 4){
            out = "出库/运输过程中";
        }else if(data == 5){
            out = "订单确认完成";
        }else if(data == 6){
            out = "已取消";
        }else if(data == 7){
            out = "退款中";
        }else if(data == 8){
            out = "退款完成";
        }
        return out;
    }
})
//商品支付类型
// 0 微信  1 会员卡 2 支付宝 3优惠抵用券  4 积分 5 系统赠送
app.filter("goodsPayType",function(){
    return function(data){
        var out = "";
        if(data == 0){
            out = "微信";
        }else if(data == 1){
            out = "会员卡";
        }else if(data == 2){
            out = "支付宝";
        }else if(data == 3){
            out = "优惠抵用券";
        }else if(data == 4){
            out = "积分";
        }else if(data == 5){
            out = "系统赠送";
        }
        return out;
    }
})