'use strict';
app
    .controller('cameraCtrl', ['$scope', '$http', '$state', '$q', '$filter', function ($scope, $http, $state, $q, $filter) {

        $scope.m_project_name=window.sessionStorage.getItem('project_name')

         $scope.cameraNav = [

                {
                    "menuName": "图像集合",
                    "url": "camera.list"
                },
                {
                    "menuName": "人脸查询 ",
                    "url": "camera.check"
                },
                {
                    "menuName": "人脸注册 ",
                    "url": "camera.register"
                },
            ];


    }]);