app
.controller('topicController',function ($scope,$timeout,$rootScope,SweetAlert,$uibModal,$localStorage,Auth,Topic,myService,$localStorage,apiUrl) {
    var token = Auth.getLocalData("token");
    $scope.topicListData = [];
    getSpecialList();

    // 获取集合列表
    function getSpecialList(){
        Topic.GetSpecialList().then(function(response){
            if(response.code == 0){
                $scope.topicListData = response.data
            }else{
                SweetAlert.swal("",response.msg,"error");
            }
        });
    };
    // 新建专题
    $scope.toNewTopic = function(){
        $rootScope.$state.go("app.newTopic");
    }

    // 编辑专题
    $scope.toEditTopic = function(topic){
        myService.set(topic);
        $rootScope.$state.go("app.editTopic");
    }


    // 删除专题
    $scope.delTopic = function(topic){
        SweetAlert.swal({
            title:"",
            text: "是否删除该集合！",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "确定",
            cancelButtonText: "返回",
            closeOnConfirm: false,
            html: true,
        }, function(isConfirm){
            if (isConfirm) {
                // 确认删除
                var data = {
                    special_sn : topic.special_sn
                }
                Topic.DelSpecial(data).then(function(response){
                    if(response.code == 0){
                        SweetAlert.swal({
                            title: "",
                            text: "删除集合成功！",
                            timer: 1000,
                            showConfirmButton: false,
                            type : "success"
                        });
                        getSpecialList();
                    }else{
                        SweetAlert.swal("",response.msg,"error");
                    }
                })
            }
        });
    }

    // 专题电影
    $scope.toTopicFilmList = function(topic){
        var special_sn = topic.special_sn;
        $rootScope.$state.go("app.topicFilmList",{special_sn:special_sn});
    }
});