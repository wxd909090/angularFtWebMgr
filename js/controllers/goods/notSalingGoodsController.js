app
.controller('notSalingGoodsController',function ($scope,$timeout,$rootScope,SweetAlert,$uibModal,$localStorage,Auth,myService,NotSalingGoods,$localStorage,apiUrl) {
    var token = Auth.getLocalData("token");
    var store_sn = Auth.getLocalData("store_sn");
    $scope.category_sn = '';//切换分类的sn
    $scope.machine = [];
    $scope.add = "123";
    //请求门店列表
    function GetStoreList(){
        var data = {
        };
        NotSalingGoods.GetStoreList(data).then(function(response){
            if(response.code  == 0){
                $scope.storeListData = response.data;//所有门店数据
                $scope.store = $scope.storeListData[0];//默认第一个门店
                $scope.getGoodsTypeList();

                var data = {};
                data['store_sn'] = $scope.store.store_sn;
                data['category_sn'] = "";
                data['status'] = 2;
                data['page'] = 0;
                //请求商品列表
                $scope.getOffShelfGoodsList(data);
                //$scope.getGoodsTypeList();
            }else{
                var msg = response.msg;
                SweetAlert.swal("",msg,"error");
            }
        })
    };
    GetStoreList();
    // 获取分类列表
    $scope.getGoodsTypeList = function(){
        var data = {
            store_sn : $scope.store.store_sn
        };
        NotSalingGoods.GetGoodsTypeList(data).then(function(response){
            if(response.code  == 0){
                $scope.goodsTypeList = response.data.data;
                console.log($scope.goodsTypeList);
            }else{
                var msg = response.msg;
                SweetAlert.swal("",msg,"error");
            }
        })
    };
    //获取下架商品列表
    $scope.getOffShelfGoodsList = function(data){
        NotSalingGoods.getOffShelfGoodsList(data).then(function(response){
            if(response.code  == 0){
                $scope.offShelfGoodsList = response.data;
                $scope.machineList = response.data;
                if($scope.offShelfGoodsList[0] == ""){
                    $scope.offShelfGoodsList = [];
                    $scope.machineList = [];
                }
                for(var i = 0; i<$scope.machineList.length; i++){
                    $scope.machineList[i].checked = false;
                }

            }else{
                var msg = response.msg;
                SweetAlert.swal("",msg,"error");
            }
        })
    };
    $scope.inputChange = function(index){
        if($scope.machineList[index].checked == false){
            $scope.machineList[index].checked = true;
        }else{
            $scope.machineList[index].checked = false;
        }
    };
    //基本功能
    //选中所有IMEI
    $scope.checkAllChoose = function(){
        for(var j = 0;j < $scope.machineList.length;j++){
            $scope.machineList[j].checked = $scope.option1;
        }
    };
    //切换门店
    $scope.changeStore = function(store){
        console.log(store);
        //$scope.store = store;

        var data = {};
        data['store_sn'] = $scope.store.store_sn;
        data['category_sn'] = $scope.category_sn;
        data['status'] = 2;
        data['page'] = 0;
        $scope.getOffShelfGoodsList(data);
        $scope.classification = "";
        $scope.getGoodsTypeList();
    };
    //监听商品分类
    $scope.$watch(function() {
            return $scope.classification;
        },
        function(newVal,oldVal) {
            if (newVal != oldVal) {
                $scope.category_sn = '';
                for(var i=0; i<$scope.goodsTypeList.length; i++){
                    var dom = $scope.goodsTypeList[i];

                    if(dom.name == newVal){
                        $scope.category_sn = dom.category_sn; 
                        $scope.newCategoryName = newVal;
                    }
                };
                //调用获取列表的函数
                //组装数据
                var data = {};
                data['store_sn'] = $scope.store.store_sn;
                data['category_sn'] = $scope.category_sn;
                console.log($scope.category_sn);
                data['status'] = 2;
                data['page'] = 0;

                $scope.getOffShelfGoodsList(data);

            }
        },
        true
    );
    //表格后面删除
    $scope.delEditorStore = function(data){
        var arr = [];
        arr.push(data.g_sn);
        var newData = {};
        newData['gsnList'] = JSON.stringify(arr);
        NotSalingGoods.deleteShelfGoods(newData).then(function(response){
            if(response.code  == 0){
                SweetAlert.swal("","删除成功","success");
                var data = {};
                data['store_sn'] = $scope.store.store_sn;
                data['category_sn'] = $scope.category_sn;
                data['status'] = 2;
                data['page'] = 0;

                $scope.getOffShelfGoodsList(data);
            }else{
                var msg = response.msg;
                SweetAlert.swal("",msg,"error");
            }
        })
    } 
    //统一删除
    $scope.delMachineImei = function(){
        //组装数组
        var comArr = [];
        var copyObj = {};   
        for(var i = 0; i < $scope.machineList.length; i++){
            if($scope.machineList[i].checked == true){
                comArr.push($scope.machineList[i].g_sn);
            }
        };
        copyObj['gsnList'] = JSON.stringify(comArr);
        NotSalingGoods.deleteShelfGoods(copyObj).then(function(response){
            if(response.code  == 0){
                SweetAlert.swal({
                    title: "",
                    text: "删除商品成功！",
                    timer: 1000,
                    showConfirmButton: false,
                    type : "success"
                });
               var data = {};
                data['store_sn'] = $scope.store.store_sn;
                data['category_sn'] = $scope.category_sn;
                data['status'] = 2;
                data['page'] = 0;

                $scope.getOffShelfGoodsList(data);
            }else{
                var msg = response.msg;
                SweetAlert.swal("",msg,"error");
            }
        })
    }
    //copyObjFunc
    $scope.copyObjFunc = function(obj){
        var newObj = {};
        for (var item in obj){
            newObj[item] = obj[item];
        } 
        return newObj;
    }
    //上架
    $scope.createMachineImei = function(){
       //组装数组
        var comArr = [];
        var copyObj = {};
        for(var i = 0; i < $scope.machineList.length; i++){
            if($scope.machineList[i].checked == true){
                comArr.push($scope.machineList[i].g_sn);
            }
        };
        copyObj['gsnList'] = JSON.stringify(comArr);
        NotSalingGoods.onShelfGoods(copyObj).then(function(response){
            if(response.code  == 0){
                SweetAlert.swal("","上架成功","success");
                //刷新列表
                var data = {};
                data['store_sn'] = $scope.store.store_sn;
                data['category_sn'] = $scope.category_sn;
                data['status'] = 2;
                data['page'] = 0;
                console.log($scope);
                $scope.getOffShelfGoodsList(data);
            }else{
                var msg = response.msg;
                SweetAlert.swal("",msg,"error");
            }
        })
    } 
    //修改
    //编辑商品
    $scope.editGoods = function(ShelfGoodsList){
        var modalInstance = $uibModal.open({
            animation: true,
            backdrop : "static",
            templateUrl: 'editGoods.html',
            controller: 'editGoodsCtrl',
            resolve: {
                notSalingGoodsController: function () {
                    return $scope;
                },
                ShelfGoodsList : function () {
                    return ShelfGoodsList
                },
                goodsTypeList : function () {
                    return $scope.goodsTypeList
                },
                storeSn : function () {
                    return $scope.store.store_sn
                },
            }
        });
        modalInstance.result.then(function () {
            console.log("修改完毕");
        });
    }
});

