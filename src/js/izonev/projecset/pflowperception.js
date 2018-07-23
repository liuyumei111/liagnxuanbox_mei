'use strict';
app.controller('pflowperceptionCtrl', ['$scope', '$http', '$state', '$q', '$interval', function ($scope, $http, $state, $q, $interval) {

    $scope.app.title.version=" - 基础版 +";
    $scope.app.title.secondary="";
    $scope.app.title.Level3="部署客流感知器 | ";
    $scope.loading=false;
    $scope.app.exhibition.id=window.sessionStorage.getItem('basePlusId');
    var projectId=window.sessionStorage.getItem("projectId");

    $scope.cpage = 1;
    $scope.size = 20;

    var mainHttp = {

        getNeedleData: function () {
            $scope.loading = true;
            $http({
                method: 'get',
                url: $scope.app.fullUrl + "/manage/getNeedleData?propertis[project_id]="+projectId+"&cpage="+$scope.cpage+"&pageSize="+$scope.size,
                headers: {'Authorization': "Bearer " + $scope.app.token},
                withCredentials: true
            }).success(function (res) {
                switch(res.code){
                    case 2000:
                        $scope.needleData = res.data;/*
                        var data=res.data;
                        console.log($scope.needleData)
                        for(var i=0;i<data.length;i++){
                            if(data[i].status.status=='异常'){
                                data[i].status.abc='false'
                            }
                            console.log(data[i].status)
                        }*/
                        break;
                    case 4009:break;
                    case 4001:break;
                    case 5000:break;
                }
                $scope.loading = false;
            }).error(function (res) {
                console.log("加载失败");
                $scope.loading = false;


            });
        },

    };
    mainHttp.getNeedleData();
    $scope.$watch('app.exhibition', function(newVal, oldVal) {

    }, true);
}]);