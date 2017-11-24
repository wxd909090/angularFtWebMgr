app
.controller('posterController',function ($scope,$timeout,$rootScope,SweetAlert,$uibModal,$localStorage,Auth,Poster,$localStorage,apiUrl) {
    var token = Auth.getLocalData("token");
    console.log(token);
    GetStoreList();
    //获取 商家 列表
    function GetStoreList(){
        var data = {};
        Poster.GetStoreList(data).then(function(response){
            if(response.code  == 0){
                $scope.storeListData = response.data;
    			$scope.storeAssessSn = getStoreAssessSn($scope.storeListData)
            }else{
                var msg = response.msg;
                SweetAlert.swal("",msg,"error");
            }
        })
    };

    function getStoreAssessSn(storeListData) {
        if($scope.storeAssessSn){
            return $scope.storeAssessSn;
        } else {
            if(storeListData){
                return storeListData[0]['store_sn'];
            } else {
                return '';
            }
        }
    }


    // 编辑海报
    $scope.editPoster = function(){
    	console.log("sss");
    }

    
});