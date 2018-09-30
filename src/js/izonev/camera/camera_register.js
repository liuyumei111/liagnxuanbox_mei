'use strict';
app
    .controller('cregisterCtrl', ['$scope', '$http', '$state', '$q', '$filter', function ($scope, $http, $state, $q, $filter) {

        $scope.m_project_name=window.sessionStorage.getItem('project_name');
        $scope.appIdS=window.sessionStorage.getItem('appId');
        $scope.storeidS=window.sessionStorage.getItem('storeId');


        var mainHttp={
            // 人脸注册
            addfaceAjax: function (appId,storeId,userId,userInfo,fileName) {
                $http({
                    method: 'get',
                    url: USP_SERVER_ROOT1 + 'newface/addface?appId='+appId+'&storeId='+storeId+'&userId='+userId+'&userInfo='+userInfo+'&filename='+fileName,
                }).success(function (data, status, headers) {
                    $scope.loading = false;
                    if(data.respStatus.code=='100'){
                        layer.msg('注册成功', {icon: 1});
                    }
                    /* layer.open({
                         title: '注册成功',
                         type: 1,
                         area: ['500px'],
                         content: $(".addfaceOK"),
                         btn: ['确认'],
                         shade: 0, //不显示遮罩
                         yes: function () {
                             layer.closeAll()
                         },
                         btn2: function () {}
                     });*/
                })
                    .error(function (data, status, headers) {
                        $scope.authError = data.message;
                        $scope.loading = false;
                    });
            },

        };


        layui.use('upload', function(){
            var upload = layui.upload;

            //执行实例
            var uploadInst = upload.render({
                elem: '#test1' //绑定元素
                ,url:USP_SERVER_ROOT1+ 'newface/addfaceImg' //上传接口
                ,done: function(res){
                    //上传完毕回调
                    if(res.code==200){
                        $('.layui-btn').addClass('upload-active');
                        layer.msg('上传成功', {icon: 1});

                        $scope.fileName=res.fileName.toString();
                        $('.uploadText').html($scope.fileName+'上传成功')

                    }else {
                        layer.msg('文件格式不对', {icon: 2});
                    }
                }
                ,error: function(){
                    //请求异常回调
                }
            });
        });

    //    注册按钮
        $scope.searchAddface=function () {
            //检测是否上传文件
            if(!$('.upload').hasClass('upload-active')) {
                layer.msg('您没有上传查询文件', {
                    icon: 2
                });
                return;
            }

            var appId= $('#appId').attr('appId');
            var storeId= $('#storeId').attr('storeId');
            var userId= $('#userId').val();
            var userInfo= $('#userInfo').val();

            // if (appId == 'NaN' || appId == 'undefined' || appId == '') {
            //     layer.tips('appId不能为空', '#appId');
            //     return false;
            // }
            // if (storeId == 'NaN' || storeId == 'undefined' || storeId == '') {
            //     layer.tips('storeId不能为空', '#storeId');
            //     return false;
            // }
            if (userId == 'NaN' || userId == 'undefined' || userId == '') {
                userId == ''
            }
            if (userInfo == 'NaN' || userInfo == 'undefined' || userInfo == '') {
                userInfo == ''
            }
            mainHttp.addfaceAjax(appId,storeId,userId,userInfo,$scope.fileName)

        }

    }]);