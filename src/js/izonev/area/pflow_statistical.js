'use strict';
app.controller('astatisticalCtrl', ['$scope', '$http', '$state', '$q', '$interval', '$stateParams', function ($scope, $http, $state, $q, $interval, $stateParams) {

    $scope.app.title.version = " - ";
    $scope.app.title.secondary = "";
    $scope.app.title.Level3 = "客流统计 | ";

    $scope.app.exhibition.id = window.sessionStorage.getItem('basePlusId');

    $scope.app.exhibition.pavilion_id = $stateParams.pavilion_id;

    $scope.app.exhibition.pavilion_idPlus = $stateParams.pavilion_idPlus;


    /**
     * 定义公共样式
     * tooltip
     *
     * */
    $scope.tooltip = {
        trigger: 'axis',
        axisPointer: {
            label: {
                textStyle: {
                    color: $scope.app.chart.white
                },
                backgroundColor: $scope.app.chart.gray
            },
            type: 'cross',
            crossStyle: {
                color: $scope.app.chart.fontColor
            }
        }
    };
    $scope.textStyle = {
        color: $scope.app.chart.fontColor,
        fontSize: $scope.app.chart.fontSize
    };


    $scope.PFlow1 = {
        legend: ['到访一次', '重复到访', '常驻人员', '总客流量'],
        xAxis: [],
        series: []
    };
    $scope.PFlow2 = {
        "xAxis": ['总客流量', '到访一次', '重复到访', '常驻人员'],
        "legend": [],
        "series": []
    };
    $scope.PFlow3 = {
        legend: [],
        xAxis: [],
        series: []
    };
    $scope.audienceStatistical = {legend: ['到访一次', '重复到访', '常驻人员']};
    var mainHttp = {
        //客流趋势
        pFlowTrend: function (url, index) {
            var deferred = $q.defer();
            $http({
                method: "get",
                url: url + index,
                headers: {'Authorization': "Bearer " + $scope.app.token}, withCredentials: true
            }).success(function (res) {
                // console.log(res)
                $scope.audienceStatistical = {
                    legend: ['到访一次', '重复到访', '常驻人员', '总客流量'],
                    xAxis: [],
                    series: []
                };
                // console.log(res)
                $scope.newTimes = [];
                $scope.oldTimes = [];
                $scope.residentStaffTimes = [];
                $scope.allPeopleTimes = [];
                if (res.data != undefined) {
                    $scope.resData = res.data;
                    for (var i = 0; i < res.data.length; i++) {
                        $scope.audienceStatistical.xAxis.push($scope.resData[i].date);
                        if ($scope.resData[i].tuples.length != 0) {
                            for (var u = 0; u < $scope.resData[i].tuples.length; u++) {
                                if ($scope.resData[i].tuples[u].pavilionId == $scope.app.exhibition.pavilion_idPlus) {
                                    $scope.newTimes.push($scope.resData[i].tuples[u].newCount);
                                    $scope.oldTimes.push($scope.resData[i].tuples[u].oldCount);
                                    $scope.residentStaffTimes.push($scope.resData[i].tuples[u].residentStaffCount);
                                    $scope.allPeopleTimes.push($scope.resData[i].tuples[u].allPeopleCount);
                                }
                            }
                        }
                    }
                    var arrr = [$scope.newTimes, $scope.oldTimes, $scope.residentStaffTimes, $scope.allPeopleTimes];
                    for (var j = 0; j < $scope.audienceStatistical.legend.length; j++) {
                        $scope.audienceStatistical.series.push(
                            {
                                name: $scope.audienceStatistical.legend[j],
                                type: 'line',
                                // stack: '总量',
                                itemStyle: {
                                    normal: {color: izone.color[j]}
                                },
                                // areaStyle: {normal: {}},
                                data: arrr[j]
                            }
                        )
                    }
                }
                $scope.resData = res.data;


                deferred.resolve(res);
            }).error(function (data) {

            });
            return deferred.promise;
        },
        pFlowTrend2: function (url, index) {
            var deferred = $q.defer();
            $http({
                method: "get",
                url: url + index,
                headers: {'Authorization': "Bearer " + $scope.app.token}, withCredentials: true
            }).success(function (res) {
                if (res.data != undefined) {
                    var xc;
                    for (var i = 0; i < res.data.length; i++) {
                        if (res.data[i].tuples.length == 0) {
                            xc = i - 1;
                        } else {
                            xc = i;
                        }

                    }
                    if ($scope.dateName.split(" - ")[0].split("-").join("") == $scope.dateName.split(" - ")[1].split("-").join("")) {
                        xc = 0;
                    }
                    $scope.resData = res.data;
                    for (var i = 0; i < res.data.length; i++) {
                        $scope.audienceStatistical = {
                            legend: ['到访一次', '重复到访', '常驻人员', '总客流量'],
                            xAxis: [],
                            series: []
                        };
                        $scope.newTimes = [];
                        $scope.oldTimes = [];
                        $scope.residentStaffTimes = [];
                        $scope.allPeopleCount = [];
                        if ($scope.resData[i].tuples.length != 0) {
                            for (var x = 0; x < $scope.resData[i].tuples.length; x++) {
                                $scope.audienceStatistical.xAxis.push($scope.resData[i].tuples[x].hour);

                                $scope.newTimes.push($scope.resData[i].tuples[x].newCount);
                                $scope.oldTimes.push($scope.resData[i].tuples[x].oldCount);
                                $scope.residentStaffTimes.push($scope.resData[i].tuples[x].residentStaffCount);
                                $scope.allPeopleCount.push($scope.resData[i].tuples[x].allPeopleCount);

                            }

                        }

                    }
                    var arrr = [$scope.newTimes, $scope.oldTimes, $scope.residentStaffTimes, $scope.allPeopleCount];
                    for (var j = 0; j < $scope.audienceStatistical.legend.length; j++) {
                        $scope.audienceStatistical.series.push(
                            {
                                name: $scope.audienceStatistical.legend[j],
                                type: 'line',
                                // stack: '总量',
                                itemStyle: {
                                    normal: {color: izone.color[j]}
                                },
                                // areaStyle: {normal: {}},
                                data: arrr[j]
                            }
                        )
                    }
                }
                $scope.resData = res.data;


                deferred.resolve(res);
            }).error(function (data) {

            });
            return deferred.promise;
        },
        passengerFlowScale: function (url, index) {

            $scope.passengerFlowScale = {
                legend: ['总客流量', '到访一次', '重复到访', '常驻人员'],
                xAxis: [],
                series: []
            };
            var deferred = $q.defer();
            $http({
                method: "get",
                url: url + index,
                headers: {'Authorization': "Bearer " + $scope.app.token}, withCredentials: true
            }).success(function (res) {
                // console.log(res)
                $scope.audienceStatistical = {
                    legend: [],
                    xAxis: ['总客流量', '到访一次', '重复到访', '常驻人员'],
                    series: []
                };
                if (res.data != undefined) {
                    $scope.audienceStatistical_Res = res.data;
                    var sticalLen = $scope.audienceStatistical_Res.length - 1;
// console.log($scope.audienceStatistical_Res)
                    var allPeopleCount = 0, newCount = 0, oldCount = 0, residentStaffCount = 0;
                    for (var i = 0; i < $scope.audienceStatistical_Res.length; i++) {
                        if ($scope.audienceStatistical_Res[i].tuples.length != 0) {
                            for (var u = 0; u < $scope.audienceStatistical_Res[i].tuples.length; u++) {
                                if ($scope.audienceStatistical_Res[i].tuples[u].pavilionId == $scope.app.exhibition.pavilion_idPlus) {
                                    allPeopleCount = ($scope.audienceStatistical_Res[i].tuples[u].allPeopleCount == undefined ? 0 : $scope.audienceStatistical_Res[i].tuples[u].allPeopleCount);
                                    newCount = ($scope.audienceStatistical_Res[i].tuples[u].newCount == undefined ? 0 : $scope.audienceStatistical_Res[i].tuples[u].newCount);
                                    oldCount = ($scope.audienceStatistical_Res[i].tuples[u].oldCount == undefined ? 0 : $scope.audienceStatistical_Res[i].tuples[u].oldCount);
                                    residentStaffCount = ($scope.audienceStatistical_Res[i].tuples[u].residentStaffCount == undefined ? 0 : $scope.audienceStatistical_Res[i].tuples[u].residentStaffCount);
                                }
                            }
                        }
                    }
                    var seriesData = [allPeopleCount, newCount, oldCount, residentStaffCount];
                    var seriesData0 = [0, 0, allPeopleCount - newCount - oldCount, 0];
                    // $scope.pavilionData = $scope.audienceStatistical_Res[0];
                    // $scope.pavilionDataTuples=$scope.pavilionData.tuples;

                    // var seriesData = [$scope.pavilionDataTuples[aa-7].allPeopleCount,$scope.pavilionDataTuples[aa-7].newCount,$scope.pavilionDataTuples[aa-7].oldCount,$scope.pavilionDataTuples[aa-7].residentStaffCount];

                    $scope.audienceStatistical_series = {
                        "xAxis": ['总客流量', '到访一次', '重复到访', '常驻人员'],
                        "legend": [],
                        "series": [
                            {
                                type: 'bar',
                                stack: '总量',
                                itemStyle: {
                                    normal: {
                                        barBorderColor: 'rgba(0,0,0,0)',
                                        color: 'rgba(0,0,0,0)'
                                    },
                                    emphasis: {
                                        barBorderColor: 'rgba(0,0,0,0)',
                                        color: 'rgba(0,0,0,0)'
                                    }
                                },
                                data: seriesData0
                            },
                            {
                                type: 'bar',
                                stack: '总量',
                                label: {
                                    normal: {
                                        show: true,
                                        position: 'inside',
                                        formatter: function (obj) {
                                            return fcomdify(obj.value)
                                        }

                                    }
                                },
                                itemStyle: {
                                    normal: {color: izone.color[1]}
                                },
                                "data": seriesData
                            }
                        ]
                    }

                }


                deferred.resolve(res);
            }).error(function (data) {

            });
            return deferred.promise;

        }
    };

    var initChart = {
        crossBarAndLine: function (legend, x, series, id) {
            var dom = document.getElementById(id);
            var myChart = echarts.init(dom);
            var option = {
                tooltip: $scope.tooltip,
                toolbox: {
                    feature: {
                        dataView: {
                            lang: ['数据表格', '关闭', '下载'],
                            show: true,
                            readOnly: true,
                            title: ['视图模式'],
                            icon: $scope.app.icon.table,
                            iconStyle: {
                                normal: {
                                    borderColor: $scope.app.chart.fontColor
                                }
                            },
                            optionToContent: function (opt) {
                                var axisData = opt.xAxis[0].data; //坐标数据
                                var series = opt.series;
                                var tdHeads = '<td  class="NoNewline">--</td>'; //表头
                                var tdBodys = ''; //数据
                                series.forEach(function (item) {
                                    if (item.name == undefined) {
                                        item.name = "--"
                                    }
                                    tdHeads += '<td class="NoNewline">' + item.name + '</td>';
                                });
                                var table = '<table class="table table-striped m-b-none table-bordered table-hover"><tbody><tr>' + tdHeads + ' </tr>';
                                for (var i = 0, l = axisData.length; i < l; i++) {
                                    for (var j = 0; j < series.length; j++) {
                                        //组装表数据
                                        tdBodys += '<td>' + series[j].data[i] + '</td>';
                                    }
                                    table += '<tr><td class="NoNewline">' + axisData[i] + '</td>' + tdBodys + '</tr>';
                                    tdBodys = '';
                                }
                                table += '</tbody></table>';
                                return table;
                            }


                        },
                        magicType: {
                            show: false,
                            type: ['line', 'bar']
                            // icon:"img/svg/Refresh.svg"
                        },
                        restore: {
                            show: false
                            // icon:"img/svg/Refresh.svg"
                        },
                        saveAsImage: {
                            show: true,
                            name: "liangXuan",
                            icon: $scope.app.icon.screenshots,
                            iconStyle: {
                                normal: {
                                    borderColor: $scope.app.chart.fontColor
                                }
                            }
                        },
                        mydownload: {
                            show: true,
                            title: '图表下载',
                            icon: $scope.app.icon.download,
                            onclick: function (opt) {
                                var res = [];
                                var title = [];
                                var exSeries = opt.option.series;
                                var exXAxis = opt.option.xAxis[0].data;
                                exSeries.forEach(function (item) {
                                    if(item.name==undefined){
                                        item.name="--"
                                    }else {
                                        title.push(item.name);
                                    }

                                });
                                title.unshift("--");
                                for (var i = 0, l = exXAxis.length; i < l; i++) {
                                    var val = [];
                                    for (var j = 0; j < exSeries.length; j++) {
//                                           console.log(exSeries[j].data[i])

                                        val.push(exSeries[j].data[i])

                                    }
                                    val.unshift(exXAxis[i]);
                                    res.push(
                                        val
                                    )
                                }
                                res.unshift(title);
                                var str = JSON.stringify(res);
                                str = '{' + '"data":' + str + '}';
                                echartsDl($scope.app.echartsDl, str)
                                alert('1111'+str)

                            }
                        }
                    },
                    bottom: 0,
                    right: 10
                },
                legend: {
                    type: 'scroll',
                    data: legend,
                    bottom: 0,
                    left: 10, textStyle: $scope.textStyle
                },
                grid: {
                    left: '2%',
                    right: '5%',
                    bottom: '12%',
                    top: '8%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        data: x,
                        axisPointer: {
                            type: 'shadow'
                        },
                        axisLine: {
                            lineStyle: {
                                width: 1,
                                color: $scope.app.chart.fontColor,
                                opacity: 1
                            }
                        },
                        axisTick: {
                            show: $scope.app.chart.hide
                        },
                        axisLabel: {
                            show: $scope.app.chart.show
                        },
                        splitLine: {
                            show: $scope.app.chart.show
                        }

                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: '单位：人数',

                        axisLabel: {
                            show: true,
                            formatter: function (obj) {
                                var val = (obj / 1 * 1).toFixed(0);// $scope.TOP_APP_LIST_VALUE_sum
                                return val;
                            }
                        },
                        axisLine: {
                            lineStyle: {
                                width: 1,
                                color: $scope.app.chart.fontColor,
                                opacity: 1
                            }
                        },
                        axisTick: {
                            show: $scope.app.chart.hide
                        },
                        splitLine: {
                            show: $scope.app.chart.show,
                            lineStyle: {
                                type: $scope.app.chart.lineStyle
                            }
                        }
                    }
                ],
                series: series
            };
            if (option && typeof option === "object") {
                myChart.setOption(option, true);
            }
            window.onresize = function () {
                myChart.resize();
            }

        },
        crossLine: function (legend, x, series, id) {
            var dom = document.getElementById(id);
            var myChart = echarts.init(dom);
            var option = {
                tooltip: $scope.tooltip,
                toolbox: {
                    feature: {
                        dataView: {
                            lang: ['数据表格', '关闭', '下载'],
                            show: true,
                            readOnly: true,
                            title: ['视图模式'],
                            icon: $scope.app.icon.table,
                            iconStyle: {
                                normal: {
                                    borderColor: $scope.app.chart.fontColor
                                }
                            },
                            optionToContent: function (opt) {
                                var axisData = opt.xAxis[0].data; //坐标数据
                                var series = opt.series;
                                var tdHeads = '<td  class="NoNewline">--</td>'; //表头
                                var tdBodys = ''; //数据
                                series.forEach(function (item) {

                                    tdHeads += '<td class="NoNewline">' + item.name + '</td>';
                                });
                                var table = '<table class="table table-striped m-b-none table-bordered table-hover"><tbody><tr>' + tdHeads + ' </tr>';
                                for (var i = 0, l = axisData.length; i < l; i++) {
                                    for (var j = 0; j < series.length; j++) {
                                        //组装表数据
                                        tdBodys += '<td>' + series[j].data[i] + '</td>';
                                    }
                                    table += '<tr><td class="NoNewline">' + axisData[i] + '</td>' + tdBodys + '</tr>';
                                    tdBodys = '';
                                }
                                table += '</tbody></table>';
                                return table;
                            }


                        },
                        magicType: {
                            show: false,
                            type: ['line', 'bar']
                            // icon:"img/svg/Refresh.svg"
                        },
                        restore: {
                            show: false
                            // icon:"img/svg/Refresh.svg"
                        },
                        saveAsImage: {
                            show: true,
                            name: "liangXuan",
                            icon: $scope.app.icon.screenshots,
                            iconStyle: {
                                normal: {
                                    borderColor: $scope.app.chart.fontColor
                                }
                            }
                        },
                        mydownload: {
                            show: true,
                            title: '图表下载',
                            icon: $scope.app.icon.download,
                            onclick: function (opt) {
                                var res = [];
                                var title = [];
                                var exSeries = opt.option.series;
                                var exXAxis = opt.option.xAxis[0].data;
                                exSeries.forEach(function (item) {
                                    if(item.name==undefined){
                                        item.name="--"
                                    }else {
                                        title.push(item.name);
                                    }
                                });
                                title.unshift("--");
                                for (var i = 0, l = exXAxis.length; i < l; i++) {
                                    var val = [];
                                    for (var j = 0; j < exSeries.length; j++) {
//                                           console.log(exSeries[j].data[i])

                                        val.push(exSeries[j].data[i])

                                    }
                                    val.unshift(exXAxis[i]);
                                    res.push(
                                        val
                                    )
                                }
                                res.unshift(title);
                                var str = JSON.stringify(res);
                                str = '{' + '"data":' + str + '}';
                                echartsDl($scope.app.echartsDl, str)

                            }
                        }
                    },
                    bottom: 0,
                    right: 10
                },
                legend: {
                    type: 'scroll',
                    data: legend,
                    bottom: 0,
                    left: 10, textStyle: $scope.textStyle
                },
                grid: {
                    left: '2%',
                    right: '5%',
                    bottom: '12%',
                    top: '8%',
                    containLabel: true
                },
                xAxis: [
                    {
                        name: '时间',
                        type: 'category',
                        boundaryGap: $scope.app.chart.hide,
                        data: x,
                        axisLine: {
                            lineStyle: {
                                width: 1,
                                color: $scope.app.chart.fontColor,
                                opacity: 1
                            }
                        },
                        axisTick: {
                            show: false
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: '单位:人数',
                        axisLine: {
                            lineStyle: {
                                width: 1,
                                color: $scope.app.chart.fontColor,
                                opacity: 1
                            }
                        },
                        axisTick: {
                            show: $scope.app.chart.hide
                        },
                        splitLine: {
                            show: $scope.app.chart.show,
                            lineStyle: {
                                type: $scope.app.chart.lineStyle
                            }
                        }
                    }
                ],
                series: series
            };
            if (option && typeof option === "object") {
                myChart.setOption(option, true);
                window.onresize = myChart.resize;
            }


        },
    };
    //初始化图表
    var init = function () {
        $scope.url_2 = $scope.app.exhibitionDev + "&exhibitionId=" + $scope.app.exhibition.id + "&startDate=" + $scope.app.exhibition.startDate + "&endDate=" + $scope.app.exhibition.endDate + "&index=";
        $scope.url_2x = $scope.app.exhibitionDev + "&exhibitionId=" + $scope.app.exhibition.id + "&pavilionId=" + $scope.kpavilionId + "&startDate=" + $scope.app.exhibition.startDate + "&endDate=" + $scope.app.exhibition.endDate + "&index=";
        if ($scope.dateName.split(" - ")[0].split("-").join("") != $scope.dateName.split(" - ")[1].split("-").join("")) {
            mainHttp.passengerFlowScale($scope.url_2, 3).then(function () {
                initChart.crossBarAndLine($scope.audienceStatistical_series.legend, $scope.audienceStatistical_series.xAxis, $scope.audienceStatistical_series.series, "passengerFlowScaleID");
            });
        } else {
            mainHttp.passengerFlowScale($scope.url_2, 2).then(function () {
                initChart.crossBarAndLine($scope.audienceStatistical_series.legend, $scope.audienceStatistical_series.xAxis, $scope.audienceStatistical_series.series, "passengerFlowScaleID");
            });
        }
        mainHttp.pFlowTrend($scope.url_2, 2).then(function () {
            initChart.crossLine($scope.audienceStatistical.legend, $scope.audienceStatistical.xAxis, $scope.audienceStatistical.series, "pFlowTrendID");
        });
    };

    $scope.OnSelectTime = function (index) {
        if (index == 2) {
            $scope.url_2 = $scope.app.exhibitionDev + "&exhibitionId=" + $scope.app.exhibition.id + "&startDate=" + $scope.app.exhibition.startDate + "&endDate=" + $scope.app.exhibition.endDate + "&index=";
            mainHttp.pFlowTrend($scope.url_2, 2).then(function () {
                initChart.crossLine($scope.audienceStatistical.legend, $scope.audienceStatistical.xAxis, $scope.audienceStatistical.series, "pFlowTrendID");
            });
        } else if (index == 4) {
            $scope.url_4 = $scope.app.exhibitionDev + "&pavilionId=" + $scope.app.exhibition.pavilion_idPlus + "&startDate=" + $scope.app.exhibition.startDate + "&endDate=" + $scope.app.exhibition.endDate + "&index=";
            if ($scope.dateName.split(" - ")[0].split("-").join("") != $scope.dateName.split(" - ")[1].split("-").join("")) {
                mainHttp.pFlowTrend2($scope.url_4, 5).then(function () {
                    initChart.crossLine($scope.audienceStatistical.legend, $scope.audienceStatistical.xAxis, $scope.audienceStatistical.series, "pFlowTrendID");
                });
            } else {
                mainHttp.pFlowTrend2($scope.url_4, 4).then(function () {
                    initChart.crossLine($scope.audienceStatistical.legend, $scope.audienceStatistical.xAxis, $scope.audienceStatistical.series, "pFlowTrendID");
                });
            }
        }
    };
    $scope.tableHide = false;
    $scope.$watch('app.exhibition', function (newVal, oldVal) {
        init()
    }, true);
}]);