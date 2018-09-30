'use strict';
app
    .controller('ccameraCtrl', ['$scope', '$http', '$state', '$q', '$filter', '$rootScope', function ($scope, $http, $state, $q, $filter, $rootScope) {

        $scope.m_project_name = window.sessionStorage.getItem('project_name')

        $scope.isShow = false
        $scope.appIdS = window.sessionStorage.getItem('appId');
        $scope.storeidS = window.sessionStorage.getItem('storeId');

        var mainHTTP = {
            //确定查询接口
            caloAjax: function (appId, storeId, deviceId) {
                if (deviceId == undefined) {
                    deviceId = ''
                }
                $http({
                    method: 'get',
                    url: USP_SERVER_ROOT1 + 'newface/findAllFace?storeId=' + storeId + '&appId=' + appId + '&deviceId=' + deviceId,
                }).success(function (data, status, headers) {
                    $scope.loading = false;
                    if (data.respStatus.code == 208) {
                        layer.msg('查询失败', {icon: 2});
                        $scope.isShow = false
                    } else if (data.respStatus.code == 100) {
                        $scope.isShow = true
                        $scope.faceDTOs = data.faceDTOs;

                    } else if (data.respStatus.code == 'null' || '') {
                        layer.msg('查询无数据', {icon: 2});
                        $scope.isShow = false
                    }
                })
                    .error(function (data, status, headers) {
                        $scope.authError = data.message;
                        $scope.loading = false;
                    });
            },
            //消息
            findpersonAjax: function () {
                // 初始化一个 WebSocket 对象
                var ws = new WebSocket("ws://39.106.166.192:8082/lx_box_pro/v1/test");
                // var ws =  new WebSocket("ws://192.168.1.116:8080/lx_box_pro/v1/test");

                // 接收服务端数据时触发事件
                ws.onmessage = function (evt) {
                    var received_msg = evt.data;
                    console.log('客户来了')
                    var audio = document.getElementById('audio');
                    audio.play();

                };

                // 断开 web socket 连接成功触发事件
                ws.onclose = function () {
                    // alert("连接已关闭...");
                };

            },
            //消息列表
            memberlist: function (appId, storeId, deviceId) {
                $http({
                    method: 'get',
                    url: 'http://39.106.166.192:8082/lx_box_pro/v1/camera/memberlist',
                    // url:  'http://192.168.1.116:8080/lx_box_pro/v1/camera/memberlist',
                }).success(function (data, status, headers) {
                    $scope.loading = false;
                    if (data.code == 200) {
                        $scope.memberlist = data.list;
                        console.log($scope.memberlist)
                    }
                })
                    .error(function (data, status, headers) {
                        $scope.authError = data.message;
                        $scope.loading = false;
                    });
            },

        };
        mainHTTP.caloAjax($scope.appIdS, $scope.storeidS);

        mainHTTP.findpersonAjax();
        $('.xiaoxi').click(function () {
            mainHTTP.memberlist();
        });

        $scope.searchList = function () {
            var appId = $('#appId').attr('appId');
            var storeId = $('#storeId').attr('storeId');
            var deviceId = $('#deviceId').val();

            // if (appId == 'NaN' || appId == 'undefined' || appId == '') {
            //     layer.tips('appId不能为空', '#appId');
            //     return false;
            // }
            // if (storeId == 'NaN' || storeId == 'undefined' || storeId == '') {
            //     layer.tips('storeId不能为空', '#storeId');
            //     return false;
            // }
            // if (deviceId == 'NaN' || deviceId == 'undefined' || deviceId == '') {
            //     deviceId == ''
            // }
            mainHTTP.caloAjax(appId, storeId, deviceId)
        }

    }]);