'use strict';
app.controller('blacklistCtrl', ['$scope', '$http', '$state', '$q', '$interval', function ($scope, $http, $state, $q, $interval) {

    $scope.app.title.version=" - 基础版 +";
    $scope.app.title.secondary="";
    $scope.app.title.Level3="黑名单 | ";
    $scope.loading=false;
    $scope.app.exhibition.id=window.sessionStorage.getItem('basePlusId');
    var projectId=window.sessionStorage.getItem("projectId");





    var mainHttp = {

    };

    $scope.$watch('app.exhibition', function(newVal, oldVal) {

    }, true);
}]);