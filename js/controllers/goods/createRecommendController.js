app
.controller('createRecommendController',function ($scope,$timeout,$rootScope,SweetAlert,$uibModal,$localStorage,Auth,myService,CreateRecommend,$localStorage,apiUrl) {
    var token = Auth.getLocalData("token");
    var store_sn = Auth.getLocalData("store_sn");
    $scope.goodsListData = [];
    $scope.comData = {
    	status : 1
    };
    console.log(token);

    // 请求门店列表
    $scope.getStoreList = function(){
        var data = {
        };
        CreateRecommend.GetStoreList(data).then(function(response){
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
                
    			$scope.getGoodsList();
            }else{
                var msg = response.msg;
                SweetAlert.swal("",msg,"error");
            }
        })
    };
    $scope.getStoreList();
    // 切换门店
    $scope.changeStore = function(){
        $scope.getGoodsList();
    };

    // 获取商品列表
    $scope.getGoodsList = function(){
        var data = {
            store_sn : $scope.store.store_sn,
            status : 1,
            page : 0,
        };
        CreateRecommend.GetGoodsList(data).then(function(response){
            if(response.code == 0){
                $scope.goodsListData = response.data;
                for(var i = 0;i < $scope.goodsListData.length;i++){
                	$scope.goodsListData[i].num = 0;
                	$scope.goodsListData[i].unit = "";
                }
            }else{
                SweetAlert.swal("",response.msg,"error");
            }
        })
    };


    // 监听商品添加变化
    $scope.$watch(function() {
            return $scope.goodsList;
        },
        function(value) {
            if (value) {
            	var getTotalPrice = 0;
            	if(value.length > 0){
            		for(var q = 0;q < value.length;q++){
            			if(value[q].num > 0 && value[q].unit){
            				getTotalPrice = getTotalPrice + (Number(value[q].price) * Number(value[q].num))
            			};
                	}
            	}
            	$scope.comData.total_price = getTotalPrice;
            }
        },
        true
    );
    // 清空商品
    $scope.emptyGoods = function(goods){
    	goods.num = 0;
    	goods.unit = 0;
    }

    // 添加商品模态框
    $scope.chooseGoods = function(){
    	var modalInstance = $uibModal.open({
            animation: true,
            backdrop : "static",
            templateUrl: 'addGoodsToRec.html',
            controller: 'chooseGoodsCtrl',
            resolve: {
                createRecommendController: function () {
                    return $scope;
                },
            }
        });
        modalInstance.result.then(function () {
            console.log("添加商品");
        });
    }

    $scope.goodsList = [];
    // 新建商品套餐
    $scope.createRecommedSub = function(){
    	if($scope.store.store_sn){
    		$scope.comData.store_sn = $scope.store.store_sn;
    	};
    	// var goodList = [];
    	// for(var i = 0;i < $scope.goodList.length;i++){
    	// 	if($scope.goodList[i].num > 0 && $scope.goodList[i].unit){
    	// 		var data = {
    	// 			g_sn : $scope.goodList[i].g_sn,
    	// 			num : $scope.goodList[i].num,
    	// 			unit : $scope.goodList[i].unit,
    	// 			name : $scope.goodList[i].name,
    	// 		};
    	// 		goodList.push(data);
    	// 	}
    	// };
        if(!!$scope.ossPath){
            $scope.comData['cover_url'] = $scope.ossPath;
            $scope.comData['file'] = '{'+'"bucket":'+'"'+$scope.bucket+'"'+',"org_path":'+'"'+$scope.ossPath+'"'+',"width":'+'"'+$scope.imgFileWidth+'"'+',"height":'+'"'+$scope.imgFileHeight+'"'+',"size":'+'"'+$scope.fileSize+'"'+'}';
        }else{
            $scope.comData['file'] = "";
            $scope.comData['cover_url'] = $scope.goodsInfo.cover_url;
        }
        for(var s = 0;s < $scope.goodsList.length;s++){
            delete $scope.goodsList[s].price;
            delete $scope.goodsList[s].$$hashKey;
        }
        console.log($scope.goodsList);
    	$scope.comData.goodList = JSON.stringify($scope.goodsList);
    	CreateRecommend.createCombo($scope.comData).then(function(response){
            if(response.code == 0){
                SweetAlert.swal({
                    title: "",
                    text: "添加套餐成功！",
                    timer: 1000,
                    showConfirmButton: false,
                    type : "success"
                });
                $timeout(function(){
                    $rootScope.$state.go("app.salingGoods");
                },1000)
            }else{
                SweetAlert.swal("",response.msg,"error");
            }
        })
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
// 修改商品信息
app.controller('chooseGoodsCtrl', function($scope,$uibModalInstance,$timeout,SweetAlert,CreateRecommend,Auth,$localStorage,createRecommendController,apiUrl,ngVerify) {
    var token = Auth.getLocalData("token");
    var store_sn = Auth.getLocalData("store_sn");
    $scope.goodsListData = createRecommendController.goodsListData;
    $scope.unit = "";
    $scope.num = 1;
    $scope.name = "";
    $scope.addGoodsSub = function (argument) {
        for(var q = 0;q < $scope.goodsListData.length;q++){
            if($scope.goodsListData[q].g_sn == $scope.g_sn){
                $scope.name = $scope.goodsListData[q].name;
                $scope.price = $scope.goodsListData[q].price;
                break;
            };
        };
        var data = {
            g_sn : $scope.g_sn,
            num : Number($scope.num),
            unit : $scope.unit,
            name : $scope.name,
            price : $scope.price,
        };
        var re = /^[0-9]+$/ ;
        var result = re.test(data.num);
        if(!result){
            SweetAlert.swal({
                title: "",
                text: "商品请输入大于0的整数！",
                timer: 1000,
                showConfirmButton: false,
                type : "warning"
            })
            return;
        };
        if(data.unit.length > 5){
            SweetAlert.swal({
                title: "",
                text: "商品单位不同超过5个字！",
                timer: 1000,
                showConfirmButton: false,
                type : "warning"
            })
            return;
        }
        createRecommendController.goodsList.push(data);
        $scope.close();
    }
    $scope.close = function(){
        $uibModalInstance.close();
    };
    $scope.emptyNum = function(goods,index){
    	goods.num = 0;
    	goods.unit = "";
    }
});