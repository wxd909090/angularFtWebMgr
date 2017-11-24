app
.controller('filmController',function ($scope,$timeout,$rootScope,Auth,SweetAlert,$localStorage,$uibModal,Film,StoreList) {
    var token = Auth.getLocalData("token");
    
    $scope.tipBox = false;
    $scope.allFilmData = [];
    $scope.recommend = 0;
    $scope.store_sn = '';
    $scope.sotreName = '全部';
    // 默认选中
    $scope.checkMode1 = "btn btn-default active";
    $scope.checkMode2 = "btn btn-default";

    $scope.changeRecommend = function(){
        console.log($scope.allFilmData[0].filmListData.list.data[0].sort)
    }
    //获取电影列表
    $scope.GetFilmListData = function(page,token){
        var data = {
            token : token,
            page : page,
            key_word : $scope.keyWord,
            is_has_image:$scope.isHasImage
        };
        if(!data.key_word){
            delete(data.key_word);
        }
        if($scope.store_sn){
            data.store_sn = $scope.store_sn;
        }
        Film.GetFilmList(data).then(function(response){
            if(response.code == 0){
                // 将每一页数据缓存到一个数组中
                var data = {
                    current_page : response.data.list.current_page,
                    filmListData : response.data
                };
                $scope.allFilmData.push(data);

                // 分页配置
                $scope.maxSize = 5;
                $scope.bigTotalItems = response.data.list.total;
                $scope.maxPage = response.data.list.last_page;

                // 显示当前请求页数据
                $scope.showFilmData = $scope.allFilmData[0].filmListData;
                for(var q = 0;q < $scope.allFilmData.length;q++){
                    if($scope.allFilmData[q].current_page == response.data.list.current_page){
                        $scope.showFilmData = $scope.allFilmData[q].filmListData;
                    }
                };
            }else{
                SweetAlert.swal("",response.msg,"error");
            }
        })
    }
    function editBlackFilmLidt(data) {
        $scope.blackFilmListData = [];
        if(data.length > 6){
            var num =  Math.ceil(data.length / 6);
            var start = 0;
            var end = 6;
            for(var i = 0; i < num;i++){
                var tem =null;
                tem = data.slice(start,end);
                $scope.blackFilmListData.push(tem);
                start = end;
                end = 2 *end;
            }
        } else {
            $scope.blackFilmListData.push(data);
        }
    }
    function getBlackFilm() {
        var data = {
            token : token
        };
        Film.getBlackFilm(data).then(function(response){
            if(response.code == 0){
               $scope.blackFilmList = response.data;
                editBlackFilmLidt(response.data);
            }else{
                SweetAlert.swal("",response.msg,"error");
            }
        })
    }

    // 监听分页数值变化
    $scope.$watch(function() {
            return $scope.bigCurrentPage;
        },
        function(value) {
            if (value) {
                $scope.bigCurrentPage = value;
                value = Number(value);
                $scope.GetFilmListData(value,token)
            }
        },
        true
    );

    // 电影跳转页数
    $scope.setPage = function () {
        if($scope.reqPage > $scope.maxPage){
            return;
        }
        $scope.bigCurrentPage = $scope.reqPage;
    }

    // 点击电影
    $scope.clickFilm = function(){
        $scope.checkMode1 = "btn btn-default active";
        $scope.checkMode2 = "btn btn-default";
    };

    // 点击黑名单
    $scope.clickBlackFilm = function(){
        $scope.checkMode1 = "btn btn-default";
        $scope.checkMode2 = "btn btn-default active";
        getBlackFilm();
    }

    // 请求门店列表
    function GetStoreList(){
        var data = {
            token : token
        };
        StoreList.GetStoreList(data).then(function(response){
            if(response.code  == 0){
                $scope.storeListData = response.data;
            }else{
                var msg = response.msg;
                SweetAlert.swal("",msg,"error");
            }
        })
    }
    function getStoreNameBySn() {
        if(!$scope.store_sn){
            $scope.sotreName ='全部';
        } else {
            if($scope.storeListData.length){
                for(var i=0;i<$scope.storeListData.length;i++){
                    var storeData = $scope.storeListData[i];
                    if($scope.store_sn == storeData.store_sn){
                        $scope.sotreName = storeData.store_name;
                        break;
                    }
                }
            }
        }
    }
    $scope.getFilmlistByStoreSn = function () {
        getStoreNameBySn();
        $scope.GetFilmListData(1,token);
    }

    $scope.serachMovie = function(){
        if($scope.keyWord && $scope.keyWord.length > 0)
        {
            // if($scope.keyWord.length < 2){
            //     SweetAlert.swal({
            //         title: "",
            //         text: "搜索字数必须大于2",
            //         timer: 1000,
            //         showConfirmButton: false,
            //         type : "warning"
            //     });
            //     return;
            // }
            var data = {
                token : token,
                page : 1,
                key_word : $scope.keyWord,
                is_has_image:$scope.isHasImage
            }
            if($scope.store_sn){
                data.store_sn = $scope.store_sn;
            }
            Film.GetFilmList(data).then(function(response){
                $scope.bigCurrentPage = 1;
                if(response.code == 0){
                    $scope.showFilmData = response.data;
                    // 分页配置
                    $scope.maxSize = 5;
                    $scope.bigTotalItems = response.data.list.total;
                    $scope.maxPage = response.data.list.last_page;
                }else{
                    SweetAlert.swal("",response.msg,"error");
                }
            })
        }
        else
        {
            $scope.GetFilmListData(1,token);
        }
    };
    $scope.searchGetFilm = function(){
        if($scope.keyWord.length == 0){
            $scope.bigCurrentPage = 1;
            $scope.GetFilmListData(1,token);
        }else{
            return;
        }
    };


    //删除电影
    $scope.delFilm = function(film,$index){
        SweetAlert.swal({
            title:"",
            text: "是否删除该电影！",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "确定",
            cancelButtonText: "返回",
            closeOnConfirm: false,
            html: true,
        }, function(isConfirm){
            // 确认暂停
            if (isConfirm) {
                // 确认删除
                var data = {
                    token : token,
                    id : film.id
                }
                Film.DelFilm(data).then(function(response){
                    console.log(response);
                    if(response.code == 0){
                        // 在allFilmData数组中删除电影
                        $scope.showFilmData.list.data.splice($index,1);
                        SweetAlert.swal({
                            title: "",
                            text: "删除电影成功！",
                            timer: 1000,
                            showConfirmButton: false,
                            type : "success"
                        })
                    }else{
                        SweetAlert.swal("",response.msg,"error");
                    }
                })
            }
        });
    }

    // 增加电影
    $scope.addFilm = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            backdrop : "static",
            templateUrl: 'addFilm.html',
            controller: 'addModalInstanceCtrl',
            resolve: {
                filmController: function () {
                    return $scope;
                }
            }
        });
        modalInstance.result.then(function () {
            console.log("增加电影");
        });
    };

    // 编辑电影
    $scope.editFilm = function (film,$index) {
        var modalInstance = $uibModal.open({
            animation: true,
            backdrop : "static",
            templateUrl: 'editFilm.html',
            controller: 'editFilmModalInstanceCtrl',
            resolve: {
                filmController: function () {
                    return $scope;
                },
                film : function(){
                    return film;
                },
                index : function(){
                    return $index;
                }
            }
        });
        modalInstance.result.then(function () {
            console.log("编辑电影");
        });
    };

    // 增加黑名单电影
    $scope.addBalckFilm = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            backdrop : "static",
            templateUrl: 'addBalckFilm.html',
            controller: 'addBalckFilmModalInstanceCtrl',
            resolve: {
                filmController: function () {
                    return $scope;
                }
            }
        });
        modalInstance.result.then(function () {
            getBlackFilm();
        });
    };
    // 增加黑名单电影
    $scope.editBalckFilm = function (index,filmName) {
        var modalInstance = $uibModal.open({
            animation: true,
            backdrop : "static",
            templateUrl: 'editBalckFilm.html',
            controller: 'editBalckFilmModalInstanceCtrl',
            resolve: {
                filmController: function () {
                    return $scope;
                },
                index:function () {
                    return index;
                },
                filmName:function () {
                    return filmName;
                }
            }
        });
        modalInstance.result.then(function () {
            getBlackFilm();
        });
    };


    //默认拉取所有
    $scope.isHasImage = '0';
    $scope.isHasImageData =[
        {
            "name" : "所有",
            "value" : '0',
        },
        {
            "name" : "有海报",
            "value" : '1',
        },
        {
            "name" : "无海报",
            "value" : '2',
        }
    ];
    $scope.changeisShow = function () {
        $scope.GetFilmListData(1,token);
    }

    //init
    GetStoreList();
    $scope.GetFilmListData(1,token);
});

