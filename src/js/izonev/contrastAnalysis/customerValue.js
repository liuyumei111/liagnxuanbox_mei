'use strict';
app
    .controller('cCustomerValueCtrl', ['$scope', '$http', '$state', '$q', function ($scope, $http, $state, $q) {
        $scope.app.title.Level3="客户价值 | ";
        $scope.app.title.version=" - 基础版";
        $scope.app.title.secondary="";
        $scope.passengerSource={
            folder:'customerValue',
            file:'d'
        };
            /**
         * 定义公共样式
         * tooltip
         *
         * */
        $scope.tooltip={
            trigger: 'axis',
            axisPointer: {
                label:{
                    textStyle:{
                        color: $scope.app.chart.white
                    },
                    backgroundColor:$scope.app.chart.gray
                },
                type: 'cross',
                crossStyle: {
                    color: $scope.app.chart.fontColor
                }
            }
        };
        $scope.textStyle={
            color:$scope.app.chart.fontColor,
            fontSize: $scope.app.chart.fontSize
        };
        //http请求数据
        var jhttp= {
            customerValue: function (chart_id,pid,tagid,aid,start_date,end_date,top) {
                $scope.loading=true;
                var deferred = $q.defer();
                $http({
                    method: 'get',
                    // url: $scope.app.apiUrl+"getPortrayalDatas?"+"token="+$scope.app.token+"&chart_id="+chart_id+"&pid="+pid+"&tagid="+tagid+"&aid="+aid+"&start_date="+start_date+"&end_date="+end_date+"&top="+top,
                    url: $scope.app.apiUrl+"getPortrayalDatas?"+"chart_id="+chart_id+"&pid="+pid+"&tagid="+tagid+"&aid="+aid+"&start_date="+start_date+"&end_date="+end_date+"&top="+top,
                    headers: { 'Authorization': "Bearer "+$scope.app.token}, withCredentials: true
                }).success(function (res) {
                    res.data.legend=$scope.basisName;
                    $scope.customerValue=res.data;
                    deferred.resolve();
                    $scope.loading=false;
                }).error(function (res) {
                    console.log("加载失败");
                    $scope.loading=false;

                });
                return deferred.promise;
            },
        };
        var initChart= {
            crossBar:function (data,num,id) {
                var datas=clickhouseData(data,num);
                var x=datas[0];
                var legend=datas[1];
                var series=datas[2];
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
                                title: ['视图模式' ],
                                icon:$scope.app.icon.table,
                                iconStyle: {
                                    normal: {
                                        borderColor: $scope.app.chart.fontColor
                                    }
                                },
                                optionToContent:  function (opt) {
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
                                name:"iZone",
                                icon:$scope.app.icon.screenshots,
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
                                onclick: function (opt){
                                    var res=[];
                                    var title=[];
                                    var exSeries=opt.option.series;
                                    var exXAxis=opt.option.xAxis[0].data;
                                    exSeries.forEach(function (item) {
//                                        console.log(item.name )
                                        title.push(item.name);

                                    });
                                    title.unshift("--");
                                    for (var i = 0, l = exXAxis.length; i < l; i++) {
                                        var val=[];
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
                                    var str=JSON.stringify(res);
                                    str='{'+'"data":'+str+'}';
                                    echartsDl($scope.app.echartsDl,str)

                                }
                            }
                        },
                        bottom: 0,
                        right: 10
                    },
                    legend: {
                        type: 'scroll',
                        data:legend,
                        bottom:0,
                        left:10,
                        textStyle: $scope.textStyle
                    },
                    grid: {
                        left: '3%',
                        right: '5%',
                        bottom: '12%',
                        top:'8%',
                        containLabel: true
                    },
                    xAxis: [
                        {
                            type: 'category',
                            inverse:true,
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
                            axisLabel:{
                                show: $scope.app.chart.show
                            },
                            splitLine:{
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
                                formatter: function (obj){
                                    var val = (obj/100*100).toFixed(0);// $scope.TOP_APP_LIST_VALUE_sum
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
                            axisTick:{
                                show: $scope.app.chart.hide
                            },
                            splitLine: {
                                show:$scope.app.chart.show,
                                lineStyle: {
                                    type:$scope.app.chart.lineStyle
                                }
                            }
                        }
                    ],
                    series: series
                };
                if (option && typeof option === "object") {
                    myChart.setOption(option, true);
                }
                window.onresize = function(){
                    myChart.resize();
                }

            }
        };


        var init=function (basePlusIds,aid,startDate,endDate) {
            //月收入水平
            jhttp.customerValue(chart_id.basicPortrait,basePlusIds,portrait.FIM_FISM_INCL_MONTH,aid,startDate,endDate,0).then(function (res) {
                initChart.crossBar($scope.customerValue,1,"incomeLevelID");
            });
            //月消费水平
            jhttp.customerValue(chart_id.basicPortrait,basePlusIds,portrait.FIM_FISM_CONL_CIR_MONTH,aid,startDate,endDate,0).then(function (res) {
                initChart.crossBar($scope.customerValue,2,"consumptionLevelID");
            });
            //是否有房   v3 沒有
            // jhttp.customerValue(chart_id.basicPortrait,basePlusIds,portrait.  ,aid,startDate,endDate,0).then(function (res) {
            //     initChart.crossBar($scope.customerValue,3,"isHaveRoomID");
            // });
            //是否有车
            jhttp.customerValue(chart_id.basicPortrait,basePlusIds,portrait.CPL_INDM_VEIC_VEID,aid,startDate,endDate,0).then(function (res) {
                initChart.crossBar($scope.customerValue,4,"isHaveCarID");
            });
            //家庭年收入
            jhttp.customerValue(chart_id.basicPortrait,basePlusIds,portrait.FIM_FISM_INCL_YEAR,aid,startDate,endDate,0).then(function (res) {
                initChart.crossBar($scope.customerValue,5,"householdIncomeLevelID");
            });
            //企业类型    v3 沒有
            // jhttp.customerValue(chart_id.basicPortrait,basePlusIds,portrait.  ,aid,startDate,endDate,0).then(function (res) {
            //     initChart.crossBar($scope.customerValue,5,"enterpriseTypeID");
            // });
            //车辆品牌    v3 沒有
            // jhttp.customerValue(chart_id.basicPortrait,basePlusIds,portrait.  ,aid,startDate,endDate,0).then(function (res) {
            //     initChart.crossBar($scope.customerValue,5,"vehicleBrandID");
            // });
            //手机品牌
            jhttp.customerValue(chart_id.basicPortrait,basePlusIds,portrait.CPL_DVM_BRAD,aid,startDate,endDate,0).then(function (res) {
                initChart.crossBar($scope.customerValue,5,"phoneBrandID");
            });
            //手机型号
            jhttp.customerValue(chart_id.basicPortrait,basePlusIds,portrait.CID_MODEL,aid,startDate,endDate,0).then(function (res) {
                initChart.crossBar($scope.customerValue,5,"phoneModelsID");
            });
        };

        var watch1 = $scope.$watch('app.chart.fontColor',function(newValue,oldValue, scope){
            $scope.textStyle={
                color:$scope.app.chart.fontColor,
                fontSize: $scope.app.chart.fontSize
            };
        });
        $scope.$watch('app.basisFolder', function(newVal, oldVal) {
            init($scope.appid,$scope.app.basisFolder.id,$scope.app.basisFolder.startDate,$scope.app.basisFolder.endDate);
        }, true);



    }]);