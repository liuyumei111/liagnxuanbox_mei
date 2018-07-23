'use strict';
app.controller('areaAnalysis', ['$scope', '$http', '$state', '$q', '$interval', function ($scope, $http, $state, $q, $interval) {

    $scope.app.title.version = " - 基础版 +";
    $scope.app.title.secondary = "";
    $scope.app.title.Level3 = "区域导览 | ";

    $scope.app.exhibition.dataflag = false;
    $scope.app.exhibition.dataflag2 = false;
    var projectId = window.sessionStorage.getItem("projectId");

    $scope.traffic = [];

    var thttp = {
        serchT: function () {
            var url = $scope.app.fullUrl + "/manage/findProjectAreaData?project_id=" + projectId + "&type=1";
            $http({
                method: "get",
                url: url,
                headers: {
                    'Authorization': "Bearer " + $scope.app.token
                },
                withCredentials: true
            }).success(function (res) {
                $scope.img = res.data[0].project_url2;
                if ($scope.img == undefined) {
                    $scope.img = "";
                }
            }).error(function (data) {

            });

        },
        resiveT: function (data) {
            var formdata = new FormData();
            for (var i in data) {
                formdata.append(i, data[i]);
            }
            var url = $scope.app.fullUrl + "/manage/updateProjectData";
            var postCfg = {
                headers: {'Content-Type': undefined, 'Authorization': "Bearer " + $scope.app.token},
                withCredentials: true,
                transformRequest: angular.identity
            };
            $http.post(url, formdata, postCfg).success(function (res) {
                thttp.serchT();
            }).error(function (data) {

            });
        },
        serchArea: function () {
            var url = $scope.app.fullUrl + "/manage/findProjectAreaData?project_id=" + projectId + "&type=2";
            $http({
                method: "get",
                url: url,
                headers: {
                    'Authorization': "Bearer " + $scope.app.token
                },
                withCredentials: true
            }).success(function (res) {

                if (res.data.length == 0) {
                    $scope.app.exhibition.dataflag = false;
                    $scope.app.exhibition.dataflag2 = true;
                } else {
                    $scope.app.exhibition.dataflag = true;
                    $scope.app.exhibition.dataflag2 = false;
                }
                $scope.traffic = res.data;
                console.log($scope.traffic)
            }).error(function (data) {
                $scope.app.exhibition.dataflag = false;
                $scope.app.exhibition.dataflag2 = true;
            });
        }
    };
    thttp.serchT();
    thttp.serchArea();
    $scope.filechange = function (e) {
        if (e.files[0] == undefined) {

            return false;
        }
        if (e.files[0].size / 1024 > 5120) {
            $scope.fileerror = "最大上传图片为5M，请重新上传";
            return false;
        }
        var data = {
            file: e.files[0],
            project_id: projectId,
            project_url2: $scope.img,
            type: 2
        };
        thttp.resiveT(data);
    };

}]);