'use wifipix';
app
    .controller('wifipix1Controller', ['$scope', '$http', '$state', '$q', '$filter','$stateParams', function ($scope, $http, $state, $q, $filter,$stateParams) {
        window.sessionStorage.removeItem("storeName");
        if ($stateParams.storeName == undefined) {
        } else {
            window.sessionStorage.setItem('storeName', $stateParams.storeName);
        }
        $scope.m_project_name = window.sessionStorage.getItem('storeName');
        $scope.cameraNav = [
            {
                "menuName": "客流统计 ",
                "url": "wifipix-1.statistics"
            },
            {
                "menuName": "用户画像",
                "url": "wifipix-1.portrayal"
            }
        ];


    }]);