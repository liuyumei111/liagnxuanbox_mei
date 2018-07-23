app
    .controller('uinfoCtrl', ['$scope', '$rootScope', '$http', '$state', '$q', '$stateParams', 'Sysuser', 'apiStorage', function ($scope, $rootScope, $http, $state, $q, $stateParams, Sysuser, apiStorage) {

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
            userinfoAjax: function () {
                var userName = localStorage.getItem('userName')

                $http({
                    method: 'GET',
                    url: admin_ROOT + 'user/userinfo' + '?username=' + userName,
                }).success(function (data,status, headers) {
                    $scope.loading = false;
                    $scope.dataS=data.userInfo[0]
                    // console.log($scope.dataS)

                })
                    .error(function (data, status, headers) {
                        $scope.authError = data.message;
                        $scope.loading = false;
                    });
            },
        }
        mainHttp.userinfoAjax()










        }]);