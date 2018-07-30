'use strict';
app
    .controller('overallMainCtrl', ['$scope', '$http', '$state', '$q', '$filter', function ($scope, $http, $state, $q, $filter) {

        // $scope.kpavilionId=window.sessionStorage.getItem('basePluspavilionId');
        $scope.mktime = window.sessionStorage.getItem('mktime');
        $scope.endtime = window.sessionStorage.getItem("endtime");


        $scope.app.exhibition.dataflag = false;
        $scope.app.exhibition.dataflag2 = false;

        var projectId = window.sessionStorage.getItem("projectId");
        var pid = window.sessionStorage.getItem("pid");

        //请求总体分析--权限接口
        $http({
            method: 'GET',
            url: USP_SERVER_ROOT1 + 'project/module' + '?project_id=' + projectId,
        }).success(function (data, status, headers) {
            $scope.menuSecondaryRes = data.overall;
            console.log($scope.menuSecondaryRes)
            /* $scope.menuSecondaryRes = [

                 {
                     "menuName": "客流统计",
                     "url": "overall.statistical"
                 },
                 {
                     "menuName": "客流行为 ",
                     "url": "overall.behavior"
                 },
                 {
                     "menuName": "客流来源 ",
                     "url": "overall.source"
                 },
                 {
                     "menuName": "客流特征 ",
                     "url": "overall.characteristicsToc"
                 }
             ];*/

        })
            .error(function (data, status, headers) {
                $scope.authError = data.message;
                console.log($scope.authError)
            });


        var thttp = {
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
                }).error(function (data) {
                    $scope.app.exhibition.dataflag = false;
                    $scope.app.exhibition.dataflag2 = true;
                });
            },
            serch: function () {
                var url = $scope.app.fullUrl + "/manage/findProjectAreaData?project_id=" + projectId + "&type=1";
                $http({
                    method: "get",
                    url: url,
                    headers: {
                        'Authorization': "Bearer " + $scope.app.token
                    },
                    withCredentials: true
                }).success(function (res) {
                    (res.data[0].project_province == undefined) && (res.data[0].project_province = "");
                    (res.data[0].project_city == undefined) && (res.data[0].project_city = "");
                    (res.data[0].project_county == undefined) && (res.data[0].project_county = "");
                    var city = res.data[0].project_city;
                    sessionStorage.setItem('city', city);
                    $scope.traffic = res.data[0];
                    if ($scope.traffic.project_url1 == undefined) {
                        $scope.traffic.project_url1 = "";
                    }
                    $scope.m_project_name = res.data[0].project_name
                    // console.log(res.data[0].pid)
                    // sessionStorage.setItem("pid", res.data[0].pid)
                    // console.log(res.data[0].pid)
                }).error(function (data) {

                });
            },
        };
        thttp.serchArea();
        thttp.serch();

        if ($scope.endtime == 1) {
            var agodate = addDate($filter('date')(new Date(), 'yyyy-MM-dd'), -1);
            var agodateArr = (agodate + "").split("");
            agodateArr.splice(4, 0, '-');
            agodateArr.splice(7, 0, '-');
            var agodate7 = addDate($filter('date')(new Date(), 'yyyy-MM-dd'), -7);
            var agodateArr7 = (agodate7 + "").split("");
            agodateArr7.splice(4, 0, '-');
            agodateArr7.splice(7, 0, '-');

            $scope.endtime = agodateArr.join("");

            $scope.defaultmktime = addDate(agodateArr.join(""), -6) >= new Date($scope.mktime).format("yyyyMMdd") ? agodateArr7 : $scope.mktime;
            $scope.defaultendtime = $scope.endtime;

            $scope.timeName = $scope.defaultmktime + ' - ' + $scope.defaultendtime
            console.log("第二次" + $scope.timeName)

            $scope.app.exhibition.startDate = new Date($scope.defaultmktime).format("yyyyMMdd");
            $scope.app.exhibition.endDate = agodate;
        } else {
            var agodate = addDate($filter('date')(new Date(), 'yyyy-MM-dd'), -1);
            var agodateArr = (agodate + "").split("");
            agodateArr.splice(4, 0, '-');
            agodateArr.splice(7, 0, '-');
            var agodate7 = addDate($filter('date')(new Date(), 'yyyy-MM-dd'), -7);
            var agodateArr7 = (agodate7 + "").split("");
            agodateArr7.splice(4, 0, '-');
            agodateArr7.splice(7, 0, '-');

            var nowagodate7 = addDate(new Date($scope.endtime).format("yyyy-MM-dd"), -6);
            var nowagodateArr7 = (nowagodate7 + "").split("");
            nowagodateArr7.splice(4, 0, '-');
            nowagodateArr7.splice(7, 0, '-');

            $scope.endtime = new Date($scope.endtime).format("yyyyMMdd") < agodate ? $scope.endtime : agodateArr.join("");

            if (agodate > new Date($scope.endtime).format("yyyyMMdd")) {
                $scope.defaultmktime = (addDate(new Date($scope.endtime).format("yyyy-MM-dd"), -6) >= new Date($scope.mktime).format("yyyyMMdd") ? nowagodateArr7.join("") : $scope.mktime);
            } else {
                $scope.defaultmktime = (addDate(new Date($scope.endtime).format("yyyy-MM-dd"), -6) >= new Date($scope.mktime).format("yyyyMMdd") ? agodateArr7.join("") : $scope.mktime);
            }

            $scope.defaultendtime = $scope.endtime;

            $scope.timeName = $scope.defaultmktime + ' - ' + $scope.defaultendtime;
            console.log("第三次" + $scope.timeName)

            $scope.app.exhibition.startDate = new Date($scope.defaultmktime).format("yyyyMMdd");
            $scope.app.exhibition.endDate = new Date($scope.defaultendtime).format("yyyyMMdd");
        }

        console.log($scope.mktime)
        console.log($scope.endtime)
        laydate.render({
            elem: '#plustest', //指定元素
            value: $scope.defaultmktime + ' - ' + $scope.defaultendtime,
            range: true,
            btns: ['confirm'],
            min: $scope.mktime,
            max: $scope.endtime,
            done: function (value, date, endDate) {
                $scope.app.exhibition.startDate = value.split(" - ")[0].split("-").join("");
                $scope.app.exhibition.endDate = value.split(" - ")[1].split("-").join("");
                $scope.timeName = value;
                console.log("第一次" + $scope.timeName)
                $scope.$apply();

                // console.log(value);
            }
        });

        function addDate(date, days) {
            var d = new Date(date);
            d.setDate(d.getDate() + days);
            var month = d.getMonth() + 1;
            var day = d.getDate();
            if (month < 10) {
                month = "0" + month;
            }
            if (day < 10) {
                day = "0" + day;
            }
            var val = d.getFullYear() + "" + month + "" + day;
            return val;
        };

        $scope.nav600 = function () {
            $('.m_app-left').show()
        };
        $scope.navHide600 = function () {
            $('.m_app-left').hide()
        };

    }]);