'use strict';

/* Controllers */

angular.module('app')
  .controller('AppCtrl', ['$scope', '$localStorage', '$window','$location','$rootScope','apiUrl','Auth','SweetAlert',
    function(              $scope,   $localStorage,  $window,$location,$rootScope,apiUrl,Auth,SweetAlert) {
      
      // 点击退出，删除localStorage
      $scope.dropOut = function(){
          Auth.deletLocalData();
      }
      // 路由跳转时
      $scope.$on('$viewContentLoaded',function(){
          $(function(){  
              // 设置jQuery Ajax全局的参数  
              $.ajaxSetup({  
                  type: "POST",
                  // statusCode: {
                  //   200: function() {
                  //     alert("200状态，请求成功！");
                  //   }
                  // },
                  // error : function(jqXHR, textStatus, errorThrown) {
                  //   console.log(jqXHR.status);
                  //   if(jqXHR.status == 500){
                  //     SweetAlert.swal({
                  //       title: "",
                  //       text: "500",
                  //       timer: 1000,
                  //       showConfirmButton: false,
                  //       type : "danger"
                  //     })
                  //   }
                  //   if(jqXHR.status == 404){
                  //     SweetAlert.swal({
                  //       title: "",
                  //       text: "404",
                  //       timer: 1000,
                  //       showConfirmButton: false,
                  //       type : "danger"
                  //     })
                  //   }
                  // },
                  data: {'token': Auth.getLocalData("token") ? Auth.getLocalData("token") : ''},
                  success: function(response){
                      if(response.code == 1012){
                          Auth.deletLocalData();
                          // delete $localStorage.ftLoginData;
                          delete $localStorage.ftLoginData;
                          $rootScope.$state.go("login");
                          return;
                      }
                  }  
            });  
          });
          // 如果本地没账号密码默认跳转到login页面
          var data1 = Auth.getLocalAllData();
          if(!data1){
               $location.url('/login');  
          }
      })
      
      isSmartDevice( $window ) && angular.element($window.document.body).addClass('smart');
      // 配置
      $scope.app = {
        name: '青柠OSS后台',
        version: '1.0.0',
        // 颜色风格参数
        color: {
          primary: '#7266ba',
          info:    '#23b7e5',
          success: '#27c24c',
          warning: '#fad733',
          danger:  '#f05050',
          light:   '#e8eff0',
          dark:    '#3a3f51',
          black:   '#1c2b36'
        },
        settings: {
          themeID: 1,
          navbarHeaderColor: 'bg-black',
          navbarCollapseColor: 'bg-white-only',
          asideColor: 'bg-black',
          headerFixed: true,
          asideFixed: true,
          asideFolded: false,
          asideDock: false,
          container: false,
        }
      }

      // 保存设置到本地存储
      if ( angular.isDefined($localStorage.settings) ) {
        $scope.app.settings = $localStorage.settings;
      } else {
        $localStorage.settings = $scope.app.settings;
      }
      $scope.$watch('app.settings', function(){
        if( $scope.app.settings.asideDock  &&  $scope.app.settings.asideFixed ){
          // aside dock and fixed must set the header fixed.
          $scope.app.settings.headerFixed = true;
        }
        // 保存到本地
        $localStorage.settings = $scope.app.settings;
      }, true);

      // 判断是否是移动设备
      function isSmartDevice( $window )
      {
          // Adapted from http://www.detectmobilebrowsers.com
          var ua = $window['navigator']['userAgent'] || $window['navigator']['vendor'] || $window['opera'];
          // Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
          return (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
      }

      //设置 房间时间段
      $rootScope.setTime={min:20*60,max:130*60};
  }]);

  // 汉化日期段插件
moment.defineLocale('zh-cn',{
  months : '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'),  
  monthsShort : '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
  weekdays : '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),  
    weekdaysShort : '周日_周一_周二_周三_周四_周五_周六'.split('_'),  
    weekdaysMin : '日_一_二_三_四_五_六'.split('_')   
})
angular.module('app').factory('Auth', function($localStorage,apiUrl) {
    return {
      getLocalData: function(key){
        if($localStorage[apiUrl.localName]){
          return JSON.parse($localStorage[apiUrl.localName])[key];        
        }
      },
      setLocalData: function(data){
        $localStorage[apiUrl.localName] = JSON.stringify(data);
      },
      getLocalAllData: function(){
        if($localStorage[apiUrl.localName]){
          return JSON.parse($localStorage[apiUrl.localName]);        
        }
      },
      deletLocalData: function(){
        if($localStorage[apiUrl.localName]){
          delete $localStorage[apiUrl.localName] 
        }
      }
    };
}); 


