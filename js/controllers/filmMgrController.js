app
.controller('filmMgrController',function ($scope,$timeout,$rootScope,SweetAlert,$uibModal,$localStorage,apiUrl,Auth,FilmMgr,myService,$localStorage,StoreList) {
    GetStoreList();
	// 请求门店列表
    function GetStoreList(){
        var data = {
        };
        StoreList.GetStoreList(data).then(function(response){
            if(response.code  == 0){
                $scope.storeListData = response.data;
            }else{
                var msg = response.msg;
                SweetAlert.swal("",msg,"error");
            }
        })
    };
    // 上下架功能flag
    $scope.filmTypeFlag = false;

    // 门店切换
    $scope.getFilmlistByStoreSn = function(){
        var length = $scope.filmBillboards.length - 1;
        if($scope.store_sn){
            $scope.filmTypeFlag = true;
            $scope.filmBillboards[length-2].disabled = false;
            $scope.filmBillboards[length-1].disabled = false;
            $scope.filmBillboards[length].disabled = false;
        }else{
            $scope.filmTypeFlag = false;
            for(var q = 0;q < $scope.filmBillboards.length;q++){
                $scope.filmBillboards[q].choose = false;
            };
            $scope.order_type = 2;
            $scope.type = "";
            $scope.filmBillboards[length-2].disabled = true;
            $scope.filmBillboards[length-1].disabled = true;
            $scope.filmBillboards[length].disabled = true;
            $scope.filmBillboards[0].choose = true;
        }
        $scope.getFilmListData();
    }

    // 海报有无切换
    $scope.changeisShow = function(){
        $scope.getFilmListData();
    }

    // 年份筛选
    $scope.begin_time = "";
    $scope.end_time = "";
    $scope.changeYears = function(){
        if($scope.begin_time && $scope.end_time){
            if($scope.begin_time.toString().length == 4 || $scope.end_time.toString().length == 4){
                $scope.begin_date = new Date($scope.begin_time,0,1).getTime()/1000;
                $scope.end_date = new Date($scope.end_time,11,31).getTime()/1000;
                $scope.getFilmListData();
                $scope.begin_date = "";
                $scope.end_date = "";
            }
        }

        if(!$scope.begin_time && !$scope.end_time){
            $scope.getFilmListData();
        }
    }

    // 电影跳转页数
    $scope.setPage = function () {
        if($scope.reqPage > $scope.maxPage){
            return;
        }
        $scope.bigCurrentPage = $scope.reqPage;
    }
    // 电影搜索
    $scope.serachMovie = function(){
        $scope.showPagination = true;
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
                page : 1,
                key_word : $scope.keyWord,
                // is_has_image:$scope.isHasImage
            }
            if($scope.store_sn){
                data.store_sn = $scope.store_sn;
            }
            FilmMgr.GetFilmList(data).then(function(response){
                $scope.bigCurrentPage = 1;
                if(response.code == 0){
                    $scope.filmListData = response.data.list.data
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
            $scope.GetFilmListData();
        }
    };


    // 分页设置
    $scope.showPagination = true;
    $scope.bigCurrentPage = 1;
    $scope.maxSize = 5;
    $scope.bigTotalItems = 0;
    $scope.maxPage = 1;

    // 电影列表分类
    $scope.orderType = 2;
    $scope.filmType = "";

	// 电影有无海报分类    
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

    //电影榜单分类
    $scope.filmBillboardDefault = "3";
    $scope.filmBillboards = [
        {
            "name":"所有",
            "value":"0",
            "choose":true,
            "disabled":false
        },
        {
            "name":"评分榜",
            "value":"1",
            "choose":false,
            "disabled":false,
        },
        {
            "name":"排行榜",
            "value":"2",
            "choose":false,
            "disabled":false,
        },
        {
            "name":"热映电影",
            "value":"3",
            "choose":false,
            "disabled":false
        },
        {
            "name":"最近更新",
            "value":"4",
            "choose":false,
            "disabled":true
        },
        {
            "name":"商家下架电影",
            "value":"5",
            "choose":false,
            "disabled":true
        },
        {
            "name":"后台下架电影",
            "value":"6",
            "choose":false,
            "disabled":true
        },        
    ]

              

    // 电影类型分类
    $scope.filmTypes = [
        {
            "name":"全部",
            "value":"0",
            "choose":true
        },
        {
            "name":"剧情",
            "value":"0",
            "choose":false
        },
        {
            "name":"爱情",
            "value":"1",
            "choose":false
        },
        {
            "name":"喜剧",
            "value":"2",
            "choose":false
        },
        {
            "name":"科幻",
            "value":"3",
            "choose":false
        },
        {
            "name":"动画",
            "value":"8",
            "choose":false
        },
        {
            "name":"动作",
            "value":"4",
            "choose":false
        },
        {
            "name":"悬疑",
            "value":"5",
            "choose":false
        },
        {
            "name":"犯罪",
            "value":"6",
            "choose":false
        },
        {
            "name":"恐怖",
            "value":"7",
            "choose":false
        },
        // {
        //     "name":"青春",
        //     "value":"8",
        //     "choose":false
        // },
        // {
        //     "name":"励志",
        //     "value":"9",
        //     "choose":false
        // },
        {
            "name":"战争",
            "value":"10",
            "choose":false
        },
        // {
        //     "name":"文艺",
        //     "value":"11",
        //     "choose":false
        // },
        // {
        //     "name":"传记",
        //     "value":"12",
        //     "choose":false
        // },
        // {
        //     "name":"家庭",
        //     "value":"13",
        //     "choose":false
        // }
    ]

   

    // 电影年份
    $scope.filmYears = [
    	{
    		name:"全部",
    		value:"0",
    		choose:true
    	},
    	{
    		name:"2017",
    		value:"2017",
    		choose:false
    	},
    	{
    		name:"2016",
    		value:"2016",
    		choose:false
    	},
    	{
    		name:"2015",
    		value:"2015",
    		choose:false
    	},
        {
            name:"2014",
            value:"2014",
            choose:false
        },
        {
            name:"2013",
            value:"2013",
            choose:false
        },
        {
            name:"2012",
            value:"2012",
            choose:false
        },
        {
            name:"2011",
            value:"2011",
            choose:false
        },
        {
            name:"2010-2000",
            value:"1",
            choose:false
        },
        {
            name:"更早",
            value:"2",
            choose:false
        },
    ]

    // 电影列表数据
    $scope.filmListData = []

    // 获取热映电影列表
    $scope.getHighPlayList = function(){
        $scope.showPagination = false;
        var data = {
            store_sn:$scope.store_sn,
            count: 30
        };
        if(!data.store_sn){
            delete data.store_sn
        }
        FilmMgr.GetHighPlayList(data).then(function(response){
            if(response.code == 0){
                $scope.filmListData = response.data;
            }else{
                SweetAlert.swal("",response.msg,"error");
            }
        })
    };

    // 获取最近更新电影列表
    $scope.getNewFilmList = function(){
        $scope.showPagination = false;
        var data = {
            store_sn:$scope.store_sn,
            count: 30
        };
        if(!data.store_sn){
            delete data.store_sn
        }
        FilmMgr.GetNewFilmList(data).then(function(response){
            if(response.code == 0){
                // $scope.bigTotalItems = response.data.list.total;
                // $scope.maxPage = response.data.list.last_page;
                $scope.filmListData = response.data;
            }else{
                SweetAlert.swal("",response.msg,"error");
            }
        })
    };

    // 获取电影列表
    $scope.getFilmListData = function(data){
        $scope.showPagination = true;
    	var data = {
            store_sn: $scope.store_sn,
            page : $scope.bigCurrentPage,
            is_has_image:$scope.isHasImage,
            key_word:$scope.keyWord,
            order_type:$scope.orderType,
            film_type:$scope.filmType,
            begin_time : $scope.begin_date,
            end_time : $scope.end_date,
            type : $scope.type
        };
        delEmptyAttr(data);
        FilmMgr.GetFilmList(data).then(function(response){
            if(response.code == 0){
                $scope.bigTotalItems = response.data.list.total;
                $scope.maxPage = response.data.list.last_page;
                $scope.filmListData = response.data.list.data
            }else{
                SweetAlert.swal("",response.msg,"error");
            }
        })
    };

    // 监听分页数值变化
    $scope.$watch(function() {
            return $scope.bigCurrentPage;
        },
        function(value) {
            if (value) {
                $scope.bigCurrentPage = value;
                value = Number(value);
                $scope.getFilmListData()
            }
        },
        true
    );

    // 修改榜单按钮
    $scope.changeBillboard = function(filmBillboard,index){
        for(var q = 0;q < $scope.filmBillboards.length;q++){
            $scope.filmBillboards[q].choose = false;
        }
        $scope.filmBillboards[index].choose = true;
        var value = filmBillboard.value;
        switch (value) {
            case '0':
                $scope.orderType = 2;
                $scope.type = "";
                $scope.getFilmListData(0);
                $scope.changeBtnSta(0);
                break;
            case '1': 
                $scope.orderType = 0;
                $scope.type = "";
                $scope.getFilmListData();       //评分榜电影
                $scope.changeBtnSta(0);
                break;
            case '2':
                $scope.orderType = 1;
                $scope.type = "";
                $scope.getFilmListData();       //排行榜电影
                $scope.changeBtnSta(0);
                break;
            case '3':
                $scope.getHighPlayList();      //热映电影
                $scope.changeBtnSta(1);
                break;
            case '4':
                $scope.getNewFilmList();        //最近更新电影
                $scope.changeBtnSta(1);
                break;
            case '5':
                $scope.type = 3;
                $scope.orderType = "";
                $scope.getFilmListData();        //商家下架电影
                $scope.changeBtnSta(0);
                break;
            case '6':
                $scope.type = 2;
                $scope.orderType = "";
                $scope.getFilmListData();        //后台下架电影
                $scope.changeBtnSta(0);
                break;
            default:
                $scope.orderType = 2;
                $scope.orderType = "";
                $scope.getFilmListData();       //所有电影
                $scope.changeBtnSta(0);
        }
    };

    // 修改电影、年份分类
    $scope.changeBtnSta = function(x){
        if(x){
            for(var q = 0;q < $scope.filmTypes.length;q++){
                $scope.filmTypes[q].disabled = true;
                $scope.filmTypes[q].choose = false;
                $scope.filmTypes[0].choose = true;
                $scope.orderType = "";
                $scope.filmType = "";
                $scope.begin_date = "";
                $scope.end_date = "";
            }
            for(var m = 0;m < $scope.filmYears.length;m++){
                $scope.filmYears[m].disabled = true;
                $scope.filmYears[m].choose = false;
                $scope.filmYears[0].choose = true;
                $scope.orderType = "";
                $scope.filmType = "";
                $scope.begin_date = "";
                $scope.end_date = "";
            }
        }else{
            for(var q = 0;q < $scope.filmTypes.length;q++){
                $scope.filmTypes[q].disabled = false
            }
            for(var m = 0;m < $scope.filmYears.length;m++){
                $scope.filmYears[m].disabled = false
            }
        }
    }

    // 修改电影分类
    $scope.changeFilmType = function(filmType,index){
        if(filmType.name == "全部"){
            $scope.filmType = ""
        }else{
            $scope.filmType = filmType.name;
        }
        for(var q = 0;q < $scope.filmTypes.length;q++){
            $scope.filmTypes[q].choose = false;
        }
        $scope.filmTypes[index].choose = true;
        $scope.getFilmListData();
    };

    // 修改电影年份分类
    $scope.chooseYears = function(filmYear,index){
        var dateNumber = filmYear.value;
        if(filmYear.name == "全部"){
            $scope.begin_date = "";
            $scope.end_date = "";
        }else if(filmYear.name == "更早"){
            $scope.begin_date = "";
            $scope.end_date = new Date(1999,11,31).getTime()/1000;
        }else if(filmYear.name == "2010-2000"){
            $scope.begin_date = new Date(2000,0,1).getTime()/1000;
            $scope.end_date = new Date(2010,11,31).getTime()/1000;
        }else{
            $scope.begin_date = new Date(filmYear.value,0,1).getTime()/1000;
            $scope.end_date = new Date(filmYear.value,11,31).getTime()/1000;
        }
        for(var q = 0;q < $scope.filmYears.length;q++){
            $scope.filmYears[q].choose = false;
        }
        $scope.filmYears[index].choose = true;
        $scope.getFilmListData();
    };

    // 添加电影
    $scope.addFilm = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            backdrop : "static",
            templateUrl: 'filmAdd.html',
            controller: 'filmAddModalInstanceCtrl',
            resolve: {
                filmMgrController: function () {
                    return $scope;
                },
            }
        });
        modalInstance.result.then(function () {
            console.log("增加电影");
        });
    };

    // 评论管理
    $scope.toFilmReviewsMgr = function(film){
        myService.set(film);
        $rootScope.$state.go("app.filmReviews");
    };

    // 电影关联名人查看
    $scope.getCelebrityList = function(film){
        console.log(film)
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'getCelebrityList.html',
            controller: 'getCelebrityModalInstanceCtrl',
            resolve: {
                filmMgrController: function () {
                    return $scope;
                },
                film: function () {
                    return film
                }
            }
        });
        modalInstance.result.then(function () {
            console.log("增加电影");
        });
    };
    // 删除电影
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
                    id : film.id
                }
                FilmMgr.DelFilm(data).then(function(response){
                    if(response.code == 0){
                        // 在allFilmData数组中删除电影
						$scope.getFilmListData(1);
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
    };
    // 编辑电影
    $scope.editFilm = function (film,$index) {
        var modalInstance = $uibModal.open({
            animation: true,
            backdrop : "static",
            templateUrl: 'filmEdit.html',
            controller: 'filmEditModalInstanceCtrl',
            resolve: {
                filmMgrController: function () {
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

    // 移入专题模态框
    $scope.removeTopic = function(film){
        var modalInstance = $uibModal.open({
            animation: true,
            backdrop : "static",
            templateUrl: 'chooseTopic.html',
            controller: 'chooseTopicModalInstanceCtrl',
            resolve: {
                filmMgrController: function () {
                    return $scope;
                },
                film : function(){
                    return film;
                }
            }
        });
        modalInstance.result.then(function () {
            console.log("编辑电影");
        });
    }
});

// 电影编辑模态框控制器
app.controller('filmEditModalInstanceCtrl', function($scope,$uibModalInstance,$timeout,SweetAlert,FilmMgr,Auth,$localStorage,filmMgrController,film,index,apiUrl,ngVerify) {
    var token = Auth.getLocalData("token");
    // 初始化编辑电影
    $scope.editFilmData = angular.copy(film);

    // 电影上下架功能flag
    $scope.filmTypeFlag = filmMgrController.filmTypeFlag

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



    // 默认关闭图片上传
    $scope.showUpFile = false;
    $scope.showUpFileClick = function(){
        $scope.showUpFile = !$scope.showUpFile;
    }


    //图片上传事件
    $scope.upfileSubmit = function(){
        var file= document.getElementById('fileInput').files[0];
        if(!file){SweetAlert.swal("","请选择图片！","error");return ;}

        // 打开上传中提示框
        tipBoxController(filmMgrController,"上传中，请等待！",true)

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
                    tipBoxController(filmMgrController,"上传成功！",true)
                    $timeout(function(){
                        tipBoxController(filmMgrController,"",false)
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
        if(filmMgrController.store_sn){
            data.store_sn = filmMgrController.store_sn;
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
                FilmMgr.EditFilm(data).then(function(response){
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

// 电影添加模态框控制器
app.controller('filmAddModalInstanceCtrl', function($scope,$uibModalInstance,$timeout,SweetAlert,FilmMgr,Auth,$localStorage,filmMgrController,apiUrl,ngVerify) {
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
        tipBoxController(filmMgrController,"上传中，请等待！",true)

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
                    tipBoxController(filmMgrController,"上传成功！",true)
                    $timeout(function(){
                        tipBoxController(filmMgrController,"",false)
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
                $scope.addFilmData.sort = 1;
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
                FilmMgr.AddFilm($scope.addFilmData).then(function(response){
                    if(response.code == 0){
                        $uibModalInstance.close();
                        SweetAlert.swal({
                            title: "",
                            text: "添加电影成功!",
                            timer: 1000,
                            showConfirmButton: false,
                            type : "success"
                        })
                        filmMgrController.bigCurrentPage = 1;
                        filmMgrController.getFilmListData(1)
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

// 电影移入专题模态框控制器
app.controller('chooseTopicModalInstanceCtrl', function($scope,$uibModalInstance,$timeout,SweetAlert,FilmMgr,Auth,$localStorage,filmMgrController,film,apiUrl,ngVerify) {
    var token = Auth.getLocalData("token");
    // 获取专题集合
    $scope.getSpecialList = function(){
        FilmMgr.GetSpecialList().then(function(response){
            if(response.code == 0){
                $scope.topicList = response.data;
            }else{
                SweetAlert.swal("",response.msg,"error");
            }
        })
    };
    $scope.getSpecialList();

    // 添加电影到集合
    $scope.addSpecialFilmSub = function(){
        var data = {
            special_sn : $scope.special_sn,
            name_hash : film.name_hash
        };
        FilmMgr.AddSpecialFilm(data).then(function(response){
            $scope.close();
            if(response.code == 0){
                SweetAlert.swal({
                    title: "",
                    text: "添加成功！",
                    timer: 1000,
                    showConfirmButton: false,
                    type : "success"
                })
            }else{
                SweetAlert.swal("",response.msg,"error");
            }
        })
    };
    // 关闭
    $scope.close = function(){
        $uibModalInstance.close();
    }
});

// 电影移入专题模态框控制器
app.controller('getCelebrityModalInstanceCtrl', function($scope,$uibModalInstance,$timeout,SweetAlert,FilmMgr,Auth,$localStorage,filmMgrController,film,apiUrl,ngVerify) {
    var token = Auth.getLocalData("token");
    $scope.type = 1;

    // 获取电影的名人列表
    $scope.getCelebrityInFilm = function(){
        var data = {
            name_hash : film.name_hash
        };
        FilmMgr.GetCelebrityInFilm(data).then(function(response){
            if(response.code == 0){
                console.log(response);
                $scope.celebrityList = response.data;
            }else{
                SweetAlert.swal("",response.msg,"error");
            }
        })
    };
    $scope.getCelebrityInFilm();


    // 搜索名人
    $scope.celebrityName = "";
    $scope.searchCelebrity = function(){
        var data = {
            keyword : $scope.celebrityName
        };
        if(!data.keyword){
            SweetAlert.swal({
                title: "",
                text: "搜索名称不能为空！",
                timer: 1000,
                showConfirmButton: false,
                type : "warning"
            });
            return;
        }
        FilmMgr.GetCelebrityList(data).then(function(response){
            if(response.code == 0){
                $scope.searchResults = response.data.data;
            }else{
                SweetAlert.swal("",response.msg,"error");
            }
        })
    };

    // 添加关联
    // 关联职位
    $scope.addData = {
        type : 1
    }
    $scope.addRelation = function(celebrity){
        var data = {
            name_hash : film.name_hash,
            celebrity_sn : celebrity.celebrity_sn,
            type : $scope.addData.type
        };
        FilmMgr.AddRelation(data).then(function(response){
            if(response.code == 0){
                SweetAlert.swal({
                    title: "",
                    text: "添加成功！",
                    timer: 1000,
                    showConfirmButton: false,
                    type : "success"
                });
                $scope.searchResults=[];
                $scope.celebrityName="";
                $scope.getCelebrityInFilm();
            }else{
                SweetAlert.swal("",response.msg,"error");
            }
        })
    };

    // 删除电影名人关联
    $scope.delRelation = function(celebrity){
        var data = {
            name_hash : film.name_hash,
            id : celebrity.id,
            celebrity_sn : celebrity.celebrity_sn
        };
        FilmMgr.DelRelation(data).then(function(response){
            if(response.code == 0){
                SweetAlert.swal({
                    title: "",
                    text: "删除成功！",
                    timer: 1000,
                    showConfirmButton: false,
                    type : "success"
                });
                $scope.getCelebrityInFilm();
            }else{
                SweetAlert.swal("",response.msg,"error");
            }
        })
    };


    // 关闭
    $scope.close = function(){
        $uibModalInstance.close();
    }
});