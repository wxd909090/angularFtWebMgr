app
.controller('forbidFilmController',function ($scope,$timeout,$rootScope,SweetAlert,$uibModal,$localStorage,Auth,ForbidFilm,$localStorage,apiUrl) {
    getBlackFilm();
    function getBlackFilm() {
        var data = {};
        ForbidFilm.getBlackFilm(data).then(function(response){
            if(response.code == 0){
                $scope.blackFilmList = response.data;
                editBlackFilmLidt(response.data);
            }else{
                SweetAlert.swal("",response.msg,"error");
            }
        })
    }
    function editBlackFilmLidt(data) {
        $scope.blackFilmListData = [];
        if(data.length > 6){
            var num =  Math.ceil(data.length / 6);
            var start = 0;
            var end = 6;
            for(var i = 0; i < num;i++){
                var tem =null;
                tem = data.slice(start,end);
                $scope.blackFilmListData.push(tem);
                start = end;
                end = 2 *end;
            }
        } else {
            $scope.blackFilmListData.push(data);
        }
    }
    // 增加黑名单电影
    $scope.addBalckFilm = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            backdrop : "static",
            templateUrl: 'addForbidFilm.html',
            controller: 'addForbidFilmModalInstanceCtrl',
            resolve: {
                forbidFilmController: function () {
                    return $scope;
                }
            }
        });
        modalInstance.result.then(function () {
            getBlackFilm();
        });
    };
    // 编辑黑名单电影
    $scope.editBalckFilm = function (index,filmName) {
        var modalInstance = $uibModal.open({
            animation: true,
            backdrop : "static",
            templateUrl: 'editForbidFilm.html',
            controller: 'editForbidFilmModalInstanceCtrl',
            resolve: {
                forbidFilmController: function () {
                    return $scope;
                },
                index:function () {
                    return index;
                },
                filmName:function () {
                    return filmName;
                }
            }
        });
        modalInstance.result.then(function () {
            getBlackFilm();
        });
    };
});
// 添加电影黑名单
app.controller('addForbidFilmModalInstanceCtrl', function($scope,$uibModalInstance,SweetAlert,ForbidFilm,Auth,forbidFilmController) {
    var token = Auth.getLocalData("token");
    $scope.blackFilmName = '';
    var blackFilmList = forbidFilmController.blackFilmList;
    $scope.blackSubmit = function () {
        if(!$scope.blackFilmName){
            SweetAlert.swal('','电影名必填','error');
            return ;
        }
        if(blackFilmList.length){
            for (var i = 0; i < blackFilmList.length; i++) {
                if (blackFilmList[i] == $scope.blackFilmName) {
                    SweetAlert.swal('','电影已经在黑名单中','error');
                    return ;
                }
            }
        }

        blackFilmList.push($scope.blackFilmName);
        blackFilmList = JSON.stringify(blackFilmList);
        var data = {
            film_list:blackFilmList
        };
        ForbidFilm.editBlackFilm(data).then(function(response){
            $scope.close();
            if(response.code == 0){
                SweetAlert.swal("",'成功',"success");
            }else{
                SweetAlert.swal("",response.msg,"error");
            }
        })
    }
    $scope.close = function(){
        $uibModalInstance.close();
    }
});
// 编辑电影黑名单
app.controller('editForbidFilmModalInstanceCtrl', function($scope,$uibModalInstance,SweetAlert,ForbidFilm,Auth,forbidFilmController,index,filmName) {
    $scope.blackFilmName = filmName;
    var blackFilmList = forbidFilmController.blackFilmList;
    $scope.blackSubmit = function () {
        if(!$scope.blackFilmName){
            SweetAlert.swal('','电影名必填','error');
            return ;
        }

        if(blackFilmList.length){
            for (var i = 0; i < blackFilmList.length; i++) {
                if (blackFilmList[i] == $scope.blackFilmName) {
                    SweetAlert.swal('','电影已经在黑名单中','error');
                    return ;
                }
            }
        }
        blackFilmList.splice(index,1);
        blackFilmList.push($scope.blackFilmName);
        blackFilmList = JSON.stringify(blackFilmList);
        var data = {
            film_list:blackFilmList
        };
        ForbidFilm.editBlackFilm(data).then(function(response){
            $scope.close();
            if(response.code == 0){
                SweetAlert.swal("",'成功',"success");
            }else{
                SweetAlert.swal("",response.msg,"error");
            }
        })
    }
    $scope.blackDel = function () {
        blackFilmList.splice(index,1);
        blackFilmList = JSON.stringify(blackFilmList);
        var data = {
            film_list:blackFilmList
        };
        ForbidFilm.editBlackFilm(data).then(function(response){
            $scope.close();
            if(response.code == 0){
                SweetAlert.swal("",'成功',"success");
            }else{
                SweetAlert.swal("",response.msg,"error");
            }
        })
    }
    $scope.close = function(){
        $uibModalInstance.close();
    }
});