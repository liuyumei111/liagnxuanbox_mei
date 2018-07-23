app
    .controller('pflowperceptionCtrl', ['$scope', '$rootScope', '$http', '$state', '$q', '$stateParams', 'Sysuser', 'apiStorage', function ($scope, $rootScope, $http, $state, $q, $stateParams, Sysuser, apiStorage) {

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
            //项目信息列表
            findboxAjax: function () {

                $http({
                    method: 'GET',
                    url: admin_ROOT + 'project/findbox?'+'customer_name='+'yiqihongqi',
                }).success(function (data, status, headers) {
                    $scope.loading = false;
                    console.log(data)
                })
                    .error(function (data, status, headers) {
                        $scope.authError = data.message;
                        $scope.loading = false;
                    });
            },

        }
        mainHttp.findboxAjax()










    }]);