'use strict';

/**
 * Config for the router
 */
angular.module('app')
.run(
  ['$rootScope', '$state', '$stateParams',
    function ($rootScope,   $state,   $stateParams) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;   
    }
  ]
)
.config(
  ['$stateProvider', '$urlRouterProvider',function ($stateProvider,   $urlRouterProvider) {
      $urlRouterProvider.otherwise('app/storeList');
      $stateProvider
          .state('app', {
              abstract: true,
              url: '/app',
              templateUrl: 'tpl/app.html'
          })

          .state('login', {
              url: '/login',
              templateUrl: 'tpl/login.html',
              controller: "loginController",
              resolve: {
                  deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                      return $ocLazyLoad.load(
                          ['css/login.css', 'js/controllers/loginController.js', 'js/services/login_service.js']
                      );
                  }]
              },
              onEnter: function () {
                  $("body").css("background", "url('./img/login/login_bgx.gif')")
              },
              onExit: function () {
                  $("body").css("background", "")
              }
          })

          .state('app.main', {
              url: '/main',
              templateUrl: 'tpl/main.html',
              resolve: {
                  deps: ['$ocLazyLoad',
                      function ($ocLazyLoad) {
                          return $ocLazyLoad.load(['js/controllers/chart.js']);
                      }]
              }
          })

          .state('app.storeList', {
              url: '/storeList',
              templateUrl: 'tpl/storeList.html',
              controller: "storeListController",
              resolve: {
                  deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                      return $ocLazyLoad.load(
                          ['vendor/qrcode/jquery.qrcode.min.js','js/directives/qrcode.js','js/directives/upfile.js']
                      ).then(function () {
                          return $ocLazyLoad.load(['js/controllers/storeListController.js', 'js/services/storeList_service.js']);
                      });
                  }]
              }
          })

          .state('app.roomList', {
              url: '/roomList/:storeId',
              templateUrl: 'tpl/roomList.html',
              controller: "roomListController",
              resolve: {
                  deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                      return $ocLazyLoad.load(
                          ['vendor/qrcode/jquery.qrcode.min.js', 'js/directives/upfile.js']
                      ).then(function () {
                          return $ocLazyLoad.load(['js/controllers/roomListController.js', 'js/directives/qrcode.js', 'js/services/roomList_service.js']);
                      });
                  }]
              },
              onEnter: function () {
              },
              onExit: function ($rootScope, $interval) {
                  $interval.cancel($rootScope.statusTimer);
              }
          })

          .state('app.staffList', {
              url: '/staffList',
              templateUrl: 'tpl/staffList.html',
              controller: "staffListController",
              resolve: {
                  deps: ['$ocLazyLoad',
                      function ($ocLazyLoad) {
                          return $ocLazyLoad.load(['js/controllers/staffListController.js', 'js/services/staffList_service.js']);
                      }]
              }
          })

          .state('app.userList', {
              url: '/userList',
              templateUrl: 'tpl/userList.html',
              controller: "userListController",
              resolve: {
                  deps: ['$ocLazyLoad',
                      function ($ocLazyLoad) {
                          return $ocLazyLoad.load(['js/controllers/userListController.js', 'js/services/userList_service.js']);
                      }]
              }
          })

          .state('app.userAnalysis', {
              url: '/userAnalysis',
              templateUrl: 'tpl/userAnalysis.html',
              controller: "userAnalysisController",
              resolve: {
                  deps: ['$ocLazyLoad',
                      function ($ocLazyLoad) {
                          return $ocLazyLoad.load(['js/controllers/userAnalysisController.js', 'js/services/userAnalysis_service.js']);
                      }]
              }
          })

          .state('app.storeStream', {
              url: '/storeStream',
              templateUrl: 'tpl/storeStream.html',
              controller: "storeStreamController",
              resolve: {
                  deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                      return $ocLazyLoad.load(
                          ['js/controllers/storeStreamController.js', 'js/services/storeStream_service.js']
                      )
                  }]
              }
          })

          .state('app.film', {
              url: '/film',
              templateUrl: 'tpl/film.html',
              controller: "filmController",
              resolve: {
                  deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                      return $ocLazyLoad.load(
                          ['js/directives/upfile.js']
                      ).then(function () {
                          return $ocLazyLoad.load(['js/controllers/filmController.js', 'js/services/film_service.js','js/services/storeList_service.js']);
                      });
                  }]
              }
          })

          .state('app.filmMgr', {
              url: '/filmMgr',
              templateUrl: 'tpl/filmMgr.html',
              controller: "filmMgrController",
              resolve: {
                  deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                      return $ocLazyLoad.load(
                          ['js/directives/upfile.js']
                      ).then(function () {
                          return $ocLazyLoad.load(['js/controllers/filmMgrController.js', 'js/services/filmMgr_service.js','js/services/storeList_service.js','js/directives/select.js']);
                      });
                  }]
              }
          })

          .state('app.commonSet', {
              url: '/commonSet',
              templateUrl: 'tpl/commonSet.html',
              controller: "commonSetController",
              resolve: {
                  deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                      return $ocLazyLoad.load(
                          ['js/controllers/commonSetController.js', 'js/services/commonSet_service.js']
                      );
                  }]
              }
          })

          .state('app.activities', {
              url: '/activities',
              templateUrl: 'tpl/activities.html',
              controller: "activitiesController",
              resolve: {
                  deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                      return $ocLazyLoad.load(
                          ['js/controllers/activitiesController.js', 'js/services/activities_service.js']
                      );
                  }]
              }
          })

          .state('app.userAssess', {
              url: '/userAssess',
              templateUrl: 'tpl/userAssess.html',
              controller: "userAssessController",
              resolve: {
                  deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                      return $ocLazyLoad.load(
                          ['js/controllers/userAssessController.js', 'js/services/userAssess_service.js']
                      );
                  }]
              }
          })

          .state('app.statistics', {
              url: '/statistics',
              templateUrl: 'tpl/statistics.html',
              controller: "statisticsController",
              resolve: {
                  deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                      return $ocLazyLoad.load(
                          ['js/controllers/statisticsController.js', 'js/services/statistics_service.js']
                      );
                  }]
              }
          })

          .state('app.filmXf', {
              url: '/filmXf',
              templateUrl: 'tpl/filmXf.html',
              controller: "filmXfController",
              resolve: {
                  deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                      return $ocLazyLoad.load(
                          ['js/controllers/filmXfController.js', 'js/services/filmXf_service.js']
                      );
                  }]
              }
          })

          .state('app.timeTemplet', {
              url: '/timeTemplet/:store_sn',
              templateUrl: 'tpl/timeTemplet.html',
              controller: "timeTempletController",
              resolve: {
                  deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                      return $ocLazyLoad.load(
                          ['js/controllers/timeTempletController.js', 'js/services/timeTemplet_service.js']
                      )
                  }]
              }
          })

          .state('app.storeStatistic', {
              url: '/storeStatistic',
              templateUrl: 'tpl/storeStatistic.html',
              controller: "storeStatisticController",
              resolve: {
                  deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                      return $ocLazyLoad.load(
                          ['js/controllers/storeStatisticController.js', 'js/services/storeStatistic_service.js', 'js/services/storeStream_service.js', 'js/services/storeList_service.js']
                      )
                  }]
              }
          })

          .state('app.businessApp', {
              url: '/businessApp',
              templateUrl: 'tpl/businessApp.html',
              controller: "businessAppController",
              resolve: {
                  deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                      return $ocLazyLoad.load(
                          ['js/directives/upfile.js']
                      ).then(function () {
                          return $ocLazyLoad.load(['js/controllers/businessAppController.js', 'js/services/businessApp_service.js']);
                      });
                  }]
              },
          })

          .state('app.groupBuy', {
              url: '/groupBuy',
              templateUrl: 'tpl/groupBuy.html',
              controller: "groupBuyController",
              resolve: {
                  deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                      return $ocLazyLoad.load(
                          ['js/controllers/groupBuyController.js', 'js/services/groupBuy_service.js']
                      )
                  }]
              },
          })

          .state('app.storeMaster', {
              url: '/storeMaster',
              templateUrl: 'tpl/storeMaster.html',
              controller: "storeMasterController",
              resolve: {
                  deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                      return $ocLazyLoad.load(
                          ['js/controllers/storeMasterController.js', 'js/services/storeMaster_service.js', 'js/directives/select.js']
                      )
                  }]
              },
          })

          .state('app.versionMgr', {
              url: '/versionMgr',
              templateUrl: 'tpl/versionMgr.html',
              controller: "versionMgrController",
              resolve: {
                  deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                      return $ocLazyLoad.load(
                          ['js/controllers/versionMgrController.js', 'js/services/versionMgr_service.js', 'js/directives/select.js']
                      )
                  }]
              },
          })

          .state('app.vouchers', {
              url: '/vouchers',
              templateUrl: 'tpl/vouchers.html',
              controller: "vouchersController",
              resolve: {
                  deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                      return $ocLazyLoad.load(
                          ['js/controllers/vouchersController.js', 'js/services/vouchers_service.js', 'js/directives/select.js']
                      )
                  }]
              },
          })

          .state('app.topic', {
              url: '/topic',
              templateUrl: 'tpl/topic.html',
              controller: "topicController",
              resolve: {
                  deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                      return $ocLazyLoad.load(
                          ['js/controllers/topicController.js', 'js/services/topic_service.js', 'js/directives/select.js']
                      )
                  }]
              },
          })

          .state('app.forbidFilm', {
              url: '/forbidFilm',
              templateUrl: 'tpl/forbidFilm.html',
              controller: "forbidFilmController",
              resolve: {
                  deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                      return $ocLazyLoad.load(
                          ['js/controllers/forbidFilmController.js', 'js/services/forbidFilm_service.js', 'js/directives/select.js']
                      )
                  }]
              },
          })

          .state('app.newTopic', {
            url: '/newTopic',
            templateUrl: 'tpl/newTopic.html',
            controller: "newTopicController",
            resolve: {
              deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                  return $ocLazyLoad.load(
                      ['js/directives/upfile.js']
                  ).then(function () {
                      return $ocLazyLoad.load(['js/controllers/newTopicController.js', 'js/services/newTopic_service.js', 'js/directives/select.js']);
                  });
              }]
            },
          })

          .state('app.editTopic', {
            url: '/editTopic',
            templateUrl: 'tpl/editTopic.html',
            controller: "editTopicController",
            resolve: {
              deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                  return $ocLazyLoad.load(
                      ['js/directives/upfile.js']
                  ).then(function () {
                      return $ocLazyLoad.load(['js/controllers/editTopicController.js', 'js/services/editTopic_service.js', 'js/directives/select.js']);
                  });
              }]
            },
          })

          .state('app.topicFilmList', {
            url: '/topicFilmList/:special_sn',
            templateUrl: 'tpl/topicFilmList.html',
            controller: "topicFilmListController",
            resolve: {
              deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                  return $ocLazyLoad.load(
                      ['js/directives/upfile.js']
                  ).then(function () {
                      return $ocLazyLoad.load(['js/controllers/topicFilmListController.js', 'js/services/topicFilmList_service.js', 'js/directives/select.js']);
                  });
              }]
            },
          })

          .state('app.celebrity', {
            url: '/celebrity',
            templateUrl: 'tpl/celebrity.html',
            controller: "celebrityController",
            resolve: {
              deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                  return $ocLazyLoad.load(
                      ['js/directives/upfile.js']
                  ).then(function () {
                      return $ocLazyLoad.load(['js/controllers/celebrityController.js', 'js/services/celebrity_service.js', 'js/directives/select.js']);
                  });
              }]
            },
          })

          .state('app.filmReviews', {
            url: '/filmReviews',
            templateUrl: 'tpl/filmReviews.html',
            controller: "filmReviewsController",
            resolve: {
              deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                  return $ocLazyLoad.load(
                      ['js/directives/upfile.js']
                  ).then(function () {
                      return $ocLazyLoad.load(['js/controllers/filmReviewsController.js', 'js/services/filmReviews_service.js', 'js/directives/select.js']);
                  });
              }]
            },
          })

          .state('app.poster', {
            url: '/poster',
            templateUrl: 'tpl/poster.html',
            controller: "posterController",
            resolve: {
              deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                  return $ocLazyLoad.load(
                      []
                  ).then(function () {
                      return $ocLazyLoad.load(['js/controllers/posterController.js', 'js/services/poster_service.js', 'js/directives/select.js']);
                  });
              }]
            },
          })
          // 商家1.7  
          // 商品管理
          .state('app.salingGoods', {
            url: '/salingGoods',
            templateUrl: 'tpl/goods/salingGoods.html',
            controller: "salingGoodsController",
            resolve: {
              deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                  return $ocLazyLoad.load(
                      ['css/style.css','js/plupload.full.min.js','js/qnupload.js']
                  ).then(function () {
                      return $ocLazyLoad.load(['js/controllers/goods/salingGoodsController.js', 'js/services/goods/salingGoods_service.js']);
                  });
              }]
            },
          })

          .state('app.notSalingGoods', {
            url: '/notSalingGoods',
            templateUrl: 'tpl/goods/notSalingGoods.html',
            controller: "notSalingGoodsController",
            resolve: {
              deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                  return $ocLazyLoad.load(
                      ['css/style.css','js/plupload.full.min.js','js/qnupload.js']
                  ).then(function () {
                      return $ocLazyLoad.load(['js/controllers/goods/notSalingGoodsController.js', 'js/services/goods/notSalingGoods_service.js']);
                  });
              }]
            },
          })

          .state('app.goodsType', {
            url: '/goodsType',
            templateUrl: 'tpl/goods/goodsType.html',
            controller: "goodsTypeController",
            resolve: {
              deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                  return $ocLazyLoad.load(
                      []
                  ).then(function () {
                      return $ocLazyLoad.load(['js/controllers/goods/goodsTypeController.js', 'js/services/goods/goodsType_service.js']);
                  });
              }]
            },
          })

          .state('app.goodsCount', {
            url: '/goodsCount',
            templateUrl: 'tpl/goods/goodsCount.html',
            controller: "goodsCountController",
            resolve: {
              deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                  return $ocLazyLoad.load(
                      []
                  ).then(function () {
                      return $ocLazyLoad.load(['js/controllers/goods/goodsCountController.js', 'js/services/goods/goodsCount_service.js']);
                  });
              }]
            },
          })

          .state('app.createGoodsType', {
            url: '/createGoodsType',
            templateUrl: 'tpl/goods/createGoodsType.html',
            controller: "createGoodsTypeController",
            resolve: {
              deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                  return $ocLazyLoad.load(
                      []
                  ).then(function () {
                      return $ocLazyLoad.load(['js/controllers/goods/createGoodsTypeController.js', 'js/services/goods/createGoodsType_service.js']);
                  });
              }]
            },
          })

          .state('app.createGoods', {
            url: '/createGoods',
            templateUrl: 'tpl/goods/createGoods.html',
            controller: "createGoodsController",
            resolve: {
              deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                  return $ocLazyLoad.load(
                      ['css/style.css','js/plupload.full.min.js','js/qnupload.js']
                  ).then(function () {
                      return $ocLazyLoad.load(['js/controllers/goods/createGoodsController.js', 'js/services/goods/createGoods_service.js']);
                  });
              }]
            },
          })

          .state('app.createRecommend', {
            url: '/createRecommend',
            templateUrl: 'tpl/goods/createRecommend.html',
            controller: "createRecommendController",
            resolve: {
              deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                  return $ocLazyLoad.load(
                      ['css/style.css','js/plupload.full.min.js','js/qnupload.js']
                  ).then(function () {
                      return $ocLazyLoad.load(['js/controllers/goods/createRecommendController.js', 'js/services/goods/createRecommend_service.js','js/directives/select.js']);
                  });
              }]
            },
          })

          //商品订单管理
          .state('app.goodsOrderHandle', {
            url: '/goodsOrderHandle',
            templateUrl: 'tpl/goodsOrder/goodsOrderHandle.html',
            controller: "goodsOrderHandleController",
            resolve: {
              deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                  return $ocLazyLoad.load(
                      []
                  ).then(function () {
                      return $ocLazyLoad.load(['js/controllers/goodsOrder/goodsOrderHandleController.js', 'js/services/goodsOrder/goodsOrderHandle_service.js']);
                  });
              }],
            },
            onEnter: function () {
            },
            onExit: function ($rootScope, $interval) {
                $interval.cancel($rootScope.getCountOrderTimer);
            }
          })

          .state('app.historyOrderHandle', {
            url: '/historyOrderHandle',
            templateUrl: 'tpl/goodsOrder/historyOrderHandle.html',
            controller: "historyOrderHandleController",
            resolve: {
              deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                  return $ocLazyLoad.load(
                      []
                  ).then(function () {
                      return $ocLazyLoad.load(['js/controllers/goodsOrder/historyOrderHandleController.js', 'js/services/goodsOrder/historyOrderHandle_service.js']);
                  });
              }]
            },
          })

          .state('app.goodsOrderSta', {
            url: '/goodsOrderSta',
            templateUrl: 'tpl/goodsOrder/goodsOrderSta.html',
            controller: "goodsOrderStaController",
            resolve: {
              deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                  return $ocLazyLoad.load(
                      []
                  ).then(function () {
                      return $ocLazyLoad.load(['js/controllers/goodsOrder/goodsOrderStaController.js', 'js/services/goodsOrder/goodsOrderSta_service.js']);
                  });
              }]
            },
          })

          .state('app.editRecommend', {
            url: '/editRecommend',
            templateUrl: 'tpl/goods/editRecommend.html',
            controller: "editRecommendController",
            resolve: {
              deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                  return $ocLazyLoad.load(
                      []
                  ).then(function () {
                      return $ocLazyLoad.load(['js/controllers/goods/editRecommendController.js', 'js/services/goods/editRecommend_service.js']);
                  });
              }]
            },
          })

          .state('app.busMgrStatistic', {
            url: '/busMgrStatistic',
            templateUrl: 'tpl/busMgrStatistic.html',
            controller: "busMgrStatisticController",
            resolve: {
              deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                  return $ocLazyLoad.load(
                      []
                  ).then(function () {
                      return $ocLazyLoad.load(['js/controllers/busMgrStatisticController.js', 'js/services/busMgrStatistic_service.js']);
                  });
              }]
            },
          })
  }]
);