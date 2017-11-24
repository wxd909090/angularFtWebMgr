app
.controller('userListController',function ($scope,$timeout,$rootScope,$uibModal,Auth,$localStorage,SweetAlert,UserList) {

    var token = Auth.getLocalData("token");

    $scope.allUserData = [];
    $scope.keyWord = '';
    $scope.page = 1;
    $scope.searchFlag = 0;
    //获取用户列表
    $scope.getUserListData = function(page,token){

        var data = {
            token : token,
            page : page
        }
        if($scope.searchFlag)
        {
            data.key_word = $scope.keyWord;
        }
        UserList.GetUserInfo(data).then(function(response){
            console.log(response)
            if(response.code == 0){
                // 将每一页数据缓存到一个数组中
                var data = {
                    current_page : response.data.list.current_page,
                    userListData : response.data
                };
                $scope.page = response.data.list.current_page;
                if($scope.searchFlag){
                    $scope.allUserData = [];
                }
                $scope.allUserData.push(data);

                // 分页配置
                $scope.maxSize = 5;
                $scope.bigTotalItems = response.data.list.total;

                // 显示当前请求页数据
                $scope.showUserData = $scope.allUserData[0].userListData;
                for(var q = 0;q < $scope.allUserData.length;q++){
                    if($scope.allUserData[q].current_page == response.data.list.current_page){
                        $scope.showUserData = $scope.allUserData[q].userListData;
                    }
                }
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
                // 看当前查询页面是否已经在缓存数组中，如果不存在再请求数据
                var flag = true;
                if($scope.allUserData.length > 0){
                    for(var q = 0;q < $scope.allUserData.length;q++){
                        if($scope.allUserData[q].current_page == value){
                            $scope.showUserData = $scope.allUserData[q].userListData;
                            flag = false;
                            return;
                        }
                    }
                    if(flag){
                        $scope.getUserListData(value,token);
                    }
                }else{
                    $scope.getUserListData(value,token);
                }
            }
        },
        true
    );
    $scope.serachUser = function () {
        if($scope.keyWord.length >= 8)
        {
            $scope.searchFlag = 1;
            $scope.getUserListData(1,token);
        }
        else
        {
            $scope.searchFlag = 0;
            if($scope.keyWord.length == 0)
            {
                $scope.allUserData = [];
                $scope.getUserListData($scope.page,token);
            }
        }
    }

    // 获得用户列表第一页
    $scope.getUserListData($scope.page,token);

    // 修改用户状态
    $scope.changeUserSta = function(user){
        console.log(user.user_sn,user.status);
        var data = {
            token : token,
            user_sn : user.user_sn,
            status : Math.abs(user.status - 1)
        };
        console.log(data)
        UserList.ChangeUserStatus(data).then(function(response){
            console.log(response)
            if(response.code == 0){
                user.status = data.status
                SweetAlert.swal({
                    title: "",
                    text: "修改成功！",
                    timer: 1000,
                    showConfirmButton: false,
                    type : "success"
                })
            }else{
                SweetAlert.swal("",response.msg,"error");
            }
        })
    }


	//钱包记录模态框
    // $scope.animationsEnabled = true;
    // $scope.walletRecord = function () {
    //     var modalInstance = $uibModal.open({
    //         animation: $scope.animationsEnabled,
    //         templateUrl: 'walletRecord.html',
    //         controller: 'commonModalInstanceCtrl',
    //         size: 'lg',
    //         resolve: {
    //             addStore: function () {
    //                 return $scope;
    //             }
    //         }
    //     });
    //     modalInstance.result.then(function () {
    //         Log.Debug("钱包记录");
    //     });
    // };


    //押金记录模态框
    $scope.animationsEnabled = true;
    $scope.depositRecord = function (user) {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'depositRecord.html',
            controller: 'depositModalInstanceCtrl',
            resolve: {
                scope: function () {
                    return $scope;
                },
                user : function(){
                    return user;
                }
            }
        });
        modalInstance.result.then(function () {
            Log.Debug("押金记录");
        });
    };

    //罚款记录模态框
    $scope.animationsEnabled = true;
    $scope.penaltiesRecord = function (user) {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'penaltiesRecord.html',
            controller: 'penaltiesRecordModalInstanceCtrl',
            resolve: {
                scope: function () {
                    return $scope;
                },
                user : function(){
                    return user;
                }
            }
        });
        modalInstance.result.then(function () {
            Log.Debug("罚款记录");
        });
    };

    //观看记录模态框
    $scope.animationsEnabled = true;
    $scope.watchRecord = function (user) {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'watchRecord.html',
            controller: 'watchRecordModalInstanceCtrl',
            size:'lg',
            resolve: {
                user: function () {
                    return user;
                }
            }
        });
        modalInstance.result.then(function () {
        });
    };


    //使用记录模态框
    // $scope.animationsEnabled = true;
    // $scope.operationRecord = function () {
    //     var modalInstance = $uibModal.open({
    //         animation: $scope.animationsEnabled,
    //         templateUrl: 'operationRecord.html',
    //         controller: 'commonModalInstanceCtrl',
    //         size:'lg',
    //         resolve: {
    //             addStore: function () {
    //                 return $scope;
    //             }
    //         }
    //     });
    //     modalInstance.result.then(function () {
    //     });
    // };


})



