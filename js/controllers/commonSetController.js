app
.controller('commonSetController',function ($scope,$timeout,$rootScope,$localStorage,Auth,CommonSet,SweetAlert,$uibModal) {
    var token = Auth.getLocalData("token");
	// 获得押金
	getSetting();
    // 获得系统拷贝时间
    getSysCopyDaily();

    
	function getSetting(){
        var data = {
            token : token
        }
		CommonSet.getSetting(data).then(function(response){
			console.log(response);
			if(response.code == 0){
				$scope.storeDeposit = response.data.deposit
			}else{
				SweetAlert.swal("",response.msg,"error")
			}
		})
	}
    function getSysCopyDaily(){
        var data = {
            token : token
        }
        CommonSet.getSysCopyDaily(data).then(function(response){
            console.log(response);
            if(response.code == 0){
                $scope.sysCopyDaily = response.data.max_reserve_day
            }else{
                SweetAlert.swal("",response.msg,"error")
            }
        })
    }


    $scope.storeCommonSet = function(){
    	var re = /^[0-9]+$/ ;
    	var result = re.test($scope.storeDeposit);
    	if(!result){
            SweetAlert.swal({
                title: "",
                text: "请输入大于0的整数！",
                timer: 1000,
                showConfirmButton: false,
                type : "warning"
            })
			return;
    	}
    	var data = {
            token : token,
    		deposit : $scope.storeDeposit
    	};
        CommonSet.setSetting(data).then(function(response){
        	console.log(response);
        	if(response.code == 0){
                SweetAlert.swal({
                    title: "",
                    text: "修改成功！",
                    timer: 1000,
                    showConfirmButton: false,
                    type : "success"
                })
        	}else{
        		SweetAlert.swal("",response.msg,"error")
        	}
        })
    }
    $scope.setSysCopyDaily = function(){
        var token = Auth.getLocalData("token");
        var re = /^[1-9]$|^10$/ ;
        var result = re.test($scope.sysCopyDaily);
        if(!result){
            SweetAlert.swal({
                title: "",
                text: "请输入大于0小于11的整数！",
                timer: 1000,
                showConfirmButton: false,
                type : "warning"
            })
            return;
        }
        var data = {
            token : token,
            day : $scope.sysCopyDaily
        };
        CommonSet.setSysCopyDaily(data).then(function(response){
            console.log(response);
            if(response.code == 0){
                SweetAlert.swal({
                    title: "",
                    text: "修改成功！",
                    timer: 1000,
                    showConfirmButton: false,
                    type : "success"
                })
            }else{
                SweetAlert.swal("",response.msg,"error")
            }
        })
    }
});






