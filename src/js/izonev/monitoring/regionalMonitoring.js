'use strict';
app.controller('regionalMonitoringCtrl', ['$scope', '$http', '$state', '$q', '$interval', function ($scope, $http, $state, $q, $interval) {

    function G(id) {
        return document.getElementById(id);
    };
    var randomInt = function (nMin, nMax) {
        return Math.floor(Math.random() * (nMax - nMin) + nMin + 0.5);
    };
    var getHotTime = function (arr) {
        var time = [];
        for (var i = 0; i < arr.length; i++) {
            time.push((arr[i].time).replace("_", ":"))
        }
        return time;

    };
    var getHotLnglat = function (arr) {
        var l = [];
        for (var i = 0; i < arr.length; i++) {
            l.push([arr[i].lng, arr[i].lat, arr[i].count + "'"])
        }
        return l;
    };

    var getHotSeries = function (datas) {
        var res = [];
        for (var i = 0; i < datas.length; i++) {
            //ceshi[i].regionLatLog
            res.push(
                {
                    series: [{
                        data: getHotLnglat($scope.monitoring.allRegionLatLog[i].regionLngLat)//regionLatLog
                    }]
                }
            )

        }
        return res;
    };
    $scope.focus = 0;
    $scope.clickStatus = function (i, name, data) {

        $scope.focus = i;
        $scope.fileName = name;
        $scope.lbsname = name;
        $scope.lng = data.lng;
        $scope.lat = data.lat;
        initChartMap();

    };
    $('.heatHeight').css({
        height: ($('body').height()) - 160,
    });

    //********************************************************************************************************************
    $scope.lng = 116.2747842986;
    $scope.lat = 39.9985571735;

    $scope.temMenu = [
        // {id: "lbs_slt_tgl", name: "三里屯",lng:116.459486,lat:39.940573},
        // {id: "lbs_sh_ifc", name: "上海国金中心",lng:121.5078739346,lat:31.2423045690},
        {id: 301, name: "颐和园", lng: 116.2747842986, lat: 39.9985571735},
        {id: 303, name: "圆明园", lng: 116.3064948757, lat: 40.0155122462},
        {id: 300, name: "植物园", lng: 116.2148375076, lat: 40.0078285364},
        {id: 302, name: "玉渊潭", lng: 116.3231304934, lat: 39.9204226628},
        {id: 231, name: "故宫", lng: 116.4035636823, lat: 39.9243254649},
    ];
    $scope.lbsname = $scope.temMenu[0].id;
    $scope.areaStyle = [
        {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(26, 166, 146, 0.6)'
            }, {
                offset: 0.8,
                color: 'rgba(26, 166, 146, 0.6)'
            }], false),
            shadowColor: 'rgba(26, 166, 146, 0.6)',
            shadowBlur: 10
        }
        ,
        {
            //线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(77, 211, 159, 0.6)'
            }, {
                offset: 0.7,
                color: 'rgba(77, 211, 159, 0.6)'
            }], false),

            shadowColor: 'rgba(77, 211, 159, 0.6)', //阴影颜色
            shadowBlur: 10 //shadowBlur设图形阴影的模糊大小。配合shadowColor,shadowOffsetX/Y, 设置图形的阴影效果。
        }
    ];
    $scope.monitoring = {
        allRegionLatLog: []
    };
    $scope.loading = true;

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
    var dateTime = new Date();
    $scope.lbstime = dateTime.getHours();
    if ($scope.lbstime <= 9) {
        $scope.lbstime = '0' + $scope.lbstime;
    } else {
        $scope.lbstime = $scope.lbstime;
    }

    var getFindRegionData1 = function (url) {
        $scope.loading = true;
        var deferred = $q.defer();
        $http({
            method: 'get',
            url: url,
            headers: { 'Authorization': "Bearer "+$scope.app.token}, withCredentials: true
        }).success(function (res) {
            if (res !== undefined) {
                if (res.code === 2000) {


                    if (res.data !== null && res.data !== undefined) {

                        $scope.dataAll_Res_Hot = res.data;

                        // $scope.allRegionLatLog_Res = $scope.dataAll_Res_Hot.allRegionLatLog;
                        //
                        // var allRegionLatLog_len = $scope.dataAll_Res_Hot.allRegionLatLog.length - 1;
                        // 获取最新热力图数据数据
                        $scope.regionLngLat_Res = $scope.dataAll_Res_Hot;
                        //[allRegionLatLog_len].regionLngLat
                        // console.log($scope.regionLngLat_Res)

                        //动态热力图实现
                        // $scope.monitoring.allRegionLatLog = $scope.dataAll_Res_Hot.allRegionLatLog;
                        // if ($scope.monitoring.allRegionLatLog.length > 0) {
                        //
                        //
                        //     // var dateTime=new Date();
                        //     $scope.hhwe = $scope.monitoring.allRegionLatLog.length - 1;
                        //     $scope.timewe = getHotTime($scope.monitoring.allRegionLatLog);
                        //
                        //     $scope.SeriesData = getHotSeries($scope.monitoring.allRegionLatLog);
                        // }

                        $scope.SeriesData = $scope.regionLngLat_Res;
                        // $scope.citylnglat_Res = $scope.dataAll_Res.citylnglat;


                    }
                    $scope.loading = false;
                }

            }
            deferred.resolve();
        }).error(function (data) {
            $scope.loading = false;
            console.log("查询失败");
            // initChart_dev();

        });
        return deferred.promise;
    };
    var getRealTime = function (url) {
        var sequential = [];

        $scope.thisDayPassengerFlow = {
            legend: ["客流量", "昨日客流"],
            xAxis: [],
            series: [],
        };
        var deferred = $q.defer();
        $http({
            method: 'get',
            url: url,
            headers: { 'Authorization': "Bearer "+$scope.app.token}, withCredentials: true
        }).success(function (res) {
            if (res !== undefined) {
                if (res.code === 2000) {
                    $scope.allDataList = res.data;
                    // 总人数
                    $scope.todayAllPeoPle = $scope.allDataList.todayAllPeople;
                    // 实时人数
                    $scope.todayRealTimes = $scope.allDataList.todayRealTimes;

                    $scope.todayCountList = $scope.allDataList.todayCount;
                    $scope.yesterdayCountList = $scope.allDataList.yesterdayCount;
                    var todayCountListLen = $scope.todayCountList.length;
                    var pnum = [];
                    for (var i = 0; i < yesterdayCountListLen; i++) {
                        var stime=$scope.yesterdayCountList[i].time.substr($scope.yesterdayCountList[i].time.length-2,2);
                        $scope.thisDayPassengerFlow.xAxis.push(stime);

                        if ($scope.todayCountList[i]!== undefined)
                        {
                            pnum.push($scope.todayCountList[i].number);


                        } else {
                            pnum.push(null)

                        }
                        if($scope.yesterdayCountList!==undefined){
                            if($scope.yesterdayCountList[i]!=undefined){
                                var yescont=$scope.yesterdayCountList[i].number;
                                sequential.push(yescont)
                            }

                        }



                    }
                    var yAxisIndex = [0, 1];
                    //sequential
                    $scope.listRes = [pnum,sequential];
                    for (var i = 0; i < $scope.listRes.length; i++) {
                        $scope.thisDayPassengerFlow.series.push(
                            {
                                name: $scope.thisDayPassengerFlow.legend[i],
                                type: 'line',
                                // smooth: true,
                                // areaStyle: {
                                //     normal: $scope.areaStyle[i]
                                // },
                                itemStyle: {
                                    normal: {color: izone.color[i+2]}
                                },
                                // itemStyle: {
                                //
                                //     // normal: {
                                //     //     color: 'rgba(77, 211, 159, 0.9)'
                                //     //
                                //     // }
                                // },
                                // markPoint: {
                                //     data: [
                                //         {name: '周最低', value: -2, xAxis: 1, yAxis: -1.5}
                                //     ]
                                // },
                                // yAxisIndex: yAxisIndex[i],
                                data: $scope.listRes[i]

                            }
                        );

                    }


                }else {
                    $scope.todayAllPeoPle=0;

                    $scope.todayRealTimes=0;
                }

            } else {
                // initChart_dev();
            }
            deferred.resolve();
        }).error(function (data) {
            console.log("查询失败");
            // initChart_dev();

        });
        return deferred.promise;
    };
    var initChart = {
        // 客流量函数
        PassengerFlowSum: function (name, data, max, id) {
            var dom = document.getElementById(id);
            var myChart = echarts.init(dom);
            var option = {
                tooltip: {
                    formatter: $scope.tooltip
                },
                toolbox: {
                    show: false,
                    feature: {
                        mark: {show: true},
                        restore: {show: true},
                        saveAsImage: {show: true}
                    }
                },
                series: [
                    {
                        name: name,
                        type: 'gauge',
                        min: 0,
                        max: max,
                        splitNumber: 10,
                        radius: '80%',
                        axisLine: {            // 坐标轴线
                            lineStyle: {       // 属性lineStyle控制线条样式
                                color: [[0.09, '#76e4ff'], [0.82, '#57bdfe'], [1, '#4b42ff']],
                                width: 8,
                                shadowColor: '#fff', //默认透明
                                shadowBlur: 10
                            }
                        },
                        axisLabel: {            // 坐标轴小标记
                            textStyle: {       // 属性lineStyle控制线条样式
                                fontWeight: 'bolder',
                                color: '#57bdfe',
                                shadowColor: '#fff', //默认透明
                                shadowBlur: 10
                            }
                        },
                        axisTick: {            // 坐标轴小标记
                            length: 15,        // 属性length控制线长
                            lineStyle: {       // 属性lineStyle控制线条样式
                                color: 'auto',
                                shadowColor: '#fff', //默认透明
                                shadowBlur: 10
                            }
                        },
                        splitLine: {           // 分隔线
                            length: 25,         // 属性length控制线长
                            lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                                width: 3,
                                color: '#57bdfe',
                                shadowColor: '#fff', //默认透明
                                shadowBlur: 10
                            }
                        },
                        pointer: {           // 分隔线
                            shadowColor: '#57bdfe', //默认透明
                            shadowBlur: 5
                        },
                        title: {
                            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                fontWeight: 'bolder',
                                fontSize: 20,
                                fontStyle: 'italic',
                                color: '#57bdfe',
                                shadowColor: '#000', //默认透明
                                shadowBlur: 10
                            }
                        },
                        detail: {
                            offsetCenter: [0, '50%'],       // x, y，单位px
                            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                fontWeight: 'bolder',
                                color: '#76e4ff'
                            },
                            formatter: function (e) {
                                return fcomdify(e)
                            }
                        },
                        data: [{value: data}]
                    }
                ]
            };
            myChart.setOption(option);

        },
        //今日客流
        theDayPassengerFlow: function (legend, x, series) {
            var dom = document.getElementById("theDayPassengerFlowID");
            var myChart = echarts.init(dom);
            var option = {

                tooltip: $scope.tooltip,
                legend: {
                    data: legend,
                    bottom: 0,
                    left: 10,
                    textStyle: $scope.textStyle
                },
                grid: {
                    left: '1%',
                    right: '5%',
                    bottom: '12%',
                    top: '10%',
                    containLabel: $scope.app.chart.show
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
                        name: '人数',
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
                    // ,
                    // {
                    //     type: 'value',
                    //     show: true,
                    //     name: "环比",
                    //     min: -100,
                    //     max:100,
                    //
                    //     // interval: 5,
                    //     axisLabel: {
                    //         formatter: '{value} '
                    //     },
                    //     axisLine: {
                    //         lineStyle: {
                    //             width: 1,
                    //             color: $scope.app.chart.fontColor,
                    //             opacity: 1
                    //         }
                    //     },
                    //     axisTick: {
                    //         show: $scope.app.chart.hide
                    //     },
                    //     splitLine: {
                    //         show: $scope.app.chart.hide,
                    //         lineStyle: {
                    //             type: $scope.app.chart.lineStyle
                    //         }
                    //     }
                    // }
                ],
                series: series
            };
            if (option && typeof option === "object") {
                myChart.setOption(option, true);
                window.onresize = myChart.resize;
            }


        },
    };

    $scope.drawType = "heatmap";
    $scope.RadiusValue = 12;
    $scope.maxinputValue = 4;
    $scope.opacityValue = 80;
    $scope.drawMapHot = { // 绘制参数
        blur: true, // 是否有模糊效果
        unit: 'px', // 单位,px:像素(默认),m:米
        max: $scope.maxinputValue, // 设置显示的权重最大值
        type: 'circle', // 形状,可选circle:圆形(默认),rect:矩形
        size: $scope.RadiusValue, // 半径大小
        maxOpacity: 0.7,
        gradient: { // 显示的颜色渐变范围
            '0': 'blue',
            '0.25': 'cyan',
            '0.55': 'lime',
            '0.85': 'yellow',
            '1.0': 'red'
        }
    };

    $scope.zoom = 16;
    var mk;
    var runfield2 = function (data, lng, lat, time, index, zoom) {
        var Hotoption = null;
        var dom = document.getElementById("heatmapID");
        var HotChart = echarts.init(dom);
        Hotoption = {
            baseOption: {
                title: {
                    left: 'center',
                    top: 10,
                    textStyle: {
                        color: '#98a6ad',
                        fontSize: 20
                    },
                    subtextStyle: {
                        color: 'white',
                        fontSize: 12
                    }
                },
                timeline: {
                    realtime: true,
                    loop: false,
                    currentIndex: [index],
                    autoPlay: false,
                    data: time,
                    // data: ["00","01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23"],
                    axisType: 'category',
                    position: 'fixed',
                    top: '2%',
                    left: '6%',
                    width: '90%',
                    playInterval: 1500,
                    lineStyle: {color: '#98a6ad'},
                    symbol: 'triangle',
                    symbolSize: [4, 4],
                    label: {
                        normal: {
                            show: true,
                            textStyle: {
                                color: '#7266ba',
                                fontSize: 12
                            }
                        }
                    }

                },
                tooltip: {},
                bmap: {
                    // center: [114.20075, 22.385427],
                    center: [lng, lat],
                    // center: [116.30309635413902, 40.063023502646665],
                    zoom: zoom,
                    // zoom: 16,
                    roam: false,


                },
                visualMap: {

                    show: false,
                    top: 'top',
                    min: 0,
                    max: 5,
                    seriesIndex: 0,
                    calculable: true,
                    inRange: {
                        color: [ 'blue', 'green', 'yellow', 'red']
                    }
                },
                series: [{
                    type: 'heatmap',
                    mapType: 'china',
                    coordinateSystem: 'bmap',
                    pointSize: 26,
                    blurSize: 20,
                    minOpacity:0,
                    maxOpacity:0.7,
                }]
            },
            options: data,

        };
        // 使用刚指定的配置项和数据显示图表。

        HotChart.setOption(Hotoption);

        if (!app.inNode) {
            // 添加百度地图插件
            var bmap = HotChart.getModel().getComponent('bmap').getBMap();
            // bmap.addControl(new BMap.MapTypeControl());
            var ctrl_nav = new BMap.NavigationControl({
                anchor: BMAP_ANCHOR_TOP_LEFT,
                type: BMAP_NAVIGATION_CONTROL_ZOOM,

            });
            bmap.addControl(ctrl_nav);
            bmap.enableDragging();

        }


    };
    var runfield = function (dataRes, lng, lat, time, index, zoom){


        $scope.bmaphot = new BMap.Map('heatmapID', {
            enableMapClick: false
        });
        // bmaphot.enableScrollWheelZoom(); // 启用滚轮放大缩小
        $scope.bmaphot.centerAndZoom(new BMap.Point(lng, lat), zoom); // 初始化地图,设置中心坐标和地图级别
        $scope.ctrl_nav = new BMap.NavigationControl({
            anchor: BMAP_ANCHOR_TOP_LEFT,
            type: BMAP_NAVIGATION_CONTROL_ZOOM
        });
        $scope.bmaphot.addControl($scope.ctrl_nav);
        var mapv = new Mapv({
            drawTypeControl: true,
            map: $scope.bmaphot  // 百度地图的map实例
        });
        $scope.layer = new Mapv.Layer({
            mapv: mapv, // 对应的mapv实例
            zIndex: -99999999999, // 图层层级
            dataType: 'point', // 数据类型，点类型
            data: dataRes, // 数据
            drawType: "heatmap", // 展示形式
            drawOptions: $scope.drawMapHot
        });
        $scope.setRadiusValue = function (value, max) {
            $scope.layer.set('drawOptions', { // 绘制参数
                blur: true, // 是否有模糊效果
                unit: 'px', // 单位,px:像素(默认),m:米
                max: max / 1.5, // 设置显示的权重最大值
                type: 'circle', // 形状,可选circle:圆形(默认),rect:矩形
                size: value, // 半径大小
                maxOpacity: 1,
                gradient: { // 显示的颜色渐变范围
                    '0': 'blue',
                    '0.25': 'cyan',
                    '0.55': 'lime',
                    '0.85': 'yellow',
                    '1.0': 'red'
                }
            });
        };

        // $scope.bmaphot.addEventListener("click",function(e){
        //     $scope.bmaphot.removeOverlay(mk);
        //     mk = new BMap.Marker(e.point);
        //     $scope.bmaphot.addOverlay(mk);
        //     var opts = {
        //         width : 360,     // 信息窗口宽度
        //         height: 120,     // 信息窗口高度
        //         title : "" , // 信息窗口标题
        //         enableMessage:true,//设置允许信息窗发送短息
        //         message:"hahahha~"
        //     }
        //     var infoWindow = new BMap.InfoWindow("百度坐标："+e.point.lng + "," + e.point.lat+'</br>' ,opts);  // 创建信息窗口对象
        //     console.log("百度坐标："+e.point.lng + "," + e.point.lat+'</br>')
        //     $scope.bmaphot.openInfoWindow(infoWindow,e.point); //开启信息窗口
        //
        // });
        var canvas = document.querySelectorAll('canvas');

    };

    var initChartMap = function () {
        var dateTime = new Date();
        $scope.lbstime = dateTime.getHours();
        if ($scope.lbstime <= 9) {
            $scope.lbstime = '0' + $scope.lbstime;
        } else {
            $scope.lbstime = $scope.lbstime;
        }

        //热力图
        var fullUrl = $scope.app.fullUrl + '/region/getLatLnt?&area_id=' + $scope.lbsname ;
        var fullUrl2 = $scope.app.fullUrl + '/region/getPeopleCount?area_id=' + $scope.lbsname;

        getFindRegionData1(fullUrl).then(function () {
            runfield($scope.SeriesData, $scope.lng, $scope.lat, $scope.timewe, $scope.hhwe, 16);
        });
        getRealTime(fullUrl2).then(function () {
            initChart.PassengerFlowSum("实时客流量", $scope.todayRealTimes, 40000, "realTimePassengerFlowID");
            initChart.PassengerFlowSum("今日累计参展客流量", $scope.todayAllPeoPle, 300000, "DPassengerFlowSumID");
            initChart.theDayPassengerFlow($scope.thisDayPassengerFlow.legend, $scope.thisDayPassengerFlow.xAxis, $scope.thisDayPassengerFlow.series);
        })

    };

    initChartMap();


    //    时钟
    $scope.clock = {

        now: new Date().toLocaleString()

    };

    var updateClock = function () {

        $scope.clock.now = new Date().toLocaleString();

    };

    $interval(function () {

        updateClock()

    }, 1000);
    $interval(function () {
        // initChartMap();
    }, 1000 * 60);

    updateClock();


}]);