'use strict';
app.controller('acharacteristicsTobCtrl', ['$scope', '$http', '$state', '$q', '$interval', '$stateParams', function ($scope, $http, $state, $q, $interval, $stateParams) {

    $scope.app.title.version = " - 基础版 +";
    $scope.app.title.secondary = "";
    $scope.app.title.Level3 = "客流特征 | ";
    var randomInt = function (nMin, nMax) {
        return Math.floor(Math.random() * (nMax - nMin) + nMin + 0.5);
    };
    $scope.loading = true;
    var par = "par";
    $scope.app.exhibition.id = window.sessionStorage.getItem('basePlusId');
    $scope.app.exhibition.pavilion_id = $stateParams.pavilion_id;
    $scope.app.exhibition.pavilion_idPlus = $stateParams.pavilion_idPlus;
    $scope.dataToken = sessionStorage.getItem("dataToken");
    $scope.pid = window.sessionStorage.getItem("pid");
    $scope.pars = "null";

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
    function sum(arr) {
        var sum = 0;
        for (var i = 0; i < arr.length; i++) {
            sum += Number(arr[i]);
        }
        return sum;
    }

    var funGetData = function (d) {
        if (d.code == 2000) {
            var data = d.data;
            // (data.xAxis[0]=="M") && (data.xAxis[0]="男");
            // (data.xAxis[1]=="F") && (data.xAxis[1]="女");
            var x = data.xAxis;
            var legend = data.legend;
            var series = [];
            if (data.series != undefined) {
                for (var i = 0; i < data.series.length; i++) {
                    var datas = [];
                    data.series[i].data.forEach(function (v) {
                        datas.push(((v / sum(data.series[i].data)) * 100).toFixed(1))
                    });
                    series.push(
                        {
                            name: "",
                            type: 'bar',
                            // barWidth:"50%",
                            itemStyle: {
                                normal: {color: izone.color[i + 1]}
                            },
                            data: datas

                        }
                    )
                }
            }
            return [x, legend, series]
        }
    };
    //$scope.app.mallsUrl
    var mainHttp = {
        audienceFeatureFun: function (chart_id, pid, tagid, aid, start_date, end_date) {
            $scope.loading = true;
            var deferred = $q.defer();
            $http({
                method: 'get',
                url: $scope.app.apiUrl + "getPortrayalDatas?" + "chart_id=" + chart_id + "&pid=" + pid + "&tagid=" + tagid + "&aid=" + aid + "&start_date=" + start_date + "&end_date=" + end_date,
                headers: {'Authorization': "Bearer " + $scope.app.token}, withCredentials: true
            }).success(function (res) {
                $scope.audienceFeature = funGetData(res);
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
        crossBar: function (legend, x, series, id) {
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
                        name: '占比(%)',

                        axisLabel: {
                            show: true,
                            formatter: function (obj) {
                                var val = (obj / 100 * 100).toFixed(2);// $scope.TOP_APP_LIST_VALUE_sum
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
        verticalBar: function (legend, x, series, id) {
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
                    right: '15%',
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
                        name: '占比(%)',
                        axisLabel: {
                            show: true,
                            formatter: function (obj) {
                                var val = (obj / 100 * 100).toFixed(2);// $scope.TOP_APP_LIST_VALUE_sum
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

        }
    };
    //初始化图表
    var init = function (url) {
        var startDate = $scope.app.exhibition.startDate;
        var endDate = $scope.app.exhibition.endDate;
        var idPlus = $scope.app.exhibition.pavilion_idPlus;
        mainHttp.audienceFeatureFun(portrait.chart_id, $scope.pid, portrait.CPL_INDM_GEND_S, idPlus, startDate, endDate).then(function (res) {
            initChart.crossBar($scope.audienceFeature[1], $scope.audienceFeature[0], $scope.audienceFeature[2], "genderID");
        });
        mainHttp.audienceFeatureFun(portrait.chart_id, $scope.pid, portrait.CPL_INDM_AGE_C5, idPlus, startDate, endDate).then(function (res) {
            initChart.crossBar($scope.audienceFeature[1], $scope.audienceFeature[0], $scope.audienceFeature[2], "ageID");
        });

        mainHttp.audienceFeatureFun(portrait.chart_id, $scope.pid, portrait.CPL_INDM_MARR_S, idPlus, startDate, endDate).then(function (res) {
            initChart.crossBar($scope.audienceFeature[1], $scope.audienceFeature[0], $scope.audienceFeature[2], "marriageID");
        });
        mainHttp.audienceFeatureFun(portrait.chart_id, $scope.pid, portrait.culturalLeve, idPlus, startDate, endDate).then(function (res) {
            initChart.crossBar($scope.audienceFeature[1], $scope.audienceFeature[0], $scope.audienceFeature[2], "culturalLevelID");

        });
        mainHttp.audienceFeatureFun(portrait.chart_id, $scope.pid, portrait.SOM_OCM_CAREER, idPlus, startDate, endDate).then(function (res) {
            initChart.crossBar($scope.audienceFeature[1], $scope.audienceFeature[0], $scope.audienceFeature[2], "professionalID");
        });
        //
        mainHttp.audienceFeatureFun(portrait.chart_id, $scope.pid, portrait.GBM_BHM_PURB_SUPR, idPlus, startDate, endDate).then(function (res) {
            initChart.verticalBar($scope.audienceFeature[1], $scope.audienceFeature[0], $scope.audienceFeature[2], "demoData1ID");
        });
        mainHttp.audienceFeatureFun(portrait.chart_id, $scope.pid, portrait.GBM_BHM_REAB_REAP, idPlus, startDate, endDate).then(function (res) {
            initChart.verticalBar($scope.audienceFeature[1], $scope.audienceFeature[0], $scope.audienceFeature[2], "demoData3ID");
        });
        mainHttp.audienceFeatureFun(portrait.chart_id, $scope.pid, portrait.GBM_BHM_APPP_APPR_S, idPlus, startDate, endDate).then(function (res) {
            initChart.verticalBar($scope.audienceFeature[1], $scope.audienceFeature[0], $scope.audienceFeature[2], "demoData4ID");
        });

    };

    $scope.$watch('app.exhibition', function (newVal, oldVal) {
        init();
    }, true);


}]);