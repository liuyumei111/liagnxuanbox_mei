'use strict';
app
    .controller('areaMainCtrl', ['$scope', '$http', '$state', '$q', '$filter', '$stateParams', function ($scope, $http, $state, $q, $filter, $stateParams) {


        $scope.mktime = window.sessionStorage.getItem('mktime');
        $scope.endtime = window.sessionStorage.getItem("endtime");

        var projectId = window.sessionStorage.getItem("projectId");
        //区域id
        $scope.app.exhibition.pavilion_id = $stateParams.pavilion_id;
        $scope.app.exhibition.pavilion_idPlus = $stateParams.pavilion_idPlus;

        /*    $scope.menuSecondaryRes = [

                {
                    "menuName": "客流统计",
                    "url": "area.astatistical"
                },
                {
                    "menuName": "客流行为 ",
                    "url": "area.abehavior"
                },
                {
                    "menuName": "客流来源 ",
                    "url": "area.asource"
                },
                {
                    "menuName": "客流特征 ",
                    "url": "area.acharacteristicsToc"
                }
            ];*/

        //请求区域分析--权限接口
        $http({
            method: 'GET',
            url: USP_SERVER_ROOT1 + 'project/areaModule' + '?project_id=' + projectId,
        }).success(function (data, status, headers) {
            $scope.menuSecondaryRes = data.overall;
            // console.log($scope.menuSecondaryRes)
        })
            .error(function (data, status, headers) {
                $scope.authError = data.message;
                console.log($scope.authError)
            });


        var thttp = {
            serch: function () {
                var url = $scope.app.fullUrl + "/manage/findProjectAreaData?project_id=" + projectId + "&type=3&area_id=" + $scope.app.exhibition.pavilion_idPlus;
                $http({
                    method: "get",
                    url: url,
                    headers: {
                        'Authorization': "Bearer " + $scope.app.token
                    },
                    withCredentials: true
                }).success(function (res) {
                    $scope.traffic = res.data[0];
                    $scope.m_area_name = res.data[0].area_name;
                    if ($scope.traffic.area_url == undefined) {
                        $scope.traffic.area_url = "";
                    }
                    console.log($scope.m_area_name)
                }).error(function (data) {

                });
            },
            revise: function (data) {
                var formdata = new FormData();
                for (var i in data) {
                    formdata.append(i, data[i]);
                }
                var url = $scope.app.fullUrl + "/manage/updateProjectAreaData";
                var postCfg = {
                    headers: {'Content-Type': undefined, 'Authorization': "Bearer " + $scope.app.token},
                    withCredentials: true,
                    transformRequest: angular.identity
                };
                $http.post(url, formdata, postCfg).success(function (res) {
                    thttp.serch();
                }).error(function (data) {

                });
            }
        };
        thttp.serch();
        $scope.filechange = function (e) {
            if (e.files[0] == undefined) {

                return false;
            }
            if (e.files[0].size / 1024 > 2048) {
                $scope.fileerror = "最大上传图片为2M，请重新上传";
                return false;
            }
            var data = {
                file: e.files[0],
                project_id: projectId,
                area_id: $scope.app.exhibition.pavilion_idPlus,
                area_grade: $scope.traffic.area_grade
            };
            thttp.revise(data);
        };
        $scope.titlefalg = [false, false];
        $scope.titlechange = function (i) {
            $scope.titlefalg[i] = true;
        };
        $scope.save = function (i) {
            if (i == 0) {
                if ($scope.traffic.area_name.length < 2) {
                    $scope.colorred = true;
                    return false;
                }
                var data = {
                    area_name: $scope.traffic.area_name,
                    project_id: projectId,
                    area_id: $scope.app.exhibition.pavilion_idPlus,
                    area_grade: $scope.traffic.area_grade
                };
                thttp.revise(data);
            } else if (i == 1) {
                var data = {
                    area_desc: $scope.traffic.area_desc,
                    project_id: projectId,
                    area_id: $scope.app.exhibition.pavilion_idPlus,
                    area_grade: $scope.traffic.area_grade
                };
                thttp.revise(data);
            }
            $scope.titlefalg[i] = false;
        };
        $scope.cancel = function (i) {
            $scope.titlefalg[i] = false;
        };
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

            $scope.dateName = $scope.defaultmktime + ' - ' + $scope.defaultendtime

            $scope.app.exhibition.startDate = new Date($scope.defaultmktime).format("yyyyMMdd");
            $scope.app.exhibition.endDate = agodate;
        }
        else {
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
                $scope.defaultmktime = (addDate(new Date($scope.endtime).format("yyyy-MM-dd"), -6) >= new Date($scope.mktime).format("yyyy-MM-dd") ? nowagodateArr7.join("") : $scope.mktime);
            } else {
                $scope.defaultmktime = (addDate(new Date($scope.endtime).format("yyyy-MM-dd"), -6) >= new Date($scope.mktime).format("yyyy-MM-dd") ? agodateArr7.join("") : $scope.mktime);
            }

            $scope.defaultendtime = $scope.endtime;

            $scope.dateName = $scope.defaultmktime + ' - ' + $scope.defaultendtime;

            $scope.app.exhibition.startDate = new Date($scope.defaultmktime).format("yyyyMMdd");
            $scope.app.exhibition.endDate = new Date($scope.defaultendtime).format("yyyyMMdd");
        }
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
                $scope.dateName = value;
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
        }

        $scope.nav600 = function () {
            $('.m_app-left').show()
        };
        $scope.navHide600 = function () {
            $('.m_app-left').hide()
        };

    }]);