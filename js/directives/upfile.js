(function (app) {
    /**
     * 侧边栏 菜单的展开收起
     */
    'use strict';
    app
        .directive('upFile', qrcodeFun);

    function qrcodeFun($window) {
        var directive = {
            //设置指令传进来的属性参数
            // scope: {
            //     qrcodeUrl: '@'
            // },
            restrict: 'E',
            replace: true,
            templateUrl: 'tpl/directivesHtml/upfile.html',
            link: link
        };
        function link(scope, element, attrs) {
            $("#fileInput").fileinput({
                showUpload: false
            });
        }
        return directive;
    }
})(app);