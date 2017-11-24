app
.controller('createGoodsTypeController',function ($scope,$timeout,$rootScope,SweetAlert,$uibModal,$localStorage,Auth,myService,CreateGoodsType,$localStorage,apiUrl) {
    var token = Auth.getLocalData("token");
    var store_sn = Auth.getLocalData("store_sn");
    $scope.test = "createGoodsType";
    $scope.addTag = "";
    $scope.createGoodsTypeData = {
    	tag : [],
        name : ""
    };
    $scope.placeholderTextType = "请输入商品分类名称                     " + $scope.createGoodsTypeData.name.length + "/" + "10";
    $scope.placeholderTextTag = "请输入商品分类标签                     " + $scope.createGoodsTypeData.name.length + "/" + "10";
    GetStoreList();
    // 请求门店列表
    function GetStoreList(){
        var data = {
        };
        CreateGoodsType.GetStoreList(data).then(function(response){
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
            }else{
                var msg = response.msg;
                SweetAlert.swal("",msg,"error");
            }
        })
    };

    // 添加标签
    $scope.addTagClick = function(){
    	var tag = $scope.addTag;
    	$scope.addTag = "";
        console.log($scope.createGoodsTypeData.tag);
        for(var q = 0;q < $scope.createGoodsTypeData.tag.length;q++){
            if(tag == $scope.createGoodsTypeData.tag[q].name){
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
    		$scope.createGoodsTypeData.tag.push(data)
    	}
    }

    //返回
    $scope.return = function(){

    };
    // 提交添加商品分类
    $scope.createGoodsSub = function(){
    	$scope.createGoodsTypeData.store_sn = $scope.store.store_sn;
    	var data = $scope.createGoodsTypeData;
    	CreateGoodsType.CreateGoodsType(data).then(function(response){
            if(response.code  == 0){
                console.log(response);
                SweetAlert.swal({
                    title: "",
                    text: "添加商品分类成功！",
                    timer: 1000,
                    showConfirmButton: false,
                    type : "success"
                });
                $timeout(function(){
        			$rootScope.$state.go("app.goodsType");
                },1000)
            }else{
                var msg = response.msg;
                SweetAlert.swal("",msg,"error");
            }
        })
    };
});