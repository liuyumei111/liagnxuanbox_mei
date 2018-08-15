'use strict';
app
    .controller('caloCtrl', ['$scope', '$http', '$state', '$q', '$filter', function ($scope, $http, $state, $q, $filter) {

        $scope.m_project_name=window.sessionStorage.getItem('project_name')


    }]);