app
.controller('storeMasterController',function ($scope,$timeout,$rootScope,SweetAlert,$uibModal,$localStorage,apiUrl,Auth,StoreMaster,$localStorage) {
    // 分页设置
    $scope.maxSize = 5;
    $scope.perPage = 10;
    $scope.bigCurrentPage = 1;
    $scope.isBind = "";
    $scope.imei = "";
    $scope.storeSn = "";
	
    // 获得门店列表
    $scope.getStoreList = function(){
        StoreMaster.GetStoreList().then(function(response){
            $scope.storeListData = response.data;
        })
    };
    $scope.getStoreList();
    // 请求imei列表
    $scope.getMachineList = function(data){
        StoreMaster.GetMachineList(data).then(function(response){
            if(response.code  == 0){
            	$scope.machineList = response.data.data;
                for(var i = 0;i <　$scope.machineList.length;i++){
                    $scope.machineList[i].checked = false;
                }
            	//最大页数
                $scope.maxPage = response.data.last_page
                // 总条数
                $scope.bigTotalItems = response.data.total
                // 每页条数
                $scope.perPage = response.data.per_page;
            }else{
                var msg = response.msg;
                SweetAlert.swal("",msg,"error");
            }
        })
    };
        // 监听分页数值变化
    $scope.$watch(function() {
            return $scope.bigCurrentPage;
        },
        function(newValue,oldValue) {

            console.log(newValue);
            console.log(oldValue);

            $scope.option1 = false;
            var data = {
            	is_bind : $scope.isBind,
            	imei : $scope.imei,
            	store_sn : $scope.storeSn,
                page : newValue
            };
            delEmptyAttr(data);
            $scope.getMachineList(data);
        },
        true
    );

    // 选中所有IMEI
    $scope.checkAllChoose = function(){
        for(var j = 0;j < $scope.machineList.length;j++){
            $scope.machineList[j].checked = $scope.option1;
        }
    }
    $scope.searchBtn = function(){
    	var data = {
    		is_bind : $scope.isBind,
        	imei : $scope.imei,
            store_sn : $scope.storeSn,
            page : 1
    	};
        delEmptyAttr(data);
    	console.log(data);
    	if($scope.bigCurrentPage == 1){
    		$scope.getMachineList(data);
    	}else{
    		$scope.bigCurrentPage = 1
    	}
    };

    // 添加IMEI
    $scope.createMachineImei =  function(){
        var modalInstance = $uibModal.open({
            animation: true,
            backdrop : "static",
            templateUrl: 'createMachineImei.html',
            controller: 'createMachineImeiCtrl',
            resolve: {
                storeMasterController : function(){
                    return $scope
                }
            }
        });
        modalInstance.result.then(function () {
        });
    };

    //删除IMEI
    $scope.delMachineImei = function(){
        var delArr = [];
        for(var q = 0;q < $scope.machineList.length;q++){
            if($scope.machineList[q].checked){
                delArr.push($scope.machineList[q].imei)
            }
        }
        if(delArr.length == 0){
            SweetAlert.swal({
                title: "",
                text: "请选择要删除的IMEI！",
                timer: 1000,
                showConfirmButton: false,
                type : "warning"
            })
            return;
        }
        var data = {
            imei : delArr.join(",")
        }
        StoreMaster.DelMachineImei(data).then(function (response) {
            if(response.code == 0){
                var data = {
                    page : $scope.bigCurrentPage
                };
                $scope.getMachineList(data)
                SweetAlert.swal({
                    title: "",
                    text: "删除成功！",
                    timer: 1000,
                    showConfirmButton: false,
                    type : "success"
                })
            }else{
                SweetAlert.swal("",response.msg,"error");
            }
        })
    };

    //编辑IMEI
    $scope.editMachine = function(machine,$index){
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'ediMachineImei.html',
            controller: 'ediMachineImeiCtrl',
            resolve: {
                storeMasterController : function(){
                    return $scope
                },
                machineInfo : function(){
                    return machine
                },
                index : function(){
                    return $index
                }
            }
        });
        modalInstance.result.then(function () {
        });
    }
});
// 添加
app
.controller('createMachineImeiCtrl',function ($scope,$timeout,SweetAlert,$uibModal,$uibModalInstance,$localStorage,StoreMaster,storeMasterController,$localStorage) {
    $scope.createMachineImeiSub = function(){
        var data = {
            num : $scope.num
        };
        StoreMaster.CrateMachineImei(data).then(function (response) {
            if(response.code == 0){
                var data = {
                    page : 1
                }
                storeMasterController.getMachineList(data);
                $scope.close();
                SweetAlert.swal({
                    title: "",
                    text: "创建成功！",
                    timer: 1000,
                    showConfirmButton: false,
                    type : "success"
                })
            }else{
                SweetAlert.swal("",response.msg,"error");
            }
        })
    };
    $scope.close = function(){
        $uibModalInstance.close();
    };
});
// 编辑
app
.controller('ediMachineImeiCtrl',function ($scope,$timeout,SweetAlert,$uibModal,$uibModalInstance,$localStorage,StoreMaster,storeMasterController,machineInfo,index) {
    if(machineInfo.store_info.store_sn){
        $scope.store_sn = machineInfo.store_info.store_sn;
    }else{
        $scope.store_sn = "";
    }
    // 获取门店列表数据
    $scope.config2 = storeMasterController.storeListData;
    // 绑定门店
    $scope.bindStoreSub = function(){
        var data = {
            server_imei : machineInfo.imei,
            store_sn : $scope.store_sn
        };
        if(!data.store_sn){
            SweetAlert.swal({
                title: "",
                text: "请选择门店再绑定",
                timer: 1000,
                showConfirmButton: false,
                type : "warning"
            });
            return;
        }
        StoreMaster.BindStore(data).then(function (response) {
            if(response.code == 0){
                var data = {
                    page : 1
                }
                storeMasterController.getMachineList(data);
                $scope.close();
                SweetAlert.swal({
                    title: "",
                    text: "绑定成功！",
                    timer: 1000,
                    showConfirmButton: false,
                    type : "success"
                })
            }else{
                SweetAlert.swal("",response.msg,"error");
            }
        })
        console.log(data)
    };
    // 解绑门店
    $scope.unbindStoreSub = function(){
        var data = {
            server_imei : machineInfo.imei,
            store_sn : $scope.store_sn
        };
        if(!data.store_sn){
            SweetAlert.swal({
                title: "",
                text: "请选择正确门店再进行解绑",
                timer: 1000,
                showConfirmButton: false,
                type : "warning"
            });
            return;
        }
        StoreMaster.UnbindStore(data).then(function (response) {
            if(response.code == 0){
                var data = {
                    page : 1
                 }
                storeMasterController.getMachineList(data);
                $scope.close();
                SweetAlert.swal({
                    title: "",
                    text: "绑定成功！",
                    timer: 1000,
                    showConfirmButton: false,
                    type : "success"
                })
            }else{
                SweetAlert.swal("",response.msg,"error");
            }
        })
    }

    $scope.close = function(){
        $uibModalInstance.close();
    };

});