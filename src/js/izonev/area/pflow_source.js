'use strict';
app.controller('asourceCtrl', ['$scope', '$http', '$state', '$q', '$interval', '$stateParams', function ($scope, $http, $state, $q, $interval, $stateParams) {

    $scope.app.title.version = " - ";
    $scope.app.title.secondary = "";
    $scope.app.title.Level3 = "客流来源 | ";
    $scope.RadiusValue = 10;
    $scope.maxinputValue = 20;
    $scope.opacityValue = 80;
    $scope.loading = true;
    $scope.app.exhibition.id = window.sessionStorage.getItem('basePlusId');

    $scope.app.exhibition.pavilion_id = $stateParams.pavilion_id;

    $scope.app.exhibition.pavilion_idPlus = $stateParams.pavilion_idPlus;
    $scope.dataToken = sessionStorage.getItem("dataToken");
    $scope.pid = window.sessionStorage.getItem("pid");
    $scope.pars = "ALL";
    var randomInt = function (nMin, nMax) {
        return Math.floor(Math.random() * (nMax - nMin) + nMin + 0.5);
    };

    function isContains(str, substr) {
        return new RegExp(substr).test(str);
    }

    $('#distpicker5').distpicker({
        autoSelect: false
    });

    /**
     * 定义公共样式
     * tooltip
     *
     * */
    $scope.drawMapHot = { // 绘制参数
        blur: true, // 是否有模糊效果
        unit: 'px', // 单位,px:像素(默认),m:米
        max: $scope.maxinputValue, // 设置显示的权重最大值
        type: 'circle', // 形状,可选circle:圆形(默认),rect:矩形
        size: $scope.RadiusValue, // 半径大小
        maxOpacity: 1,
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


            }
            // mousemove: function(e, data) {
            //     console.log('move',e, data)
            // }
        }
    };
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
    $scope.selectHomeOrWork = "home";
    $scope.homeOrWork = [
        {"name": "居住地", "id": "home"},
        {"name": "工作地", "id": "work"},
    ];
    $scope.onselectHomeOrWork = function () {
        var province = $("#province10 option:selected").html();
        var city = $("#city10 option:selected").html();
        var district = $("#district10 option:selected").html();
        if (isContains(city, "市辖区")) {
            var str = city;
            var reg = new RegXYp("市辖区", "g");
            city = str.replace(reg, "");
        }

        if (province == undefined || province == null || province == "—— 省 ——") {
            province = "ALL"
        }
        if (city == undefined || city == null || city == "—— 市 ——") {
            city = "ALL"
        }
        if (district == undefined || district == null || district == "—— 区 ——") {
            district = "ALL"
        }
        // mainHttp.districtRanking($scope.app.exhibition.startDate, $scope.app.exhibition.endDate, $scope.selectHomeOrWork, province, city, district, "izone_"+window.sessionStorage.getItem("pid")+"_src", window.sessionStorage.getItem("key")+"_Area_Top");
        init();

    };
    var mainHttp = {
        //地图
        getHeatMap: function (chart_id, pid, aid, type, start_date, end_date) {
            $scope.loading = true;
            var deferred = $q.defer();
            $http({
                method: 'get',
                url: $scope.app.apiUrl + "getPortrayalDatas?" + "chart_id=" + chart_id + "&pid=" + pid + "&aid=" + aid + "&type=" + type + "&start_date=" + start_date + "&end_date=" + end_date,
                headers: {'Authorization': "Bearer " + $scope.app.token}, withCredentials: true
            }).success(function (res) {
                // console.log(res)
                if (res.code === 2000) {
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
                }

                deferred.resolve();

            }).error(function (res) {
                console.log("加载失败");
                $scope.loading = false;
            });
            return deferred.promise;
        },
        //居住地址数量
        districtRanking: function (chart_id, pid, aid, type, start_date, end_date) {

            var deferred = $q.defer();
            $http({
                method: 'get',
                url: $scope.app.apiUrl + "getPortrayalDatas?" + "chart_id=" + chart_id + "&pid=" + pid + "&aid=" + aid + "&type=" + type + "&start_date=" + start_date + "&end_date=" + end_date,
                headers: {'Authorization': "Bearer " + $scope.app.token}, withCredentials: true
            }).success(function (res) {
                // console.log(res)
                if (res.code === 2000) {
                    $scope.districtRankingData = res.data;
                    $scope.districtRankingDataX = $scope.districtRankingData.xAxis;
                    $scope.districtRankingDataS = $scope.districtRankingData.series[0].data;
                    $scope.districtRankingDataRes = [];
                    for (var i = 0; i < $scope.districtRankingDataX.length; i++) {
                        $scope.districtRankingDataRes.push(
                            {
                                name: $scope.districtRankingDataX[i],
                                value: $scope.districtRankingDataS[i]
                            }
                        )
                    }
                }

                deferred.resolve();

            }).error(function (res) {
                console.log("加载失败");
                $scope.districtRankingDataRes = [];

            });
            return deferred.promise;
        },
        //本省外省
        getSourceContrastProv: function (chart_id, pid, aid, type, start_date, end_date) {
            var deferred = $q.defer();
            $http({
                method: 'get',
                url: $scope.app.apiUrl + "getPortrayalDatas?" + "chart_id=" + chart_id + "&pid=" + pid + "&aid=" + aid + "&type=" + type + "&start_date=" + start_date + "&end_date=" + end_date,
                headers: {'Authorization': "Bearer " + $scope.app.token}, withCredentials: true
            }).success(function (res) {
                // console.log(res)
                if (res.code === 2000) {
                    $scope.sourceDataProv = res.data;
                    $scope.sourceDataProvX = $scope.sourceDataProv.xAxis;
                    $scope.sourceDataProvS = $scope.sourceDataProv.series[0].data;
                    for (var i = 0; i < $scope.sourceDataProvX.length; i++) {
                        $scope.pie.prov.push(
                            {
                                name: $scope.sourceDataProvX[i],
                                value: $scope.sourceDataProvS[i]
                            }
                        )
                    }

                }

                deferred.resolve();

            }).error(function (res) {
                console.log("加载失败");

            });
            return deferred.promise;
        },
        //本市外市
        getSourceContrastCity: function (chart_id, pid, aid, type, start_date, end_date) {
            var deferred = $q.defer();
            $http({
                method: 'get',
                url: $scope.app.apiUrl + "getPortrayalDatas?" + "chart_id=" + chart_id + "&pid=" + pid + "&aid=" + aid + "&type=" + type + "&start_date=" + start_date + "&end_date=" + end_date,
                headers: {'Authorization': "Bearer " + $scope.app.token}, withCredentials: true
            }).success(function (res) {
                // console.log(res)
                if (res.code === 2000) {
                    $scope.sourceDataCity = res.data;
                    $scope.sourceDataCityX = $scope.sourceDataCity.xAxis;
                    $scope.sourceDataCityS = $scope.sourceDataCity.series[0].data;
                    for (var i = 0; i < $scope.sourceDataCityX.length; i++) {
                        $scope.pie.city.push(
                            {
                                name: $scope.sourceDataCityX[i],
                                value: $scope.sourceDataCityS[i]
                            }
                        )
                    }

                }

                deferred.resolve();

            }).error(function (res) {
                console.log("加载失败");

            });
            return deferred.promise;
        },
        // 中国
        getSourceContrastForeign: function (chart_id, pid, aid, type, start_date, end_date) {
            var deferred = $q.defer();
            $http({
                method: 'get',
                url: $scope.app.apiUrl + "getPortrayalDatas?" + "chart_id=" + chart_id + "&pid=" + pid + "&aid=" + aid + "&type=" + type + "&start_date=" + start_date + "&end_date=" + end_date,
                headers: {'Authorization': "Bearer " + $scope.app.token}, withCredentials: true
            }).success(function (res) {
                // console.log(res)
                if (res.code === 2000) {
                    $scope.sourceDataForeign = res.data;
                    $scope.sourceDataForeignX = $scope.sourceDataForeign.xAxis;
                    $scope.sourceDataForeignS = $scope.sourceDataForeign.series[0].data;
                    for (var i = 0; i < $scope.sourceDataForeignX.length; i++) {
                        $scope.pie.foreign.push(
                            {
                                name: $scope.sourceDataForeignX[i],
                                value: $scope.sourceDataForeignS[i]
                            }
                        )
                    }

                }

                deferred.resolve();

            }).error(function (res) {
                console.log("加载失败");

            });
            return deferred.promise;
        },
    };
    var initChart = {
        customerFrom: function (dist, city, prov, area, id) {

            var dom = document.getElementById(id);
            var myChart = echarts.init(dom);
            /* var option = {
                 tooltip: {
                     trigger: 'item',
                     formatter: "{a} <br/>{b}：{d}%"
                 },
                 legend: {
                     orient: 'vertical',
                     show: false,
                     left: 'left',
                     data: ['体验', '娱乐']
                 },
                 series: [
                     {
                         name: '顾客来源对比',
                         type: 'pie',
                         radius: '40%',
                         center: ['20%', '22%'],
                         color: izone.color,
                         label: {
                             normal: {
                                 formatter: "{b}:{d}%",

                                 position: 'inner'


                             }
                         },
                         data: dist,

                     },
                     {
                         name: '顾客来源对比',
                         type: 'pie',
                         radius: '40%',//大小
                         center: ['46%', '22%'],//位置
                         color: izone.color,
                         label: {
                             normal: {
                                 formatter: "{b}{d}%",
                                 position: 'inner'
                             }
                         },
                         data: city,

                     },
                     {
                         name: '顾客来源对比',
                         type: 'pie',
                         radius: '40%',
                         center: ['20%', '66%'],
                         color: izone.color,
                         label: {
                             normal: {
                                 formatter: "{b}:{d}%",
                                 position: 'inner'


                             }
                         },
                         data: prov,

                     },
                     {
                         name: '顾客来源对比',
                         type: 'pie',
                         radius: '40%',
                         center: ['76%', '66%'],
                         color: izone.color,
                         label: {
                             normal: {
                                 formatter: "{b}:{d}%",
                                 position: 'inner'


                             }
                         },
                         data: area,

                     }
                 ]
             };*/

            //日期5.21   饼图换成柱形图，数据处理
            handleData(city)
            handleData(prov)
            function handleData(city) {
                var cityall = ''
                function sum(arr) {
                    var sumLen = []
                    for (var i = 0; i < arr.length; i++) {
                        sumLen.push(arr[i].value)
                    }
                    cityall = eval(sumLen.join("+"))
                };
                sumArr(city)
                function sumArr(arr) {
                    sum(city)
                    for (var i = 0; i < arr.length; i++) {
                        var value=arr[i].value / cityall * 100
                        city[i].value = value.toFixed(1)
                        city[i].name = arr[i].name+"(%)"
                    }
                }
            }

           var option = {
                /*  //标题组件
                  title: [
                      {
                      text: '在线构建',
                      subtext: '总计 ' + builderJson.all,
                      x: '25%',
                      textAlign: 'center'
                  },
                      {
                          text: '在线构建2',
                          subtext: '总计 ' + '88888',
                          y: '48%',
                          x: '25%',
                          textAlign: 'center'
                      },
                  ],
          */

                tooltip: {
                    show: true,
                    // trigger:'item',
                    alwaysShowContent: 'true',

                },
                //grid可以放置上下两个 X 轴，左右两个 Y 轴
                grid: [
                    {
                        top: 50,
                        width: '100%',
                        bottom: '55%',
                        left: 10,
                        containLabel: true
                    },
                    {
                        top: '55%',
                        width: '100%',
                        bottom: 10,
                        left: 10,
                        containLabel: true
                    }],

                //x轴
                xAxis: [

                    {
                        show: false,
                        type: 'value',
                        // max: builderJson.all,
                        splitLine: {
                            show: false

                        }
                    },
                    {
                        show: false,
                        type: 'value',
                        // max: builderJson.all,
                        gridIndex: 1,
                        splitLine: {
                            show: false
                        }
                    }
                ],
                //y轴
                yAxis: [
                    {
                        type: 'category',
                        data: city.map(function (item) {
                            return item.name

                        }),
                        // axisLabel: {
                        //     interval: 0,
                        //     rotate: 30
                        // },
                        // splitLine: {
                        //    show: false
                        // }
                    },
                    {
                        gridIndex: 1,
                        type: 'category',
                        data: prov.map(function (item) {
                            return item.name

                        }),
                        // axisLabel: {
                        //     interval: 0,
                        //     rotate: 30
                        // },
                        // splitLine: {
                        //    show: false
                        // }
                    }
                ],
                //系列列表，通过 type 决定自己的图表类型
                series: [
                    {
                        type: 'bar',
                        stack: 'chart',
                        z: 3,
                        label: {
                            normal: {
                                position: 'right',
                                show: false
                            }
                        },
                        data: city
                    },
                    {
                        type: 'bar',
                        stack: 'component',
                        xAxisIndex: 1,
                        yAxisIndex: 1,
                        z: 3,
                        label: {
                            normal: {
                                position: 'right',
                                show: false
                            }
                        },
                        data: prov
                    },
                ]
            };


            if (option && typeof option === "object") {
                myChart.setOption(option, true);
            }
            window.onresize = function () {
                myChart.resize();
            }

        },
        runmap: function (lng, lat, zoom, data, typeMap) {
            var bmaphot = new BMap.Map('hotMapID', {
                enableMapClick: false
            });

            // bmaphot.enableScrollWheelZoom(); // 启用滚轮放大缩小
            // bmaphot.centerAndZoom(new BMap.Point(lng, lat), zoom); // 初始化地图,设置中心坐标和地图级别
            bmaphot.centerAndZoom(window.sessionStorage.getItem('city'), zoom);
            var bottom_left_control = new BMap.ScaleControl({anchor: BMAP_ANCHOR_BOTTOM_RIGHT});// 左上角，添加比例尺
            var navigationControl = new BMap.NavigationControl({
                // 靠左上角位置
                anchor: BMAP_ANCHOR_TOP_RIGHT

            });

            //添加控件和比例尺
            function add_control() {
                bmaphot.addControl(bottom_left_control);
                bmaphot.addControl(navigationControl);
            }

            add_control();
            bmaphot.setMapStyle($scope.app.mapStyle);
            $scope.setMapv = function (typeMap) {
                var mapv = new Mapv({
                    drawTypeControl: true,
                    map: bmaphot  // 百度地图的map实例
                });
                if (typeMap === "mapHot") {
                    $scope.layer = new Mapv.Layer({
                        mapv: mapv, // 对应的mapv实例
                        zIndex: -99999999999, // 图层层级
                        dataType: 'point', // 数据类型，点类型
                        data: data, // 数据
                        drawType: "heatmap", // 展示形式
                        drawOptions: $scope.drawMapHot
                    });

                } else if (typeMap === "grid") {
                    $scope.layer = new Mapv.Layer({
                        mapv: mapv, // 对应的mapv实例
                        zIndex: -99999999999, // 图层层级
                        dataType: 'point', // 数据类型，点类型
                        data: data, // 数据
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
                var canvas = document.querySelectorAll('canvas');
                canvas[1].style.opacity = 0.8;


                $scope.hiedeMapHot = function () {
                    $scope.layer.canvasLayer.hide()
                };
                $scope.showMapHot = function () {
                    $scope.layer.canvasLayer.show()
                };


            };

            $scope.setMapv(typeMap);
            $scope.getCenter = function () {
                $scope.lng = bmaphot.getCenter().lng;
                $scope.lat = bmaphot.getCenter().lat;
                $scope.zoom = bmaphot.getZoom();
            };

            function getBoundary(getcity) {
                var bdary = new BMap.Boundary();
                bdary.get(getcity, function (rs) {       //获取行政区域
                    bmaphot.clearOverlays();        //清除地图覆盖物
                    var count = rs.boundaries.length; //行政区域的点有多少个
                    $scope.getCenter();


                    if (count === 0) {
                        // alert('未能获取当前输入行政区域');
                        return;
                    }
                    var pointArray = [];
                    for (var i = 0; i < count; i++) {
                        var ply = new BMap.Polygon(rs.boundaries[i], {strokeWeight: 2, strokeColor: "#e4e9e9d6"}); //建立多边形覆盖物
                        // bmaphot.addOverlay(ply);  //添加覆盖物
                        pointArray = pointArray.concat(ply.getPath());
                    }
                    bmaphot.setViewport(pointArray);    //调整视野
                });

            }

            $("#province10").change(function () {
                var province = $("#province10 option:selected").html();
                getBoundary(province);
                mainHttp.districtRanking($scope.app.exhibition.startDate, $scope.app.exhibition.endDate, $scope.selectHomeOrWork, province, "ALL", "ALL", "izone_" + window.sessionStorage.getItem("pid") + "_src", window.sessionStorage.getItem("key") + "_Area_Top");
                $scope.setmpaType();
            });
            $("#city10").change(function () {
                var province = $("#province10 option:selected").html();
                var city = $("#city10 option:selected").html();
                getBoundary(province + city);
                if (isContains(city, "市辖区")) {
                    var str = city;
                    var reg = new RegXYp("市辖区", "g");
                    city = str.replace(reg, "");
                }
                mainHttp.districtRanking($scope.app.exhibition.startDate, $scope.app.exhibition.endDate, $scope.selectHomeOrWork, province, city, "ALL", "izone_" + window.sessionStorage.getItem("pid") + "_src", window.sessionStorage.getItem("key") + "_Area_Top");
                $scope.setmpaType();
            });
            $("#district10").change(function () {
                var province = $("#province10 option:selected").html();
                var city = $("#city10 option:selected").html();
                var district = $("#district10 option:selected").html();
                getBoundary(province + city + district);
                if (isContains(city, "市辖区")) {
                    var str = city;
                    var reg = new RegXYp("市辖区", "g");
                    city = str.replace(reg, "");
                }
                mainHttp.districtRanking($scope.app.exhibition.startDate, $scope.app.exhibition.endDate, $scope.selectHomeOrWork, province, city, district, "izone_" + window.sessionStorage.getItem("pid") + "_src", window.sessionStorage.getItem("key") + "_Area_Top");
                $scope.setmpaType();
            })

        }
    };
    //初始化图表
    var lng = '121.4689000000';
    var lat = '31.2323530000';
    var zoom = 12;
    var init = function (url) {
        var startDate = $scope.app.exhibition.startDate;
        var endDate = $scope.app.exhibition.endDate;
        var idPlus = $scope.app.exhibition.pavilion_idPlus;
        $scope.pie = {
            dist: [],
            city: [],
            prov: [],
            foreign: []
        };
        mainHttp.getSourceContrastProv(audienceSource.Prov_id, $scope.pid, idPlus, $scope.selectHomeOrWork, startDate, endDate).then(function () {
            mainHttp.getSourceContrastCity(audienceSource.City_id, $scope.pid, idPlus, $scope.selectHomeOrWork, startDate, endDate).then(function () {
                mainHttp.getSourceContrastForeign(audienceSource.overseas_id, $scope.pid, idPlus, $scope.selectHomeOrWork, startDate, endDate).then(function () {
                    initChart.customerFrom($scope.pie.dist, $scope.pie.city, $scope.pie.prov, $scope.pie.foreign, "customerFromContrastID");
                });
            });
        });
        mainHttp.getHeatMap(audienceSource.chart_id, $scope.pid, idPlus, $scope.selectHomeOrWork, startDate, endDate).then(function () {

            initChart.runmap(lng, lat, zoom, $scope.HeatMapRes, "mapHot");
            $scope.loading = false;
        });
        mainHttp.districtRanking(audienceSource.community, $scope.pid, idPlus, $scope.selectHomeOrWork, startDate, endDate);
    };
    $scope.$watch('app.exhibition', function (newVal, oldVal) {
        init();
    }, true);

    $scope.OnSelectMap = function (type) {
        $scope.mpaType = type;
        $scope.getCenter();
        initChart.runmap($scope.lng, $scope.lat, $scope.zoom, $scope.HeatMapRes, type);
    };
    $scope.setmpaType = function (opacity) {
        setTimeout(function () {
            if ($scope.mpaType == undefined) {
                $scope.mpaType = "mapHot";
            }
            $scope.setMapv($scope.mpaType);

        }, 1000);

    };

}]);