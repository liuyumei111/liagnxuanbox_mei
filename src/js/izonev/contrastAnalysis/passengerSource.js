'use strict';
app
    .controller('cPassengerSourceCtrl', ['$scope', '$http', '$state', '$q', function ($scope, $http, $state, $q) {
        //全局
        $scope.app.title.Level3 = "客流统计 | ";
        $scope.app.title.version = " - ";
        $scope.app.title.secondary = "";

        $scope.RadiusValue = 10;
        $scope.maxinputValue = 1;
        $scope.opacityValue = 80;
        $scope.drawMapHot = { // 绘制参数
            blur: true, // 是否有模糊效果
            unit: 'px', // 单位,px:像素(默认),m:米
            max: $scope.maxinputValue, // 设置显示的权重最大值
            type: 'circle', // 形状,可选circle:圆形(默认),rect:矩形
            size: $scope.RadiusValue, // 半径大小
            maxOpacity: 0.8,
            gradient: { // 显示的颜色渐变范围
                '0': 'blue',
                '0.25': 'cyan',
                '0.55': 'lime',
                '0.85': 'yellow',
                '1.0': 'red'
            }
        };
        $scope.drawGrid = { // 绘制参数
            type: "rect", // 网格类型，方形网格或蜂窝形
            size: 30, // 网格大小
            unit: 'px', // 单位
            opacity: '0.5',
            label: { // 是否显示文字标签
                show: true
            },
            gradient: { // 显示的颜色渐变范围
                '0': 'blue',
                '0.6': 'cyan',
                '0.7': 'lime',
                '0.8': 'yellow',
                '1.0': 'red'
            },
            events: {
                click: function (e, data) {
                    console.log('click', e)
                    console.log('click', data)

                }
                // mousemove: function(e, data) {
                //     console.log('move',e, data)
                // }
            }
        };
        $scope.app.basisFolder.Folder = sessionStorage.getItem("basisFolder");

        $scope.sheng = "";
        $scope.shi = "";
        $scope.qu = "";
        $scope.addType = [
            {"id": "home", "name": "按居住地"},
            {"id": "work", "name": "按工作地"},
            // {"id":"consumption","name":"按常去消费地"}
        ];
        $scope.addTypeModel = "home";
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
        //****************************************************************************************************
        $scope.selectConditions = function (b, d) {
            jhttp.getHeatMap(chart_id.heatMap, basePlusIds, $scope.app.basisFolder.id, $scope.app.basisFolder.startDate, $scope.app.basisFolder.endDate, $scope.addTypeModel).then(function () {
                initChart.runmap($scope.lng, $scope.lat, zoom, $scope.HeatMapRes, "mapHot");
            });
            jhttp.getTable(chart_id.communityRanking, basePlusIds, $scope.app.basisFolder.id, $scope.app.basisFolder.startDate, $scope.app.basisFolder.endDate, $scope.addTypeModel, $("#sheng option:selected").html(), $("#shi option:selected").html(), $("#qu option:selected").html());

        };
        //http请求数据
        var jhttp = {
            getHeatMap: function (chart_id, pid, aid, start_date, end_date, type) {
                var deferred = $q.defer();
                $http({
                    method: 'get',
                    url: $scope.app.apiUrl + "getPortrayalDatas?" + "chart_id=" + chart_id + "&pid=" + pid + "&aid=" + aid + "&start_date=" + start_date + "&end_date=" + end_date + "&type=" + type,
                    headers: {'Authorization': "Bearer " + $scope.app.token}, withCredentials: true
                }).success(function (res) {
                    $scope.heatMapData = res.data;
                    $scope.HeatMapRes = [];
                    for (var i = 0; i < $scope.heatMapData.length; i++) {
                        $scope.HeatMapRes.push(
                            {
                                lng: $scope.heatMapData[i][0],
                                lat: $scope.heatMapData[i][1],
                                count: $scope.heatMapData[i][2]
                            }
                        )
                    }
                    $scope.centerPoint = res.data[0];
                    $scope.lng = $scope.centerPoint[0];
                    $scope.lat = $scope.centerPoint[1];
                    var geoc = new BMap.Geocoder();
                    geoc.getLocation(new BMap.Point($scope.lng, $scope.lat), function (rs) {
                        $("#distpicker").distpicker({
                            province: rs.addressComponents.province,
                            city: rs.addressComponents.city,
                            district: rs.addressComponents.district,
                            autoSelect: false
                        });
                    });
                    deferred.resolve();
                }).error(function (res) {
                    console.log("加载失败")

                });
                return deferred.promise;
            },
            getTable: function (chart_id, pid, aid, start_date, end_date, type, province, city, district) {
                var deferred = $q.defer();
                $http({
                    method: 'get',
                    url: $scope.app.apiUrl + "getPortrayalDatas?" + "chart_id=" + chart_id + "&pid=" + pid + "&aid=" + aid + "&start_date=" + start_date + "&end_date=" + end_date + "&type=" + type + "&province=" + province + "&city=" + city + "&district=" + district,
                    headers: {'Authorization': "Bearer " + $scope.app.token}, withCredentials: true
                }).success(function (res) {
                    if (res.data != null) {
                        var tablethg = [{bus: []}];
                        var tabledatag = [];
                        for (var i = 0; i < $scope.basisName.length; i++) {
                            tablethg[0].bus.push(
                                $scope.basisName[i]
                            );
                        }
                        for (var j = 0; j < res.data.xAxis.length; j++) {
                            tabledatag.push(
                                {
                                    name: res.data.xAxis[j],
                                    value: []
                                }
                            );
                            for (var m = 0; m < res.data.series.length; m++) {
                                tabledatag[j].value.push(res.data.series[m].data[j]);
                            }
                        }
                        $scope.TableTh = tablethg;
                        $scope.TableData = tabledatag;
                    } else {
                        $scope.TableTh = [];
                        $scope.TableData = [];
                    }
                    deferred.resolve();
                }).error(function (res) {
                    $scope.TableTh = [];
                    $scope.TableData = [];
                    console.log("加载失败")

                });
                return deferred.promise;
            },
            passengerSource1: function (chart_id, pid, tagid, aid, start_date, end_date, top) {
                $scope.loading = true;
                var deferred = $q.defer();
                $http({
                    method: 'get',
                    // url: $scope.app.apiUrl+"getPortrayalDatas?"+"token="+$scope.app.token+"&chart_id="+chart_id+"&pid="+pid+"&tagid="+tagid+"&aid="+aid+"&start_date="+start_date+"&end_date="+end_date+"&top="+top,
                    url: $scope.app.apiUrl + "getPortrayalDatas?" + "chart_id=" + chart_id + "&pid=" + pid + "&tagid=" + tagid + "&aid=" + aid + "&start_date=" + start_date + "&end_date=" + end_date + "&top=" + top,
                    headers: {'Authorization': "Bearer " + $scope.app.token}, withCredentials: true
                }).success(function (res) {
                    res.data.legend = $scope.basisName;
                    $scope.passengerSource1 = res.data;
                    deferred.resolve();
                    $scope.loading = false;
                }).error(function (res) {
                    console.log("加载失败");
                    $scope.loading = false;
                });
                return deferred.promise;
            },
            passengerSource2: function (chart_id, pid, aid, start_date, end_date) {
                $scope.loading = true;
                var deferred = $q.defer();
                $http({
                    method: 'get',
                    // url: $scope.app.apiUrl+"getPortrayalDatas?"+"token="+$scope.app.token+"&chart_id="+chart_id+"&pid="+pid+"&aid="+aid+"&start_date="+start_date+"&end_date="+end_date,
                    url: $scope.app.apiUrl + "getPortrayalDatas?" + "chart_id=" + chart_id + "&pid=" + pid + "&aid=" + aid + "&start_date=" + start_date + "&end_date=" + end_date,
                    headers: {'Authorization': "Bearer " + $scope.app.token}, withCredentials: true
                }).success(function (res) {
                    res.data.legend = $scope.basisName;
                    $scope.passengerSource2 = res.data;
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
            runmap: function (lng, lat, zoom, data, typeMap) {
                var dataRes = [];
                for (var i = 0; i < data.length; i++) {
                    var tmp = "";
                    if (data[i].count < 1) {
                        tmp = 1;
                    } else {
                        tmp = data[i].count
                    }
                    dataRes.push(
                        {
                            lng: data[i].lng,
                            lat: data[i].lat,
                            count: tmp
                        }
                    )
                }

                $scope.bmaphot = new BMap.Map('hotMapID', {
                    enableMapClick: false
                });

                function getBoundary(getcity) {
                    var bdary = new BMap.Boundary();
                    bdary.get(getcity, function (rs) {       //获取行政区域

                        var count = rs.boundaries.length; //行政区域的点有多少个
                        if (count === 0) {
                            // alert('未能获取当前输入行政区域');
                            var poi = new BMap.Point(113.93005, 40.994275);
                            $scope.bmaphot.centerAndZoom(poi, 5);
                            return;
                        }
                        var pointArray = [];

                        for (var i = 0; i < count; i++) {
                            var plys = new BMap.Polygon(rs.boundaries[i], {
                                strokeWeight: 2,
                                strokeColor: "#ff0000",
                                fillOpacity: 0.2
                            }); //建立多边形覆盖物

                            pointArray = pointArray.concat(plys.getPath());
                        }
                        $scope.bmaphot.setViewport(pointArray);    //调整视野

                    });
                };
                $("#sheng").change(function () {
                    getBoundary($("#sheng option:selected").html());
                    jhttp.getTable(chart_id.communityRanking, basePlusIds, $scope.app.basisFolder.id, $scope.app.basisFolder.startDate, $scope.app.basisFolder.endDate, $scope.addTypeModel, $("#sheng option:selected").html(), $("#shi option:selected").html(), $("#qu option:selected").html());
                });
                $("#shi").change(function () {
                    getBoundary($("#sheng option:selected").html() + $("#shi option:selected").html());
                    jhttp.getTable(chart_id.communityRanking, basePlusIds, $scope.app.basisFolder.id, $scope.app.basisFolder.startDate, $scope.app.basisFolder.endDate, $scope.addTypeModel, $("#sheng option:selected").html(), $("#shi option:selected").html(), $("#qu option:selected").html());
                });
                $("#qu").change(function () {
                    getBoundary($("#sheng option:selected").html() + $("#shi option:selected").html() + $("#qu option:selected").html());
                    jhttp.getTable(chart_id.communityRanking, basePlusIds, $scope.app.basisFolder.id, $scope.app.basisFolder.startDate, $scope.app.basisFolder.endDate, $scope.addTypeModel, $("#sheng option:selected").html(), $("#shi option:selected").html(), $("#qu option:selected").html());
                });


                // bmaphot.enableScrollWheelZoom(); // 启用滚轮放大缩小
                $scope.bmaphot.centerAndZoom(new BMap.Point(lng, lat), zoom); // 初始化地图,设置中心坐标和地图级别
                $scope.ctrl_nav = new BMap.NavigationControl({
                    anchor: BMAP_ANCHOR_TOP_LEFT,
                    type: BMAP_NAVIGATION_CONTROL_ZOOM
                });
                $scope.bmaphot.addControl($scope.ctrl_nav);

                $scope.bmaphot.setMapStyle($scope.app.mapStyle);
                var mapv = new Mapv({
                    drawTypeControl: true,
                    map: $scope.bmaphot  // 百度地图的map实例
                });
                if (typeMap === "mapHot") {
                    $scope.layer = new Mapv.Layer({
                        mapv: mapv, // 对应的mapv实例
                        zIndex: -99999999999, // 图层层级
                        dataType: 'point', // 数据类型，点类型
                        data: dataRes, // 数据
                        drawType: "heatmap", // 展示形式
                        drawOptions: $scope.drawMapHot
                    });
                } else if (typeMap === "grid") {
                    $scope.layer = new Mapv.Layer({
                        mapv: mapv, // 对应的mapv实例
                        zIndex: -99999999999, // 图层层级
                        dataType: 'point', // 数据类型，点类型
                        data: dataRes, // 数据
                        drawType: "density", // 展示形式
                        drawOptions: $scope.drawGrid
                    });
                }


                $scope.setRadiusValue = function (value, max) {
                    $scope.layer.set('drawOptions', { // 绘制参数
                        blur: true, // 是否有模糊效果
                        unit: 'px', // 单位,px:像素(默认),m:米
                        max: max / 1.5, // 设置显示的权重最大值
                        type: 'circle', // 形状,可选circle:圆形(默认),rect:矩形
                        size: value, // 半径大小
                        maxOpacity: 0.8,
                        gradient: { // 显示的颜色渐变范围
                            '0': 'blue',
                            '0.25': 'cyan',
                            '0.55': 'lime',
                            '0.85': 'yellow',
                            '1.0': 'red'
                        }
                    });
                };
                var canvas = document.querySelectorAll('canvas');

                $scope.hiedeMapHot = function () {
                    $scope.layer.canvasLayer.hide()
                };
                $scope.showMapHot = function () {
                    $scope.layer.canvasLayer.show()
                };

            },
            crossBar: function (data, num, id, name) {
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
                        left: '5%',
                        right: '8%',
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
                            name: name,

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
            crossLine: function (data, num, id, name) {
                var x = data.xAxis;
                var legend = data.legend;
                var series = [];
                if (data.series != undefined) {
                    for (var i = 0; i < data.series.length; i++) {
                        series.push(
                            {
                                name: legend[i],
                                type: 'line',
                                smooth: true, //是否平滑曲线显示
                                areaStyle: {normal: {}},
                                itemStyle: {
                                    normal: {color: izone.color[i + num]}
                                },
                                data: data.series[i].data

                            }
                        )
                    }
                }

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
                        left: '5%',
                        right: '8%',
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
                            }

                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            name: name,

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
            crossLine2: function (data, num, id, name) {
                var x = data.xAxis;
                var legend = data.legend;
                var series = [];
                if (data.series != undefined) {
                    for (var i = 0; i < data.series.length; i++) {
                        series.push(
                            {
                                name: legend[i],
                                type: 'line',
                                smooth: true, //是否平滑曲线显示
                                itemStyle: {
                                    normal: {color: izone.color[i + num]}
                                },
                                data: data.series[i].data

                            }
                        )
                    }
                }
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
                        left: '5%',
                        right: '8%',
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
                            }

                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            name: name,

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
        };
        var zoom = 12;

        var init = function (basePlusIds, aid, startDate, endDate) {
            //客流总量对比
            // jhttp.passengerSource1(chart_id.basicPortrait,basePlusIds,portrait.  ,aid,startDate,endDate,0).then(function () {
            //     initChart.crossBar($scope.passengerSource1, 0, "customerTotalID","人数(人)");
            // });
            //客流量统计
            // jhttp.passengerSource1(chart_id.basicPortrait,basePlusIds,portrait.  ,aid,startDate,endDate,0).then(function () {
            //     initChart.crossLine($scope.passengerSource1, 2, "pFlowStatisticalTimeID","客流量（人）");
            // });
            //平均访问频次
            // jhttp.passengerSource1(chart_id.basicPortrait,basePlusIds,portrait.  ,aid,startDate,endDate,0).then(function () {
            //     initChart.crossBar($scope.passengerSource1,1,"thisShopVsAllShopID","次数（次）");
            // });
            //客流时段分析
            // jhttp.passengerSource1(chart_id.basicPortrait,basePlusIds,portrait.  ,aid,startDate,endDate,0).then(function () {
            //     initChart.crossLine2($scope.passengerSource1, 3, "passengerFlowOntimeID","人数（人）");
            // });
            //顾客来源展示  热力图
            jhttp.getHeatMap(chart_id.heatMap, basePlusIds, aid, startDate, endDate, $scope.addTypeModel).then(function () {
                initChart.runmap($scope.lng, $scope.lat, zoom, $scope.HeatMapRes, "mapHot");
            });
            jhttp.getTable(chart_id.communityRanking, basePlusIds, aid, startDate, endDate, $scope.addTypeModel, "ALL", "ALL", "ALL");

            //客户来源省份对比
            jhttp.passengerSource2(chart_id.customeProvince, basePlusIds, aid, startDate, endDate).then(function () {
                initChart.crossBar($scope.passengerSource2, 1, "customerSourceProID", "占比(%)");
            });
            //客户来源城市对比
            jhttp.passengerSource2(chart_id.customeCity, basePlusIds, aid, startDate, endDate).then(function () {
                initChart.crossBar($scope.passengerSource2, 2, "customerSourceCityID", "占比(%)");
            });
        };
        $scope.$watch('app.basisFolder.id', function (newVal, oldVal) {
            init($scope.appid, $scope.app.basisFolder.id, $scope.app.basisFolder.startDate, $scope.app.basisFolder.endDate);
        }, true);
        // $scope.OnSelectTime=function (d) {
        //     jhttp.pFlowStatisticalTime($scope.app.basisFolder.Folder, $scope.ChartJointOne,d).then(function () {
        //         initChart.crossLine($scope.pFlowStatisticalTime_Res, 2, "pFlowStatisticalTimeID");
        //     });
        // };
        // $scope.OnSelectTime2=function (d) {
        //     jhttp.passengerFlowOntimeFun($scope.app.basisFolder.Folder, $scope.ChartJointOne,d).then(function () {
        //         initChart.crossLine2($scope.passengerFlowOntime_Res, 3, "passengerFlowOntimeID");
        //     });
        // };
        $scope.OnSelectMap = function (type) {
            initChart.runmap($scope.lng, $scope.lat, zoom, $scope.HeatMapRes, type);
        };
    }]);