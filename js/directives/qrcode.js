(function (app) {
    'use strict';
    app
        .directive('ngQrcode', qrcodeFun);

    function qrcodeFun($window,SweetAlert) {
        var directive = {
            //设置指令传进来的属性参数
            scope: {
                qrcodeUrl: '@'
            },
            restrict: 'E',
            replace: true,
            template: '<div id="qrcode"></div>',
            link: link
        };
        function link(scope, element, attrs) {
            $('#qrcode').qrcode({
                render : "canvas",//也可以替换为table
                width  : 100,
                height : 100,
                text   : scope.qrcodeUrl
            });

            // 检测二维码值是否修改，重新生成二维码
            scope.$watch(function() {
                    return scope.qrcodeUrl;
                },
                function(newValue,oldValue) {
                    $("#qrcode").html("");
                    if(newValue == ""){
                        // newValue = "{'type': 'null','data': 'null'}";
                        // SweetAlert.swal("","请输入正确的二维码信息！","error");
                    }
                    $('#qrcode').qrcode({
                        render : "canvas",//也可以替换为table
                        width  : 100,
                        height : 100,
                        text   : newValue
                    });
                },
                true
            );
        }
        return directive;
    }
})(app);