app
.controller('businessAppController',function ($scope,$timeout,$rootScope,SweetAlert,$uibModal,$localStorage,Auth,BusinessApp,$localStorage,$interval,apiUrl) {
    var token = Auth.getLocalData("token");
        // 分页设置
    $scope.maxSize = 5;
    $scope.perPage = 10;
    $scope.bigCurrentPage = 1;

    $scope.getStoreApp = function(page){
        var data = {
            token : token,
            page_size : 10,
            page : page
        }
        BusinessApp.GetStoreAppVersion(data).then(function (response) {
            if(response.code == 0){
                $scope.businessAppData = response.data.data;

                //最大页数
                $scope.maxPage = response.data.last_page
                // 总条数
                $scope.bigTotalItems = response.data.total
                // 每页条数
                $scope.perPage = response.data.per_page;
            }else{
                SweetAlert.swal("",response.msg,"error");
            }
        })
    }
    // 监听分页数值变化
    $scope.$watch(function() {
            return $scope.bigCurrentPage;
        },
        function(value) {
            if (value) {
                $scope.bigCurrentPage = value;
                value = Number(value);
                $scope.getStoreApp(value);
            }
        },
        true
    );
    $scope.filmXfList = [];
    $scope.businessAppAdd = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            backdrop : "static",
            templateUrl: 'businessAppAdd.html',
            controller: 'businessAppAddInstanceCtrl',
            resolve: {
                businessAppController : function(){
                    return $scope
                }
            }
        });
        modalInstance.result.then(function () {
        });
    }
    $scope.editBusinessApp = function(businessApp){
    	var modalInstance = $uibModal.open({
            animation: true,
            backdrop : "static",
            templateUrl: 'businessAppEdi.html',
            controller: 'businessAppEdiInstanceCtrl',
            resolve: {
                businessAppController : function(){
                    return $scope
                },
                businessAppData : function () {
                	return businessApp
                }
            }
        });
        modalInstance.result.then(function () {
        });
    }
});
app.controller('businessAppAddInstanceCtrl',function($scope,$uibModalInstance,$location,SweetAlert,$uibModal,$localStorage,Auth,businessAppController,$interval,apiUrl,BusinessApp){
    var token = Auth.getLocalData("token");
    $scope.fileName = "";
    $scope.fileUrl = "";
    $scope.uploadFlag = false;
    $scope.progressText = "";
	$scope.progressStyle = {
        "width" : "5%"
    }
    $scope.checkShowVer = false;
    $scope.checkStoreAppVersionExist = function(){
    	var data = {
    		app_id : $scope.type,
    		version : $scope.verNum
    	}
    	if(!$scope.verNum){
    		return;
    	}
    	BusinessApp.CheckStoreAppVersionExist(data).then(function (response) {
            if(response.code == 0){
            	console.log(response)
            }else{
                SweetAlert.swal("",response.msg,"error");
                $scope.checkShowVer = true;
            }
        })
    };
    $scope.geInVersionExist = function(){
    	$scope.checkShowVer = false;
    }
    $scope.upfileSubmit = function(){

    	var file = $("#fileInput")[0].files[0];
    	if(!file){
    		SweetAlert.swal({
			  	title: "请选择文件",
			  	timer: 1000,
			  	showConfirmButton: true,
			  	type: "warning"
			});
			return;
    	};
    	if(file.name.split(".")[1] != "zip"){
    		SweetAlert.swal({
			  	title: "格式错误",
			  	text: "请上传zip格式的文件",
			  	timer: 2000,
			  	showConfirmButton: true,
			  	type: "warning"
			});
			return;
    	}
		$scope.uploadFlag = true;
		$scope.progressText = "上传中";
		$scope.progressStyle = {
	        "width" : "5%"
	    }

    	// 将文件转化为FormData
        var data = new FormData();
        data.append('jar_lib', file);
        console.log(data);
        var timeout = $interval(function(){
        	if($scope.progressStyle.width == "95%"){
        		$interval.cancel(timeout);
        		return;
        	}
        	$scope.progressStyle.width = (parseInt($scope.progressStyle.width)+5) + "%";
        }, 1000, 10000000);
        // 发送文件上传请求
        $.ajax({
            url: apiUrl.url + "/store/uploadJarLib",
            type: "POST",
            processData: false,
            contentType: false,
            data: data,
            success: function(response) {
                if(response.code == 0){
                    $scope.fileUrl = response.data.oss_url;
                    $interval.cancel(timeout);
                    $scope.progressStyle.width = "100%";
                    $scope.progressText = "上传成功";
                    $scope.$apply();
                }else{
                    SweetAlert.swal("",response.msg,"error");
                    $scope.progressText = "上传失败，请重新上传！"
                }
            }
        });
    };
    $scope.fileNameChanged = function(files){
    	$scope.progressText = "";
    	$scope.uploadFlag = false;
    	console.log($("#fileInput")[0].files[0]);
    	$scope.fileName = $("#fileInput")[0].files[0].name;
    	$scope.progressStyle.width = "5%"
    	$scope.$apply();
    };
    $scope.addBusinessSub = function(){
    	var data = {
    		app_id : $scope.type,
    		version : $scope.verNum,
    		md5 : $scope.fileMd5,
    		download_url : $scope.fileUrl
    	}
    	BusinessApp.AddStoreAppVersion(data).then(function (response) {
            if(response.code == 0){
            	businessAppController.getStoreApp();
                $scope.close();
                SweetAlert.swal({
                    title: "",
                    text: "添加成功",
                    timer: 1000,
                    showConfirmButton: false,
                    type : "warning"
                })
            }else{
                SweetAlert.swal("",response.msg,"error");
            }
        })
    }
    $scope.close = function () {
        $uibModalInstance.close();
    }
})

