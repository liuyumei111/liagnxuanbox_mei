'use strict';
app
    .controller('ccheckCtrl', ['$scope', '$http', '$state', '$q', '$filter', function ($scope, $http, $state, $q, $filter) {

        $scope.m_project_name=window.sessionStorage.getItem('project_name')

        var mainHttp={
            // 人脸注册
            findFaceAjax: function (appId,storeId,faceid) {
                $http({
                    method: 'get',
                    url: USP_SERVER_ROOT1 + 'newface/findFace?appId='+appId+'&storeId='+storeId+'&faceId='+faceid,
                }).success(function (data, status, headers) {
                    $scope.loading = false;
                    $scope.faceInfo=data.faceInfo;
                    console.log($scope.faceInfo);
                     layer.open({
                         title: '注册成功',
                         type: 1,
                         area: ['500px','400px'],
                         content: $(".addfaceOK"),
                         btn: ['确认'],
                         shade: 0, //不显示遮罩
                         yes: function () {
                             layer.closeAll()
                         },
                         btn2: function () {}
                     });
                })
                    .error(function (data, status, headers) {
                        $scope.authError = data.message;
                        $scope.loading = false;
                    });
            },
        };

        //    注册按钮
        $scope.findFace=function () {
            var appId= $('#appId').val();
            var storeId= $('#storeId').val();
            var faceid= $('#faceid').val();

            if (appId == 'NaN' || appId == 'undefined' || appId == '') {
                layer.tips('appId不能为空', '#appId');
                return false;
            }
            if (storeId == 'NaN' || storeId == 'undefined' || storeId == '') {
                layer.tips('storeId不能为空', '#storeId');
                return false;
            }
            if (faceid == 'NaN' || faceid == 'undefined' || faceid == '') {
                layer.tips('faceid不能为空', '#faceid');
                return false;
            }

            mainHttp.findFaceAjax(appId,storeId,faceid)

        }



    }]);