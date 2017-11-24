app
.controller('topicFilmListController',function ($scope,$timeout,$rootScope,SweetAlert,$uibModal,$location,$localStorage,Auth,TopicFilmList,myService,$localStorage,apiUrl) {
	var special_sn = $location.url().substr($location.url().lastIndexOf("/") + 1);
	$scope.getSpecialFilmList = function(){
		var data = {
			special_sn : special_sn
		};
		TopicFilmList.GetSpecialFilmList(data).then(function(response){
            if(response.code == 0){
                $scope.filmListData = response.data
            }else{
                SweetAlert.swal("",response.msg,"error");
            }
        });
	};
	// 获取专题电影
	$scope.getSpecialFilmList();


	// 移出专题
	$scope.delFilm = function(film){
		var data = {
			id : film.relation_id
		};
		TopicFilmList.DelSpecialFilm(data).then(function(response){
            if(response.code == 0){
                SweetAlert.swal({
	                title: "",
	                text: "移出专题成功！",
	                timer: 1000,
	                showConfirmButton: false,
	                type : "success"
	            })
	            $scope.getSpecialFilmList();
            }else{
                SweetAlert.swal("",response.msg,"error");
            }
        });
	}
});