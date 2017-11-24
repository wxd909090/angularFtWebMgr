app
.controller('goodsTypeController',function ($scope,$timeout,$rootScope,SweetAlert,$uibModal,myService,$localStorage,Auth,EditRecommend,apiUrl) {
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
        EditRecommend.GetStoreList(data).then(function(response){
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
        EditRecommend.GetGoodsTypeList(data).then(function(response){
            if(response.code  == 0){
                $scope.bigTotalItems = response.data.total;
                $scope.maxPage = response.data.total_page;
            	$scope.goodsTypes = response.data.data;
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
});
