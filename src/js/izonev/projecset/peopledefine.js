'use strict';
app.controller('peopledefineCtrl', ['$scope', '$http', '$state', '$q', '$interval', function ($scope, $http, $state, $q, $interval) {

    $scope.app.title.version=" - 基础版 +";
    $scope.app.title.secondary="";
    $scope.app.title.Level3="人群定义 | ";
    $scope.loading=false;
    $scope.app.exhibition.id=window.sessionStorage.getItem('basePlusId');
    var projectId=window.sessionStorage.getItem("projectId");
    $scope.d8=[
        {id:1,name:'顾客'}
    ];
    var n=["顾客","员工","路人"];
    $scope.addPeople=function () {
        $scope.d8.push(
            {id:1,name:n[parseInt(3*Math.random())]}
        )
    };





    var mainHttp = {

    };

    $scope.$watch('app.exhibition', function(newVal, oldVal) {

    }, true);
}]);