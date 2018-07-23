'use strict';
app
    .controller('contrastAnalysisCtrl', ['$scope', '$http', '$filter', '$state', '$q', function ($scope, $http, $filter, $state, $q) {

        $scope.app.basisFolder.Folder = sessionStorage.getItem("basisFolder");
        $scope.app.exhibition.id = window.sessionStorage.getItem('basePlusId');
        $scope.appid = window.sessionStorage.getItem('projectId');

        if ($scope.app.basisFolder.Folder == undefined || $scope.app.basisFolder.Folder == "") {
            $scope.app.basisFolder.Folder = "0";
            sessionStorage.setItem("basisFolder", $scope.app.basisFolder.Folder);
        } else {
            $scope.app.basisFolder.Folder = sessionStorage.getItem("basisFolder");
        }
        $scope.basisFolder_Arr = $scope.app.basisFolder.Folder.split(",");
        var combasisFolder = function (arr) {
            var arrd = arr.split(",");
            $scope.arrd_len = arrd.length;
            if (arrd.length <= 2) {
                $scope.displayShow = "displayshow";
            } else {
                $scope.displayShow = "displayhide";
            }
        };
        combasisFolder($scope.app.basisFolder.Folder);

        function strAdd(str, val) {
            var res = StringOperate.add(str, val);
            return res
        };

        function strDel(str, val) {
            var res = StringOperate.remove(str, val);
            return res
        };
        //通過id獲取索引
        function fenceId(data, id) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].id == id) {
                    return i + "";
                }
            }
        };
        //通過索引獲取數據
        function fenceRes(data, id) {
            var id_arr = id.split(",");
            var arr = [];
            for (var i = 0; i < id_arr.length; i++) {
                arr.push(data[id_arr[i]]);
            }
            return arr;
        };
        //獲取id和name
        function res_name_id(data) {
            var name = [], id = [];
            data.forEach(function (v) {
                name.push(v.name);
                id.push(v.id);
            });
            return [name, id];
        };

        $scope.basisName = [];
        $scope.basisId = [];
        //http请求数据
        var mainHttp = {
            proAllFence: function (id) {
                var deferred = $q.defer();
                var url = $scope.app.toolUrl + "findAreaData?cpage=" + "1" + "&pageSize=9999&propertis[project_id]=" + id + "&propertis[city]=" + "NA" + "&propertis[province]=" + "NA";
                $http({
                    mothod: "get",
                    url: url,
                    headers: {'Authorization': "Bearer " + $scope.app.token}, withCredentials: true
                }).success(function (res) {
                    $scope.proAllFence = [];
                    var allFence = $filter('orderBy')(res.data.data.list, 'id', true);
                    for (var i = 0; i < allFence.length; i++) {
                        if (allFence[i].taskState == 6) {
                            $scope.proAllFence.push(allFence[i]);
                        }
                    }
                    if ($scope.proAllFence.length == 0) {
                        $scope.proAllFence = null;
                    }
                    deferred.resolve();
                }).error(function (err) {
                    var urls = "js/data/" + id + "/config.json";
                    $http({
                        mothod: "get",
                        url: urls,
                        headers: {'Authorization': "Bearer " + $scope.app.token}, withCredentials: true
                    }).success(function (res) {
                        $scope.proAllFence = $filter('orderBy')(res.response.data.data.list, 'id', true);

                        $scope.proFenceShow = fenceRes($scope.proAllFence, $scope.app.basisFolder.Folder);

                        $scope.basisName = res_name_id($scope.proFenceShow)[0];
                        $scope.basisId = res_name_id($scope.proFenceShow)[1];
                        $scope.app.basisFolder.id = $scope.basisId.join(",");
                    });
                });
                return deferred.promise;
            }
        };
        $scope.ids = window.sessionStorage.getItem('projectId');
        mainHttp.proAllFence($scope.ids).then(function () {
            $scope.proFenceShow = fenceRes($scope.proAllFence, $scope.app.basisFolder.Folder);

            $scope.basisName = res_name_id($scope.proFenceShow)[0];
            $scope.basisId = res_name_id($scope.proFenceShow)[1];
            $scope.app.basisFolder.id = $scope.basisId.join(",");
        });

        //    添加竞品
        $scope.addFenceAlert = function () {
            $scope.proConfig = [];
            for (var i = 0; i < $scope.proAllFence.length; i++) {
                $scope.proConfig.push(i);
            }
            $scope.basisFolder_Arr = $scope.app.basisFolder.Folder.split(",");
            for (var i = 0; i < $scope.basisFolder_Arr.length; i++) {
                $scope.proConfig = strDel($scope.proConfig, $scope.basisFolder_Arr[i]);
            }
            if ($scope.basisFolder_Arr.length < 3) {
                $scope.proFenceNoShow = fenceRes($scope.proAllFence, $scope.proConfig);
            } else {
                // $scope.proFenceNoShow=fenceRes($scope.proAllFence,$scope.proConfig);
            }
            if ($scope.basisFolder_Arr.length == $scope.proAllFence.length) {
                $scope.proFenceNoShow = [];
            }
        };
        //确认添加竞品
        $scope.proFenceAdd = function (id) {
            var i = fenceId($scope.proAllFence, id);
            $scope.app.basisFolder.Folder = strAdd($scope.app.basisFolder.Folder, i);
            sessionStorage.setItem("basisFolder", $scope.app.basisFolder.Folder);
            $scope.proFenceShow = fenceRes($scope.proAllFence, $scope.app.basisFolder.Folder);
            combasisFolder($scope.app.basisFolder.Folder);
            $('#estateModal').modal('hide');
            $scope.basisName = res_name_id($scope.proFenceShow)[0];
            $scope.basisId = res_name_id($scope.proFenceShow)[1];
            $scope.app.basisFolder.id = $scope.basisId.join(",");
        };
        //确认删除竞品
        $scope.proFenceRemove = function (id) {
            var i = fenceId($scope.proAllFence, id);
            $scope.app.basisFolder.Folder = strDel($scope.app.basisFolder.Folder, i);
            sessionStorage.setItem("basisFolder", $scope.app.basisFolder.Folder);
            $scope.proFenceShow = fenceRes($scope.proAllFence, $scope.app.basisFolder.Folder);
            combasisFolder($scope.app.basisFolder.Folder);
            $scope.basisName = res_name_id($scope.proFenceShow)[0];
            $scope.basisId = res_name_id($scope.proFenceShow)[1];
            $scope.app.basisFolder.id = $scope.basisId.join(",");
        };

        $scope.startDate = window.sessionStorage.getItem("mktime");
        $scope.endDate = window.sessionStorage.getItem("endtime");
        $scope.proDate = $scope.startDate + " - " + $scope.endDate;
        $scope.app.basisFolder.startDate = $scope.startDate.split("-").join("");
        $scope.app.basisFolder.endDate = $scope.endDate.split("-").join("");
        laydate.render({
            elem: '#date', //指定元素
            value: $scope.startDate + " - " + $scope.endDate,
            range: true,
            btns: ['confirm'],
            min: $scope.startDate,
            max: $scope.endDate,
            done: function (value, date, endDate) {
                $scope.app.basisFolder.startDate = value.split(" - ")[0].split("-").join("");
                $scope.app.basisFolder.endDate = value.split(" - ")[1].split("-").join("");
                $scope.proDate = value;
                $scope.$apply();
            }
        });
    }]);