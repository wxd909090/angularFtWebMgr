app
.controller('salingGoodsController',function ($scope,$timeout,$rootScope,SweetAlert,$uibModal,$localStorage,Auth,SalingGoods,myService,$localStorage,apiUrl) {
    var token = Auth.getLocalData("token");
    var store_sn = Auth.getLocalData("store_sn");
    $scope.showGoods = true;
    $scope.category_sn = "";
    $scope.allChoose = false;
    $scope.changeStatus = function(x){
    	if(x){
    		$scope.showGoods = false;
    	}else{
    		$scope.showGoods = true;
    	}
    };

    // 商品列表分页设置
    $scope.bigCurrentPage = 1;
    $scope.maxSize = 5;
    $scope.bigTotalItems = 0;
    $scope.maxPage = 1;

    // 套餐列表分页设置
    $scope.bigCurrentPage2 = 1;
    $scope.maxSize2 = 5;
    $scope.bigTotalItems2 = 0;
    $scope.maxPage2 = 1;
    // 请求门店列表
    $scope.getStoreList = function(){
        var data = {
        };
        SalingGoods.GetStoreList(data).then(function(response){
            if(response.code  == 0){
                $scope.storeListData = response.data;
                $scope.store = $scope.storeListData[0];
                $scope.getGoodsList();
                $scope.getRecommendGoods();
                $scope.getGoodsTypeList()
            }else{
                var msg = response.msg;
                SweetAlert.swal("",msg,"error");
            }
        })
    };

    // 监听排序事件
    $scope.$watch(function() {
            return $scope.goodsListData;
        },
        function(newValue,oldValue) {
            var newArr = [];
            for(var q = 0;q < newValue.length;q++){
                if(oldValue.length > 0){
                    if(newValue[q].name != oldValue[q].name){
                        newArr.push(newValue[q])
                    }
                }
            };
            if(newArr.length > 0){
                var data = {
                    store_sn : $scope.store.store_sn,
                    g_sn : newArr[0].g_sn,
                    priority : newArr[1].priority
                };
                SalingGoods.ChangeSort(data).then(function(response){
                    if(response.code == 0){
                        SweetAlert.swal({
                            title: "",
                            text: "排序成功！",
                            timer: 1000,
                            showConfirmButton: false,
                            type : "success"
                        });
                        // $scope.getGoodsList();
                    }else{
                        SweetAlert.swal("",response.msg,"error");
                        $scope.getGoodsList();
                    }
                })
            }

        },
        true
    );

    // 拖动配置参数
    $scope.sortableConf = {
        forceFallback: true,
        onStart: true,
    }

    // 新建商品套餐
    $scope.goCreateGoodsType = function(){
        var data = {
            store : $scope.store
        }
        myService.set(data);
        $rootScope.$state.go("app.createRecommend");
    };

    // 新建商品分类
    $scope.salingCreateGoodsType = function(){
        var data = {
            store : $scope.store
        }
        myService.set(data);
        $rootScope.$state.go("app.createGoodsType");
    };

    // 新建商品
    $scope.salingCreateGoods = function(){
        var data = {
            store : $scope.store
        }
        myService.set(data);
        $rootScope.$state.go("app.createGoods");
    }

    // 切换门店
    $scope.changeStore = function () {
        $scope.allChoose = false;
        $scope.category_sn = "";
        
        $scope.getGoodsList();
        $scope.getGoodsTypeList();
        $scope.getRecommendGoods();
    };

    // 切换分类
    $scope.changeGoodsType = function(){
        console.log($scope.category_sn);
        if($scope.category_sn == "rx"){
            $scope.getHotGoods()
            return;
        }
        $scope.bigCurrentPage = 1;
        $scope.getGoodsList();
    }
    // 获取分类列表
    $scope.getGoodsTypeList = function(){
        var data = {
            store_sn : $scope.store.store_sn
        };
        SalingGoods.GetGoodsTypeList(data).then(function(response){
            if(response.code  == 0){
                $scope.goodsTypeList = response.data.data;
            }else{
                var msg = response.msg;
                SweetAlert.swal("",msg,"error");
            }
        })
    }
    // 获取商品列表
    $scope.getGoodsList = function(){
        var data = {
            store_sn : $scope.store.store_sn,
            status : 1,
            page : $scope.bigCurrentPage,
            category_sn : $scope.category_sn
        };
        delEmptyAttr(data);
        SalingGoods.GetGoodsList(data).then(function(response){
            if(response.code == 0){
                $scope.bigTotalItems = response.data.total;
                $scope.maxPage = response.data.total_page;
                $scope.goodsListData = response.data.data;
            }else{
                SweetAlert.swal("",response.msg,"error");
            }
        })
    };
    // 获取热销商品列表
    $scope.getHotGoods = function(){
        var data = {
            store_sn : $scope.store.store_sn,
        };
        SalingGoods.GetHotGoods(data).then(function(response){
            if(response.code == 0){
                $scope.goodsListData = response.data;
            }else{
                SweetAlert.swal("",response.msg,"error");
            }
        })
    };
    // 获取推荐套餐
    $scope.getRecommendGoods = function(){
        var data = {
            store_sn : $scope.store.store_sn,
            page : $scope.bigCurrentPage2,
        };
        SalingGoods.GetComboList(data).then(function(response){
            if(response.code == 0){
                $scope.recommendListData = response.data.data;
                $scope.bigTotalItems2 = response.data.total;
                $scope.maxPage2 = response.data.total_page;
            }else{
                SweetAlert.swal("",response.msg,"error");
            }
        })
    };
    // 商品列表数据
    $scope.goodsListData = [];

    // 推荐套餐
    $scope.recommendListData = [];

    // 编辑商品
    $scope.editGoods = function(ShelfGoodsList){
        var modalInstance = $uibModal.open({
            animation: true,
            backdrop : "static",
            templateUrl: 'editSalingGoods.html',
            controller: 'editSalingGoodsCtrl',
            resolve: {
                salingGoodsController: function () {
                    return $scope;
                },
                ShelfGoodsList : function () {
                    return ShelfGoodsList
                },
                goodsTypeList : function () {
                    return $scope.goodsTypeList
                }
            }
        });
        modalInstance.result.then(function () {
            console.log("修改完毕");
        });
    }

    $scope.checkAllChoose = function(){
        for(var i = 0;i < $scope.goodsListData.length;i++){
            $scope.goodsListData[i].checked = $scope.allChoose;
        };
    }

    // 下架商品
    $scope.downGoodsSub = function(data){
        SalingGoods.DownGoods(data).then(function(response){
            console.log(response)
            if(response.code == 0){
                SweetAlert.swal({
                    title: "",
                    text: "下架商品成功！",
                    timer: 1000,
                    showConfirmButton: false,
                    type : "success"
                });
                $scope.getGoodsList();
            }else{
                SweetAlert.swal("",response.msg,"error");
            }
        })
    }
    // 下架单个商品
    $scope.downGoods = function(goods){
        SweetAlert.swal({
            title:"",
            text: "是否下架该商品！",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "确定",
            cancelButtonText: "返回",
            closeOnConfirm: true,
            html: true,
        },function(isfirm){
            if(isfirm){
                var data = {
                    gsnList : []
                }
                data.gsnList.push(goods.g_sn);
                data.gsnList = JSON.stringify(data.gsnList);
                $scope.downGoodsSub(data);
            }
        });
    };

    // 下架多个商品
    $scope.downGoodsChoosed = function(){
        SweetAlert.swal({
            title:"",
            text: "是否下架选中商品！",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "确定",
            cancelButtonText: "返回",
            closeOnConfirm: true,
            html: true,
        },function(isfirm){
            if(isfirm){
                var goodsDownArr =  []
                for(var i = 0;i < $scope.goodsListData.length;i++){
                    if($scope.goodsListData[i].checked){
                        goodsDownArr.push($scope.goodsListData[i].g_sn)
                    }
                };
                SweetAlert.close();
                if(goodsDownArr <= 0){
                    SweetAlert.swal({
                        title: "",
                        text: "请选择下架商品!",
                        timer: 1000,
                        showConfirmButton: false,
                        type : "warning"
                    });
                    return;
                }
                var data = {
                    gsnList : JSON.stringify(goodsDownArr)
                }
                $scope.downGoodsSub(data);
            }
        });

    };


    // 监听商品列表分页数值变化
    $scope.$watch(function() {
            return $scope.bigCurrentPage;
        },
        function(value) {
            if (value) {
                $scope.bigCurrentPage = value;
                value = Number(value);
                if($scope.store){
                    $scope.getGoodsList()
                }else{
                    $scope.getStoreList()
                }
            }
        },
        true
    );

    // 监听套餐列表分页数值变化
    $scope.$watch(function() {
            return $scope.bigCurrentPage2;
        },
        function(value) {
            if (value) {
                $scope.bigCurrentPage2 = value;
                value = Number(value);
                if($scope.store){
                    $scope.getRecommendGoods();
                }else{
                    $scope.getStoreList()
                }
            }
        },
        true
    );
    // 商品列表跳转页数
    $scope.setPage = function () {
        if($scope.reqPage > $scope.maxPage){
            return;
        }
        $scope.bigCurrentPage = $scope.reqPage;
    }
    // 商品分类跳转页数
    $scope.setPage2 = function () {
        if($scope.reqPage2 > $scope.maxPage2){
            return;
        }
        $scope.bigCurrentPage2 = $scope.reqPage2;
    }
    // 删除商品
    $scope.delGoods = function(goods){
        SweetAlert.swal({
            title:"",
            text: "是否删除该商品?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "确定",
            cancelButtonText: "返回",
            closeOnConfirm: true,
            html: true,
        },function(isfirm){
            if(isfirm){
                var data = {
                    gsnList : []
                }
                data.gsnList.push(goods.g_sn);
                data.gsnList = JSON.stringify(data.gsnList);
                SweetAlert.close();
                SalingGoods.DelGoods(data).then(function(response){
                    if(response.code == 0){
                        SweetAlert.swal({
                            title: "",
                            text: "删除商品成功!",
                            timer: 1000,
                            showConfirmButton: false,
                            type : "success"
                        });
                        $scope.getGoodsList();
                    }else{
                        SweetAlert.swal("",response.msg,"error");
                    }
                })
            }
        })
    };
    // 删除多个商品
    $scope.delChoosedGoods = function(){
        SweetAlert.swal({
            title:"",
            text: "是否删除选中的商品？",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "确定",
            cancelButtonText: "返回",
            closeOnConfirm: true,
            html: true,
        },function(isfirm){
            if(isfirm){
                var data = {
                    // staff_sn : staff.staff_sn,
                    // token : token
                };
                SweetAlert.close();
                SalingGoods.DelGoods(data).then(function(response){
                    if(response.code == 0){
                        SweetAlert.swal({
                            title: "",
                            text: "删除商品成功！",
                            timer: 1000,
                            showConfirmButton: false,
                            type : "success"
                        });
                        $scope.getGoodsList();
                    }else{
                        SweetAlert.swal("",response.msg,"error");
                    }
                })
            }
        })
    }
    // 删除套餐
    $scope.delRecommend = function(recommend){
        SweetAlert.swal({
            title:"",
            text: "是否删除该套餐?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "确定",
            cancelButtonText: "返回",
            closeOnConfirm: true,
            html: true,
        },function(isfirm){
            if(isfirm){
                var data = {
                    cb_sn : recommend.cb_sn
                }
                SweetAlert.close();
                SalingGoods.DelCombo(data).then(function(response){
                    if(response.code == 0){
                        SweetAlert.swal({
                            title: "",
                            text: "删除套餐成功！",
                            timer: 1000,
                            showConfirmButton: false,
                            type : "success"
                        });
                        $scope.getRecommendGoods();
                    }else{
                        SweetAlert.swal("",response.msg,"error");
                    }
                })
            }
        })
    }

    // 修改套餐
    $scope.editRecommed = function(recommend){
        console.log("ssssssssss")
    }

});
// 修改商品信息
app.controller('editSalingGoodsCtrl', function($uibModalInstance,$scope,$timeout,$rootScope,SweetAlert,$uibModal,$localStorage,Auth,SalingGoods,$localStorage,apiUrl,salingGoodsController,ShelfGoodsList,goodsTypeList) {
    var token = Auth.getLocalData("token");
    var store_sn = Auth.getLocalData("store_sn");
    $scope.placeholderTextName = "请输入商品名称                     "  + "0/" + "10";
    $scope.placeholderTextGoodsPrice = "请输入商品售价";
    $scope.placeholderTextGoodsInfo = "请输入商品介绍                     "  + "0/" + "30";

    $scope.goodsInfo = ShelfGoodsList;//商品信息
    $scope.goodsTypeList = goodsTypeList;//分类
    //当前商品信息
    $scope.oldName = $scope.goodsInfo.name;//名字
    $scope.oldPrice = $scope.goodsInfo.price;//价格
    $scope.oldInfo = $scope.goodsInfo.info;//信息
    $scope.out_category_sn = $scope.goodsInfo.out_category_sn;//所属分类
    $scope.goods_hot = $scope.goodsInfo.goods_hot;
    console.log($scope.goodsInfo);
    if($scope.goodsTypeList.length > 0){
        for(var z = 0;z < $scope.goodsTypeList.length;z++){
            $scope.goodsTypeList[z]
            if($scope.goodsTypeList[z].category_sn == $scope.goodsInfo.out_category_sn){
                $scope.goodsType = $scope.goodsTypeList[z];
            }
        }
    }

    //传给后台
    function submitForm(data){
        SalingGoods.changeShelfGoodsMess(data).then(function(response){
            if(response.code  == 0){
                SweetAlert.swal({
                    title: "",
                    text: "修改商品成功！",
                    timer: 1000,
                    showConfirmButton: false,
                    type : "success"
                });
                if(salingGoodsController.category_sn == "rx"){
                    salingGoodsController.getHotGoods()
                }else{
                    salingGoodsController.getGoodsList()
                }
                $scope.close();
            }else{
                var msg = response.msg;
                SweetAlert.swal("",msg,"error");
            }
        })
    }
    //点击修改
    $scope.editGoodsTypeSub = function(){
        //拼凑数据
        var data = {};
        var file = {};
        if(!!$scope.ossPath){
            data['cover_url'] = $scope.ossPath;
            data['file'] = '{'+'"bucket":'+'"'+$scope.bucket+'"'+',"org_path":'+'"'+$scope.ossPath+'"'+',"width":'+'"'+$scope.imgFileWidth+'"'+',"height":'+'"'+$scope.imgFileHeight+'"'+',"size":'+'"'+$scope.fileSize+'"'+'}';
        }else{
            data['file'] = "";
            data['cover_url'] = $scope.goodsInfo.cover_url;
        }
        data['g_sn'] = $scope.goodsInfo.g_sn;
        data['name'] = $scope.oldName;
        data['info'] = $scope.oldInfo;
        data['price'] = $scope.oldPrice;
        data['out_goods_sn'] = $scope.goodsInfo.out_goods_sn;
        data['out_category_sn'] = $scope.goodsType.category_sn;
        data['goods_hot'] = $scope.goodsInfo.goods_hot;
        console.log(data);
        //调用修改函数
        submitForm(data);
    };
    //切换分类
    $scope.getFilmlistByStoreSn = function(){
        if(!!$scope.classification){
            //$scope.categoryName = $scope.classification;
            for(var i = 0; i < $scope.goodsTypeList.length; i++){
                if($scope.classification == $scope.goodsTypeList[i].name){
                    $scope.out_category_sn = $scope.goodsTypeList[i].category_sn;
                }
            }
        }
    };
    // 关闭
    $scope.close = function(){   
        $uibModalInstance.close();
    }
    //上传成功回调
    var callbackOnSuccessFunc = function(){
        //一般来说需要把这个路径和buccket写入js变量或隐藏input去，提交时判断，没有的话就是没传文件
        //alert('bucket=' + qnUpload.uploadSignInfo.bucket + ', aliyunPath=' + qnUpload.ossPath);
        $scope.ossPath = qnUpload.ossPath;
        $scope.bucket = qnUpload.uploadSignInfo.bucket;

        $scope.imgFileWidth = qnUpload.imgFileWidth;
        $scope.imgFileHeight = qnUpload.imgFileHeight;
        $scope.fileSize = qnUpload.fileSize;
        $scope.$apply();
    }
    var qnUpload = new QnUpload(apiUrl.commonUrlTwo, 'PT_FT_OSS', 'STORE_RETAIL', 'retail_img', callbackOnSuccessFunc);
    qnUpload.init();
});