'use strict';
app.controller('realtimewifiCtrl', ['$scope', '$http', '$state', '$q', '$interval', function ($scope, $http, $state, $q, $interval) {
    $scope.app.title.Level3 = "感知器监测 | ";
    $scope.app.title.version = " - 基础版";
    $scope.app.title.secondary = "";
    function G(id) {
        return document.getElementById(id);
    };
    //测试更新
    var randomInt = function (nMin, nMax) {
        return Math.floor(Math.random() * (nMax - nMin) + nMin + 0.5);
    };
    //********************************************************************************************************************


    $scope.areaStyle = [
        {
            //rgb(215, 213, 196)
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(78, 165, 146, 0.6)'
            }, {
                offset: 0.8,
                color: 'rgba(78, 165, 146, 0.6)'
            }], false),
            shadowColor: 'rgba(78, 165, 146, 0.6)',
            shadowBlur: 10
        },
        {
            //线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(207, 202, 182, 0.3)'
            }, {
                offset: 0.7,
                color: 'rgba(207, 202, 182, 0.3)'
            }], false),

            shadowColor: 'rgba(207, 202, 182, 0.3)', //阴影颜色
            shadowBlur: 10 //shadowBlur设图形阴影的模糊大小。配合shadowColor,shadowOffsetX/Y, 设置图形的阴影效果。
        }
    ];
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

    var getRealTime = function (url) {
        $scope.loading = true;
        var sequential = [];

        var deferred = $q.defer();
        $http({
            method: 'get',
            url: url,
            headers: {'Authorization': "Bearer " + $scope.app.token}, withCredentials: true
        }).success(function (res) {
            if (res !== undefined) {
                if (res.message === "查询成功！") {
                    $scope.thisDayPassengerFlow = {
                        legend: ["客流量", "昨日客流"],
                        xAxis: [],
                        series: [],
                    };
                    $scope.allDataList = res.data;
                    // 总人数
                    $scope.todayAllPeoPle = $scope.allDataList.totalPU;
                    // 实时人数
                    $scope.todayRealTimes = $scope.allDataList.realTimePU;

                    $scope.todayCountList = $scope.allDataList.today;
                    $scope.yesterdayCountList = $scope.allDataList.yesterday;
                    var todayCountListLen = $scope.todayCountList.length;
                    var yesterdayCountListLen = $scope.yesterdayCountList.length;
                    var pnum = [];
                    for (var i = 0; i < yesterdayCountListLen; i++) {
                        var stime = $scope.yesterdayCountList[i].time.substr(0, $scope.yesterdayCountList[i].time.length - 3);
                        $scope.thisDayPassengerFlow.xAxis.push(stime);

                        if ($scope.todayCountList[i] !== undefined) {
                            pnum.push($scope.todayCountList[i].realTimePU);


                        } else {
                            pnum.push(null)

                        }
                        if ($scope.yesterdayCountList !== undefined) {
                            if ($scope.yesterdayCountList[i] != undefined) {
                                var yescont = $scope.yesterdayCountList[i].realTimePU;
                                sequential.push(yescont)
                            }

                        }


                    }

                    var yAxisIndex = [0, 1];

                    //sequential
                    $scope.listRes = [pnum, sequential];
                    var col = ["rgb(78, 165, 146)", "rgb(207, 202, 182)"];
                    for (var i = 0; i < $scope.listRes.length; i++) {
                        $scope.thisDayPassengerFlow.series.push(
                            {
                                name: $scope.thisDayPassengerFlow.legend[i],
                                type: 'line',
                                smooth: true,
                                areaStyle: {
                                    normal: $scope.areaStyle[i]
                                },
                                itemStyle: {
                                    normal: {color: col[i]}
                                },
                                // itemStyle: {
                                //
                                //     // normal: {
                                //     //     color: 'rgba(77, 211, 159, 0.9)'
                                //     //
                                //     // }
                                // },
                                markPoint: {
                                    data: [
                                        {type: 'max', name: '最大值'},
                                        {type: 'min', name: '最小值'}
                                    ]
                                },
                                // },
                                // yAxisIndex: yAxisIndex[i],
                                data: $scope.listRes[i]

                            }
                        );

                    }

                } else {
                    $scope.todayAllPeoPle = 0;

                    $scope.todayRealTimes = 0;
                }

            } else {
                // initChart_dev();
            }
            $scope.loading = false;
            deferred.resolve();
        }).error(function (data) {
            $scope.loading = false;
            console.log("查询失败");
            // initChart_dev();

        });
        return deferred.promise;
    };
    $scope.app.exhibition.dataflag = false;
    $scope.app.exhibition.dataflag2 = false;
    var projectId = window.sessionStorage.getItem("projectId");

    $scope.traffic = [];

    var thttp = {
        serchT: function () {
            var url = $scope.app.devUrl + "v1/manage/findProjectAreaData?project_id=" + projectId + "&type=1";
            $http({
                method: "get",
                url: url,
                headers: {
                    'Authorization': "Bearer " + $scope.app.token
                },
                withCredentials: true
            }).success(function (res) {
                $scope.img = res.data[0].project_url2;
                if ($scope.img == undefined) {
                    $scope.img = "";
                }
            }).error(function (data) {

            });

        },
        resiveT: function (data) {
            var formdata = new FormData();
            for (var i in data) {
                formdata.append(i, data[i]);
            }
            var url = $scope.app.devUrl + "v1/manage/updateProjectData";
            var postCfg = {
                headers: {'Content-Type': undefined, 'Authorization': "Bearer " + $scope.app.token},
                withCredentials: true,
                transformRequest: angular.identity
            };
            $http.post(url, formdata, postCfg).success(function (res) {
                thttp.serchT();
            }).error(function (data) {

            });
        },
        serchArea: function () {
            var url = $scope.app.devUrl + "v1/manage/findProjectAreaData?project_id=" + projectId + "&type=2";
            $http({
                method: "get",
                url: url,
                headers: {
                    'Authorization': "Bearer " + $scope.app.token
                },
                withCredentials: true
            }).success(function (res) {

                // if (res.data.length == 0) {
                //     $scope.app.exhibition.dataflag = false;
                //     $scope.app.exhibition.dataflag2 = true;
                // } else {
                //     $scope.app.exhibition.dataflag = true;
                //     $scope.app.exhibition.dataflag2 = false;
                // }
                $scope.traffic = res.data;
                realTime();
            }).error(function (data) {
                // $scope.app.exhibition.dataflag = false;
                // $scope.app.exhibition.dataflag2 = true;
            });
        },


        searchData:function () {
            $scope.loading=true;
            var url=$scope.app.devUrl+"v1/manage/getNeedleData?pageSize="+99999+"&propertis[project_id]="+projectId+"&cpage=1";
            $http({
                method: "get",
                url: url,
                headers: {
                    'Authorization': "Bearer "+$scope.app.token
                },
                withCredentials: true
            }).success(function(res){
                if (res.code!==2000) {
                    $scope.app.exhibition.dataflag = false;
                    $scope.app.exhibition.dataflag2 = true;
                    $scope.loading=false;
                } else {
                    $scope.app.exhibition.dataflag = true;
                    $scope.app.exhibition.dataflag2 = false;
                    initChartMap();
                }


            }).error(function (res) {
                $scope.loading=false;
                $scope.app.exhibition.dataflag = false;
                $scope.app.exhibition.dataflag2 = true;
            });
        },
    };
    thttp.serchT();
    thttp.serchArea();
    thttp.searchData();

    function realTime() {
        for(var i=0;i<$scope.traffic.length;i++){
            $scope.traffic[i].realTime="";
            var url=$scope.app.devUrl+"v1/mall/getExhibition?index=23&areaId="+$scope.traffic[i].area_id;
            $.ajax({
                type: "get",
                url: url,
                async: false,
                headers: {
                    'Authorization': "Bearer " + $scope.app.token
                },
                success: function (res) {
                    $scope.traffic[i].realTime=res.data.realTimePU;
                },
                error: function () {

                }
            })
        }
    };
    $scope.filechange = function (e) {
        if (e.files[0] == undefined) {

            return false;
        }
        if (e.files[0].size / 1024 > 5120) {
            $scope.fileerror = "最大上传图片为5M，请重新上传";
            return false;
        }
        var data = {
            file: e.files[0],
            project_id: projectId,
            project_url2: $scope.img,
            type: 2
        };
        thttp.resiveT(data);
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
                                echartsDl($scope.app.devUrl, str)

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
    var initChartMap = function () {
        //热力图
        // var fullUrl2 = $scope.app.fullUrl + '/region/getPeopleCount?area_id=' + 301;
        var fullUrl2 = $scope.app.devUrl+'v1/mall/getExhibition?index=23&areaId=' + window.sessionStorage.getItem("basePlusId");
        getRealTime(fullUrl2).then(function () {
            initChart.PassengerFlowSum("实时客流量", $scope.todayRealTimes, 40000, "realTimePassengerFlowID");
            initChart.PassengerFlowSum("今日累计参展客流量", $scope.todayAllPeoPle, 300000, "DPassengerFlowSumID");
            initChart.theDayPassengerFlow($scope.thisDayPassengerFlow.legend, $scope.thisDayPassengerFlow.xAxis, $scope.thisDayPassengerFlow.series);
        })

    };




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
    var timer=$interval(function () {
        initChartMap();
        $scope.$apply(function () {
            realTime();
        });
    }, 1000 * 60 *5);

    updateClock();

    $scope.$on('$destroy',function(){
        if (timer) {
            $interval.cancel(timer);
        }
    });

}]);