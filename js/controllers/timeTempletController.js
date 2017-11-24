app
.controller('timeTempletController',function ($scope,$timeout,$rootScope,$location,SweetAlert,Auth,$uibModal,$localStorage,TimeTemplet,$window) {
	
    var token = Auth.getLocalData("token");
    $scope.template_sn = "";
	// 获得门店基本信息
	if($localStorage.storeRoomData){
		$scope.storeData = $localStorage.storeRoomData;
	}else{
		SweetAlert.swal("","获取不到房间信息！","error");
	};
	
	if($scope.storeData.length == 0){
		var store_sn = $location.url().substr($location.url().lastIndexOf("/") + 1);
	}else{
		if($scope.storeData[0].store_sn){
			var store_sn = $scope.storeData[0].store_sn;
		}else{
			SweetAlert.swal({
                title: "",
                text: "获取不到store_sn！",
                timer: 1000,
                showConfirmButton: false,
                type : "error"
            })
		};
	}

	// 获取门店模板拷贝时间
	getStoreMaxCopyTime()

	function getStoreMaxCopyTime(){
        var data = {
            token : token,
            store_sn : store_sn
        }
        TimeTemplet.GetStoreMaxCopyTime(data).then(function(response){
            if(response.code == 0){
                $scope.storeMaxCopyTime = response.data
            }else{
                SweetAlert.swal("",response.msg,"error")
            }
        })
    }
    $scope.setStoreMaxCopyTime = function(){
    	var data = {
    		store_sn : store_sn,
    		days : $scope.storeMaxCopyTime
    	}
    	TimeTemplet.SetStoreMaxCopyTime(data).then(function(response){
             if(response.code == 0){
                SweetAlert.swal({
				  	title: "",
				  	text: "修改成功！",
				  	timer: 1000,
				  	showConfirmButton: false,
				  	type : "success"
				})
            }else{
                SweetAlert.swal("",response.msg,"error")
            }
        })
    }
	// 获得模板信息
	function getTemplateInfo(){
		var data = {
			store_sn : store_sn
		}
		TimeTemplet.GetTemplate(data).then(function(response){
            if(response.code == 0){
            	for(var q =  0;q < response.data.length;q++){
            		if(response.data[q].type == 0){
            			$scope.showDurationFlag = true;
            			$scope.storeStartTime = getDurationTime3(response.data[q].template_begin_time);
            			$scope.storeEndTime = getDurationTime3(response.data[q].template_end_time);
            			$scope.spaceTime = response.data[q].interval_time;
            			$scope.durationMin = response.data[q].duration_time;
            			$scope.price = response.data[q].price;
            			for(var z = 0;z < $scope.durationArr.length;z++){
            				for(var i in response.data[q].template){ 
								if($scope.durationArr[z].room_sn == i){
									$scope.durationArr[z].durationTime = response.data[q].template[i] 
								}
            				}
            			}
            			$scope.typeArr = response.data;
            			console.log($scope.storeStartTime);
            			console.log($scope.storeEndTime);
					    turntimeData();
            		}
            	}
            	var int0 = false;
            	var int1 = false;
            	for(var x = 0;x < $scope.typeArr.length;x++){
    				if($scope.typeArr[x].type == 0){
    					int0 = true;
    				};
    				if($scope.typeArr[x].type == 1){
    					int1 = true;
    				}
    			}
    			if(!int0){
    				$scope.typeArr.push({
						type : 0,
						template_name : "平日",
						apply_time:[]
					})
    			}
    			if(!int1){
    				$scope.typeArr.push({
						type : 1,
						template_name : "周末",
						apply_time:[]
					})
    			}
            }else{
                SweetAlert.swal("",response.msg,"error");
            }
        })
	}
	getTemplateInfo();
	//模板类型
	$scope.typeArr = [
		{
			type : 0,
			template_name : "平日",
			apply_time:[]
		},
		{
			type : 1,
			template_name : "周末",
			apply_time:[]
		}
	];
	$scope.temType = "0";
	$("#typeSelect").change(function(){
		$scope.changeType()
	})
	$scope.changeType = function(){
		console.log($scope.typeArr)
		$scope.showDateTypeArr = [];
		if($scope.temType == 2){
			for(var i = 0;i <　$scope.typeArr.length;i++){
				if(!($scope.typeArr[i].apply_time instanceof Array)){
					if($scope.typeArr[i].apply_time){
						$scope.typeArr[i].apply_time = JSON.parse($scope.typeArr[i].apply_time);
					}else{
						$scope.typeArr[i].apply_time = [];
					}
				}
				if($scope.typeArr[i].template_name == $("#typeSelect option:selected").text()){
					$scope.showDateTypeArr = $scope.typeArr[i].apply_time
				}
			}
		}
        for(var q =  0;q < $scope.typeArr.length;q++){
    		if($scope.typeArr[q].type == $scope.temType && $scope.typeArr[q].template_name ==  $("#typeSelect option:selected").text()){
    			if(!$scope.typeArr[q].template_begin_time){
    				$scope.showDurationFlag = false;
	    			$scope.storeStartTime = "8:00";
					$scope.storeEndTime = "3:00";
					$scope.spaceTime = 10;
					$scope.durationMin = 150;
					$scope.price = 36;
					return;
    			}
    			$scope.showDurationFlag = true;
    			$scope.template_sn = $scope.typeArr[q].template_sn;;
    			$scope.storeStartTime = getDurationTime3($scope.typeArr[q].template_begin_time);
    			$scope.storeEndTime = getDurationTime3($scope.typeArr[q].template_end_time);
    			$scope.spaceTime = $scope.typeArr[q].interval_time;
    			$scope.durationMin = $scope.typeArr[q].duration_time;
    			$scope.price = $scope.typeArr[q].price;
    			for(var z = 0;z < $scope.durationArr.length;z++){
    				for(var i in $scope.typeArr[q].template){ 
						if($scope.durationArr[z].room_sn == i){
							$scope.durationArr[z].durationTime = $scope.typeArr[q].template[i] 
						}
    				}
    			}
    		}
    	}
    	turntimeData();	
	}
	// 添加模板
	$scope.addDateType = function(){
		var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'addDateType.html',
            controller: 'addDateTypeModalInstanceCtrl',
            resolve: {
                timeTempletController : function(){
                	return $scope
                }
            }
        });
        modalInstance.result.then(function () {

        });
	};

	// 删除模板
	$scope.deleteTemplate = function(){
		var templateSn = "";
		for(var i = 0;i < $scope.typeArr.length;i++){
			if($scope.typeArr[i].template_name == $("#typeSelect option:selected").text()){
				if($scope.typeArr[i].template_sn){
					templateSn = $scope.typeArr[i].template_sn
				}
			}
		}
		var data = {
			template_sn : templateSn
		}
		// 删除模板
		TimeTemplet.RemoveTemplate(data).then(function(response){
            if(response.code == 0){
                $window.location.reload();
            }else{
                SweetAlert.swal("",response.msg,"error");
            }
        })
	};

	// 自定义模板添加时间
	$scope.addTypeDate = function(){
		if(!$scope.changeDate){
			return;
		}
		var todayTime = getTodayTime(new Date());
		var time = getTodayTime($scope.changeDate);
		for(var i = 0;i <　$scope.typeArr.length;i++){
			if($scope.typeArr[i].template_name == $("#typeSelect option:selected").text()){
				for(var j = 0;j <　$scope.typeArr[i].apply_time.length;j++){
					if($scope.typeArr[i].apply_time[j] == time){
						SweetAlert.swal({
			                title: "",
			                text: "该时间已存在！",
			                timer: 1000,
			                showConfirmButton: false,
			                type : "error"
			            })
						return;
					}
				}
				if(time < todayTime){
					SweetAlert.swal({
		                title: "",
		                text: "错误时间选择！",
		                timer: 1000,
		                showConfirmButton: false,
		                type : "warning"
		            })
		            return;
				}
				$scope.typeArr[i].apply_time.push(time)
			}
		}
	};
	$scope.checkDateChange = function(date){
		$scope.changeDate = date;
	}

	// 删除自定义模板使用日期
	$scope.deleteApply_time = function(arr,index){
		arr.splice(index,1)
	}

	// 模板应用
	$scope.applyTemplate = function(){
		SweetAlert.swal({
            title:"",
            text: "确定是否应用？",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "确定",
            cancelButtonText: "返回",
            closeOnConfirm: false,
            html:true
        },function(isConfirm){
            if(isConfirm){
            	if($scope.temType == 0){
            		$scope.template_sn = $scope.typeArr[0].template_sn
            	};
            	var data = {
            		store_sn : store_sn,
            		template_sn : $scope.template_sn
            	};
                TimeTemplet.ApplyTemplate(data).then(function(response){
                    if(response.code == 0){
                        SweetAlert.swal({
						  	title: "",
						  	text: "应用成功！",
						  	timer: 1000,
						  	showConfirmButton: false,
						  	type : "success"
						})
                    }else{
                        SweetAlert.swal("",response.msg,"error");
                    }
                })
            }else{
            }
        })
	};

	// 默认选中周一到周七的checkbox
	$scope.option1 = true;
	// 监听分页数值变化
    $scope.$watch(function() {
            return $scope.option1;
        },
        function(value) {
            $scope.option1 = true;
        },
        true
    );

	// 开始时间，打烊时间，房间间隔时间，单场时间，价格,清洁时间
	$scope.storeStartTime = "8:00";
	$scope.storeEndTime = "3:00";
	$scope.spaceTime = 10;
	$scope.durationMin = 150;
	$scope.price = 36;
	$scope.clearTime = 10;

	// 默认时间段隐藏
	$scope.showDurationFlag = false;

	// 时间段数组
	$scope.durationArr = [];
	for(var q = 0;q <　$scope.storeData.length;q++){
		var room_sn = $scope.storeData[q].room_sn;
		$scope.durationArr.push({
			room_name : $scope.storeData[q].room_name,
			room_sn : room_sn
		})
	}
	console.log($scope.durationArr)

	// 点击生成时间
	function isInteger(obj) {
	 	return parseInt(obj, 10) === obj
	}
	$scope.produceDuration = function(){
		if(!$scope.begin_time || !$scope.begin_time){
			SweetAlert.swal({
                title: "",
                text: "请输入正确的营业时间！",
                timer: 1000,
                showConfirmButton: false,
                type : "warning"
            })
            return;
		}
		$scope.durationMin = Number($scope.durationMin);
		if($scope.durationMin > 720 || $scope.durationMin<=0 || (!isInteger(Number($scope.durationMin)))){
			SweetAlert.swal({
                title: "",
                text: "单场时间必须大于0小于720的整数！",
                timer: 2000,
                showConfirmButton: false,
                type : "warning"
            })
			return;
		};
		if($scope.spaceTime >= ($scope.durationMin + $scope.clearTime) || $scope.spaceTime >180 || $scope.spaceTime < 0 || (!isInteger(Number($scope.spaceTime)))){
			SweetAlert.swal({
                title: "",
                text: "错场时间必须是0到180之间,不能超过单场时间加上清洁时间的整数！",
                timer: 2000,
                showConfirmButton: false,
                type : "warning"
            })
			return;
		}
		if($scope.price < 0){
			SweetAlert.swal({
                title: "",
                text: "价格不能小于0！",
                timer: 1000,
                showConfirmButton: false,
                type : "warning"
            })
			return;
		}

		// // 开始时间分钟数
		// var storeStartTimeMin = Number(getDurationTime2($scope.storeStartTime));

		// // 结束时间分钟数
		// var storeEndTimeMin = Number(getDurationTime2($scope.storeEndTime));
		var storeStartTimeMin = Number($scope.begin_time.getHours())*60 + Number($scope.begin_time.getMinutes());
		var storeEndTimeMin = Number($scope.end_time.getHours())*60 + Number($scope.end_time.getMinutes());
		if(storeStartTimeMin > storeEndTimeMin){
			storeEndTimeMin = storeEndTimeMin + 1440;
		}
		// 生成的时间段数组
		var durationSin = [];

		// 房间循环周期数
		var roundRoom = Math.ceil(($scope.durationMin + $scope.clearTime) / $scope.spaceTime);

		// 时间段生成个数
		var durationLength = Math.ceil((storeEndTimeMin - storeStartTimeMin) / ($scope.durationMin + $scope.clearTime));
		if(!$scope.durationMin || isNaN(Number($scope.durationMin))){
            SweetAlert.swal({
                title: "",
                text: "请输入正确的单场时间！",
                timer: 1000,
                showConfirmButton: false,
                type : "warning"
            })
            return;
		};
		if(!$scope.price || isNaN(Number($scope.price))){
            SweetAlert.swal({
                title: "",
                text: "请输入正确的包间价格！",
                timer: 1000,
                showConfirmButton: false,
                type : "warning"
            })
            return;
		};
		if(!$scope.spaceTime || isNaN(Number($scope.spaceTime))){
            SweetAlert.swal({
                title: "",
                text: "请输入正确的错场时间！",
                timer: 1000,
                showConfirmButton: false,
                type : "warning"
            })
            return;
		}
		for(var i = 0;i < durationLength;i++){
			if(i == 0){
				durationSin.push({
					begin_time : Number(storeStartTimeMin + i*($scope.durationMin)),
					end_time : Number(storeStartTimeMin + i*($scope.durationMin) + $scope.durationMin),
					price : $scope.price
				});
			}else{
				durationSin.push({
					begin_time : Number(storeStartTimeMin + i*($scope.durationMin + $scope.clearTime)),
					end_time : Number(storeStartTimeMin + i*($scope.durationMin + $scope.clearTime) + $scope.durationMin),
					price : $scope.price
				});
			}
			
		}
		// 时间段添加到房间上
		for(var j = 0;j < $scope.durationArr.length;j++){
			$scope.durationArr[j].durationTime = angular.copy(durationSin);
			var addMinRound = j % roundRoom;
			for(var k = 0;k < $scope.durationArr[j].durationTime.length;k++){
				$scope.durationArr[j].durationTime[k].begin_time = $scope.durationArr[j].durationTime[k].begin_time + addMinRound*$scope.spaceTime;
				$scope.durationArr[j].durationTime[k].end_time = $scope.durationArr[j].durationTime[k].end_time + addMinRound*$scope.spaceTime;
			}
		}
		// 判断时段结束时间是否会大于门店开始时间
		for(var f = 0;f < $scope.durationArr.length;f++){
			if($scope.durationArr[f].durationTime[($scope.durationArr[f].durationTime.length)-1].end_time > 1440){
				if(($scope.durationArr[f].durationTime[($scope.durationArr[f].durationTime.length)-1].end_time-1440) > storeStartTimeMin){
					$scope.durationArr[f].durationTime.splice(($scope.durationArr[f].durationTime.length)-1,1);
					f--;
				}
			}
		}

		// 判断时段开始时间是否会大于门店打烊时间
		for(var t = 0;t < $scope.durationArr.length;t++){
			if(($scope.durationArr[t].durationTime[($scope.durationArr[t].durationTime.length)-1].begin_time) >= storeEndTimeMin){
				$scope.durationArr[t].durationTime.splice(($scope.durationArr[t].durationTime.length)-1,1);
				t--;
			}
		}

		// 判断时段结束时间是否会大于门店打烊时间
		for(var t = 0;t < $scope.durationArr.length;t++){
			if(($scope.durationArr[t].durationTime[($scope.durationArr[t].durationTime.length)-1].end_time) > storeEndTimeMin){
				$scope.durationArr[t].durationTime.splice(($scope.durationArr[t].durationTime.length)-1,1);
				t--;
			}
		}
		
		// show时间段
		$scope.showDurationFlag = true;
	};

	$scope.goback = function(){
		window.history.go(-1);
	};
	
	//删除时间段
	$scope.deleteDuration = function(roomIndex,timeIndex){
		$scope.durationArr[roomIndex].durationTime.splice(timeIndex,1)
	}

	//修改时间段
	$scope.changeDurationTime = function(roomIndex,timeIndex,timeInfo){
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'durationTem.html',
            controller: 'temDurationModalInstanceCtrl',
            resolve: {
            	roomIndex : function(){
                    return roomIndex;
                },
                timeIndex : function(){
                    return timeIndex;
                },
                timeInfo : function(){
                    return timeInfo;
                },
                timeTempletController : function(){
                	return $scope.timeTempletController
                }
            }
        });
        modalInstance.result.then(function () {

        });
	}
	// 点击保存时间段信息
	$scope.submitTemData = function(){
		var durationData = {};
		for(var i = 0;i < $scope.durationArr.length;i++){
			// durationData.push({
			// 	[$scope.durationArr[i].room_sn] : $scope.durationArr[i].durationTime
			// })
			durationData[$scope.durationArr[i].room_sn] = $scope.durationArr[i].durationTime
		};
		if($scope.temType == 2){
			var timeArr = [];
			var templateSn = "";
			for(var q = 0;q < $scope.typeArr.length;q++){
				if($scope.typeArr[q].template_name == $("#typeSelect option:selected").text()){
					timeArr = $scope.typeArr[q].apply_time;
					if($scope.typeArr[q].template_sn){
						templateSn = $scope.typeArr[q].template_sn
					}
				}
			}
			if(timeArr.length == 0){
				SweetAlert.swal({
	                title: "",
	                text: "请添加使用日期再保存！",
	                timer: 1000,
	                showConfirmButton: false,
	                type : "warning"
	            })
            	return;
			};
			var data = {
				token : token,
				type  : $scope.temType,
				template_name : $("#typeSelect option:selected").text(),
				apply_time : JSON.stringify(timeArr),
				store_sn : store_sn,
				template : JSON.stringify(durationData),
				interval_time : $scope.spaceTime,
				template_begin_time : Number($scope.begin_time.getHours())*60 + Number($scope.begin_time.getMinutes()),
				template_end_time : Number($scope.end_time.getHours())*60 + Number($scope.end_time.getMinutes()),
				duration_time : $scope.durationMin,
				price : $scope.price,
				template_sn : templateSn
			}
			if(!data.template_sn){
				delete data.template_sn
			};

		}else{
			var data = {
				token : token,
				type  : $scope.temType,
				template_name : $("#typeSelect option:selected").text(),
				store_sn : store_sn,
				template :JSON.stringify(durationData),
				interval_time : $scope.spaceTime,
				template_begin_time : Number($scope.begin_time.getHours())*60 + Number($scope.begin_time.getMinutes()),
				template_end_time : Number($scope.end_time.getHours())*60 + Number($scope.end_time.getMinutes()),
				duration_time : $scope.durationMin,
				price : $scope.price
			};
		};

		// 时间段大于1440的减去1440
		data.template = JSON.parse(data.template);
		console.log(data.template)
		for(var key in data.template){
			for(var l = 0;l < data.template[key].length;l++){
				if(Number(data.template[key][l].begin_time) > 1440){
					data.template[key][l].begin_time = data.template[key][l].begin_time - 1440
				};
				if(Number(data.template[key][l].end_time) > 1440){
					data.template[key][l].end_time = data.template[key][l].end_time - 1440
				}
			}    
	    }    
		data.template = JSON.stringify(data.template);

		// 添加模板
		TimeTemplet.AddTemplate(data).then(function(response){
            if(response.code == 0){
            	// SweetAlert.swal("","保存模板成功！","success");
                var data2 = {
                	store_sn : store_sn,
	            	template_sn : response.data.template_sn
                }
                TimeTemplet.ApplyTemplate(data2).then(function(response){
                    if(response.code == 0){
                    	for(var i = 0;i < $scope.typeArr.length;i++){
                    		if($scope.typeArr[i].template_name == data.template_name){
                    			$scope.typeArr[i].duration_time = data.duration_time;
                    			$scope.typeArr[i].interval_time = data.interval_time;
                    			$scope.typeArr[i].price = data.price;
                    			$scope.typeArr[i].store_sn = data.store_sn;
                    			$scope.typeArr[i].template = JSON.stringify(data.template);
                    			$scope.typeArr[i].template_begin_time = data.template_begin_time;
                    			$scope.typeArr[i].template_end_time = data.template_end_time;
                    		}
                    	}
                    	SweetAlert.swal({
						  	title: "",
						  	text: "模板应用成功！",
						  	timer: 1000,
						  	showConfirmButton: false,
						  	type : "success"
						});
                    }else{
                        SweetAlert.swal("",response.msg,"error");
                    }
                });
     //            $timeout(function(){
     //            	var newTemplateSn = "";
					// for(var i = 0;i < $scope.typeArr.length;i++){
					// 	if($scope.typeArr[i].template_name == $("#typeSelect option:selected").text()){
					// 		if($scope.typeArr[i].template_sn){
					// 			newTemplateSn = $scope.typeArr[i].template_sn
					// 		}
					// 	}
					// }
					// var data = {
	    //         		store_sn : store_sn,
	    //         		template_sn : newTemplateSn
	    //         	};
	    //             TimeTemplet.ApplyTemplate(data).then(function(response){
	    //                 if(response.code == 0){
	    //                 	SweetAlert.swal({
					// 		  	title: "",
					// 		  	text: "模板应用成功！",
					// 		  	timer: 1000,
					// 		  	showConfirmButton: false,
					// 		  	type : "success"
					// 		})
	    //                 }else{
	    //                     SweetAlert.swal("",response.msg,"error");
	    //                 }
	    //             })
     //            },1500)
            }else{
                SweetAlert.swal("",response.msg,"error");
            }
        })
	}

	// 点击添加时间段
    $scope.addDurationTime = function(index,duration){
    	var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'addDurationTem.html',
            controller: 'addTemDurationModalInstanceCtrl',
            resolve: {
            	roomIndex : function(){
                    return index;
                },
                duration : function(){
                    return duration;
                },
                timeTempletController : function(){
                	return $scope
                }
            }
        });
        modalInstance.result.then(function () {

        });
    }
    datePicker();
    // 日期插件调用
	function datePicker(){
	    $scope.today = function() {
	        $scope.checkDate = new Date();
	    };
	    // $scope.today();

	    $scope.clear = function() {
	        $scope.dt1 = null;
	    };

	    // 设置周六周日不可选，不使用
	    function disabled(data) {
	        var date = data.date;
	        mode = data.mode;
	        return mode === 'day' && (date.getDay() === 10 || date.getDay() === 11);
	    }

	    $scope.toggleMin = function() {
	        $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
	        $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
	    };
	    $scope.inlineOptions = {
	        customClass: getDayClass,
	        minDate: new Date(),
	        showWeeks: true
	    };

	    $scope.dateOptions = {
	        dateDisabled: disabled,
	        formatYear: 'yy',
	        maxDate: new Date(2020, 5, 22),
	        minDate: new Date(2017,1,1),
	        startingDay: 1
	    };
	    $scope.openDateBox = function() {
	        $scope.popup1.opened = true;
	    };
	    $scope.setDate = function(year, month, day) {
	        $scope.dt1 = new Date(year, month, day);
	    };

	    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
	    $scope.format = $scope.formats[0];
	    $scope.altInputFormats = ['M!/d!/yyyy'];

	    $scope.popup1 = {
	        opened: false
	    };

	    var tomorrow = new Date();
	    tomorrow.setDate(tomorrow.getDate() + 1);
	    var afterTomorrow = new Date();
	    afterTomorrow.setDate(tomorrow.getDate() + 1);
	    $scope.events = [
	        {
	          date: tomorrow,
	          status: 'full'
	        },
	        {
	          date: afterTomorrow,
	          status: 'partially'
	        }
	    ];

	    function getDayClass(data) {
	        var date = data.date,
	        mode = data.mode;
	        if (mode === 'day') {
	            var dayToCheck = new Date(date).setHours(0,0,0,0);

	            for (var i = 0; i < $scope.events.length; i++) {
	                var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

	                if (dayToCheck === currentDay) {
	                    return $scope.events[i].status;
	                }
	            }
	        }
	        return '';
	    }
	}


	// 时间段插件
  	$scope.hstep = 1;
  	$scope.mstep = 15;
		//转为时间obj
    function turntimeData(){
        var beginTime = getDurationTime2($scope.storeStartTime);
        var endTime = getDurationTime2($scope.storeEndTime);
        $scope.begin_time = new Date();
        $scope.end_time = new Date();
        $scope.begin_time.setHours(turnTime(beginTime).hours);
        $scope.begin_time.setMinutes(turnTime(beginTime).minutes);
        $scope.end_time.setHours(turnTime(endTime).hours);
        $scope.end_time.setMinutes(turnTime(endTime).minutes);
    }
    function turnTime(time){
        var out = "";
        var hours = parseInt(time/60);
        var minutes = time%60;
        out = {
            hours : hours,
            minutes : minutes
        };
        return out;
    }
});
// 时间模板添加
app.controller('addDateTypeModalInstanceCtrl',function($scope,$uibModalInstance,$location,SweetAlert,Auth,$uibModal,$localStorage,timeTempletController){
    var token = Auth.getLocalData("token");
    $scope.addDateType = function(){
    	if($scope.newDateType){
    		var data = {
    			type : 2,
    			template_name : $scope.newDateType,
    			apply_time : []
    		}
    		timeTempletController.typeArr.push(data);
	    	$uibModalInstance.close();
    	}else{
    		return;
    	}
    }
})
// 时段修改
app.controller('temDurationModalInstanceCtrl',function($scope,$uibModalInstance,$location,SweetAlert,$uibModal,Auth,$localStorage,timeTempletController,roomIndex,timeIndex,timeInfo){
    var token = Auth.getLocalData("token");
    $scope.time = angular.copy(timeInfo);
    if($scope.time.end_time >= 1440){
    	$scope.time.end_time = $scope.time.end_time - 1440
    };
    $scope.showTime = getDurationTime3($scope.time.begin_time) + "-" + getDurationTime3($scope.time.end_time);
    $scope.subChangeDurationTime = function(showTime){
    	var arr = showTime.split("-");
    	timeInfo.begin_time = getDurationTime2(arr[0]);
    	timeInfo.end_time = getDurationTime2(arr[1]);
    	$uibModalInstance.close();
    };
})
// 时段添加
app.controller('addTemDurationModalInstanceCtrl',function($scope,$uibModalInstance,$location,SweetAlert,Auth,$uibModal,$localStorage,timeTempletController,roomIndex,duration){
    var token = Auth.getLocalData("token");
    datePicker();
    // 时间段插件
  	$scope.hstep = 1;
  	$scope.mstep = 15;
    // 日期插件调用
	function datePicker(){
	    $scope.today = function() {
	        $scope.checkDate = new Date();
	    };
	    // $scope.today();

	    $scope.clear = function() {
	        $scope.dt1 = null;
	    };

	    // 设置周六周日不可选，不使用
	    function disabled(data) {
	        var date = data.date,
	        mode = data.mode;
	        return mode === 'day' && (date.getDay() === 10 || date.getDay() === 11);
	    }

	    $scope.toggleMin = function() {
	        $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
	        $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
	    };
	    $scope.inlineOptions = {
	        customClass: getDayClass,
	        minDate: new Date(),
	        showWeeks: true
	    };

	    $scope.dateOptions = {
	        dateDisabled: disabled,
	        formatYear: 'yy',
	        maxDate: new Date(2020, 5, 22),
	        minDate: new Date(2017,1,1),
	        startingDay: 1
	    };
	    $scope.openDateBox = function() {
	        $scope.popup1.opened = true;
	    };
	    $scope.setDate = function(year, month, day) {
	        $scope.dt1 = new Date(year, month, day);
	    };

	    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
	    $scope.format = $scope.formats[0];
	    $scope.altInputFormats = ['M!/d!/yyyy'];

	    $scope.popup1 = {
	        opened: false
	    };

	    var tomorrow = new Date();
	    tomorrow.setDate(tomorrow.getDate() + 1);
	    var afterTomorrow = new Date();
	    afterTomorrow.setDate(tomorrow.getDate() + 1);
	    $scope.events = [
	        {
	          date: tomorrow,
	          status: 'full'
	        },
	        {
	          date: afterTomorrow,
	          status: 'partially'
	        }
	    ];

	    function getDayClass(data) {
	        var date = data.date,
	        mode = data.mode;
	        if (mode === 'day') {
	            var dayToCheck = new Date(date).setHours(0,0,0,0);

	            for (var i = 0; i < $scope.events.length; i++) {
	                var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

	                if (dayToCheck === currentDay) {
	                    return $scope.events[i].status;
	                }
	            }
	        }
	        return '';
	    }
	}
    $scope.addDurationTime = function(){
    	var reg = /^(([01]?[0-9])|(2[0-3])):[0-5]?[0-9]-(([01]?[0-9])|(2[0-3])):[0-5]?[0-9]$/;
    	// if(!reg.test($scope.showAddTime)){
    	// 	SweetAlert.swal({
     //            title: "",
     //            text: "请输入正确的时间格式，xx:xx-xx:xx",
     //            timer: 1000,
     //            showConfirmButton: false,
     //            type : "warning"
     //        })
    	// 	return;
    	// };
    	if(!Number($scope.showAddPrice) && Number($scope.showAddPrice) < 0){
    		SweetAlert.swal({
                title: "",
                text: "请输入正确的价格",
                timer: 1000,
                showConfirmButton: false,
                type : "warning"
            });
            return;
    	}
    	// var arr = $scope.showAddTime.split("-");
    	var data = {
    		begin_time : $scope.begin_time.getHours()*60+$scope.begin_time.getMinutes(),
    		end_time : $scope.end_time.getHours()*60+$scope.end_time.getMinutes(),
    		price : $scope.showAddPrice
    	};
    	duration.durationTime.push(data);
    	$uibModalInstance.close();
    };
    $scope.close = function(){
    	$uibModalInstance.close();
    };
})