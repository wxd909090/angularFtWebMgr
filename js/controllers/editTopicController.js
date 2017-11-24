app
.controller('editTopicController',function ($scope,$timeout,$rootScope,SweetAlert,$uibModal,$localStorage,Auth,myService,EditTopic,$localStorage,apiUrl) {
    var token = Auth.getLocalData("token");
    var topicData = myService.get();
    $scope.editTopicData = topicData;

        //图片上传事件
    $scope.upfileSubmit = function(){
        var  file= document.getElementById('fileInput').files[0];
        if(!file){alert('请选择图片');return ;}

        // 打开上传中提示框
        editTopicController = $scope;
        tipBoxController(editTopicController,"上传中，请等待！",true)

        // 将文件转化为FormData
        var data = new FormData();
        data.append('image', file);
        data.append('name',file.name);  
        data.append('token',token);     

        // 发送文件上传请求
        $.ajax({
            url: apiUrl.url +  "/film/uploadImage",
            type: "POST",
            processData: false,
            contentType: false,
            data: data,
            success: function(response) {
                if(response.code == 0){
                    // 提示上传成功，1秒之后自动关闭
                    tipBoxController(editTopicController,"上传成功！",true)
                    $timeout(function(){
                        tipBoxController(editTopicController,"",false)
                    },1000)

                    // 获得OSS图片返回的地址，将图片显示在页面上
                    $scope.editTopicData.image = response.data.oss_name;

                    // 调用remove事件，清空文件上传
                    document.getElementsByClassName("fileinput-remove-button")[0].click();
                    $scope.$apply();
                }else{
                    SweetAlert.swal("",response.msg,"error");
                }
            }
        });
    };
    // 取消返回
    $scope.returnLastPage = function(){
        window.history.go(-1);
    };
    // 修改保存
    $scope.editTopicSub = function(){
    	var data = {
    		special_sn : $scope.editTopicData.special_sn,
    		special_name : $scope.editTopicData.special_name,
    		info : $scope.editTopicData.info,
    		image : $scope.editTopicData.image,
    	}
    	EditTopic.EditSpecial(data).then(function(response){
	        if(response.code == 0){
	            SweetAlert.swal({
	                title: "",
	                text: "修改集合成功！",
	                timer: 1000,
	                showConfirmButton: false,
	                type : "success"
	            });
	            $timeout(function(){
        			$rootScope.$state.go("app.topic");
	            },1300,1);
	        }else{
	            SweetAlert.swal("",response.msg,"error");
	        }
	    })
    };
});