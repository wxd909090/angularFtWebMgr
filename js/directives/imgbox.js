// (function (app) {
//     'use strict';
//     app
//         .directive('imgBox', imgBoxFun);

//     function imgBoxFun($window,SweetAlert) {
//         var directive = {
//             //设置指令传进来的属性参数
//             scope: {
//                 imgboxUrl: '@'
//             },
//             restrict: 'E',
//             replace: true,
//             templateUrl: 'tpl/directivesHtml/imgbox.html',
//             link: link
//         };
//         function link(scope, element, attrs) {
//             // 检测二维码值是否修改，重新生成二维码
//             scope.$watch(function() {
//                     return scope.imgboxUrl;
//                 },
//                 function(newValue,oldValue) {
//                     newValue = newValue.split(",")
//                     scope.showImgs = newValue;
//                     for(var q = 0;q < scope.showImgs.length;q++){
//                         if(q != 0){
//                             scope.showImgs[q] = "http://qnbar-test.oss-cn-hangzhou.aliyuncs.com/" + scope.showImgs[q]
//                         }
//                     }
//                     console.log(scope.showImgs)
//                 },
//                 true
//             );
//             console.log(scope.imgboxUrl)
//         }
//         return directive;
//     }
// })(app);