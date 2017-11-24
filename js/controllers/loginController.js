app
.controller('loginController',function ($scope,$timeout,$rootScope,SweetAlert,$uibModal,$localStorage,apiUrl,Auth,Login,$localStorage) {
	// 回车登录事件
	$scope.enterEvent = function(e) {
        var keycode = window.event?e.keyCode:e.which;
        if(keycode==13){
            $scope.signIn()
        }else{
        	return;
        }
    }
    if($localStorage[apiUrl.localName]){
    	Auth.deletLocalData();
    }
    // 点击登录
	$scope.signIn = function(){
		$scope.password = hex_md5($scope.password);
		var data = {
			mobile : $scope.accountNum,
			password : $scope.password,
			type : 2
		}
        Login.Login(data).then(function(response){
        	if(response.code == 0){
			    // 保存设置到本地存储
			    var token = response.data.token;
			    var localStorageData = {
			    	mobile : $scope.accountNum,
					type : 2,
					token : token
			    }
				Auth.setLocalData(localStorageData)
				$rootScope.$state.go("app.storeList");
        	}else{
        		SweetAlert.swal("",response.msg,"error");
        	}   
        })
	}
});