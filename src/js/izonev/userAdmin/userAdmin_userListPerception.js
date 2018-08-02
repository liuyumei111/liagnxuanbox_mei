app
    .controller('userListPerceptionCtrl', ['$scope', '$rootScope', '$http', '$state', '$q', '$stateParams', 'Sysuser', 'apiStorage', function ($scope, $rootScope, $http, $state, $q, $stateParams, Sysuser, apiStorage) {

        //获取到用户名
        $scope.userRName = apiStorage.getLoc('userName');
        $scope.app.title.Level3 = "客流盒子 | ";
        $scope.app.title.version = " ";
        $scope.app.title.secondary = "";
        $scope.pageSize = 16;
        $scope.cpage = 1;
        $scope.stateNum = "NA";
        $scope.loading = true;

        var mainHttp = {
            userListAjax: function () {
                var userName = localStorage.getItem('userName')
                $http({
                    method: 'GET',
                    url: admin_ROOT + 'user/userList' + '?username=' + userName,
                }).success(function (data, status, headers) {
                    $scope.loading = false;
                    $scope.userManageDataS = data.userManage;
                })
                    .error(function (data, status, headers) {
                        $scope.authError = data.message;
                        $scope.loading = false;
                    });
            },
        }
        // mainHttp.userListAjax()

    }]);