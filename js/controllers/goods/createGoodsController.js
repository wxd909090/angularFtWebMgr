app
.controller('createGoodsController',function ($scope,$timeout,$rootScope,SweetAlert,$uibModal,$localStorage,myService,Auth,CreateGoods,$localStorage,apiUrl) {
    var token = Auth.getLocalData("token");
    var store_sn = Auth.getLocalData("store_sn");
    $scope.goodsInfo = null;
    $scope.category_sn = null;
    $scope.goodsListArr = [];
    console.log(token);
    // 请求门店列表
    $scope.getStoreList = function(){
        var data = {
        };
        CreateGoods.GetStoreList(data).then(function(response){
            if(response.code  == 0){
                $scope.storeListData = response.data;
                var getStore = myService.get();
                if(getStore.store){
                    if($scope.storeListData.length > 0){
                        for(var q = 0;q < $scope.storeListData.length;q++){
                            if($scope.storeListData[q].store_sn == getStore.store.store_sn){
                                $scope.store = $scope.storeListData[q];
                            }
                        }
                    }else{
                        $scope.store = $scope.storeListData[0];
                    }
                }else{
                    $scope.store = $scope.storeListData[0];
                }
                $scope.getGoodsTypeList();
            }else{
                var msg = response.msg;
                SweetAlert.swal("",msg,"error");
            }
        })
    };

    // 切换门店
    $scope.changeStore = function(){
        $scope.getGoodsTypeList();
    }

    // 获取分类列表
    $scope.getGoodsTypeList = function(){
        var data = {
            store_sn : $scope.store.store_sn
        };
        CreateGoods.GetGoodsTypeList(data).then(function(response){
            if(response.code  == 0){
                $scope.goodsTypeList = response.data.data;
            }else{
                var msg = response.msg;
                SweetAlert.swal("",msg,"error");
            }
        })
    };

    // 添加商品
    $scope.addGoods = function(){
        var modalInstance = $uibModal.open({
            animation: true,
            backdrop : "static",
            templateUrl: 'addGoodsMo.html',
            controller: 'addGoodsMoCtrl',
            resolve: {
                createGoodsController: function () {
                    return $scope;
                }
            }
        });
        modalInstance.result.then(function () {
            // console.log("关闭查看所有设备")
        });
    };


    // 修改商品信息
    // $scope.editGoods = function(goods,index){
    //     var modalInstance = $uibModal.open({
    //         animation: true,
    //         backdrop : "static",
    //         templateUrl: 'editGoodsMo.html',
    //         controller: 'editGoodsMoCtrl',
    //         resolve: {
    //             createGoodsController: function () {
    //                 return $scope;
    //             },
    //             editGoods: function () {
    //                 return goods;
    //             },
    //             index: function () {
    //                 return index;
    //             }
    //         }
    //     });
    //     modalInstance.result.then(function () {
    //         // console.log("关闭查看所有设备")
    //     });
    // }

    // 删除商品信息
    $scope.delGoods = function(goods,index){
        $scope.goodsListArr.splice(index,1);
    }
    // 获取门店列表和分类列表
    $scope.getStoreList();

    // 提交添加商品
    $scope.creatrGoodsSub = function(){
        var data = {
            "data" : JSON.stringify($scope.goodsListArr)
        };
        console.log(data);
        CreateGoods.AddGoods(data).then(function(response){
            if(response.code  == 0){
                SweetAlert.swal({
                    title: "",
                    text: "添加商品成功！",
                    timer: 1000,
                    showConfirmButton: false,
                    type : "success"
                });
                $timeout(function(){
                    $rootScope.$state.go("app.salingGoods");
                },1000)
            }else{
                var msg = response.msg;
                SweetAlert.swal("",msg,"error");
            }
        })
    }


});
// 添加商品信息
app.controller('addGoodsMoCtrl', function($scope,$uibModalInstance,$timeout,SweetAlert,CreateGoods,Auth,$localStorage,createGoodsController,apiUrl,ngVerify) {
    var token = Auth.getLocalData("token");
    var store_sn = Auth.getLocalData("store_sn");
    $scope.goodsInfo = {
        status:1,
        goods_hot:1
    };
    $scope.placeholderTextName = "请输入商品名称                     "  + "0/" + "10";
    $scope.placeholderTextGoodsPrice = "请输入商品售价";
    $scope.placeholderTextGoodsInfo = "请输入商品介绍                     "  + "0/" + "30";
    $scope.addGoodsSub = function(){
        console.log($scope.goodsInfo);
        if($scope.goodsInfo.name.length > 10){
            SweetAlert.swal({
                title: "",
                text: "商品名字长度不能大于10！",
                timer: 1000,
                showConfirmButton: false,
                type : "warning"
            });
            return;
        };
        if(!($scope.goodsInfo.price > 0)){
            SweetAlert.swal({
                title: "",
                text: "商品价格应是大于0的整数！",
                timer: 2000,
                showConfirmButton: false,
                type : "warning"
            })
            return;
        };
        if($scope.ossPath){
            $scope.goodsInfo['file'] = '{'+'"bucket":'+'"'+$scope.bucket+'"'+',"org_path":'+'"'+$scope.ossPath+'"'+',"width":'+'"'+$scope.imgFileWidth+'"'+',"height":'+'"'+$scope.imgFileHeight+'"'+',"size":'+'"'+$scope.fileSize+'"'+'}';
            $scope.goodsInfo['cover_url'] = $scope.ossPath;
        }
        
        // 添加门店store_sn
        $scope.goodsInfo.store_sn = createGoodsController.store.store_sn;
        // 添加商品分类sn
        $scope.goodsInfo.category_sn = createGoodsController.category_sn;

        console.log($scope.goodsInfo);
        if(!$scope.goodsInfo.cover_url){
            SweetAlert.swal({
                title: "",
                text: "请上传商品图片！",
                timer: 2000,
                showConfirmButton: false,
                type : "warning"
            });
            return;
        }
        // 添加到商品显示数组
        createGoodsController.goodsListArr.push($scope.goodsInfo);
        $scope.close();
    };

        //上传成功回调
    var callbackOnSuccessFunc = function(){
        //一般来说需要把这个路径和buccket写入js变量或隐藏input去，提交时判断，没有的话就是没传文件
        //alert('bucket=' + qnUpload.uploadSignInfo.bucket + ', aliyunPath=' + qnUpload.ossPath);
        $scope.ossPath = qnUpload.ossPath;
        $scope.bucket = qnUpload.uploadSignInfo.bucket;

        $scope.imgFileWidth = qnUpload.imgFileWidth;
        $scope.imgFileHeight = qnUpload.imgFileHeight;
        $scope.fileSize = qnUpload.fileSize;
        console.log($scope.ossPath);
        $scope.$apply();
    }
    var qnUpload = new QnUpload(apiUrl.commonUrlTwo, 'PT_FT_OSS', 'STORE_RETAIL', 'retail_img', callbackOnSuccessFunc);
    //var qnUpload = new QnUpload("http://api2.qnbar.cn/", 'PT_FT_OSS', 'STORE_RETAIL', 'retail_img', callbackOnSuccessFunc);
    qnUpload.init();
    // 关闭模态框
    $scope.close = function(){
        $uibModalInstance.close();
    }
});
// // 修改商品信息
// app.controller('editGoodsMoCtrl', function($scope,$uibModalInstance,$timeout,SweetAlert,CreateGoods,Auth,$localStorage,createGoodsController,editGoods,index,apiUrl,ngVerify) {
//     var token = Auth.getLocalData("token");
//     var store_sn = Auth.getLocalData("store_sn");
//     $scope.goodsInfo = goods;
//     console.log($scope.goodsInfo);

//     // 关闭模态框
//     $scope.close = function(){
//         $uibModalInstance.close();
//     }
// });