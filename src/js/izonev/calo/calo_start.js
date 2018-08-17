'use strict';
app.controller('ccaloCtrl', ['$scope', '$http', '$state', '$q', '$interval', function($scope, $http, $state, $q, $interval) {

	$scope.app.title.version = " - 基础版 +";
	$scope.app.title.secondary = "";
	$scope.loading = true;
	$scope.app.exhibition.id = window.sessionStorage.getItem('basePlusId');

	var projectId = window.sessionStorage.getItem("projectId");

	//input选择框初始化
	layui.use('form', function() {
		var form = layui.form;
		//监听提交
		form.on('submit(formDemo)', function(data) {
			layer.msg(JSON.stringify(data.field));
			return false;
		});
	});

	var mainHttp = {
		//确定查询接口
		caloAjax: function(inputVal,filename) {
			$http({
					method: 'GET',
					url: USP_SERVER_ROOT1 + 'newbox/calo?type=' + inputVal+'&filename='+$scope.filename,
					data: {}
				}).success(function(data, status, headers) {
					$scope.loading = false;
					if(data.code == "200") {
						layer.confirm('是否下载结果文件', {
							btn: ['确定', '取消'] //按钮
						}, function() {
							// console.log('确定查询');
							mainHttp.updownAjax()
							layer.closeAll()
						}, function() {
							// layer.msg('取消成功', {icon: 1});
						});
					} else if(data.code == "400") {
						layer.msg('数据格式不匹配，请重新查询', {icon: 2});
					}
					console.log(data)
				})
				.error(function(data, status, headers) {
					$scope.authError = data.message;
					$scope.loading = false;
				});
		},

		//下载
		updownAjax: function() {
			var url = USP_SERVER_ROOT1 + 'newbox/updownresult/1';
			var xhr = new XMLHttpRequest();
			xhr.open('GET', url, true);
			xhr.responseType = "blob";
			xhr.onload = function() {
				if(this.status === 200) {
					var blob = this.response;
					var reader = new FileReader();
					reader.readAsDataURL(blob);
					reader.onload = function(e) {
						var a = document.createElement('a');
						a.download = 'calo评分结果.xlsx';
						a.href = e.target.result;
						$("body").append(a);
						a.click();
						$(a).remove();
					}
				}
			};
			xhr.send()
		},
	};

	//上传查询文件
	layui.use('upload', function() {
		var upload = layui.upload;
		var uploadInst = upload.render({
			elem: '#test1' //绑定元素
				,
			url: USP_SERVER_ROOT1 + 'newbox/uploadimg' //上传接口
				,
			accept: 'file',
			done: function(res) {
				//上传完毕回调
				if(res.code == 200) {
					$('.upload').addClass('upload-active');
					layer.msg('上传成功', {
						icon: 1
					});
					$scope.filename = res.fileName.toString()
					$('.uploadText').html($scope.filename + '上传成功')

				} else {
					layer.msg('文件格式不对', {
						icon: 2
					});
				}

			},
			error: function() {
				//请求异常回调
				layer.msg('服务器异常', {
					icon: 2
				});
			}
		});
	});

	//查询按钮操作
	$scope.searchCalo = function() {
		//检测是否上传文件
		if(!$('.upload').hasClass('upload-active')) {
			layer.msg('您没有上传查询文件', {
				icon: 2
			});
			return;
		}

		// 确认查询询问
		var inputVal = $('.layui-input').val();
		layer.confirm('您将根据【' + inputVal + '】进行查询calo评分', {
			btn: ['确定', '取消'] //按钮
		}, function() {
			// console.log('确定查询');
			mainHttp.caloAjax(inputVal)
			layer.closeAll()
		}, function() {
			// layer.msg('取消成功', {icon: 1});
		});
	}

}]);