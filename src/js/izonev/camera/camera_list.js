'use strict';
app
    .controller('ccameraCtrl', ['$scope', '$http', '$state', '$q', '$filter', function ($scope, $http, $state, $q, $filter) {

        $scope.m_project_name = window.sessionStorage.getItem('project_name')

        $scope.isShow = false

        var mainHTTP = {
            //确定查询接口
            caloAjax: function (appId, storeId, deviceId) {
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
        };

        $scope.searchList = function () {
            var appId = $('#appId').val();
            var storeId = $('#storeId').val();
            var deviceId = $('#deviceId').val();

            if (appId == 'NaN' || appId == 'undefined' || appId == '') {
                layer.tips('appId不能为空', '#appId');
                return false;
            }
            if (storeId == 'NaN' || storeId == 'undefined' || storeId == '') {
                layer.tips('storeId不能为空', '#storeId');
                return false;
            }
            if (deviceId == 'NaN' || deviceId == 'undefined' || deviceId == '') {
                deviceId == ''
            }
            mainHTTP.caloAjax(appId, storeId, deviceId)
        }


    }]);