app
.controller('goodsTypeController',function ($scope,$timeout,$rootScope,SweetAlert,$uibModal,$localStorage,myService,Auth,GoodsType,$localStorage,apiUrl) {
    var token = Auth.getLocalData("token");
    var store_sn = Auth.getLocalData("store_sn");
    $scope.store = null;
    // 分页设置
    $scope.bigCurrentPage = 1;
    $scope.maxSize = 5;
    $scope.bigTotalItems = 0;
    $scope.maxPage = 1;

    // 请求门店列表
    $scope.getStoreList = function(){
        var data = {
            page : $scope.bigCurrentPage
        };
        GoodsType.GetStoreList(data).then(function(response){
            if(response.code  == 0){
                $scope.storeListData = response.data;
                $scope.store = $scope.storeListData[0]  
                $scope.getGoodsTypeList();
            }else{
                var msg = response.msg;
                SweetAlert.swal("",msg,"error");
            }
        })
    };
    // 请求商品分类列表
    $scope.getGoodsTypeList = function(){
    	var data = {
    		store_sn : $scope.store.store_sn,
            page : $scope.bigCurrentPage,
    	}
        GoodsType.GetGoodsTypeList(data).then(function(response){
            if(response.code  == 0){
                $scope.bigTotalItems = response.data.total;
                $scope.maxPage = response.data.total_page;
            	$scope.goodsTypes = response.data.data;
                $scope.hotGoodsNormal = response.data.hotGoodsNormal;
                $scope.hotGoodsNotBuy = response.data.hotGoodsNotBuy;
                if($scope.goodsTypes.length > 0){
                    for(var x = 0;x < $scope.goodsTypes.length;x++){
                        if(!$scope.goodsTypes[x].tag){
                            $scope.goodsTypes[x].tag=[];
                        }
                    }
                }
            	console.log($scope.goodsTypes);
            }else{
                var msg = response.msg;
                SweetAlert.swal("",msg,"error");
            }
        })
    };

    // 切换门店
    $scope.changeStore = function () {
        $scope.getGoodsTypeList();
    };

    // 修改商品分类信息
    $scope.editGoodsType = function(goodsType){
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'editGoodsType.html',
            controller: 'editGoodsTypeModalCtrl',
            resolve: {
                goodsTypeController: function () {
                    return $scope;
                },
                goodsType: function () {
                    return goodsType;
                }
            }
        });
        modalInstance.result.then(function () {
        });
    };

    // 新建商品分类
    $scope.goodsTypeCreateGoodsType = function(){
        var data = {
            store : $scope.store
        }
        myService.set(data);
        $rootScope.$state.go("app.createGoodsType");
    };

    // 新建商品
    $scope.goodsTypeCreateGoods = function(){
        var data = {
            store : $scope.store
        }
        myService.set(data);
        $rootScope.$state.go("app.createGoods");
    }

    // 删除商品分类
    $scope.delGoodsType = function(goodsType){
        SweetAlert.swal({
            title:"",
            text: "是否删除该商品分类！",
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
                    category_sn:goodsType.category_sn
                }
                SweetAlert.close();
                GoodsType.DelGoodsType(data).then(function(response){
                    if(response.code == 0){
                        SweetAlert.swal({
                            title: "",
                            text: "删除商品成功！",
                            timer: 1000,
                            showConfirmButton: false,
                            type : "success"
                        });
                        $scope.getGoodsTypeList();
                    }else{
                        SweetAlert.swal("",response.msg,"error");
                    }
                })
            }
        })
    };
    // 拖动配置参数
	$scope.sortableConf = {
		forceFallback: true,
		onStart: true,
		onMove: true,
	};
    // 商品分类数组
	$scope.goodsTypes = [];

	// 监听排序事件
    $scope.$watch(function() {
            return $scope.goodsTypes;
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
                    category_sn : newArr[0].category_sn,
                    priority : newArr[1].priority
                };
                GoodsType.ChangeSort(data).then(function(response){
                    if(response.code == 0){
                        SweetAlert.swal({
                            title: "",
                            text: "排序成功！",
                            timer: 1000,
                            showConfirmButton: false,
                            type : "success"
                        });
                        // $scope.getGoodsTypeList();
                    }else{
                        SweetAlert.swal("",response.msg,"error");
                        $scope.getGoodsTypeList();
                    }
                })
            }

        },
        true
    );
    // 监听分页数值变化
    $scope.$watch(function() {
            return $scope.bigCurrentPage;
        },
        function(value) {
            if (value) {
                $scope.bigCurrentPage = value;
                value = Number(value);
                if($scope.store){
                    $scope.getGoodsTypeList()
                }else{
                    $scope.getStoreList()
                }
            }
        },
        true
    );

    // 商品分类跳转页数
    $scope.setPage = function () {
        if($scope.reqPage > $scope.maxPage){
            return;
        }
        $scope.bigCurrentPage = $scope.reqPage;
    }

    // 新建商品分类
    $scope.createGoodsType = function(){
        $rootScope.$state.go("app.editTopic");
    }
});
// 编辑商品分类模态框控制器
app.controller('editGoodsTypeModalCtrl', function($scope,$uibModalInstance,$timeout,SweetAlert,GoodsType,Auth,$localStorage,goodsTypeController,goodsType,apiUrl,ngVerify) {
    var token = Auth.getLocalData("token");
    var store_sn = Auth.getLocalData("store_sn");
    $scope.addTag = "";
    $scope.goodsTypeData = angular.copy(goodsType);
    if(goodsTypeController.store){
        $scope.goodsTypeData.store_sn = goodsTypeController.store.store_sn
    }
    // 添加标签
    $scope.addTagClick = function(){
        var tag = $scope.addTag;
        $scope.addTag = "";
        for(var q = 0;q < $scope.goodsTypeData.tag.length;q++){
            if(tag == $scope.goodsTypeData.tag[q].name){
                SweetAlert.swal({
                    title: "",
                    text: "添加商品标签重复!",
                    timer: 1000,
                    showConfirmButton: false,
                    type : "warning"
                });
                return;
            }
        }
        var data = {
            name : tag
        }
        if(tag){
            $scope.goodsTypeData.tag.push(data)
        }
    }
    // 删除标签
    $scope.removeTag = function($index){
        $scope.goodsTypeData.tag.splice($index,1);
    }
    $scope.editGoodsTypeSub = function(){
        var data = $scope.goodsTypeData;
        // if(data.tag.length > 0){
        //     for(var c = 0;c < data.tag.length;c++){
        //         delete data.tag[c].$$hashKey
        //     }
        // }
    	GoodsType.EditGoodsType(data).then(function(response){
            if(response.code  == 0){
                SweetAlert.swal({
                    title: "",
                    text: "修改商品分类成功！",
                    timer: 1000,
                    showConfirmButton: false,
                    type : "success"
                });
                goodsTypeController.getGoodsTypeList();
                $scope.close();
            }else{
                var msg = response.msg;
                SweetAlert.swal("",msg,"error");
            }
        })
    };
    // 关闭
    $scope.close = function(){
        $uibModalInstance.close();
    }
});
