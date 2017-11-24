app
.controller('filmReviewsController',function ($scope,$timeout,$rootScope,SweetAlert,$uibModal,$localStorage,Auth,myService,FilmReviews,$localStorage,apiUrl) {
    var token = Auth.getLocalData("token");
    $scope.filmInfo = myService.get();
    if(isEmpty($scope.filmInfo)){
        console.log("empty")
        $rootScope.$state.go("app.filmMgr");
        return;
    }
    $scope.celebrityList = [];
    $scope.reviewsList = [];

    $scope.reload = function(){
        $scope.bigCurrentPage = 1;
        $scope.getFilmReviewsList();
    };

    // 获取电影的名人列表
    $scope.getCelebrityInFilm = function(){
        var data = {
            name_hash : $scope.filmInfo.name_hash
        };
        FilmReviews.GetCelebrityInFilm(data).then(function(response){
            if(response.code == 0){
                $scope.celebrityList = response.data;
            }else{
                SweetAlert.swal("",response.msg,"error");
            }
        })
    };
    $scope.getCelebrityInFilm();

    $scope.bigCurrentPage = 1;
    // 获取评价列表
    $scope.getFilmReviewsList = function(){
        var data = {
            name_hash : $scope.filmInfo.name_hash,
            page : $scope.bigCurrentPage,
            show:2
        };
        FilmReviews.GetFilmReviewsList(data).then(function(response){
            if(response.code == 0){
                console.log(response);
                $scope.reviewsList = response.data.data;
                // 分页配置
                $scope.maxSize = 5;
                $scope.bigTotalItems = response.data.total;
                $scope.maxPage = response.data.last_page;
                $scope.perPage = response.data.per_page;
            }else{
                SweetAlert.swal("",response.msg,"error");
            }
        })
    };

    // 监听分页数值变化
    $scope.$watch(function() {
            return $scope.bigCurrentPage;
        },
        function(value) {
            if (value) {
                $scope.bigCurrentPage = value;
                value = Number(value);
                $scope.getFilmReviewsList();
            }
        },
        true
    );

    
    // 电影跳转页数
    $scope.setPage = function () {
        if($scope.reqPage > $scope.maxPage){
            return;
        }
        $scope.bigCurrentPage = $scope.reqPage;
    }

    // 屏蔽
    $scope.setReviews = function(reviews,x,index) {
        if(x){
            var data = {
                id : reviews.id,
                is_show : 0
            }
            FilmReviews.SetShowReviews(data).then(function(response){
                if(response.code == 0){
                    SweetAlert.swal({
                        title: "",
                        text: "操作成功！",
                        timer: 1000,
                        showConfirmButton: false,
                        type : "success"
                    });
                    $scope.getFilmReviewsList();
                }else{
                    SweetAlert.swal("",response.msg,"error");
                }
            })
        }else{
            var data = {
                id : reviews.id,
                is_show : 1
            }
            FilmReviews.SetShowReviews(data).then(function(response){
                if(response.code == 0){
                    SweetAlert.swal({
                        title: "",
                        text: "操作成功！",
                        timer: 1000,
                        showConfirmButton: false,
                        type : "success"
                    });
                    $scope.getFilmReviewsList();
                }else{
                    SweetAlert.swal("",response.msg,"error");
                }
            })
        }
    }
}); 