// 修改商品信息
app.controller('editGoodsCtrl', function(storeSn,$uibModalInstance,$scope,$timeout,$rootScope,SweetAlert,$uibModal,$localStorage,Auth,NotSalingGoods,$localStorage,apiUrl,notSalingGoodsController,ShelfGoodsList,goodsTypeList) {
                                        
    // var token = Auth.getLocalData("token");
    // var store_sn = Auth.getLocalData("store_sn");
    // $scope.goodsInfo = ShelfGoodsList;//商品信息
    // $scope.goodsTypeList = goodsTypeList;//分类
    // //当前商品信息
    // $scope.oldName = $scope.goodsInfo.name;//名字
    // $scope.oldPrice = $scope.goodsInfo.price;//价格
    // $scope.oldInfo = $scope.goodsInfo.info;//信息
    // $scope.out_category_sn = $scope.goodsInfo.out_category_sn;//所属分类
    // $scope.categoryName = $scope.goodsInfo.category_name;
    // //传给后台
    // function submitForm(data){
    //     NotSalingGoods.changeShelfGoodsMess(data).then(function(response){
    //         if(response.code  == 0){
    //             SweetAlert.swal("","修改成功","success");
    //             $scope.close();
    //             var data = {};
    //             data['store_sn'] = storeSn;
    //             data['category_sn'] = "";
    //             data['status'] = 2;
    //             data['page'] = 0;
    //             //请求商品列表
    //             notSalingGoodsController.getOffShelfGoodsList(data);
    //         }else{
    //             var msg = response.msg;
    //             SweetAlert.swal("",msg,"error");
    //         }
    //     })
    // }
    // //点击修改
    // $scope.editGoodsTypeSub = function(){
    //     //拼凑数据
    //     var data = {};
    //     //data['file'] = '{'+'"bucket":'+'"'+$scope.bucket+'"'+',"org_path":'+'"'+$scope.ossPath+'"'+',"width":'+'"'+$scope.imgFileWidth+'"'+',"height":'+'"'+$scope.imgFileHeight+'"'+',"size":'+'"'+$scope.fileSize+'"'+'}';
        

    //     if(!!$scope.ossPath){
    //         data['cover_url'] = $scope.ossPath;
    //         data['file'] = '{'+'"bucket":'+'"'+$scope.bucket+'"'+',"org_path":'+'"'+$scope.ossPath+'"'+',"width":'+'"'+$scope.imgFileWidth+'"'+',"height":'+'"'+$scope.imgFileHeight+'"'+',"size":'+'"'+$scope.fileSize+'"'+'}';
    //     }else{
    //         data['file'] = "";
    //         data['cover_url'] = $scope.goodsInfo.cover_url;
    //     }



    //     data['cover_of_sn'] = $scope.goodsInfo.cover_of_sn;
    //     data['g_sn'] = $scope.goodsInfo.g_sn;
    //     data['name'] = $scope.oldName;
    //     data['info'] = $scope.oldInfo;
    //     data['price'] = $scope.oldPrice;
    //     data['out_goods_sn'] = $scope.goodsInfo.out_goods_sn;
    //     data['out_category_sn'] = $scope.out_category_sn;
    //     console.log(data);
    //     //调用修改函数
    //     submitForm(data);
    // };
    // //切换分类
    // $scope.getFilmlistByStoreSn = function(){
    //     console.log($scope.classification)
    //     if(!!$scope.classification){
    //         //$scope.categoryName = $scope.classification;
    //         for(var i = 0; i < $scope.goodsTypeList.length; i++){
    //             if($scope.classification == $scope.goodsTypeList[i].name){
    //                 $scope.out_category_sn = $scope.goodsTypeList[i].category_sn;
    //             }
    //         }
    //     }
    // };
    // //上传成功回调
    // var callbackOnSuccessFunc = function(){
    //     //一般来说需要把这个路径和buccket写入js变量或隐藏input去，提交时判断，没有的话就是没传文件
    //     //alert('bucket=' + qnUpload.uploadSignInfo.bucket + ', aliyunPath=' + qnUpload.ossPath);
    //     $scope.ossPath = qnUpload.ossPath;
    //     $scope.bucket = qnUpload.uploadSignInfo.bucket;

    //     $scope.imgFileWidth = qnUpload.imgFileWidth;
    //     $scope.imgFileHeight = qnUpload.imgFileHeight;
    //     $scope.fileSize = qnUpload.fileSize;
    // }
    // var qnUpload = new QnUpload(apiUrl.commonUrlTwo, 'PT_FT_OSS', 'STORE_RETAIL', 'retail_img', callbackOnSuccessFunc);
    // //var qnUpload = new QnUpload("http://api2.qnbar.cn/", 'PT_FT_OSS', 'STORE_RETAIL', 'retail_img', callbackOnSuccessFunc);
    // qnUpload.init();
    // // 关闭
    // $scope.close = function(){   
    //     $uibModalInstance.close();
    // }

    $scope.placeholderTextName = "请输入商品名称                     "  + "0/" + "10";
    $scope.placeholderTextGoodsPrice = "请输入商品售价";
    $scope.placeholderTextGoodsInfo = "请输入商品介绍                     "  + "0/" + "30";


    var token = Auth.getLocalData("token");
    var store_sn = Auth.getLocalData("store_sn");


    $scope.goodsInfo = ShelfGoodsList;//商品信息
    $scope.goodsTypeList = goodsTypeList;//分类
    //当前商品信息
    $scope.oldName = $scope.goodsInfo.name;//名字
    $scope.oldPrice = $scope.goodsInfo.price;//价格
    $scope.oldInfo = $scope.goodsInfo.info;//信息
    $scope.out_category_sn = $scope.goodsInfo.out_category_sn;//所属分类
    $scope.goods_hot = $scope.goodsInfo.goods_hot;//所属分类
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
        NotSalingGoods.changeShelfGoodsMess(data).then(function(response){
            if(response.code  == 0){
                SweetAlert.swal({
                    title: "",
                    text: "修改商品成功！",
                    timer: 1000,
                    showConfirmButton: false,
                    type : "success"
                });
                var data = {};
                data['store_sn'] = storeSn;
                data['category_sn'] = "";
                data['status'] = 2;
                data['page'] = 0;
                notSalingGoodsController.getOffShelfGoodsList(data);
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
        data['goods_hot'] = $scope.goods_hot;
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
        console.log("asdad");
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
       
    }
    var qnUpload = new QnUpload(apiUrl.commonUrlTwo, 'PT_FT_OSS', 'STORE_RETAIL', 'retail_img', callbackOnSuccessFunc);
    qnUpload.init();
});