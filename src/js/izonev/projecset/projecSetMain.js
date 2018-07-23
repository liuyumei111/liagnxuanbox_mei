'use strict';
app
    .controller('projecSetMainCtrl', ['$scope', '$http', '$state', '$q', '$filter', function ($scope, $http, $state, $q, $filter) {
        $scope.mktime=window.sessionStorage.getItem('mktime');
        $scope.endtime=window.sessionStorage.getItem("endtime");
        var projectId=window.sessionStorage.getItem("projectId");

        $scope.menuSecondaryRes= [

            {
                "menuName": "区域层级设置",
                "url": "projecset.areaset"
            },
            {
                "menuName": "部署客流感知器 ",
                "url": "projecset.pflowperception"
            },
            {
                "menuName": "人群定义 ",
                "url": "projecset.peopledefine"
            },
            {
                "menuName": "黑名单 ",
                "url": "projecset.blacklis"
            }
        ];


    }]);