app.controller('addModalInstanceCtrl', function($scope,$uibModalInstance,$timeout,SweetAlert,Film,Auth,$localStorage,filmController,apiUrl,ngVerify) {
    var token = Auth.getLocalData("token");

    $scope.addFilmData= {};

    // 默认电影搜索为空
    $scope.searchFilmName = "";
    
    //默认推荐
    $scope.addFilmData.is_recommend = 1;

    // 搜索列表
    $scope.filmChooseList = [];

    // 默认不显示电影详情
    $scope.isShowMovieInfo = false;
    // 点击查询电影
    $scope.getDoubanFilm = function () {
        var data = {
            count : 5,
            q : $scope.searchFilmName
        }
        $.ajax({
            url: "https://api.douban.com/v2/movie/search",
            type: "POST",
            dataType : "jsonp",//数据类型为jsonp  
            data: data,
            success: function(response) {
                console.log(response)
                if(response.subjects.length > 0){
                    $scope.filmChooseList = response.subjects;
                    $scope.$apply();
                }else{
                    SweetAlert.swal({
                        title: "",
                        text: "暂时未查询到该电影！",
                        timer: 1000,
                        showConfirmButton: false,
                        type : "warning"
                    })
                }
            }
        });
        // console.log($scope.addFilmData.film_name);
        // if($scope.addFilmData.film_name){
        //     var data = {
        //         key_word : $scope.addFilmData.film_name,
        //         page : 1
        //     }
        //     Film.SearchDouBanMovie(data).then(function(response){
        //         console.log(response)
        //     })
        // }
        
    }
    $scope.chooseDoubanResult = function(film){
        $scope.isShowMovieInfo = true;
        $.ajax({
            url: "https://api.douban.com/v2/movie/subject/" + film.id,
            type: "POST",
            dataType : "jsonp",//数据类型为jsonp  
            success: function(response) {
                console.log(response)
                if(response.id){
                    $scope.addFilmData.film_name = response.title;
                    $scope.addFilmData.grade = response.rating.average;
                    $scope.addFilmData.info =  response.summary;
                    $scope.addFilmData.image = response.images.large;
                    // $scope.addFilmData.spell = response.original_title;
                    $scope.addFilmData.class_describe = response.genres.join(",");
                    $scope.addFilmData.protagonist = getdataformarr(response.casts);
                    var director = getdataformarr(response.directors);
                    $scope.addFilmData.director = director.join(",");

                    $scope.actorsArr = $scope.addFilmData.protagonist;
                    $scope.checkDate = new Date(response.year,0,1);
                    $scope.addFilmData.screen_time = (Date.parse($scope.checkDate)/1000);
                    console.log($scope.checkDate);
                    $scope.$apply();
                }else{
                    SweetAlert.swal("","暂时未查询到该电影！","error");
                }
                // if(response.subjects.length > 0){
                //     // $scope.filmChooseList = response.subjects;
                //     // $scope.$apply();
                // }else{
                //     SweetAlert.swal("","暂时未查询到该电影！","error");
                // }
            }
        });
    }
    $scope.ShowMovieInfo = function(){
        $scope.isShowMovieInfo = !$scope.isShowMovieInfo;
    }
    function getdataformarr(arr) {
        var temp =[];
        for(var i = 0;i <  arr.length;i++){
            temp.push(arr[i].name);
        }
        return temp;
    }
    // 主演数组
    $scope.actorsArr = [];
    // 主演添加
    $scope.addActor = function(){
        // 判断为空
        if($scope.actor == undefined || $scope.actor == ""){
            return;
        }else{
            // 判断重复
            for(var i = 0;i <  $scope.actorsArr.length;i++){
                if($scope.actorsArr[i] == $scope.actor){
                    return;
                }
            }
            if($scope.actorsArr.length>4){
                SweetAlert.swal({
                    title: "",
                    text: "最多添加5位演员!",
                    timer: 1000,
                    showConfirmButton: false,
                    type : "warning"
                })
                return;
            }
            $scope.actorsArr.push($scope.actor);
            $scope.actor = "";
        }
    }
    // 主演删除
    $scope.delActor = function($index){
        $scope.actorsArr.splice($index,1)
    }

    //显示文件上传
    $scope.isShowImgUpFile = false;
    $scope.ShowImgUpFile = function(){
        $scope.isShowImgUpFile = !$scope.isShowImgUpFile
    }

    // // 类型数组
    // $scope.filmTypeArr = [];
    // // 类型添加
    // $scope.addFilmType = function(){
    //     // 判断为空
    //     if($scope.filmType == undefined || $scope.filmType == ""){
    //         return;
    //     }else{
    //         // 判断重复
    //         for(var i = 0;i <  $scope.filmTypeArr.length;i++){
    //             if($scope.filmTypeArr[i] == $scope.filmType){
    //                 return;
    //             }
    //         }
    //         if($scope.filmTypeArr.length>2){
    //             SweetAlert.swal("","最多添加3种类型","error");
    //             return;
    //         }
    //         $scope.filmTypeArr.push($scope.filmType);
    //         $scope.filmType = "";
    //     }
    // }
    // // 类型删除
    // $scope.delFilm = function($index){
    //     $scope.filmTypeArr.splice($index,1)
    // }

    // 上传图片默认图片
    // $scope.addFilmData.image = "";

    // 图片base路径
    $scope.baseUrl = filmController.showFilmData.imageBaseUrl;

    //图片上传事件
    $scope.upfileSubmit = function(){
        var file= document.getElementById('fileInput').files[0];
        if(!file){
            SweetAlert.swal({
                title: "",
                text: "请选择图片！",
                timer: 1000,
                showConfirmButton: false,
                type : "error"
            })
            return ;
        }

        // 打开上传中提示框
        tipBoxController(filmController,"上传中，请等待！",true)

        // 将文件转化为FormData
        var data = new FormData();
        data.append('image', file);
        data.append('name',file.name);   
        data.append('token',token);     
        // 发送文件上传请求
        $.ajax({
            url: apiUrl.url + "/film/uploadImage",
            type: "POST",
            processData: false,
            contentType: false,
            data: data,
            success: function(response) {
                console.log(response);
                if(response.code == 0){
                    // 提示上传成功，1秒之后自动关闭
                    tipBoxController(filmController,"上传成功！",true)
                    $timeout(function(){
                        tipBoxController(filmController,"",false)
                    },1000)

                    // 获得OSS图片返回的地址，将图片显示在页面上
                    $scope.addFilmData.image =  response.data.oss_name;

                    // 调用remove事件，清空文件上传
                    document.getElementsByClassName("fileinput-remove-button")[0].click();
                    $scope.$apply();
                }else{
                    SweetAlert.swal("",response.msg,"error");
                }
            }
        });
    };

    // 关闭
    $scope.close = function(){
        $uibModalInstance.close();
    }
    // 添加电影
    $scope.addFilmSubmit = function() {

        // 将主演数组转化为字符串
        $scope.addFilmData.protagonist = $scope.actorsArr.join(",");

        // // 将类型数组转化为字符串
        // $scope.addFilmData.class_describe = $scope.filmTypeArr.join(",");

        // 用电影名字做电影的MD5_hash值
        // if($scope.addFilmData.film_name){
        //     $scope.addFilmData.name_hash = hex_md5($scope.addFilmData.film_name);
        // }
        console.log($scope.addFilmData)
        ngVerify.check('filmAddForm',function (errEls) {
            if(errEls.length > 0){
                SweetAlert.swal({
                    title: "",
                    text: "请填写正确的电影信息！",
                    timer: 1000,
                    showConfirmButton: false,
                    type : "error"
                })
            }else{

                // 添加的电影默认是推荐
                $scope.addFilmData.is_recommend = 1;
                // 添加的电影默认是排在第一位
                if(filmController.allFilmData[0].filmListData.list.data[0]){
                    $scope.addFilmData.sort = Number(filmController.allFilmData[0].filmListData.list.data[0].sort) + 1;
                }else{
                    $scope.addFilmData.sort = 1;
                }
                // 验证主演和电影类型是否为空
                if($scope.addFilmData.protagonist == "" ||  $scope.addFilmData.class_describe == ""){
                    SweetAlert.swal({
                        title: "",
                        text: "请完善主演信息和电影类型!",
                        timer: 1000,
                        showConfirmButton: false,
                        type : "error"
                    })
                    return;
                }
                // $scope.addFilmData.image = "https://img3.doubanio.com/view/movie_poster_cover/lpst/public/p2022462385.jpg"
                Film.AddFilm($scope.addFilmData).then(function(response){
                    if(response.code == 0){
                        $uibModalInstance.close();
                        SweetAlert.swal({
                            title: "",
                            text: "添加电影成功!",
                            timer: 1000,
                            showConfirmButton: false,
                            type : "success"
                        })
                        filmController.bigCurrentPage = 1;
                        filmController.GetFilmListData(1,token)
                    }else{
                        SweetAlert.swal("",response.msg,"error");
                    }
                })
            }
        });
       
    }

    $scope.checkDateChange = function(checkDate){
        console.log("日期更改！");
        if(checkDate){
            $scope.addFilmData.screen_time = (Date.parse($scope.checkDate)/1000);
        }else{
            console.log("未选择时间！")
        }
    }
    // 日期插件调用
    datePicker()
    // 日期插件封装
    function datePicker(){
        // $scope.checkDate = new Date($scope.editFilmData.screen_time * 1000);
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
            return false;
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
            maxDate: new Date(2099, 11, 31),
            minDate: new Date(1899,12,1),
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
app.controller('editFilmModalInstanceCtrl', function($scope,$uibModalInstance,$timeout,SweetAlert,Film,Auth,$localStorage,filmController,film,index,apiUrl,ngVerify) {
    var token = Auth.getLocalData("token");

    // 初始化编辑电影
    $scope.editFilmData = angular.copy(film);


    // 搜索列表
    $scope.filmChooseList = [];
    // 默认不显示电影详情
    $scope.isShowMovieInfo = false;
    // 点击查询电影
    $scope.getDoubanFilm = function () {
        var data = {
            count : 5,
            q : $scope.editFilmData.film_name
        }
        $.ajax({
            url: "https://api.douban.com/v2/movie/search",
            type: "POST",
            dataType : "jsonp",//数据类型为jsonp
            data: data,
            success: function(response) {
                console.log(response)
                if(response.subjects.length > 0){
                    $scope.filmChooseList = response.subjects;
                    $scope.$apply();
                }else{
                    SweetAlert.swal({
                        title: "",
                        text: "暂时未查询到该电影！",
                        timer: 1000,
                        showConfirmButton: false,
                        type : "error"
                    })
                }
            }
        });
    }
    $scope.chooseDoubanResult = function(film){
        $scope.isShowMovieInfo = true;
        $.ajax({
            url: "https://api.douban.com/v2/movie/subject/" + film.id,
            type: "POST",
            dataType : "jsonp",//数据类型为jsonp
            success: function(response) {
                console.log(response)
                if(response.id){
                    $scope.editFilmData.film_name = response.title;
                    $scope.editFilmData.grade = response.rating.average;
                    $scope.editFilmData.info =  response.summary;
                    $scope.editFilmData.image = response.images.large;
                    // $scope.editFilmData.spell = response.original_title;
                    $scope.editFilmData.class_describe = response.genres.join(",");
                    $scope.editFilmData.protagonist = getdataformarr(response.casts);
                    var director = getdataformarr(response.directors);
                    $scope.editFilmData.director = director.join(",");

                    $scope.actorsArr = $scope.editFilmData.protagonist;
                    $scope.checkDate = new Date(response.year,0,1);
                    $scope.editFilmData.screen_time = (Date.parse($scope.checkDate)/1000);
                    console.log($scope.checkDate);
                    $scope.$apply();
                }else{
                    SweetAlert.swal({
                        title: "",
                        text: "暂时未查询到该电影！",
                        timer: 1000,
                        showConfirmButton: false,
                        type : "error"
                    })
                }
                // if(response.subjects.length > 0){
                //     // $scope.filmChooseList = response.subjects;
                //     // $scope.$apply();
                // }else{
                //     SweetAlert.swal("","暂时未查询到该电影！","error");
                // }
            }
        });
    }
    $scope.ShowMovieInfo = function(){
        $scope.isShowMovieInfo = !$scope.isShowMovieInfo;
    }
    function getdataformarr(arr) {
        var temp =[];
        for(var i = 0;i <  arr.length;i++){
            temp.push(arr[i].name);
        }
        return temp;
    }
    // 监听表单是否有改变,返回flagSubmit
    formCheckChange($scope,$scope.editFilmData)

    // 主演数组
    $scope.actorsArr = $scope.editFilmData.protagonist.split(",");
    // 主演添加
    $scope.addActor = function(){
        // 判断为空
        if($scope.actor == undefined || $scope.actor == ""){
            return;
        }else{
            // 判断重复
            for(var i = 0;i <  $scope.actorsArr.length;i++){
                if($scope.actorsArr[i] == $scope.actor){
                    return;
                }
            }
            if($scope.actorsArr.length>4){
                SweetAlert.swal({
                    title: "",
                    text: "最多添加5位演员!",
                    timer: 1000,
                    showConfirmButton: false,
                    type : "error"
                })
                return;
            }
            $scope.actorsArr.push($scope.actor);
            $scope.actor = "";
            $scope.flagSubmit = true;
        }
    }
    // 主演删除
    $scope.delActor = function($index){
        $scope.actorsArr.splice($index,1);
        $scope.flagSubmit = true;
    }

    // // 类型数组
    // $scope.filmTypeArr = $scope.editFilmData.class_describe.split(",");
    // // 类型添加
    // $scope.addFilmType = function(){
    //     // 判断为空
    //     if($scope.filmType == undefined || $scope.filmType == ""){
    //         return;
    //     }else{
    //         // 判断重复
    //         for(var i = 0;i <  $scope.filmTypeArr.length;i++){
    //             if($scope.filmTypeArr[i] == $scope.filmType){
    //                 return;
    //             }
    //         }
    //         if($scope.filmTypeArr.length>2){
    //             SweetAlert.swal("","最多添加3种类型","error");
    //             return;
    //         }
    //         $scope.filmTypeArr.push($scope.filmType);
    //         $scope.filmType = "";
    //         $scope.flagSubmit = true;
    //     }
    // }
    // // 类型删除
    // $scope.delFilmType = function($index){
    //     $scope.filmTypeArr.splice($index,1);
    //     $scope.flagSubmit = true;
    // }

    // 默认关闭图片上传
    $scope.showUpFile = false;
    $scope.showUpFileClick = function(){
        $scope.showUpFile = !$scope.showUpFile;
    }

    // 图片base路径
    $scope.baseUrl = filmController.showFilmData.imageBaseUrl;
    // if(film.image.substr(0,5) != "https"){
    //     $scope.editFilmData.image =$scope.baseUrl + film.image;
    // } else {
    //     $scope.editFilmData.image = film.image;
    // }
    //图片上传事件
    $scope.upfileSubmit = function(){
        var file= document.getElementById('fileInput').files[0];
        if(!file){SweetAlert.swal("","请选择图片！","error");return ;}

        // 打开上传中提示框
        tipBoxController(filmController,"上传中，请等待！",true)

        // 将文件转化为FormData
        var data = new FormData();
        data.append('image', file);
        data.append('name',file.name);
        // 发送文件上传请求
        $.ajax({
            url: apiUrl.url + "/film/uploadImage",
            type: "POST",
            processData: false,
            contentType: false,
            data: data,
            success: function(response) {
                console.log(response);
                if(response.code == 0){
                    // 提示上传成功，1秒之后自动关闭
                    tipBoxController(filmController,"上传成功！",true)
                    $timeout(function(){
                        tipBoxController(filmController,"",false)
                    },1000)

                    // 获得OSS图片返回的地址，将图片显示在页面上
                    $scope.editFilmData.image =  response.data.oss_name;

                    // 调用remove事件，清空文件上传
                    document.getElementsByClassName("fileinput-remove-button")[0].click();
                    $scope.$apply();
                }else{
                    SweetAlert.swal("",response.msg,"error");
                }
            }
        });
    };
    // 关闭
    $scope.close = function(){
        $uibModalInstance.close();
    }
    $scope.editFilmSubmit = function(){

        // 表单是否有改变
        if(!$scope.flagSubmit){
            SweetAlert.swal({
                title: "",
                text: "没有修改的信息!",
                timer: 1000,
                showConfirmButton: false,
                type : "warning"
            })
            return;
        }
        // 将主演数组转化为字符串
        $scope.editFilmData.protagonist = $scope.actorsArr.join(",");
        // // 将主演数组转化为字符串
        // $scope.editFilmData.class_describe = $scope.filmTypeArr.join(",");
        var data = $scope.editFilmData;
        if(filmController.store_sn){
            data.store_sn = filmController.store_sn;
        }
        // 编辑电影请求
        ngVerify.check('filmEditorForm',function (errEls) {
            if(errEls.length > 0){
                SweetAlert.swal({
                    title: "",
                    text: "请填写正确的电影信息！",
                    timer: 1000,
                    showConfirmButton: false,
                    type : "warning"
                })
            }else{
                if($scope.editFilmData.protagonist == "" ||  $scope.editFilmData.class_describe == ""){
                    SweetAlert.swal({
                        title: "",
                        text: "请完善主演信息和电影类型!",
                        timer: 1000,
                        showConfirmButton: false,
                        type : "warning"
                    })
                    return;
                }
                // var reqData = getDiffObj(film,data)
                // reqData.id = film.id;
                Film.EditFilm(data).then(function(response){
                    if(response.code == 0){
                        // 关闭模态框
                        $uibModalInstance.close();
                        // 更新传进来的电影参数
                        upDateInfo($scope.editFilmData,film)
                        SweetAlert.swal({
                            title: "",
                            text: "编辑电影成功！",
                            timer: 1000,
                            showConfirmButton: false,
                            type : "success"
                        })
                    }else{
                        SweetAlert.swal("",response.msg,"error");
                    }
                })
            }
        });
    }

    $scope.checkDateChange = function(checkDate){
        console.log("日期更改！");
        if(checkDate){
            $scope.editFilmData.screen_time = (Date.parse($scope.checkDate)/1000);
        }else{
            console.log("未选择时间！")
        }
    }
    // 日期插件调用
    datePicker()
    // 日期插件封装
    function datePicker(){
        $scope.checkDate = new Date($scope.editFilmData.screen_time * 1000);
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
            return false;
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
            maxDate: new Date(2099, 11, 31),
            minDate: new Date(1899,12,1),
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
app.controller('addBalckFilmModalInstanceCtrl', function($scope,$uibModalInstance,SweetAlert,Film,Auth,filmController) {
    var token = Auth.getLocalData("token");
    $scope.blackFilmName = '';
    var blackFilmList = filmController.blackFilmList;
    $scope.blackSubmit = function () {
        if(!$scope.blackFilmName){
            SweetAlert.swal('','电影名必填','error');
            return ;
        }
        if(blackFilmList.length){
            for (var i = 0; i < blackFilmList.length; i++) {
                if (blackFilmList[i] == $scope.blackFilmName) {
                    SweetAlert.swal('','电影已经在黑名单中','error');
                    return ;
                }
            }
        }

        blackFilmList.push($scope.blackFilmName);
        blackFilmList = JSON.stringify(blackFilmList);
        var data = {
            token : token,
            film_list:blackFilmList
        };
        Film.editBlackFilm(data).then(function(response){
            $scope.close();
            if(response.code == 0){
                SweetAlert.swal("",'成功',"success");
            }else{
                SweetAlert.swal("",response.msg,"error");
            }
        })
    }
    $scope.close = function(){
        $uibModalInstance.close();
    }
});
app.controller('editBalckFilmModalInstanceCtrl', function($scope,$uibModalInstance,SweetAlert,Film,Auth,filmController,index,filmName) {
    var token = Auth.getLocalData("token");
    $scope.blackFilmName = filmName;
    var blackFilmList = filmController.blackFilmList;
    $scope.blackSubmit = function () {
        if(!$scope.blackFilmName){
            SweetAlert.swal('','电影名必填','error');
            return ;
        }

        if(blackFilmList.length){
            for (var i = 0; i < blackFilmList.length; i++) {
                if (blackFilmList[i] == $scope.blackFilmName) {
                    SweetAlert.swal('','电影已经在黑名单中','error');
                    return ;
                }
            }
        }
        blackFilmList.splice(index,1);
        blackFilmList.push($scope.blackFilmName);
        blackFilmList = JSON.stringify(blackFilmList);
        var data = {
            token : token,
            film_list:blackFilmList
        };
        Film.editBlackFilm(data).then(function(response){
            $scope.close();
            if(response.code == 0){
                SweetAlert.swal("",'成功',"success");
            }else{
                SweetAlert.swal("",response.msg,"error");
            }
        })
    }
    $scope.blackDel = function () {
        blackFilmList.splice(index,1);
        blackFilmList = JSON.stringify(blackFilmList);
        var data = {
            token : token,
            film_list:blackFilmList
        };
        Film.editBlackFilm(data).then(function(response){
            $scope.close();
            if(response.code == 0){
                SweetAlert.swal("",'成功',"success");
            }else{
                SweetAlert.swal("",response.msg,"error");
            }
        })
    }
    $scope.close = function(){
        $uibModalInstance.close();
    }
});