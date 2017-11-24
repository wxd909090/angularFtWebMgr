app
.controller('newTopicController',function ($scope,$timeout,$rootScope,SweetAlert,$uibModal,$localStorage,Auth,NewTopic,$localStorage,apiUrl) {
    var token = Auth.getLocalData("token");
    console.log(token);
    $scope.addTopicData = {
    	image:""
    };


    //图片上传事件
    $scope.upfileSubmit = function(){
        var  file= document.getElementById('fileInput').files[0];
        if(!file){alert('请选择图片');return ;}

        // 打开上传中提示框
        newTopicController = $scope;
        tipBoxController(newTopicController,"上传中，请等待！",true)

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
                    tipBoxController(newTopicController,"上传成功！",true)
                    $timeout(function(){
                        tipBoxController(newTopicController,"",false)
                    },1000)

                    // 获得OSS图片返回的地址，将图片显示在页面上
                    $scope.addTopicData.image = response.data.oss_name;
                    // 调用remove事件，清空文件上传
                    document.getElementsByClassName("fileinput-remove-button")[0].click();
                    $scope.$apply();
                }else{
                    SweetAlert.swal("",response.msg,"error");
                }
            }
        });
    };

    $scope.addTopicSub = function(){
        var index = $scope.addTopicData.image.indexOf("ftang");
        $scope.addTopicData.image = $scope.addTopicData.image.substring(index);
    	var data = $scope.addTopicData;
    	NewTopic.AddSpecial(data).then(function(response){
            if(response.code == 0){
            	SweetAlert.swal({
	                title: "",
	                text: "添加集合成功！",
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
    }
});