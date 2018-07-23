'use strict';
app.controller('obehaviorCtrl', ['$scope', '$http', '$state', '$q', '$interval', function ($scope, $http, $state, $q, $interval) {

    $scope.app.title.version = " - 基础版 +";
    $scope.app.title.secondary = "";
    $scope.loading = true;
    $scope.app.exhibition.id = window.sessionStorage.getItem('basePlusId');

    var projectId = window.sessionStorage.getItem("projectId");
    var ars = [];
    var getUrl = function () {
        var url = $scope.app.fullUrl + "/manage/findProjectAreaData?project_id=" + projectId + "&type=2";
        var deferred = $q.defer();
        $http({
            method: "get",
            url: url,
            headers: {'Authorization': "Bearer " + $scope.app.token}, withCredentials: true
        }).success(function (res) {
            // res.data[0].area_id=436;
            for (var i in res.data) {
                ars.push(res.data[i].area_id);
            }
            ;
            deferred.resolve(res);
        }).error(function (data) {

        });
        return deferred.promise;
    };
    getUrl();

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
    $scope.table = [];
    $scope.PFlow1 = {};
    var run = function (url) {
        $scope.loading = true;
        var deferred = $q.defer();
        $http({
            method: "get",
            url: url,
            headers: {'Authorization': "Bearer " + $scope.app.token}, withCredentials: true
        }).success(function (res) {
            deferred.resolve(res);
            $scope.loading = false;
        }).error(function (data) {
            $scope.loading = false;
        });
        return deferred.promise;
    };
    $scope.trajectory = {};

    var mainHttp = {
        stayTimeDistID: function (url) {
            $scope.loading = true;
            var deferred = $q.defer();
            $http({
                method: "get",
                url: url,
                headers: {'Authorization': "Bearer " + $scope.app.token}, withCredentials: true
            }).success(function (res) {
                var xc;
                if (res.data != null) {
                    for (var x = 0; x < res.data.length; x++) {
                        if (res.data[x].tuples.length == 0) {
                            xc = x - 1;
                        } else {
                            xc = x;
                        }
                        if (res.data[x].tuples.length != 0) {
                            $scope.PFlow1 = {
                                legend: ['0~30分钟', '30~45分钟', '45~60分钟', '60分钟以上', '平均停留时长'],
                                xAxis: [],
                                series: []

                            };
                            $scope.allPeopleAvgTime = [];
                            $scope.z0 = [];
                            $scope.z30 = [];
                            $scope.z45 = [];
                            $scope.z60 = [];
                            for (var i = 0; i < res.data[xc].tuples.length; i++) {
                                $scope.PFlow1.xAxis.push(res.data[xc].tuples[i].pavilionName);
                                var all_arr = res.data[xc].tuples[i].allTimeDistribution.split(",");
                                for (var j = 0; j < all_arr.length; j++) {
                                    all_arr[j] = all_arr[j].split(":");
                                    switch (all_arr[j][0]) {
                                        case '1' :
                                            $scope.z0.push(all_arr[j][1]);
                                            break;
                                        case '2' :
                                            $scope.z30.push(all_arr[j][1]);
                                            break;
                                        case '3' :
                                            $scope.z45.push(all_arr[j][1]);
                                            break;
                                        case '4' :
                                            $scope.z60.push(all_arr[j][1]);
                                            break;
                                    }
                                }
                                $scope.allPeopleAvgTime.push(res.data[xc].tuples[i].allPeopleAvgTime);
                            }
                            var arrrr = [$scope.z0, $scope.z30, $scope.z45, $scope.z60, $scope.allPeopleAvgTime];
                            for (var k = 0; k < $scope.PFlow1.legend.length; k++) {
                                $scope.PFlow1.series.push(
                                    {
                                        name: $scope.PFlow1.legend[k],
                                        type: $scope.PFlow1.legend[k] == '平均停留时长' ? 'line' : 'bar',
                                        itemStyle: {
                                            normal: {
                                                color: $scope.PFlow1.legend[k] == '平均停留时长' ? izone.color[5] : izone.color[k],
                                                label: {show: $scope.PFlow1.legend[k] == '平均停留时长' ? true : null}
                                            }
                                        },
                                        yAxisIndex: $scope.PFlow1.legend[k] == '平均停留时长' ? 1 : null,
                                        data: arrrr[k]
                                    }
                                )
                            }
                        }
                    }
                }
                deferred.resolve(res);
                $scope.loading = false;
            }).error(function (data) {
                $scope.loading = false;
            });
            return deferred.promise;
        },
        trajectorylD: function (url) {
            $scope.loading = true;
            var deferred = $q.defer();
            $http({
                method: "get",
                url: url,
                headers: {'Authorization': "Bearer " + $scope.app.token}, withCredentials: true
            }).success(function (res) {
                if (res.data != null) {
                    for (var i = 0; i < res.data.length; i++) {
                        $scope.trajectory = res.data[i].tuples;
                    }
                    $scope.loading = false;
                }
                deferred.resolve(res);
                $scope.loading = false;
            }).error(function (data) {
                $scope.loading = false;
            });
            return deferred.promise;
        },
    };
    var initChart = {
        crossBarAndLine: function (legend, x, series, id) {
            var dom = document.getElementById(id);
            var myChart = echarts.init(dom);
            var option = {
                tooltip: $scope.tooltip,
                toolbox: {
                    itemSize:17,
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
//                                        console.log(item.name )
                                    title.push(item.name);

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
                        name: '停留时长分布:人数',

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
                    },
                    {
                        type: 'value',
                        show: true,
                        name: "平均停留时长:分钟",
                        min: 0,

                        // interval: 5,
                        axisLabel: {
                            formatter: '{value} '
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
                            show: $scope.app.chart.hide,
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

        sankey: function (data, id) {
            var dom = document.getElementById(id);
            var myChart = echarts.init(dom);
            var option = {
                title: {
                    text: ''
                },
                tooltip: {
                    trigger: 'item',
                    triggerOn: 'mousemove'

                },
                series: [
                    {
                        type: 'sankey',
                        right: "8%",
                        layout: 'none',
                        data: data.nodes,
                        links: data.links,
                        label: {
                            normal: {
                                show: true,
                                color: $scope.app.chart.fontColor
                            }
                        },
                        itemStyle: {
                            normal: {
                                borderWidth: 0,
                                // borderColor: '#aaa'
                            }
                        },
                        lineStyle: {
                            normal: {
                                color: 'source',
                                opacity: 0.5,
                                curveness: 0.5
                            }
                        }
                    }
                ]
            };
            if (option && typeof option === "object") {
                myChart.setOption(option, true);
            }
        },

    };

    $scope.OnSelectTime = function (nm) {
        if ($scope.timeName.split(" - ")[0].split("-").join("") != $scope.timeName.split(" - ")[1].split("-").join("")) {
            if (nm == '8') {
                nm = '15';
            } else {
                nm = '16';
            }
        }
        $scope.table = [];
        var url8 = $scope.app.exhibitionDev + "&exhibitionId=" + $scope.app.exhibition.id + "&startDate=" + $scope.app.exhibition.startDate + "&endDate=" + $scope.app.exhibition.endDate + "&index=" + nm;
        run(url8).then(function (res) {
            if (res.data != null) {
                if (nm == '8' || nm == '15') {
                    matrix(res);
                } else if (nm == '9' || nm == '16') {
                    matrix2(res);
                }
            }
        });
    };

    function matrix(res) {
        var xc;
        for (var i = 0; i < res.data.length; i++) {
            if (res.data[i].tuples.length != 0) {
                if (res.data[i].length == 0) {
                    xc = i;
                } else {
                    xc = res.data.length - 1;
                }
                var arrr = [];
                $scope.arrr = [];
                var arr7 = [];
                var arr8 = [];
                var arr9 = [];
                var arr10 = [];
                var arr11 = [];
                var arr12 = [];
                var arr13 = [];
                var arr14 = [];
                var arr15 = [];
                var arr16 = [];
                var arr17 = [];
                var arr18 = [];
                var jsa = [];
                for (var j = 0; j < res.data[xc].tuples.length; j++) {
                    arrr.push(res.data[xc].tuples[j].targetName);
                    switch (res.data[xc].tuples[j].fromId) {
                        case ars[0] :
                            arr7.push(res.data[xc].tuples[j].value);
                            break;
                        case ars[1] :
                            arr8.push(res.data[xc].tuples[j].value);
                            break;
                        case ars[2] :
                            arr9.push(res.data[xc].tuples[j].value);
                            break;
                        case ars[3] :
                            arr10.push(res.data[xc].tuples[j].value);
                            break;
                        case ars[4] :
                            arr11.push(res.data[xc].tuples[j].value);
                            break;
                        case ars[5] :
                            arr12.push(res.data[xc].tuples[j].value);
                            break;
                        case ars[6] :
                            arr13.push(res.data[xc].tuples[j].value);
                            break;
                        case ars[7] :
                            arr14.push(res.data[xc].tuples[j].value);
                            break;
                        case ars[8] :
                            arr15.push(res.data[xc].tuples[j].value);
                            break;
                        case ars[9] :
                            arr16.push(res.data[xc].tuples[j].value);
                            break;
                        case ars[10] :
                            arr17.push(res.data[xc].tuples[j].value);
                            break;
                        case ars[11] :
                            arr18.push(res.data[xc].tuples[j].value);
                            break;
                    }
                }
                for (var k = 0; k < arrr.length; k++) {
                    if ($scope.arrr.indexOf(arrr[k]) == -1) {
                        $scope.arrr.push(arrr[k]);
                    }
                }
                jsa = [arr7, arr8, arr9, arr10, arr11, arr12, arr13, arr14, arr15, arr16, arr17, arr18];
            }
        }
        for (var n = 0; n < $scope.arrr.length; n++) {
            var obj = {};
            obj['name'] = $scope.arrr[n];
            obj.arr = [];
            for (var m = 0; m < jsa[n].length; m++) {
                obj.arr.push(jsa[n][m]);
            }
            $scope.table.push(obj);
        }
        $scope.table2 = [];
        for (var i = 0; i < $scope.table.length; i++) {
            for (var f = 0; f < i; f++) {
                $scope.table[i].arr[f] = "";
            }
            $scope.table2.push($scope.table[i]);
        }
    };
    function matrix2(res) {
        var xc;
        for (var i = 0; i < res.data.length; i++) {
            if (res.data[i].tuples.length != 0) {
                if (res.data[i].length == 0) {
                    xc = i;
                } else {
                    xc = res.data.length - 1;
                }
                var arrr = [];
                $scope.arrr = [];
                var arr7 = [];
                var arr8 = [];
                var arr9 = [];
                var arr10 = [];
                var arr11 = [];
                var arr12 = [];
                var arr13 = [];
                var arr14 = [];
                var arr15 = [];
                var arr16 = [];
                var arr17 = [];
                var arr18 = [];
                var jsa = [];
                for (var j = 0; j < res.data[xc].tuples.length; j++) {
                    arrr.push(res.data[xc].tuples[j].fromName);
                    switch (res.data[xc].tuples[j].fromId) {
                        case ars[0] :
                            arr7.push(res.data[xc].tuples[j].value);
                            break;
                        case ars[1] :
                            arr8.push(res.data[xc].tuples[j].value);
                            break;
                        case ars[2] :
                            arr9.push(res.data[xc].tuples[j].value);
                            break;
                        case ars[3] :
                            arr10.push(res.data[xc].tuples[j].value);
                            break;
                        case ars[4] :
                            arr11.push(res.data[xc].tuples[j].value);
                            break;
                        case ars[5] :
                            arr12.push(res.data[xc].tuples[j].value);
                            break;
                        case ars[6] :
                            arr13.push(res.data[xc].tuples[j].value);
                            break;
                        case ars[7] :
                            arr14.push(res.data[xc].tuples[j].value);
                            break;
                        case ars[8] :
                            arr15.push(res.data[xc].tuples[j].value);
                            break;
                        case ars[9] :
                            arr16.push(res.data[xc].tuples[j].value);
                            break;
                        case ars[10] :
                            arr17.push(res.data[xc].tuples[j].value);
                            break;
                        case ars[11] :
                            arr18.push(res.data[xc].tuples[j].value);
                            break;
                    }
                }
                for (var k = 0; k < arrr.length; k++) {
                    if ($scope.arrr.indexOf(arrr[k]) == -1) {
                        $scope.arrr.push(arrr[k]);
                    }
                }
                jsa = [arr7, arr8, arr9, arr10, arr11, arr12, arr13, arr14, arr15, arr16, arr17, arr18];
                // jsa.forEach(function (v,i) {
                //     if(v.length!=0){
                //         v.splice(i,0,100);
                //     }
                // });
            }
        }
        for (var n = 0; n < $scope.arrr.length; n++) {
            var obj = {};
            obj['name'] = $scope.arrr[n];
            obj.arr = [];
            for (var m = 0; m < jsa[n].length; m++) {
                (jsa[n][m] == 0) && (jsa[n][m] = 100);
                obj.arr.push(jsa[n][m] + "%");
            }
            $scope.table.push(obj);
        }
        $scope.table2 = [];
        for (var i = 0; i < $scope.table.length; i++) {
            for (var f = 0; f < i; f++) {
                $scope.table[i].arr[f] = "";
            }
            $scope.table2.push($scope.table[i]);
        }
    };
    //初始化图表
    var init = function () {
        var url17 = $scope.app.exhibitionDev + "&exhibitionId=" + $scope.app.exhibition.id + "&startDate=" + $scope.app.exhibition.startDate + "&endDate=" + $scope.app.exhibition.endDate + "&index=17&num=6";
        if ($scope.timeName.split(" - ")[0].split("-").join("") != $scope.timeName.split(" - ")[1].split("-").join("")) {
            var url3 = $scope.app.exhibitionDev + "&exhibitionId=" + $scope.app.exhibition.id + "&startDate=" + $scope.app.exhibition.startDate + "&endDate=" + $scope.app.exhibition.endDate + "&index=3";
            mainHttp.stayTimeDistID(url3).then(function () {
                initChart.crossBarAndLine($scope.PFlow1.legend, $scope.PFlow1.xAxis, $scope.PFlow1.series, "stayTimeDistID");
            });
            var url15 = $scope.app.exhibitionDev + "&exhibitionId=" + $scope.app.exhibition.id + "&startDate=" + $scope.app.exhibition.startDate + "&endDate=" + $scope.app.exhibition.endDate + "&index=15";
            run(url15).then(function (res) {
                if (res.data != null) {
                    $scope.table = [];
                    matrix(res);
                }
            });
            mainHttp.trajectorylD(url17).then(function () {
                initChart.sankey($scope.trajectory, "trajectorylD");
            });
        } else {
            var url2 = $scope.app.exhibitionDev + "&exhibitionId=" + $scope.app.exhibition.id + "&startDate=" + $scope.app.exhibition.startDate + "&endDate=" + $scope.app.exhibition.endDate + "&index=2";
            mainHttp.stayTimeDistID(url2).then(function () {
                initChart.crossBarAndLine($scope.PFlow1.legend, $scope.PFlow1.xAxis, $scope.PFlow1.series, "stayTimeDistID");
            });
            var url8 = $scope.app.exhibitionDev + "&exhibitionId=" + $scope.app.exhibition.id + "&pavilionId=" + $scope.kpavilionId + "&startDate=" + $scope.app.exhibition.startDate + "&endDate=" + $scope.app.exhibition.endDate + "&index=8";
            run(url8).then(function (res) {
                if (res.data != null) {
                    $scope.table = [];
                    matrix(res);
                }
            });
            mainHttp.trajectorylD(url17).then(function () {
                initChart.sankey($scope.trajectory, "trajectorylD");
            });
        }
    };
    $scope.$watch('app.exhibition', function (newVal, oldVal) {
        if ($scope.app.exhibition.dataflag) {
            init();
        } else {
            $scope.loading = false;
        }
    }, true);
}]);