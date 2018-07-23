'use strict';
app
    .controller('cInterestsHobbiesCtrl', ['$scope', '$http', '$state', '$q', function ($scope, $http, $state, $q) {
        $scope.app.title.Level3 = "基本画像 | ";
        $scope.app.title.version = " - 基础版";
        $scope.app.title.secondary = "";
        $scope.passengerSource = {
            folder: 'interestsHobbies',
            file: 'd'
        };
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
        var jhttp = {
            interestsHobbies: function (chart_id, pid, tagid, aid, start_date, end_date, top) {
                $scope.loading = true;
                var deferred = $q.defer();
                $http({
                    method: 'get',
                    url: $scope.app.apiUrl + "getPortrayalDatas?" + "chart_id=" + chart_id + "&pid=" + pid + "&tagid=" + tagid + "&aid=" + aid + "&start_date=" + start_date + "&end_date=" + end_date + "&top=" + top,
                    headers: {'Authorization': "Bearer " + $scope.app.token}, withCredentials: true
                }).success(function (res) {
                    res.data.legend = $scope.basisName;
                    $scope.interestsHobbies = res.data;
                    deferred.resolve();
                    $scope.loading = false;
                }).error(function (res) {
                    console.log("加载失败");
                    $scope.loading = false;

                });
                return deferred.promise;
            },
        };
        var initChart = {
            verticalBar: function (data, num, id) {
                var datas = clickhouseData(data, num);
                var x = datas[0];
                var legend = datas[1];
                var series = datas[2];
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
                                    var axisData = opt.yAxis[0].data; //坐标数据
                                    var series = opt.series; //折线图数据
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
                                name: "iZone",
                                icon: $scope.app.icon.screenshots,
                                iconStyle: {
                                    normal: {
                                        borderColor: $scope.app.chart.fontColor
                                    }
                                }
                                // icon:"img/copy@2x.svg"
                            },
                            mydownload: {
                                show: true,
                                title: '图表下载',
                                icon: $scope.app.icon.download,
                                onclick: function (opt) {
                                    var res = [];
                                    var title = [];
                                    var exSeries = opt.option.series;
                                    var exXAxis = opt.option.yAxis[0].data;
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
                        left: 10,
                        textStyle: $scope.textStyle
                    },
                    grid: {
                        left: '2%',
                        right: '10%',
                        bottom: '8%',
                        top: '4%',
                        containLabel: true
                    },
                    yAxis: [
                        {
                            type: 'category',
                            data: x,
                            inverse: true,
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
                            }

                        }
                    ],
                    xAxis: [
                        {
                            type: 'value',
                            name: '比例(%)',
                            axisLabel: {
                                show: true,
                                formatter: function (obj) {
                                    var val = (obj / 100 * 100).toFixed(0);// $scope.TOP_APP_LIST_VALUE_sum
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
            crossBar: function (data, num, id) {
                var datas = clickhouseData(data, num);
                var x = datas[0];
                var legend = datas[1];
                var series = datas[2];
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
                                    var axisData = opt.yAxis[0].data; //坐标数据
                                    var series = opt.series; //折线图数据
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
                                name: "iZone",
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
                            name: '比例(%)',

                            axisLabel: {
                                show: true,
                                formatter: function (obj) {
                                    var val = (obj / 100 * 100).toFixed(0);// $scope.TOP_APP_LIST_VALUE_sum
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
            radarBar: function (data, num, id) {
                var indicator = [];
                var legend = [];
                var series = [];
                if (data.series != undefined) {
                    var dd = data.series;
                    var res = [];
                    for (var i = 0; i < dd.length; i++) {
                        for (var j = 0; j < dd[0].data.length; j++) {
                            if (i < dd.length - 1) {
                                if (dd[i].data[j] > dd[i + 1].data[j]) {
                                    res.push(dd[i].data[j])
                                } else {
                                    res.push(dd[i + 1].data[j])
                                }


                            }
                        }
                    }
                    console.log(dd)
                    for (var j = 0; j < data.series[0].data.length; j++) {
                        indicator.push(
                            {
                                name: data.xAxis[j], max: res[j] * 2 + 10
                            }
                        )
                    }
                    for (var i = 0; i < data.series.length; i++) {
                        legend.push(legend[i]);

                        series.push(
                            {
                                name: legend[i],
                                itemStyle: {
                                    normal: {color: izone.color[i + num]}
                                },
                                value: data.series[i].data

                            }
                        )


                    }
                }
                var dom = document.getElementById(id);
                var myChart = echarts.init(dom);
                var option = {
                    tooltip: {},
                    legend: {
                        type: 'scroll',
                        bottom: 0,
                        left: 10,
                        textStyle: $scope.textStyle,
                        data: legend
                    },
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
                                    var axisData = opt.radar[0].indicator; //坐标数据
                                    var series = opt.series[0].data; //折线图数据
                                    var tdHeads = '<td  style="padding: 0 10px">--</td>'; //表头
                                    var tdBodys = ''; //数据
                                    axisData.forEach(function (item) {

                                        tdHeads += '<td class="NoNewline">' + item.name + '</td>';
                                    });
                                    var table = '<table class="table table-striped m-b-none table-bordered table-hover"><tbody><tr>' + tdHeads + ' </tr>';
                                    for (var i = 0, l = series.length; i < l; i++) {
                                        for (var j = 0; j < series[i].value.length; j++) {
                                            //组装表数据
                                            tdBodys += '<td>' + series[i].value[j] + '</td>';
                                        }
                                        table += '<tr><td class="NoNewline">' + series[i].name + '</td>' + tdBodys + '</tr>';
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
                                name: "iZone",
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
                                    var exSeries = opt.option.series[0].data;
                                    var exXAxis = opt.option.radar[0].indicator;
                                    exSeries.forEach(function (item) {
//                                        console.log(item.name )
                                        title.push(item.name);

                                    });
                                    title.unshift("--");
                                    for (var i = 0, l = exXAxis.length; i < l; i++) {
                                        var val = [];
                                        for (var j = 0; j < exSeries.length; j++) {
//                                           console.log(exSeries[j].data[i])

                                            val.push(exSeries[j].value[i])

                                        }
                                        val.unshift(exXAxis[i].name);
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
                    radar: {
                        // shape: 'circle',
                        name: {
                            textStyle: {
                                color: $scope.app.chart.fontColor,

                                borderRadius: 3,
                                padding: [3, 5]
                            }
                        },
                        indicator: indicator
                    },
                    series: [
                        {
                            type: 'radar',
                            data: series
                        }]
                };
                if (option && typeof option === "object") {
                    myChart.setOption(option, true);
                }
            }
        };

        var init = function (basePlusIds, aid, startDate, endDate) {
            //兴趣爱好
            jhttp.interestsHobbies(chart_id.basicPortrait, basePlusIds, portrait.GBM_HBM_S, aid, startDate, endDate, 0).then(function (res) {
                initChart.verticalBar($scope.interestsHobbies, 1, "interestsID");
            });
            //消费偏好
            jhttp.interestsHobbies(chart_id.basicPortrait, basePlusIds, portrait.GBM_BHM_PURB_CONP, aid, startDate, endDate, 0).then(function (res) {
                initChart.verticalBar($scope.interestsHobbies, 3, "consumerPreferencesID");
            });
            //消费品级
            jhttp.interestsHobbies(chart_id.basicPortrait, basePlusIds, portrait.GBM_BHM_PURB_PREF, aid, startDate, endDate, 0).then(function (res) {
                initChart.radarBar($scope.interestsHobbies, 3, "consumerGradeID");
            });
            //阅读偏好
            jhttp.interestsHobbies(chart_id.basicPortrait, basePlusIds, portrait.GBM_BHM_REAB_REAP, aid, startDate, endDate, 0).then(function (res) {
                initChart.verticalBar($scope.interestsHobbies, 3, "readingPreferenceID");
            });
            //上网目的
            jhttp.interestsHobbies(chart_id.basicPortrait, basePlusIds, portrait.GBM_BHM_PURB_SUPR, aid, startDate, endDate, 0).then(function (res) {
                initChart.verticalBar($scope.interestsHobbies, 3, "internetPurposeID");
            });
            //应用使用偏好
            jhttp.interestsHobbies(chart_id.basicPortrait, basePlusIds, portrait.GBM_BHM_APPP_APPR_S, aid, startDate, endDate, 0).then(function (res) {
                initChart.verticalBar($scope.interestsHobbies, 3, "appPreferencesID");
            });
            //常去休闲娱乐场所  v3  沒有
            // jhttp.interestsHobbies(chart_id.basicPortrait,basePlusIds,portrait.  ,aid,startDate,endDate,0).then(function () {
            //     initChart.crossBar($scope.interestsHobbies,3,"oftengoToPlayplaceID");
            // });
            //常去餐饮场所
            // jhttp.interestsHobbies(chart_id.basicPortrait,basePlusIds,portrait.  ,aid,startDate,endDate,0).then(function () {
            //     initChart.crossBar($scope.interestsHobbies,3,"oftengoToEatplaceID");
            // });

        };
        $scope.$watch('app.chart.fontColor', function (newValue, oldValue, scope) {
            $scope.textStyle = {
                color: $scope.app.chart.fontColor,
                fontSize: $scope.app.chart.fontSize
            };
        });
        $scope.$watch('app.basisFolder', function (newVal, oldVal) {
            init($scope.appid, $scope.app.basisFolder.id, $scope.app.basisFolder.startDate, $scope.app.basisFolder.endDate);
        }, true);


    }]);