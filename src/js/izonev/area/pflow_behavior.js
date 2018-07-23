'use strict';
app.controller('abehaviorCtrl', ['$scope', '$http', '$state', '$q', '$interval', '$stateParams', function ($scope, $http, $state, $q, $interval, $stateParams) {

    $scope.app.title.version = " 客流盒子";
    $scope.app.title.secondary = "";
    $scope.app.title.Level3 = "客流行为 | ";

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
    $scope.PFlow1 = {legend: ['0~30分钟', '30~45分钟', '45~60分钟', '60分钟以上', '平均停留时长']};
    $scope.audienceStatistical = {legend: ['到访一次', '重复到访', '常驻人员']};
    var run = function (url) {
        var deferred = $q.defer();
        $http({
            method: "get",
            url: url,
            headers: {'Authorization': "Bearer " + $scope.app.token}, withCredentials: true
        }).success(function (res) {

            deferred.resolve(res);
        }).error(function (data) {

        });
        return deferred.promise;
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
                        name: "停留时长：分钟",
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
                    left: '4%',
                    right: '5%',
                    bottom: '12%',
                    top: '8%',
                    containLabel: true
                },
                xAxis: [
                    {
                        name: '',
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
                        name: '停留时长：分钟',
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
    //初始化图表
    var init = function (url) {
        var url18 = $scope.app.exhibitionDev + "&pavilionId=" + $scope.app.exhibition.pavilion_id + "&startDate=" + $scope.app.exhibition.startDate + "&endDate=" + $scope.app.exhibition.endDate + "&index=18";
        if ($scope.dateName.split(" - ")[0].split("-").join("") != $scope.dateName.split(" - ")[1].split("-").join("")) {
            var url3 = $scope.app.exhibitionDev + "&exhibitionId=" + $scope.app.exhibition.id + "&startDate=" + $scope.app.exhibition.startDate + "&endDate=" + $scope.app.exhibition.endDate + "&index=3";
            run(url3).then(function (res) {
                if (res.data != null && res.data.length != 0) {
                    var xc;
                    $scope.PFlow1 = {
                        legend: ['0~30分钟', '30~45分钟', '45~60分钟', '60分钟以上', '平均停留时长'],
                        xAxis: ['全部观众', '到访一次', '重复到访', '常驻人员'],
                        series: []
                    };
                    for (var h = 0; h < res.data.length; h++) {
                        // if(res.data[h].date==$scope.app.exhibition.date){
                        if (res.data[h].tuples.length == 0) {
                            xc = h - 1;
                            // console.log(res.data[xc])
                        } else {
                            xc = h;
                        }
                        // }
                        if (res.data[xc].tuples.length != 0) {

                            if (res.data[xc].tuples.length != 0) {
                                // var arrr=[res.data[h].tuples[0].allTimeDistribution,res.data[h].tuples[0].newTimeDistribution.split(","),res.data[h].tuples[0].oldTimeDistribution.split(","),res.data[h].tuples[0].residentTimeDistribution.split(",")];
                                for (var u = 0; u < res.data[xc].tuples.length; u++) {
                                    if (res.data[xc].tuples[u].pavilionId == $scope.app.exhibition.pavilion_idPlus) {
                                        var allTimeDistribution = res.data[xc].tuples[u].allTimeDistribution == undefined ? ["1:0", "2:0", "3:0", "4:0"] : res.data[xc].tuples[u].allTimeDistribution.split(",");
                                        var newTimeDistribution = res.data[xc].tuples[u].newTimeDistribution == undefined ? ["1:0", "2:0", "3:0", "4:0"] : res.data[xc].tuples[u].newTimeDistribution.split(",");
                                        var oldTimeDistribution = res.data[xc].tuples[u].oldTimeDistribution == undefined ? ["1:0", "2:0", "3:0", "4:0"] : res.data[xc].tuples[u].oldTimeDistribution.split(",");
                                        var residentTimeDistribution = res.data[xc].tuples[u].residentTimeDistribution == undefined ? ["1:0", "2:0", "3:0", "4:0"] : res.data[xc].tuples[u].residentTimeDistribution.split(",");
                                        var arrr = [allTimeDistribution, newTimeDistribution, oldTimeDistribution, residentTimeDistribution];

                                        $scope.z0 = [];
                                        $scope.z30 = [];
                                        $scope.z45 = [];
                                        $scope.z60 = [];
                                        for (var i = 0; i < arrr.length; i++) {
                                            for (var j = 0; j < arrr[i].length; j++) {
                                                switch (arrr[i][j].split(":")[0]) {
                                                    case '1' :
                                                        $scope.z0.push(arrr[i][j].split(":")[1]);
                                                        break;
                                                    case '2' :
                                                        $scope.z30.push(arrr[i][j].split(":")[1]);
                                                        break;
                                                    case '3' :
                                                        $scope.z45.push(arrr[i][j].split(":")[1]);
                                                        break;
                                                    case '4' :
                                                        $scope.z60.push(arrr[i][j].split(":")[1]);
                                                        break;
                                                }
                                            }
                                        }
                                        $scope.avgtime = [res.data[xc].tuples[u].allPeopleAvgTime, res.data[xc].tuples[u].newAvgTime, res.data[xc].tuples[u].oldAvgTime, res.data[xc].tuples[u].residentStaffAvgTime];
                                        var t_arrr = [$scope.z0, $scope.z30, $scope.z45, $scope.z60, $scope.avgtime];
                                    }
                                }


                            } else {
                                var t_arrr = [];
                            }

                        }
                    }

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
                                data: t_arrr[k]
                            }
                        )
                    }
                }
                initChart.crossBarAndLine($scope.PFlow1.legend, $scope.PFlow1.xAxis, $scope.PFlow1.series, "stayTimeDistID");
            });

        } else {
            var url2 = $scope.app.exhibitionDev + "&exhibitionId=" + $scope.app.exhibition.id + "&startDate=" + $scope.app.exhibition.startDate + "&endDate=" + $scope.app.exhibition.endDate + "&index=2";
            run(url2).then(function (res) {
                // console.log(res.data)
                if (res.data != null && res.data.length != 0) {
                    $scope.PFlow1 = {
                        legend: ['0~30分钟', '30~45分钟', '45~60分钟', '60分钟以上', '平均停留时长'],
                        xAxis: ['全部观众', '到访一次', '重复到访', '常驻人员'],
                        series: []
                    };
                    for (var h = 0; h < res.data.length; h++) {
                        if (h == 0) {

                            if (res.data[h].tuples.length != 0) {
                                // var arrr=[res.data[h].tuples[0].allTimeDistribution,res.data[h].tuples[0].newTimeDistribution.split(","),res.data[h].tuples[0].oldTimeDistribution.split(","),res.data[h].tuples[0].residentTimeDistribution.split(",")];
                                for (var u = 0; u < res.data[h].tuples.length; u++) {
                                    if (res.data[h].tuples[u].pavilionId == $scope.app.exhibition.pavilion_idPlus) {
                                        var allTimeDistribution = res.data[h].tuples[u].allTimeDistribution == undefined ? ["1:0", "2:0", "3:0", "4:0"] : res.data[h].tuples[u].allTimeDistribution.split(",");
                                        var newTimeDistribution = res.data[h].tuples[u].newTimeDistribution == undefined ? ["1:0", "2:0", "3:0", "4:0"] : res.data[h].tuples[u].newTimeDistribution.split(",");
                                        var oldTimeDistribution = res.data[h].tuples[u].oldTimeDistribution == undefined ? ["1:0", "2:0", "3:0", "4:0"] : res.data[h].tuples[u].oldTimeDistribution.split(",");
                                        var residentTimeDistribution = res.data[h].tuples[u].residentTimeDistribution == undefined ? ["1:0", "2:0", "3:0", "4:0"] : res.data[h].tuples[u].residentTimeDistribution.split(",");
                                        var arrr = [allTimeDistribution, newTimeDistribution, oldTimeDistribution, residentTimeDistribution];
                                        $scope.z0 = [];
                                        $scope.z30 = [];
                                        $scope.z45 = [];
                                        $scope.z60 = [];
                                        for (var i = 0; i < arrr.length; i++) {
                                            for (var j = 0; j < arrr[i].length; j++) {
                                                switch (arrr[i][j].split(":")[0]) {
                                                    case '1' :
                                                        $scope.z0.push(arrr[i][j].split(":")[1]);
                                                        break;
                                                    case '2' :
                                                        $scope.z30.push(arrr[i][j].split(":")[1]);
                                                        break;
                                                    case '3' :
                                                        $scope.z45.push(arrr[i][j].split(":")[1]);
                                                        break;
                                                    case '4' :
                                                        $scope.z60.push(arrr[i][j].split(":")[1]);
                                                        break;
                                                }
                                            }
                                        }
                                        $scope.avgtime = [res.data[h].tuples[u].allPeopleAvgTime, res.data[h].tuples[u].newAvgTime, res.data[h].tuples[u].oldAvgTime, res.data[h].tuples[u].residentStaffAvgTime];
                                        var t_arrr = [$scope.z0, $scope.z30, $scope.z45, $scope.z60, $scope.avgtime];
                                    }
                                }


                            } else {
                                var t_arrr = [];
                            }

                        }
                    }
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
                                data: t_arrr[k]
                            }
                        )
                    }
                }
                initChart.crossBarAndLine($scope.PFlow1.legend, $scope.PFlow1.xAxis, $scope.PFlow1.series, "stayTimeDistID");
            });
        }
        var url2 = $scope.app.exhibitionDev + "&exhibitionId=" + $scope.app.exhibition.id + "&startDate=" + $scope.app.exhibition.startDate + "&endDate=" + $scope.app.exhibition.endDate + "&index=2";
        run(url2).then(function (res) {
            $scope.audienceStatistical = {
                legend: ['到访一次', '重复到访', '常驻人员', '总客流量'],
                xAxis: [],
                series: []
            };
            $scope.newAvgTime = [];
            $scope.oldAvgTime = [];
            $scope.residentStaffAvgTime = [];
            $scope.allPeopleAvgTime = [];
            if (res.data.length !== 0) {
                for (var l = 0; l < res.data.length; l++) {
                    $scope.audienceStatistical.xAxis.push(res.data[l].date);
                    if (res.data[l].tuples.length != 0) {
                        for (var u = 0; u < res.data[l].tuples.length; u++) {
                            if (res.data[l].tuples[u].pavilionId == $scope.app.exhibition.pavilion_idPlus) {
                                $scope.newAvgTime.push(res.data[l].tuples[[u]].newAvgTime);
                                $scope.oldAvgTime.push(res.data[l].tuples[[u]].oldAvgTime);
                                $scope.residentStaffAvgTime.push(res.data[l].tuples[[u]].residentStaffAvgTime);
                                $scope.allPeopleAvgTime.push(res.data[l].tuples[[u]].allPeopleAvgTime);
                            }
                        }

                    }
                    var ar = [$scope.newAvgTime, $scope.oldAvgTime, $scope.residentStaffAvgTime, $scope.allPeopleAvgTime];
                }
                for (var o = 0; o < $scope.audienceStatistical.legend.length; o++) {
                    $scope.audienceStatistical.series.push(
                        {
                            name: $scope.audienceStatistical.legend[o],
                            type: 'line',
                            itemStyle: {
                                normal: {
                                    color: izone.color[o],
                                    label: {show: true}
                                }
                            },
                            data: ar[o]
                        }
                    )
                }
            }

            initChart.crossLine($scope.audienceStatistical.legend, $scope.audienceStatistical.xAxis, $scope.audienceStatistical.series, "audienceStatisticalD");
        });
        initChart.crossBarAndLine($scope.PFlow1.legend, $scope.PFlow1.xAxis, $scope.PFlow1.series, "stayTimeDistID");
        initChart.crossLine($scope.audienceStatistical.legend, $scope.audienceStatistical.xAxis, $scope.audienceStatistical.series, "audienceStatisticalD");
    };
    $scope.$watch('app.exhibition', function (newVal, oldVal) {
        init();
    }, true);
}]);