app.controller('businessAppEdiInstanceCtrl',function($scope,$uibModalInstance,$location,SweetAlert,$uibModal,$window,Auth,$localStorage,businessAppController,$interval,apiUrl,BusinessApp,businessAppData){
    var token = Auth.getLocalData("token");
    $scope.fileName = "";
    $scope.fileUrl = "";
    $scope.uploadFlag = false;
    $scope.progressText = "";
	$scope.progressStyle = {
        "width" : "5%"
    }
    $scope.checkShowVer = false;

    $scope.editBusinessAppData = angular.copy(businessAppData);
    $scope.app_id = $scope.editBusinessAppData.app_id;
    if($scope.app_id == "movie_sync"){
    	$scope.app_id = "电影同步"
    }else{
    	$scope.app_id = "更新APP"
    }
    $scope.verNum = $scope.editBusinessAppData.version;
    $scope.fileMd5 = $scope.editBusinessAppData.md5;
    $scope.fileUrl = $scope.editBusinessAppData.download_url;
    $scope.id = $scope.editBusinessAppData.id;

	$scope.checkStoreAppVersionExist = function(){
    	var data = {
    		app_id : $scope.app_id,
    		version : $scope.verNum
    	}
    	if(!$scope.verNum){
    		return;
    	}
    	BusinessApp.CheckStoreAppVersionExist(data).then(function (response) {
            if(response.code == 0){
            	console.log(response)
            }else{
                SweetAlert.swal("",response.msg,"error");
                $scope.checkShowVer = true;
            }
        })
    };
        $scope.upfileSubmit = function(){

    	var file = $("#fileInput2")[0].files[0];
    	if(!file){
    		SweetAlert.swal({
			  	title: "请选择文件",
			  	timer: 1000,
			  	showConfirmButton: true,
			  	type: "warning"
			});
			return;
    	};
    	if(file.name.split(".")[1] != "zip"){
    		SweetAlert.swal({
			  	title: "格式错误",
			  	text: "请上传zip格式的文件",
			  	timer: 2000,
			  	showConfirmButton: true,
			  	type: "warning"
			});
			return;
    	}
		$scope.uploadFlag = true;
		$scope.progressText = "上传中";
		$scope.progressStyle = {
	        "width" : "5%"
	    }

    	// 将文件转化为FormData
        var data = new FormData();
        data.append('jar_lib', file);
        console.log(data);
        var timeout = $interval(function(){
        	if($scope.progressStyle.width == "95%"){
        		$interval.cancel(timeout);
        		return;
        	}
        	$scope.progressStyle.width = (parseInt($scope.progressStyle.width)+5) + "%";
        }, 1000, 10000000);
        // 发送文件上传请求
        $.ajax({
            url: apiUrl.url + "/store/uploadJarLib",
            type: "POST",
            processData: false,
            contentType: false,
            data: data,
            success: function(response) {
                if(response.code == 0){
                    $scope.fileUrl = response.data.oss_url;
                    $interval.cancel(timeout);
                    $scope.progressStyle.width = "100%";
                    $scope.progressText = "上传成功";
                    $scope.$apply();
                }else{
                    SweetAlert.swal("",response.msg,"error");
                    $scope.progressText = "上传失败，请重新上传！"
                }
            }
        });
    };
    $scope.fileNameChanged = function(files){
    	$scope.progressText = "";
    	$scope.uploadFlag = false;
    	console.log($("#fileInput2")[0].files[0]);
    	$scope.fileName = $("#fileInput2")[0].files[0].name;
    	$scope.progressStyle.width = "5%"
    	$scope.$apply();
    };
    $scope.editBusinessSub = function(){
    	if($scope.app_id == "电影同步"){
    		$scope.app_id = "movie_sync";
    	}else{
    		$scope.app_id = "upgrade";
    	}
    	var data = {
    		app_id : $scope.app_id,
    		version : $scope.verNum,
    		md5 : $scope.fileMd5,
    		download_url : $scope.fileUrl,
    		id : $scope.id
    	};
    	console.log(data);
    	BusinessApp.UpdateStoreAppVersion(data).then(function (response) {
            if(response.code == 0){
            	$window.location.reload();
            }else{
                SweetAlert.swal("",response.msg,"error");
            }
        })
    };
    $scope.geInVersionExist = function(){
    	$scope.checkShowVer = false;
    };
    $scope.deletApp = function(){
    	console.log($scope.id);
    	var data = {
    		id : $scope.id
    	};
    	BusinessApp.DelStoreAppVersion(data).then(function (response) {
            if(response.code == 0){
            	$window.location.reload();
            }else{
                SweetAlert.swal("",response.msg,"error");
            }
        })
    };
	$scope.close = function () {
        $uibModalInstance.close();
    };
})
