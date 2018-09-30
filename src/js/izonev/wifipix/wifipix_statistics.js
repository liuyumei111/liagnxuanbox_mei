'use wifipix';
app
    .controller('wifipixStatisCorl', ['$scope', '$http', '$state', '$q', '$filter', '$stateParams', function ($scope, $http, $state, $q, $filter, $stateParams) {

        $scope.app.title.version = " - 基础版 +";
        $scope.app.title.secondary = "";
        $scope.app.title.Level3 = "客流统计 | ";
        $scope.loading = true;

        //存储获取storeId
        if ($stateParams.pixProId == undefined) {
        } else {
            window.sessionStorage.setItem('storeId', $stateParams.pixProId);
        }
        var storeId = window.sessionStorage.getItem('storeId');
        //接口汇总
        var mainHttp = {
            storeAjax: function (nowtime, sign, orderId) {
                $http({
                    method: 'POST',
                    url: WIFIPIX + "flowbox/open-api",
                    data: {
                        "product": "cosmo",
                        "api": "user.passenger.flow",
                        "encrypt": '{}',
                        "orderId": orderId,
                        "reqtime": nowtime,
                        "sign": sign,
                    },
                    headers: {'Authorization': 'TFhEYXRhc2VhbjpzZWFu'},
                }).success(function (data, status, headers) {
                    if (data.code == 200) {
                        $scope.isShow = true;
                        totalShopPv = data.data.totalShopPv;
                        var lastShopPv = data.data.lastShopPv;
                        var option = {
                            color: ['#23b7e5'],
                            tooltip: {
                                trigger: 'axis',
                                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                                }
                            },
                            grid: {
                                left: '3%',
                                right: '4%',
                                bottom: '3%',
                                containLabel: true
                            },
                            xAxis: [
                                {
                                    type: 'category',
                                    data: ['今日累计客流', '半小时累计客流'],
                                    axisTick: {
                                        alignWithLabel: true
                                    }
                                }
                            ],
                            yAxis: [
                                {
                                    type: 'value'
                                }
                            ],
                            series: [
                                {
                                    name: '',
                                    type: 'bar',
                                    barWidth: '40%',
                                    data: [totalShopPv, lastShopPv]
                                }
                            ]
                        };
                        myChart.setOption(option);
                    }
                }).error(function (data, status, headers) {

                });
            },
            storehoursAjax: function (storeId, accredit_start_time, accredit_end_time, nowtime, storesign, orderId) {
                $http({
                    method: 'POST',
                    url: WIFIPIX + "flowbox/open-api",
                    data: {
                        "product": "cosmo",
                        "api": "store.passenger.flow",
                        "encrypt": "{storeId:['" + storeId + "'],startTime:'" + accredit_start_time + "',endTime:'" + accredit_end_time + "',isMerge:false}",
                        "orderId": orderId,
                        "reqtime": nowtime,
                        "sign": storesign,
                    },
                    headers: {'Authorization': 'TFhEYXRhc2VhbjpzZWFu'},
                }).success(function (data, status, headers) {
                    var time = new Array();
                    var pv = new Array();
                    var pvs = new Array();
                    var timelength = new Array();
                    var defIntp = 0;
                    var defInts = 0;
                    var defIntsp = new Array();
                    var defInt = new Array();
                    if (data.code == 200) {
                        $scope.isShow = true;
                        var datalength = data.data.length;
                        for (var k = 0; k < datalength; k++) {
                            $scope.storeName = data.data[k].storeName;
                        }
                        var timesize = data.data[0].passengerFlow.length;
                        var timesizel = data.data.length;
                        var name = new Array()
                        for (var n = 0; n < timesizel; n++) {
                            name[n] = data.data[0].storeName;
                            defInts += data.data[0].passengerFlow[n].pv;
                            defIntsp[n] = defInts;
                        }

                        for (var i = 0; i < timesize; i++) {
                            time[i] = data.data[0].passengerFlow[i].time;
                            pv[i] = data.data[0].passengerFlow[i].pv;
                            defIntp += data.data[0].passengerFlow[i].pv;
                            defInt[i] = defIntp;
                            timelength[i] = data.data[0].storeName;
                        }
                        var posList = [
                            'left', 'right', 'top', 'bottom',
                            'inside',
                            'insideTop', 'insideLeft', 'insideRight', 'insideBottom',
                            'insideTopLeft', 'insideTopRight', 'insideBottomLeft', 'insideBottomRight'
                        ];

                        app.configParameters = {
                            rotate: {
                                min: -90,
                                max: 90
                            },
                            align: {
                                options: {
                                    left: 'left',
                                    center: 'center',
                                    right: 'right'
                                }
                            },
                            verticalAlign: {
                                options: {
                                    top: 'top',
                                    middle: 'middle',
                                    bottom: 'bottom'
                                }
                            },
                            position: {
                                options: echarts.util.reduce(posList, function (map, pos) {
                                    map[pos] = pos;
                                    return map;
                                }, {})
                            },
                            distance: {
                                min: 0,
                                max: 100
                            }
                        };

                        app.config = {
                            rotate: 90,
                            align: 'left',
                            verticalAlign: 'middle',
                            position: 'insideBottom',
                            distance: 15,
                            onChange: function () {
                                var labelOption = {
                                    normal: {
                                        rotate: app.config.rotate,
                                        align: app.config.align,
                                        verticalAlign: app.config.verticalAlign,
                                        position: app.config.position,
                                        distance: app.config.distance
                                    }
                                };
                                myChart.setOption({
                                    series: [{
                                        label: labelOption
                                    }, {
                                        label: labelOption
                                    }]
                                });
                            }
                        };


                        var labelOption = {
                            normal: {
                                show: true,
                                position: app.config.position,
                                distance: app.config.distance,
                                align: app.config.align,
                                verticalAlign: app.config.verticalAlign,
                                rotate: app.config.rotate,
                                formatter: '{c}  {name|{a}}',
                                fontSize: 16,
                                rich: {
                                    name: {
                                        textBorderColor: '#fff'
                                    }
                                }
                            }
                        };
                        var option = {
                            color: ['#76d2ef', '#7ed793'],
                            // title: {
                            //     text: '店铺名称:'+storeName
                            // },
                            tooltip: {
                                trigger: 'axis',
                                axisPointer: {
                                    type: 'shadow'
                                }
                            },
                            legend: {
                                data: ['今日累计客流', '半个小时累计客流']
                            },
                            toolbox: {
                                show: true,
                                orient: 'vertical',
                                left: 'right',
                                top: 'center',
                                feature: {
                                    mark: {show: true},
                                    dataView: {show: true, readOnly: false},
                                    magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                                    restore: {show: true},
                                    saveAsImage: {show: true}
                                }
                            },
                            calculable: true,
                            xAxis: [
                                {
                                    type: 'category',
                                    axisTick: {show: false},
                                    data: time
                                }
                            ],
                            yAxis: [
                                {
                                    type: 'value'
                                }
                            ],
                            series: [
                                {
                                    name: '今日累计客流',
                                    type: 'bar',
                                    barGap: 0,
                                    barWidth: '40%',
                                    // label: labelOption,
                                    data: defInt
                                },
                                {
                                    name: '半个小时累计客流',
                                    type: 'bar',
                                    barWidth: '40%',
                                    // label: labelOption,
                                    data: pv
                                }
                            ]
                        };
                        // var storeoption = {
                        //     color: ['#003366', '#006699', '#4cabce', '#e5323e'],
                        //     // title: {
                        //     //     text: '店铺名称:'+storeName
                        //     // },
                        //     tooltip: {
                        //         trigger: 'axis',
                        //         axisPointer: {
                        //             type: 'shadow'
                        //         }
                        //     },
                        //     legend: {
                        //         data: ['今日累计客流', '半个小时累计客流']
                        //     },
                        //     toolbox: {
                        //         show: true,
                        //         orient: 'vertical',
                        //         left: 'right',
                        //         top: 'center',
                        //         feature: {
                        //             mark: {show: true},
                        //             dataView: {show: true, readOnly: false},
                        //             magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                        //             restore: {show: true},
                        //             saveAsImage: {show: true}
                        //         }
                        //     },
                        //     calculable: true,
                        //     xAxis: [
                        //         {
                        //             type: 'category',
                        //             axisTick: {show: false},
                        //             data: name
                        //         }
                        //     ],
                        //     yAxis: [
                        //         {
                        //             type: 'value'
                        //         }
                        //     ],
                        //     series: [
                        //         {
                        //             name: '今日累计客流',
                        //             type: 'bar',
                        //             barGap: 0,
                        //             barWidth: '40%',
                        //             // label: labelOption,
                        //             data: defIntsp
                        //         },
                        //         {
                        //             name: '半个小时累计客流',
                        //             type: 'bar',
                        //             barWidth: '40%',
                        //             // label: labelOption,
                        //             data: pvs
                        //         }
                        //     ]
                        // };
                        var persontimeoption = {
                            color: ['#76d2ef'],
                            // title: {
                            //     text: '店铺名称:'+storeName
                            // },
                            tooltip: {
                                trigger: 'axis',
                                axisPointer: {
                                    type: 'shadow'
                                }
                            },
                            legend: {
                                data: ['人数']
                            },
                            toolbox: {
                                show: true,
                                orient: 'vertical',
                                left: 'right',
                                top: 'center',
                                feature: {
                                    mark: {show: true},
                                    dataView: {show: true, readOnly: false},
                                    magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                                    restore: {show: true},
                                    saveAsImage: {show: true}
                                }
                            },
                            calculable: true,
                            xAxis: [
                                {
                                    type: 'category',
                                    axisTick: {show: false},
                                    data: time
                                }
                            ],
                            yAxis: [
                                {
                                    type: 'value'
                                }
                            ],
                            series: [
                                {
                                    name: '人数',
                                    type: 'line',
                                    barGap: 0,
                                    // label: labelOption,
                                    data: pv
                                }/*,
                                {
                                    name: '半个小时累计客流',
                                    type: 'bar',
                                    label: labelOption,
                                    data: defInt
                                }*/
                            ]
                        };
                        persontime.setOption(option);
                        // personstore.setOption(storeoption);
                        timeperson.setOption(persontimeoption);
                    }
                }).error(function (data, status, headers) {

                });
            },
            //历史客流
            historyAjax: function (storeId, accredit_start_time, accredit_end_time, nowtime, historysign, orderId, type) {
                $http({
                    method: 'POST',
                    url: WIFIPIX + "flowbox/open-api",
                    data: {
                        "product": "cosmo",
                        "api": "historical.passenger.flow",
                        "encrypt": "{storeId:['" + storeId + "'],startTime:'" + accredit_start_time + "',endTime:'" + accredit_end_time + "',isMerge:false,type:" + type + "}",
                        "orderId": orderId,
                        "reqtime": nowtime,
                        "sign": historysign,
                    },
                    headers: {'Authorization': 'TFhEYXRhc2VhbjpzZWFu'},
                }).success(function (data, status, headers) {
                    if (data.code == 200) {
                        var passShopUvp = new Array();//过店人数passShopUv
                        var passShopPvp = new Array();//过店人次passShopPv
                        var enterShopPvp = new Array();//进店人次enterShopPv
                        var enterShopUvp = new Array();//进店人数enterShopUv
                        var pv = new Array();
                        var uv = new Array();
                        var datatime = new Array();
                        var passShopUv = 0;
                        var passShopPv = 0;
                        var enterShopPv = 0;
                        var enterShopUv = 0;
                        var newCustomer = 0;
                        var size = data.data[0].passengerFlow.length;

                        for (var i = 0; i < size; i++) {
                            $scope.newCustomerRate = data.data[0].passengerFlow[i].newCustomerRate;
                            $scope.cvr = data.data[0].passengerFlow[i].cvr;
                            passShopUvp[i] = data.data[0].passengerFlow[i].passShopUv;
                            passShopUv += passShopUvp[i];
                            passShopPvp[i] = data.data[0].passengerFlow[i].passShopPv;
                            passShopPv += passShopPvp[i];
                            enterShopPvp[i] = data.data[0].passengerFlow[i].enterShopPv;
                            enterShopPv += enterShopPvp[i];
                            enterShopUvp[i] = data.data[0].passengerFlow[i].enterShopUv;
                            enterShopUv += enterShopUvp[i];
                            pv[i] = data.data[0].passengerFlow[i].enterShopPv;//进店人次
                            uv[i] = data.data[0].passengerFlow[i].enterShopUv;//进店人数
                            datatime[i] = data.data[0].passengerFlow[i].date;
                            newCustomer += data.data[0].passengerFlow[i].newCustomer;
                        }
                        $scope.avgStay = data.data[0].avgStay;
                        var posList = [
                            'left', 'right', 'top', 'bottom',
                            'inside',
                            'insideTop', 'insideLeft', 'insideRight', 'insideBottom',
                            'insideTopLeft', 'insideTopRight', 'insideBottomLeft', 'insideBottomRight'
                        ];

                        app.configParameters = {
                            rotate: {
                                min: -90,
                                max: 90
                            },
                            align: {
                                options: {
                                    left: 'left',
                                    center: 'center',
                                    right: 'right'
                                }
                            },
                            verticalAlign: {
                                options: {
                                    top: 'top',
                                    middle: 'middle',
                                    bottom: 'bottom'
                                }
                            },
                            position: {
                                options: echarts.util.reduce(posList, function (map, pos) {
                                    map[pos] = pos;
                                    return map;
                                }, {})
                            },
                            distance: {
                                min: 0,
                                max: 100
                            }
                        };

                        app.config = {
                            rotate: 90,
                            align: 'left',
                            verticalAlign: 'middle',
                            position: 'insideBottom',
                            distance: 15,
                            onChange: function () {
                                var labelOption = {
                                    normal: {
                                        rotate: app.config.rotate,
                                        align: app.config.align,
                                        verticalAlign: app.config.verticalAlign,
                                        position: app.config.position,
                                        distance: app.config.distance
                                    }
                                };
                                myChart.setOption({
                                    series: [{
                                        label: labelOption
                                    }, {
                                        label: labelOption
                                    }]
                                });
                            }
                        };


                        var labelOption = {
                            normal: {
                                show: true,
                                position: app.config.position,
                                distance: app.config.distance,
                                align: app.config.align,
                                verticalAlign: app.config.verticalAlign,
                                rotate: app.config.rotate,
                                formatter: '{c}  {name|{a}}',
                                fontSize: 16,
                                rich: {
                                    name: {
                                        textBorderColor: '#fff'
                                    }
                                }
                            }
                        };
                        var option = {
                            color: ['#4fc5ea','#6b79c4'],
                            // title: {
                            //     text: '店铺名称:'+storeName
                            // },
                            tooltip: {
                                trigger: 'axis',
                                axisPointer: {
                                    type: 'shadow'
                                }
                            },
                            legend: {
                                data: ['人数', '人次']
                            },
                            toolbox: {
                                show: true,
                                orient: 'vertical',
                                left: 'right',
                                top: 'center',
                                feature: {
                                    mark: {show: true},
                                    dataView: {show: true, readOnly: false},
                                    magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                                    restore: {show: true},
                                    saveAsImage: {show: true}
                                }
                            },
                            calculable: true,
                            xAxis: [
                                {
                                    type: 'category',
                                    axisTick: {show: false},
                                    data: ['过店', '进店']
                                }
                            ],
                            yAxis: [
                                {
                                    type: 'value'
                                }
                            ],
                            series: [
                                {
                                    name: '人数',
                                    type: 'bar',
                                    barGap: 0,
                                    // label: labelOption,
                                    data: [passShopUv, passShopPv]
                                },
                                {
                                    name: '人次',
                                    type: 'bar',
                                    // label: labelOption,
                                    data: [enterShopUv, enterShopPv]
                                }
                            ]
                        };
                        var timeoption = {
                            color: ['#23b7e5', '#fad733'],
                            // title: {
                            //     text: '店铺名称:'+storeName
                            // },
                            tooltip: {
                                trigger: 'axis',
                                axisPointer: {
                                    type: 'shadow'
                                }
                            },
                            legend: {
                                data: ['人数', '人次']
                            },
                            toolbox: {
                                show: true,
                                orient: 'vertical',
                                left: 'right',
                                top: 'center',
                                feature: {
                                    mark: {show: true},
                                    dataView: {show: true, readOnly: false},
                                    magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                                    restore: {show: true},
                                    saveAsImage: {show: true}
                                }
                            },
                            calculable: true,
                            xAxis: [
                                {
                                    type: 'category',
                                    axisTick: {show: false},
                                    data: datatime
                                }
                            ],
                            yAxis: [
                                {
                                    type: 'value'
                                }
                            ],
                            series: [
                                {
                                    name: '人数',
                                    type: 'line',
                                    barGap: 0,
                                    // label: labelOption,
                                    data: pv
                                },
                                {
                                    name: '人次',
                                    type: 'line',
                                    // label: labelOption,
                                    data: uv
                                }
                            ]
                        };

                        var areaoption = {
                            color:['#23b7e5','#eaeeea'],
                            tooltip: {
                                trigger: 'item',
                                formatter: "{a} <br/>{b}: {c} ({d}%)"
                            },
                            legend: {
                                orient: 'vertical',
                                x: 'left',
                                data: ['新增顾客人数', '老顾客人数']
                            },
                            series: [
                                {
                                    name: '访问来源',
                                    type: 'pie',
                                    radius: ['50%', '70%'],
                                    avoidLabelOverlap: false,
                                    label: {
                                        normal: {
                                            show: false,
                                            position: 'center'
                                        },
                                        emphasis: {
                                            show: true,
                                            textStyle: {
                                                fontSize: '30',
                                                fontWeight: 'bold'
                                            }
                                        }
                                    },
                                    labelLine: {
                                        normal: {
                                            show: false
                                        }
                                    },
                                    data: [
                                        {value: newCustomer, name: '新增顾客人数'},
                                        {value: enterShopUv - newCustomer, name: '老顾客人数'},
                                    ]
                                }
                            ]
                        };
                        var storeareaoption = {
                            color:['#7266ba','#fcab4d'],
                            tooltip: {
                                trigger: 'item',
                                formatter: "{a} <br/>{b}: {c} ({d}%)"
                            },
                            legend: {
                                orient: 'vertical',
                                x: 'left',
                                data: ['进店', '过店']
                            },
                            series: [
                                {
                                    name: '访问来源',
                                    type: 'pie',
                                    radius: ['50%', '70%'],
                                    avoidLabelOverlap: false,
                                    label: {
                                        normal: {
                                            show: false,
                                            position: 'center'
                                        },
                                        emphasis: {
                                            show: true,
                                            textStyle: {
                                                fontSize: '30',
                                                fontWeight: 'bold'
                                            }
                                        }
                                    },
                                    labelLine: {
                                        normal: {
                                            show: false
                                        }
                                    },
                                    data: [
                                        {value: enterShopUv, name: '进店'},
                                        {value: passShopUv, name: '过店'},
                                    ]
                                }
                            ]
                        };


                        historyperson.setOption(option);
                        storePersonlD.setOption(timeoption);
                        areaID.setOption(areaoption);
                        storeArealD.setOption(storeareaoption);
                    }
                }).error(function (data, status, headers) {

                });
            },
            regionalAjax: function (storeId, accredit_start_time, accredit_end_time, nowtime, regionalsign, orderId, type) {
                $http({
                    method: 'POST',
                    url: WIFIPIX + "flowbox/open-api",
                    data: {
                        "product": "cosmo",
                        "api": "regional.flow.comparison",
                        "encrypt": "{storeId:['" + storeId + "'],startTime:'" + accredit_start_time + "',endTime:'" + accredit_end_time + "',isMerge:false,type:" + type + "}",
                        "orderId": orderId,
                        "reqtime": nowtime,
                        "sign": regionalsign,
                    },
                    headers: {'Authorization': 'TFhEYXRhc2VhbjpzZWFu'},
                }).success(function (data, status, headers) {
                    if (data.code == 200) {
                        var length = data.data[0].passengerFlow.length;
                        var tagName = new Array();
                        var pv = new Array();
                        for (var i = 0; i < length; i++) {
                            tagName[i] = data.data[0].passengerFlow[i].tagName;
                            pv[i] = data.data[0].passengerFlow[i].pv;
                        }
                        if (tagName == undefined || tagName == 'NaN' || tagName == '') {
                            $scope.areaShow = false;
                        } else {
                            $scope.areaShow = true;
                            var option = {
                                color: ['#3398DB'],
                                tooltip: {
                                    trigger: 'axis',
                                    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                                        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                                    }
                                },
                                grid: {
                                    left: '3%',
                                    right: '4%',
                                    bottom: '3%',
                                    containLabel: true
                                },
                                xAxis: [
                                    {
                                        type: 'category',
                                        data: tagName,
                                        axisTick: {
                                            alignWithLabel: true
                                        }
                                    }
                                ],
                                yAxis: [
                                    {
                                        type: 'value'
                                    }
                                ],
                                series: [
                                    {
                                        name: '客流',
                                        type: 'bar',
                                        barWidth: '60%',
                                        data: pv
                                    }
                                ]
                            };
                            newArealD.setOption(option)
                        }
                    }
                }).error(function (data, status, headers) {

                });
            }
        };

        //方法汇总
        var fun = {
            //传参排序
            sortPram: function (params) {
                var keys = []
                for (var param in params) {
                    keys.push(param)
                }
                keys.sort()
                var sb = ""
                for (var i in keys) {
                    var value = params[keys[i]]
                    if (value != null) {
                        sb += keys[i] + "=" + value + ","
                    }
                }
                return sb.substr(0, sb.length - 1)
            },

            //随机生成数字--流水号  orderId
            randomString: function (len) {
                len = len || 32;
                var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
                /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
                var maxPos = $chars.length;
                var pwd = '';
                for (i = 0; i < len; i++) {
                    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
                }
                return pwd;
            },
        };


        ///获取系统当前时间
        var myDate = new Date();
        var year = myDate.getFullYear(); //获取完整的年份
        var month = myDate.getMonth(); //获取当前月份
        var day = myDate.getDate(); //获取当前日
        var hours = myDate.getHours(); //获取当前小时
        var minunt = myDate.getMinutes(); //获取当前分钟数
        var sencond = myDate.getSeconds(); //获取当前秒数
        var nowdate = year + '-' + month + '-' + day + ' ' + hours + ':' + minunt + ':' + sencond;
        var nowtime = Date.parse(nowdate).toString();

        //获取昨天日期
        myDate.setTime(myDate.getTime() - 24 * 60 * 60 * 1000);
        var month1 = myDate.getMonth() + 1;
        var day1 = myDate.getDate();
        if (month1 >= 10) {
        } else {
            month1 = "0" + month1;
        }
        if (day1 >= 10) {
        } else {
            day1 = "0" + day1;
        }
        var accredit_end_time = myDate.getFullYear() + "-" + (month1) + "-" + day1;
        //分时段客流累计这个图表只能查询昨天的数据，写死
        var yesterday = myDate.getFullYear() + "-" + (month1) + "-" + day1;

        //获取一周前的日期
        var now = new Date();
        var date = new Date(now.getTime() - 7 * 24 * 3600 * 1000);
        var year1 = date.getFullYear();
        var month2 = date.getMonth() + 1;
        var day2 = date.getDate();
        if (month2 >= 10) {
        } else {
            month2 = "0" + month2;
        }
        if (day2 >= 10) {
        } else {
            day2 = "0" + day2;
        }
        var accredit_start_time = year1 + '-' + month2 + '-' + day2;

        //orderId
        var orderId = fun.randomString(32);

        //图表的年月日  type=1 天   type=2  周  type=3 月
        var type = 1;
        $scope.daytime = function () {
            type = 1;
            var historydata = {
                "product": "cosmo",
                "api": "historical.passenger.flow",
                "encrypt": "{storeId:" + storeId + ",startTime:" + accredit_start_time + ",endTime:" + accredit_end_time + ",isMerge:true,type:" + type + "}",
                "orderId": orderId,
                "reqtime": nowtime
            }
            var historysign = $.md5(fun.sortPram(historydata));
            mainHttp.historyAjax(storeId, accredit_start_time, accredit_end_time, nowtime, historysign, orderId, type);
        }
        $scope.weektime = function () {
            type = 2;
            var historydata = {
                "product": "cosmo",
                "api": "historical.passenger.flow",
                "encrypt": "{storeId:" + storeId + ",startTime:" + accredit_start_time + ",endTime:" + accredit_end_time + ",isMerge:true,type:" + type + "}",
                "orderId": orderId,
                "reqtime": nowtime
            }
            var historysign = $.md5(fun.sortPram(historydata));
            mainHttp.historyAjax(storeId, accredit_start_time, accredit_end_time, nowtime, historysign, orderId, type);
        }
        $scope.mounthtime = function () {
            type = 3;
            var historydata = {
                "product": "cosmo",
                "api": "historical.passenger.flow",
                "encrypt": "{storeId:" + storeId + ",startTime:" + accredit_start_time + ",endTime:" + accredit_end_time + ",isMerge:true,type:" + type + "}",
                "orderId": orderId,
                "reqtime": nowtime
            }
            var historysign = $.md5(fun.sortPram(historydata));
            mainHttp.historyAjax(storeId, accredit_start_time, accredit_end_time, nowtime, historysign, orderId, type);
        }
        //参数
        var historydata = {
            "product": "cosmo",
            "api": "historical.passenger.flow",
            "encrypt": "{storeId:" + storeId + ",startTime:" + accredit_start_time + ",endTime:" + accredit_end_time + ",isMerge:true,type:" + type + "}",
            "orderId": orderId,
            "reqtime": nowtime
        }
        var regionaldata = {
            "product": "cosmo",
            "api": "regional.flow.comparison",
            "encrypt": "{storeId:" + storeId + ",startTime:" + accredit_start_time + ",endTime:" + accredit_end_time + ",isMerge:true,type:" + type + "}",
            "orderId": orderId,
            "reqtime": nowtime
        }
        var data = {
            "product": "cosmo",
            "api": "user.passenger.flow",
            "encrypt": '{}',
            "orderId": orderId,
            "reqtime": nowtime
        }
        var storedata = {
            "product": "cosmo",
            "api": "store.passenger.flow",
            "encrypt": "{storeId:['" + storeId + "'],startTime:'" + accredit_start_time + "',endTime:'" + accredit_end_time + "',isMerge:true}",
            "orderId": orderId,
            "reqtime": nowtime
        }
        //md5加密
        var sign = $.md5(fun.sortPram(data));
        var storesign = $.md5(fun.sortPram(storedata));
        var historysign = $.md5(fun.sortPram(historydata));
        var regionalsign = $.md5(fun.sortPram(regionaldata));
        //接口调用
        var callInterface = function (start, end) {
            //自主选择时间、7天默认
            if (start == undefined || end == undefined) {
                mainHttp.storeAjax(nowtime, sign, orderId);
                mainHttp.storehoursAjax(storeId, yesterday, yesterday, nowtime, storesign, orderId);
                mainHttp.historyAjax(storeId, accredit_start_time, accredit_end_time, nowtime, historysign, orderId, type);
                mainHttp.regionalAjax(storeId, accredit_start_time, accredit_end_time, nowtime, regionalsign, orderId, type);
            } else {
                mainHttp.storeAjax(nowtime, sign, orderId);
                mainHttp.storehoursAjax(storeId, yesterday, yesterday, nowtime, storesign, orderId);
                mainHttp.historyAjax(storeId, start, end, nowtime, historysign, orderId, type);
                mainHttp.regionalAjax(storeId, start, end, nowtime, regionalsign, orderId, type);
            }
        };
        callInterface();

        //自主选择时间段查询
        $scope.selectionTime = function () {
            var start = $('#accredit_start_time').val().toString();
            var end = $('#accredit_end_time').val().toString();
            callInterface(start, end);
        };


        //初始化echarts图表实例
        var myChart = echarts.init(document.getElementById('passengerFlowScaleID'));
        var persontime = echarts.init(document.getElementById('audienceStatisticaTimelD'));
        // var personstore = echarts.init(document.getElementById('audienceStatisticalD'));
        var historyperson = echarts.init(document.getElementById('audienceStatisticahistorylD'));
        var timeperson = echarts.init(document.getElementById('timePersonlD'));
        var storePersonlD = echarts.init(document.getElementById('storePersonlD'));
        var newArealD = echarts.init(document.getElementById('areaPersonlD'));
        var areaID = echarts.init(document.getElementById('newArealD'));
        var storeArealD = echarts.init(document.getElementById('storeArealD'));
        var totalShopPv = '';

        //初始化开始日期
        laydate.render({
            elem: '#accredit_start_time'
        });

        //初始化结束日期
        laydate.render({
            elem: '#accredit_end_time',
            // min:new Date().format("yyyy-MM-dd"),//设置最小时间范围
            // max:new Date().format("yyyy-MM-dd")//设置最大时间范围
        });

    }]);