// 罚款记录
app.controller('penaltiesRecordModalInstanceCtrl', function($scope,$uibModalInstance,$localStorage,Auth,SweetAlert,scope,user,UserList) {
    var token = Auth.getLocalData("token");


    // 页数选择最大数目
    $scope.maxSize = 5;
    // 总共多少条数
    $scope.bigTotalItems = 0;
    // 最大页数
    $scope.maxPage = 0;
    // 当前页数
    $scope.bigCurrentPage = 1;
    // 监听分页数值变化
    $scope.$watch(function() {
            return $scope.bigCurrentPage;
        },
        function(newValue,oldValue) {
            GetOrderList(newValue)
        },
        true
    );
    $scope.setPage = function(){
        if($scope.reqPage > $scope.maxPage ){
            return
        }else{
            $scope.bigCurrentPage = $scope.reqPage
        }

    }
    function GetOrderList(page){
        var data = {
            token : token,
            user_sn : user.user_sn,
            page : page,
            orderType : 3
        }
        UserList.GetOrderList(data).then(function(response){
            console.log(response);
            if(response.code == 0){
                $scope.bigTotalItems = response.data.list.total;
                $scope.maxPage = response.data.list.last_page;
                $scope.penaltiesRecordData = response.data.list.data;
                $scope.penaltiesRecordData = $scope.penaltiesRecordData.reverse()
                console.log($scope.penaltiesRecordData)
            }else{
                SweetAlert.swal("",response.msg,"error")
            }
        })
    }
});


// 押金记录
app.controller('depositModalInstanceCtrl', function($scope,$uibModalInstance,$localStorage,Auth,SweetAlert,scope,user,UserList) {
    var token = Auth.getLocalData("token");

    // 获取押金记录
    getDepositList();
    function getDepositList(){
        var data = {
            token : token,
            user_sn : user.user_sn,
        }
        UserList.GetDepositList(data).then(function(response){
            console.log(response);
            if(response.code == 0){
                $scope.depositList = response.data
                $scope.depositList = $scope.depositList.reverse()
            }else{
                SweetAlert.swal("",response.msg,"error")
            }
        })
    }
});

//  获得观看记录
app.controller('watchRecordModalInstanceCtrl', function($scope,$uibModalInstance,Auth,$localStorage,user,UserList) {
    var token = Auth.getLocalData("token");

    // 页数选择最大数目
    $scope.maxSize = 5;
    // 总共多少条数
    $scope.bigTotalItems = 0;
    // 最大页数
    $scope.maxPage = 0;
    // 当前页数
    $scope.bigCurrentPage = 1;
    // 监听分页数值变化
    $scope.$watch(function() {
            return $scope.bigCurrentPage;
        },
        function(newValue,oldValue) {
            watchRecordList(newValue)
        },
        true
    );
    $scope.setPage = function(){
        if($scope.reqPage > $scope.maxPage){
            return
        }else{
            $scope.bigCurrentPage = $scope.reqPage
        }
    }



    // 获取观看记录
    // watchRecordList();
    function watchRecordList(page){
        var data = {
            token : token,
            user_sn : user.user_sn,
            page : page
        }
        UserList.GetWatchRecord(data).then(function(response){
            console.log(response);
            if(response.code == 0){
                $scope.bigTotalItems = response.data.list.total;
                $scope.maxPage = response.data.list.last_page;
                $scope.WatchRecordData = response.data.list.data;
                for(var q = 0;q < $scope.WatchRecordData.length;q++){
                    $scope.WatchRecordData[q].info = JSON.parse($scope.WatchRecordData[q].info);
                };
                console.log($scope.WatchRecordData)
                // $scope.penaltiesRecordData = $scope.penaltiesRecordData.reverse()
            }else{
                SweetAlert.swal("",response.msg,"error")
            }
        })
    }
});