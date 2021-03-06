'use strict';
app
    .controller('basicPortraitTocCtrl', ['$scope', '$http', '$state', '$q', '$stateParams', '$filter',
        function ($scope, $http, $state, $q, $stateParams, $filter) {
            //全局
            $scope.app.title.Level3 = "基本画像 | ";
            $scope.app.title.version = " - ";
            $scope.app.title.secondary = "";
            $scope.aid = $stateParams.filename;
            $scope.project_id = $stateParams.project_id;
            $scope.type = $stateParams.type;
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
            function sum(arr) {
                var sum = 0;
                for (var i = 0; i < arr.length; i++) {
                    sum += Number(arr[i]);
                }
                return sum;
            };
            $scope.focus = 0;
            $scope.clickStatus = function (i, name, data) {
                $scope.moreChart = 1;
                $scope.focus = i;
                $scope.fileName = name;
                $scope.lbsname = name;
                init();

            };
            var pubchart = {
                crossBar: function (d, num) {
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
                                            normal: {color: izone.color[i + num]}
                                        },
                                        data: datas

                                    }
                                )
                            }
                        }
                        return [x, legend, series]
                    }
                },
                radar: function (d, num) {
                    var indicator = [];
                    var legend = [""];
                    var series = [];
                    var x = [];
                    if (d.code === 2000) {
                        var data = d.data;
                        x = data.xAxis;
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
                    }
                    return [x, indicator, series]

                },
                pie: function (d, num) {
                    if (d.code === 2000) {
                        var data = d.data;
                        var x = data.xAxis;
                        var series = data.series[0].data;
                        var res = [];
                        for (var i = 0; i < x.length; i++) {
                            res.push(
                                {
                                    name: x[i],
                                    value: series[i]
                                }
                            )
                        }
                    }
                    return [x, res]


                }

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
            $scope.loading = true;
            $scope.alllabel = [];
            $scope.temMenu = [
                // {id: "lbs_slt_tgl", name: "三里屯",lng:116.459486,lat:39.940573},
                // {id: "lbs_sh_ifc", name: "上海国金中心",lng:121.5078739346,lat:31.2423045690},
                {id: 301, name: "颐和园",},
                {id: 303, name: "圆明园",},
                {id: 300, name: "植物园",},
                {id: 302, name: "玉渊潭",},
                {id: 231, name: "故宫",},
            ];
            //http请求数据
            var mainhttp = {
                funfindChartData: function () {
                    $scope.loading = true;
                    var deferred = $q.defer();
                    $scope.alllabel = [];
                    $http({
                        method: 'get',
                        url: $scope.app.fullUrl + "/manage/findChartData",
                        headers: {'Authorization': "Bearer " + $scope.app.token},
                        withCredentials: true
                    }).success(function (res) {
                        $scope.chartRes = res.data;
                        // $scope.chartRes=$filter("orderBy")($scope.chartRes,"order_by",false);
                        var d1 = [];
                        var d2 = [];
                        var d3 = [];
                        var d4 = [];
                        var d5 = [];

                        function mkarr(arr) {
                            arr.push(
                                {
                                    "type": $scope.chartRes[i].chart_type,
                                    "height": $scope.chartRes[i].chart_height,
                                    "class": $scope.chartRes[i].chart_class,
                                    "id": $scope.chartRes[i].chart_tag,
                                    "chart_id": $scope.chartRes[i].chart_id,
                                    "title": $scope.chartRes[i].chart_name
                                }
                            );
                            return arr

                        }

                        for (var i = 0; i < $scope.chartRes.length; i++) {
                            switch ($scope.chartRes[i].chart_group) {
                                case "人口属性":
                                    d1 = mkarr(d1);

                                    break;
                                case "设备信息":
                                    d2 = mkarr(d2);

                                    break;
                                case "一般行为":
                                    d3 = mkarr(d3);

                                    break;
                                case "网络行为":
                                    d4 = mkarr(d4);

                                    break;
                                case "APP类别偏好":
                                    d5 = mkarr(d5);

                                    break;

                                default:

                                    break;

                            }
                        }
                        var dres = [d1, d2, d3, d4, d5];
                        var la = ["人口属性", "设备信息", "一般行为", "网络行为", "APP类别偏好"];
                        for (var i = 0; i < dres.length; i++) {
                            $scope.alllabel.push(
                                {
                                    "chartype": la[i],
                                    "label": dres[i]

                                }
                            )
                        }
                        ;
                        deferred.resolve();
                        $scope.loading = false;
                    }).error(function (res) {
                        console.log("加载失败");
                        $scope.loading = false;


                    });
                    return deferred.promise;
                },
                audienceFeatureFun: function (chart_id, pid, aid, start_date, end_date, cid, ctype) {
                    var deferred = $q.defer();
                    $http({
                        method: 'get',
                        // $scope.app.fullUrl
                        url:  "https://api-jdi.jiguang.cn/v1"+ "/manage/getPortrayalDatas?" + "chart_id=" + chart_id + "&pid=" + pid + "&aid=" + aid + "&start_date=" + start_date + "&end_date=" + end_date,
                        headers: {'Authorization': "Bearer " + $scope.app.token}, withCredentials: true
                    }).success(function (res) {
                        $scope.audienceFeature = res;
                        $scope.cid = cid;
                        $scope.ctype = ctype;
                        deferred.resolve();
                    }).error(function (res) {
                        console.log("加载失败");
                    });
                    return deferred.promise;
                },

            };

            /**
             * 图表函数
             * */
            var initChart = {
                //柱状图
                crossBar: function (data, id) {

                    var legend = data[1];
                    var x = data[0];
                    var series = data[2];

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
                            width:'60%',
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
                //条形图
                verticalBar: function (data, id) {
                    var legend = data[1];
                    var x = data[0];
                    var series = data[2];
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
                            width:'60%',
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
                                name: '占比(%)',
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
                //雷达图
                radarBar: function (data, id) {
                    var indicator = data[1];
                    var legend = [];
                    var series = data[2];

                    var dom = document.getElementById(id);
                    var myChart = echarts.init(dom);
                    var option = {
                        tooltip: {},
                        legend: {
                            type: 'scroll',
                            width:'60%',
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
                },
                //圆环
                pieRingChart: function (data, id) {
                    var dom = document.getElementById(id);
                    var myChart = echarts.init(dom);
                    var x = data[0];
                    var pie = data[1];
                    var option = {
                        tooltip: {
                            trigger: 'item',
                            formatter: "{a} <br/>{b}：{d}%"
                        },
                        legend: {
                            type: 'scroll',
                            width:'60%',
                            data: x,
                            bottom: 0,
                            left: 10,
                            textStyle: $scope.textStyle
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
                                        var series = opt.series[0].data; //折线图数据
                                        var tdHeads = ''; //表头
                                        var tdBodys = ''; //数据
                                        var table = '<table class="table table-striped m-b-none table-bordered table-hover"><tbody><tr>' + tdHeads + ' </tr>';
                                        for(var i=0;i<series.length;i++){
                                            table += '<tr><td class="NoNewline">' + series[i].name + '</td>'+
                                                '<td class="NoNewline">'+ series[i].value+ '</td>' + tdBodys + '</tr>';
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
                                        var optRes=opt.option.series[0].data;
                                        if(optRes.length!==0){
                                            for(var i=0;i<optRes.length;i++){
                                                res.push(
                                                    [optRes[i].name,optRes[i].value]
                                                )
                                            }
                                            var str = JSON.stringify(res);
                                            str = '{' + '"data":' + str + '}';
                                            echartsDl($scope.app.echartsDl, str)
                                        }


                                    }
                                }
                            },
                            bottom: 0,
                            right: 10
                        },
                    };

                    option.series = [
                        {
                            name: '',
                            type: 'pie',
                            radius: ['50%', '70%'],
                            avoidLabelOverlap: false,
                            // label: {
                            //     normal: {
                            //         show: false,
                            //         position: 'center'
                            //     },
                            //     emphasis: {
                            //         show: true,
                            //         textStyle: {
                            //             fontSize: '30',
                            //             fontWeight: 'bold'
                            //         }
                            //     }
                            // },
                            color: izone.color,
                            data: pie,
                        }
                    ];
                    if (option && typeof option === "object") {
                        myChart.setOption(option, true);
                    }
                    window.onresize = function () {
                        myChart.resize();
                    }

                },
                //  实体圆形
                pieChart: function (data, id) {
                    var dom = document.getElementById(id);
                    var myChart = echarts.init(dom);
                    var x = data[0];
                    var pie = data[1];
                    var option = {
                        tooltip: {
                            trigger: 'item',
                            formatter: "{a} <br/>{b}：{d}%"
                        },
                        legend: {
                            type: 'scroll',
                            width:'60%',
                            data: x,
                            bottom: 0,
                            left: 10,
                            textStyle: $scope.textStyle
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
                                        var series = opt.series[0].data; //折线图数据
                                        var tdHeads = ''; //表头
                                        var tdBodys = ''; //数据
                                        var table = '<table class="table table-striped m-b-none table-bordered table-hover"><tbody><tr>' + tdHeads + ' </tr>';
                                        for(var i=0;i<series.length;i++){
                                            table += '<tr><td class="NoNewline">' + series[i].name + '</td>'+
                                                '<td class="NoNewline">'+ series[i].value+ '</td>' + tdBodys + '</tr>';
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
                                        var optRes=opt.option.series[0].data;
                                        if(optRes.length!==0){
                                            for(var i=0;i<optRes.length;i++){
                                                res.push(
                                                    [optRes[i].name,optRes[i].value]
                                                )
                                            }
                                            var str = JSON.stringify(res);
                                            str = '{' + '"data":' + str + '}';
                                            echartsDl($scope.app.echartsDl, str)
                                        }


                                    }
                                }
                            },
                            bottom: 0,
                            right: 10
                        },
                    };

                    option.series = [
                        {
                            name: '',
                            type: 'pie',
                            radius: '55%',
                            center: ['50%', '60%'],
                            avoidLabelOverlap: false,
                            // label: {
                            //     normal: {
                            //         show: false,
                            //         position: 'center'
                            //     },
                            //     emphasis: {
                            //         show: true,
                            //         textStyle: {
                            //             fontSize: '30',
                            //             fontWeight: 'bold'
                            //         }
                            //     }
                            // },
                            color: izone.color,
                            data: pie,
                        }
                    ];
                    if (option && typeof option === "object") {
                        myChart.setOption(option, true);
                    }
                    window.onresize = function () {
                        myChart.resize();
                    }

                },
            };
            //加载更多图表
            $scope.moreChart = 1;
            $scope.showmoreChart = function (moreChart) {
            };
            var init = function () {
                var startDate = $scope.app.basisFolder.startDate;
                var endDate = $scope.app.basisFolder.endDate;
                //= 399
                var pid = $scope.project_id;
                //= 400
                var aid = $scope.aid;
                // var startDate = 20180101;
                // var endDate = 20180321;
                for (var i = $scope.moreChart - 1; i < $scope.moreChart; i++) {
                    for (var j = 0; j < $scope.alllabel[i].label.length; j++) {
                        var cid = $scope.alllabel[i].label[j].id;
                        var ctype = $scope.alllabel[i].label[j].type;
                        var chart_id = $scope.alllabel[i].label[j].chart_id=5;
                        mainhttp.audienceFeatureFun(chart_id, pid, aid, startDate, endDate, cid, ctype).then(function (res) {
                            //cid 图表ID
                            //ctype图表展示形式
                            switch ($scope.ctype) {
                                case "bar":
                                    // var pieRes = pubchart.pie($scope.audienceFeature, 4);
                                    // initChart.pieChart(pieRes, $scope.cid);
                                    var barRes = pubchart.crossBar($scope.audienceFeature, 1);
                                    initChart.crossBar(barRes, $scope.cid);
                                    break;
                                case "radar":
                                    var radarRes = pubchart.radar($scope.audienceFeature, 2);
                                    initChart.radarBar(radarRes, $scope.cid);
                                    break;
                                case "ring":
                                    var ringRes = pubchart.pie($scope.audienceFeature, 3);
                                    initChart.pieRingChart(ringRes, $scope.cid);
                                    break;
                                case "pie":
                                    var pieRes = pubchart.pie($scope.audienceFeature, 4);
                                    initChart.pieChart(pieRes, $scope.cid);
                                    break;
                                case "vertical":
                                    var verticalRes = pubchart.crossBar($scope.audienceFeature, 2);
                                    initChart.verticalBar(verticalRes, $scope.cid);
                                    break;
                                default:

                            }
                        });
                    }
                }
            };
            /**
             * 监控函数
             * */
            $scope.$watch('app.basisFolder', function (newVal, oldVal) {
                $scope.moreChart = 1;
                mainhttp.funfindChartData().then(function () {
                    if ($scope.alllabel.length != 0) {
                        init();
                    }
                });
            }, true);
            /*
             * 滚动加载
             * */
            $(document).ready(function () {
                $(window).scroll(function () {
                    if ($(document).scrollTop() >= $(document).height() - $(window).height()) {
                        if ($scope.moreChart <= 4) {
                            $scope.moreChart = $scope.moreChart + 1;
                            init();

                        }
                    }
                });
            });
            $scope.renderFinish = function () {
                console.log("渲染完成")

            };

            /*
             * 日期控件
             * */
            $scope.startDate = window.sessionStorage.getItem("mktime");
            $scope.endDate = window.sessionStorage.getItem("endtime");
            var agodate = addDate($filter('date')(new Date(), 'yyyy-MM-dd'), -1);
            var agodateArr = (agodate + "").split("");
            agodateArr.splice(4, 0, '-');
            agodateArr.splice(7, 0, '-');
            var agodate7 = addDate($filter('date')(new Date(), 'yyyy-MM-dd'), -7);
            var agodateArr7 = (agodate7 + "").split("");
            agodateArr7.splice(4, 0, '-');
            agodateArr7.splice(7, 0, '-');

            var nowagodate7 = addDate(new Date($scope.endDate).format("yyyy-MM-dd"), -6);
            var nowagodateArr7 = (nowagodate7 + "").split("");
            nowagodateArr7.splice(4, 0, '-');
            nowagodateArr7.splice(7, 0, '-');

            $scope.endDate = new Date($scope.endDate).format("yyyyMMdd") < agodate ? $scope.endDate : agodateArr.join("");

            if (agodate > new Date($scope.endDate).format("yyyyMMdd")) {
                $scope.defaultmktime = (addDate(new Date($scope.endDate).format("yyyy-MM-dd"), -6) >= new Date($scope.startDate).format("yyyyMMdd") ? nowagodateArr7.join("") : $scope.startDate);
            } else {
                $scope.defaultmktime = (addDate(new Date($scope.endDate).format("yyyy-MM-dd"), -6) >= new Date($scope.startDate).format("yyyyMMdd") ? agodateArr7.join("") : $scope.startDate);
            }
            $scope.defaultendtime = $scope.endDate;
            $scope.proDate = $scope.defaultmktime + " - " + $scope.defaultendtime;
            $scope.app.basisFolder.startDate = new Date($scope.defaultmktime).format("yyyyMMdd");
            $scope.app.basisFolder.endDate = new Date($scope.defaultendtime).format("yyyyMMdd");

            // $scope.app.basisFolder.startDate = $scope.startDate.split("-").join("");
            // $scope.app.basisFolder.endDate = $scope.endDate.split("-").join("");
            laydate.render({
                elem: '#date', //指定元素
                value: $scope.defaultmktime + ' - ' + $scope.defaultendtime,
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