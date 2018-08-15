'use strict';
app.controller('ccaloCtrl', ['$scope', '$http', '$state', '$q', '$interval', function ($scope, $http, $state, $q, $interval) {

    $scope.app.title.version = " - 基础版 +";
    $scope.app.title.secondary = "";
    $scope.loading = true;
    $scope.app.exhibition.id = window.sessionStorage.getItem('basePlusId');

    var projectId = window.sessionStorage.getItem("projectId");

    //input选择框初始化
    layui.use('form', function(){
        var form = layui.form;
        //监听提交
        form.on('submit(formDemo)', function(data){
            layer.msg(JSON.stringify(data.field));
            return false;
        });
    });


    var mainHttp={
        //确定查询接口
        caloAjax: function (inputVal) {
            $http({
                method: 'POST',
                url: USP_SERVER_ROOT1 + 'newbox/calo',
                data:{
                    type:inputVal
                }
            }).success(function (data, status, headers) {
                $scope.loading = false;
                console.log(data)
            })
                .error(function (data, status, headers) {
                    $scope.authError = data.message;
                    $scope.loading = false;
                });
        },
        //下载
        updownAjax: function () {
          /*  $http({
                method: 'GET',
                url: USP_SERVER_ROOT1 + 'newbox/updown?'+'filename=calo评分.xls',
            }).success(function (data, status, headers) {
                $scope.loading = false;
            })
                .error(function (data, status, headers) {
                    $scope.authError = data.message;
                    $scope.loading = false;
                });*/

            $http({
                method: 'GET',
                url: USP_SERVER_ROOT1 + 'newbox/updown',
            }).success(function (data, status, headers) {
                $scope.loading = false;
            })
                .error(function (data, status, headers) {
                    $scope.authError = data.message;
                    $scope.loading = false;
                });
        },
    };

     //上传查询文件
    layui.use('upload', function(){
        var upload = layui.upload;
        var uploadInst = upload.render({
            elem: '#test1' //绑定元素
            ,url: USP_SERVER_ROOT1+'newbox/uploadimg' //上传接口
            ,accept:'file'
            ,done: function(res){
                //上传完毕回调
                if(res.code==200){
                    $('.upload').addClass('upload-active');
                    layer.msg('上传成功', {icon: 1});
                    var fileName=res.fileName.toString()
                    // fileName= fileName.split('.')[0]
                    $('.uploadText').html(fileName+'上传成功')

                }else {
                    layer.msg('文件格式不对', {icon: 2});
                }

            }
            ,error: function(){
                //请求异常回调
                layer.msg('服务器异常', {icon: 2});
            }
        });
    });

    //查询按钮操作
    $scope.searchCalo=function () {
        //检测是否上传文件
        if(!$('.upload').hasClass('upload-active')){
            layer.msg('您没有上传查询文件', {icon: 2});
            return;
        }


       // 确认查询询问
       var inputVal= $('.layui-input').val();
        layer.confirm('您将根据【'+inputVal+'】进行查询calo评分', {
            btn: ['确定', '取消'] //按钮
        }, function () {
            // console.log('确定查询');
            mainHttp.caloAjax(inputVal)
            layer.closeAll()
        }, function () {
            // layer.msg('取消成功', {icon: 1});
        });
    }

//    下载模板
    $scope.downloadTpl=function () {
        mainHttp.updownAjax()
    }

}]);