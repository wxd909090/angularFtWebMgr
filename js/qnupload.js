
// QnUpload
QnUpload = function (apiBaseUrl, usePlatform, useModule, useFunc, callbackOnSuccess) {

    var thatQnUploader = this;

    var baseUrl = apiBaseUrl;

    this.uploadSignInfo = null;
    this.useUploadFileName = ''; //如果非原文件名，实际使用的文件名
    this.uploader = null;
    this.platform = usePlatform;
    this.module = useModule;
    this.func = useFunc;

    this.uploadOnSelectFile = false;

    //页面元素相关
    this.selectFileBtn = 'selectfilesBtn';
    this.uploadRunBtn = 'postfilesBtn';
    this.uploadContainer = 'uploadContainer';
    this.ossFileDisp = 'ossfile';

    this.ossPath = '';//上传到oss后的使用路径
    this.imgFileWidth = 0;
    this.imgFileHeight = 0;
    this.fileSize = 0;

    this.CONST_STATUS_UNSELECTED = 'UNSELECTED';//未选择文件
    this.CONST_STATUS_SELECTED = 'SELECTED';//已选择文件
    this.CONST_STATUS_UPLOADING = 'UPLOADING';//上传过程中
    this.CONST_STATUS_SUCCESS = 'SUCCESS';//上传成功
    this.CONST_STATUS_FAIL = 'FAIL';//上传失败
    this.status = this.CONST_STATUS_UNSELECTED;
    
    //获取随机字符串
    var getRandomString = function(len) {
    　　len = len || 32;
    　　var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';   
    　　var maxPos = chars.length;
    　　var pwd = '';
    　　for (i = 0; i < len; i++) {
        　　pwd += chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
    }

    //获取文件后缀
    this.getSuffix = function(filename) {
        pos = filename.lastIndexOf('.')
        suffix = ''
        if (pos != -1) {
            suffix = filename.substring(pos)
        }
        return suffix;
    }

    this.showMsg = function(msg){
        alert(msg);
    }

    this.dealUploadSignAsFrontSetting = function(paramData){
        thatQnUploader.uploadSignInfo = paramData;

        var mimeTypes = [];
        var fileSizeMB = 10;
        if (thatQnUploader.uploadSignInfo.mime_types){
            mimeTypes[0] = { title : "files", extensions :thatQnUploader.uploadSignInfo.mime_types };
        }
        if (thatQnUploader.uploadSignInfo.max_size_mb){
            fileSizeMB = thatQnUploader.uploadSignInfo.max_size_mb;
        }

        thatQnUploader.uploader = new plupload.Uploader({
            runtimes : 'html5,flash,silverlight,html4',
            browse_button : thatQnUploader.selectFileBtn, //id of the DOM element or DOM element itself to use as file dialog trigger.
            container: thatQnUploader.uploadContainer, //id of the DOM element or DOM element itself that will be used to wrap uploader structures. Defaults to immediate parent of the browse_button element.
            flash_swf_url : 'lib/plupload-2.3.1/js/Moxie.swf',
            silverlight_xap_url : 'lib/plupload-2.3.1/js/Moxie.xap',
            //url : 'http://oss.aliyuncs.com', 
            multi_selection: false, //多文件上传
            max_retries: 2, //最大上传重试次数

            'filters': {
                mime_types : mimeTypes,
                max_file_size : fileSizeMB + 'mb', 
                prevent_duplicates : true //不允许选取重复文件
            },
            'url': thatQnUploader.uploadSignInfo.host,

            init: {
                //init()执行
                PostInit: function() {
                    document.getElementById(thatQnUploader.ossFileDisp).innerHTML = '';

                    if (!thatQnUploader.uploadOnSelectFile){
                        document.getElementById(thatQnUploader.uploadRunBtn).onclick = function() {
                            thatQnUploader.uploader.start();
                            return false;
                        };
                    }
                },

                //成功选择了待上传文件后触发
                FilesAdded: function(up, files) {
                    while (up.files.length > 1) {
                        up.removeFile(up.files[0]);
                    }
                    up.refresh();
                    files = up.files;
                    document.getElementById(thatQnUploader.ossFileDisp).innerHTML = '';
                    plupload.each(files, function(file) {
                        document.getElementById(thatQnUploader.ossFileDisp).innerHTML += '<div id="' + file.id + '">' + file.name + ' (' + plupload.formatSize(file.size) + ')<b></b>'
                        +'<div class="progress"><div class="progress-bar" style="width: 0%"></div></div>'
                        +'</div>';

                        thatQnUploader.fileSize = file.size;
                        if (file.type == 'image/jpeg' || file.type == 'image/png' 
                            || file.type == 'image/bmp' || file.type == 'image/gif'){
                            var reader = new FileReader();
                            reader.readAsDataURL(file.getNative());
                            reader.onload = (function (e) {
                                var image = new Image();
                                image.src = e.target.result;
                                image.onload = function () {
                                    thatQnUploader.imgFileWidth = this.width;
                                    thatQnUploader.imgFileHeight = this.height;
                                };
                            });
                        }
                        
                    });

                    if (thatQnUploader.uploadOnSelectFile){
                        thatQnUploader.uploader.start();
                    }
                },

                //开始执行上传前触发
                BeforeUpload: function(up, file) {
                    /*check_object_radio();
                    set_upload_param(up, file.name, true);*/
                    thatQnUploader.queryUploadSignAndParams(
                        thatQnUploader.platform, 
                        thatQnUploader.module, 
                        thatQnUploader.func, 
                        thatQnUploader.dealUploadSignAsUpload, 
                        false);
                },

                //上传过程持续多次触发，用来更新进度条
                UploadProgress: function(up, file) {
                    var d = document.getElementById(file.id);
                    d.getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + "%</span>";
                    var prog = d.getElementsByTagName('div')[0];
                    var progBar = prog.getElementsByTagName('div')[0]
                    progBar.style.width= 2*file.percent+'px';
                    progBar.setAttribute('aria-valuenow', file.percent);
                },

                //文件成功上传后触发
                FileUploaded: function(up, file, info) {
                    if (info.status == 200)
                    {
                        var theHost = thatQnUploader.uploadSignInfo.host;
                        if (thatQnUploader.uploadSignInfo.access_host){
                            theHost = thatQnUploader.uploadSignInfo.access_host;
                        }
                        var fileName = file.name;
                        if (thatQnUploader.useUploadFileName){
                            fileName = thatQnUploader.useUploadFileName;
                        }
                        thatQnUploader.ossPath = theHost + '/' + thatQnUploader.uploadSignInfo.dir + fileName;
                        //document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = 'upload to oss success, object name:' + file.name;
                        if (callbackOnSuccess){
                            callbackOnSuccess();
                        }
                    }
                    else
                    {
                        alert('文件上传有些异常， status=' + info.status);
                        //document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = info.response;
                    } 
                },

                //Fires when a error occurs 
                Error: function(up, err) {
                    if (err.code == -600) {
                        thatQnUploader.showMsg("文件过大，请选择" + fileSizeMB + "mb以内的文件");
                    }
                    else if (err.code == -601) {
                        thatQnUploader.showMsg("文件类型错误，请选择 " + thatQnUploader.uploadSignInfo.mime_types + " 类型的文件");
                    }
                    else if (err.code == -602) {
                        thatQnUploader.showMsg("请勿重复上传，这个文件已经上传过一遍了");
                    }
                    else 
                    {
                        thatQnUploader.showMsg("error:" + err.response);
                    }
                }
            }
        });

        thatQnUploader.uploader.init();
    }

    this.dealUploadSignAsUpload = function(paramData){
        thatQnUploader.uploadSignInfo = paramData;

        var uploadFileName = "${filename}";
        if (thatQnUploader.uploadSignInfo.upload_file_name){
            var suffix = thatQnUploader.getSuffix(thatQnUploader.uploader.files[0].name);
            uploadFileName = thatQnUploader.uploadSignInfo.upload_file_name + suffix;
            thatQnUploader.useUploadFileName = uploadFileName;
        }

        new_multipart_params = {
            'key' : thatQnUploader.uploadSignInfo.dir + uploadFileName, //阿里云要的格式
            'policy': thatQnUploader.uploadSignInfo.policy,
            'OSSAccessKeyId': thatQnUploader.uploadSignInfo.accessid, 
            'success_action_status' : '200', //让服务端返回200,不然，默认会返回204
            //'callback' : callbackbody,
            'signature': thatQnUploader.uploadSignInfo.signature,
        };

        thatQnUploader.uploader.setOption({
            'url': thatQnUploader.uploadSignInfo.host,
            'multipart_params': new_multipart_params
        });

        thatQnUploader.uploader.start();
    }

    this.queryUploadSignAndParams = function(platform, module, func, callback, isAync){
        var xmlhttp = null;
        if (window.XMLHttpRequest)
        {
            xmlhttp=new XMLHttpRequest();
        }
        else if (window.ActiveXObject)
        {
            xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
        }

        if (!isAync){
            isAync = false;
        }
      
        if (xmlhttp!=null)
        {
            serverUrl = baseUrl + 'common/oss/upload';
            xmlhttp.open( "POST", serverUrl, isAync );//这里必须同步请求！
            xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            xmlhttp.timout = 3000;
            xmlhttp.withCredentials = true;

            var poststr = "platform=" + platform + "&module=" + module + "&func=" + func;
            xmlhttp.send( poststr );

            if (isAync){
                xmlhttp.onreadystatechange = function(){
                    if (xmlhttp.readyState == 4){
                        //console.log('async rsp:' + xmlhttp.responseText);
                        if (xmlhttp.status == 200){
                            var obj = JSON && JSON.parse(xmlhttp.responseText) || $.parseJSON(xmlhttp.responseText);
                            if (obj.code != 0){
                                alert('服务器错误:' + obj.msg);
                            }else{
                                if (!obj.data || obj.data.length == 0){
                                   alert('非法上传功能，请到后端配置此功能的上传');
                                }else{
                                    if (callback){
                                        callback(obj.data);
                                    }
                                }
                            }
                        }else{
                            alert('服务器出现异常');
                        }
                    }
                }
            }else{
                //console.log('sync rsp:' + xmlhttp.responseText);
                if (xmlhttp.status == 200){
                    var obj = JSON && JSON.parse(xmlhttp.responseText) || $.parseJSON(xmlhttp.responseText);
                    if (obj.code != 0){
                        alert('服务器错误:' + obj.msg);
                    }else{
                        if (!obj.data || obj.data.length == 0){
                           alert('非法上传功能，请到后端配置此功能的上传');
                        }else{
                            if (callback){
                                callback(obj.data);
                            }
                        }
                    }
                }else{
                    alert('服务器出现异常');
                }
            }
            
            
            return xmlhttp.responseText
        }
        else
        {
            alert("Your browser does not support XMLHTTP.");
        }
    }


    this.init = function(){
        //提前取一次sign用来设置上传参数
        thatQnUploader.queryUploadSignAndParams(
            thatQnUploader.platform, 
            thatQnUploader.module, 
            thatQnUploader.func, 
            thatQnUploader.dealUploadSignAsFrontSetting, 
            true);
    }

    this.setUsage = function(usagePlatform, usageModule, usageFunc){
        thatQnUploader.platform = usagePlatform;
        thatQnUploader.module = usageModule;
        thatQnUploader.func = usageFunc;
    }
}




