'use strict';
app
    .controller('cBasicPortraitCtrl', ['$scope', '$http', '$state', '$q', function ($scope, $http, $state, $q) {
        //全局
        $scope.app.title.Level3="基本画像 | ";
        $scope.app.title.version=" - 基础版";
        $scope.app.title.secondary="";
        $scope.passengerSource={
            folder:'basicPortrait',
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
        var jhttp={
            audienceFeatureFun: function (chart_id,pid,tagid,aid,start_date,end_date,top) {
                $scope.loading=true;
                var deferred = $q.defer();
                $http({
                    method: 'get',
                    // url: $scope.app.apiUrl+"getPortrayalDatas?"+"token="+$scope.app.token+"&chart_id="+chart_id+"&pid="+pid+"&tagid="+tagid+"&aid="+aid+"&start_date="+start_date+"&end_date="+end_date+"&top="+top,
                    url: $scope.app.apiUrl+"getPortrayalDatas?"+"chart_id="+chart_id+"&pid="+pid+"&tagid="+tagid+"&aid="+aid+"&start_date="+start_date+"&end_date="+end_date+"&top="+top,
                    headers: { 'Authorization': "Bearer "+$scope.app.token}, withCredentials: true
                }).success(function (res) {
                    res.data.legend=$scope.basisName;
                    $scope.audienceFeature=res.data;
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

                console.log(datas)

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
                        left:10,textStyle: $scope.textStyle
                    },
                    grid: {
                        left: '2%',
                        right: '5%',
                        bottom: '12%',
                        top:'8%',
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
                            name: '占比(%)',

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
            //性别
            jhttp.audienceFeatureFun(chart_id.basicPortrait,basePlusIds,portrait.CPL_INDM_GEND_S,aid,startDate,endDate,0).then(function (res) {
                initChart.crossBar($scope.audienceFeature,0,"genderID");
            });
            //年龄分布
            jhttp.audienceFeatureFun(chart_id.basicPortrait,basePlusIds,portrait.CPL_INDM_FOSUN_YEAR,aid,startDate,endDate,0).then(function (res) {
                initChart.crossBar($scope.audienceFeature,1,"ageID");
            });
            //婚育情况
            jhttp.audienceFeatureFun(chart_id.basicPortrait,basePlusIds,portrait.CPL_INDM_MARR_S,aid,startDate,endDate,0).then(function (res) {
                initChart.crossBar($scope.audienceFeature,2,"marriageID");
            });
            //家庭成员数量   v3  沒有
            // jhttp.audienceFeatureFun(chart_id.basicPortrait,basePlusIds,portrait.  ,aid,startDate,endDate,0).then(function (res) {
            //     initChart.crossBar($scope.audienceFeature,3,"familyNumID");
            // });
            //子女阶段
            jhttp.audienceFeatureFun(chart_id.basicPortrait,basePlusIds,portrait.CPL_HHM_CHILD_CHLI,aid,startDate,endDate,0).then(function (res) {
                initChart.crossBar($scope.audienceFeature,5,"childrenStageID");
            });
            //职业类型
            jhttp.audienceFeatureFun(chart_id.basicPortrait,basePlusIds,portrait.SOM_OCM_CAREER,aid,startDate,endDate,0).then(function (res) {
                initChart.crossBar($scope.audienceFeature,1,"professionalTypesID");
            });
            //文化水平
            jhttp.audienceFeatureFun(chart_id.basicPortrait,basePlusIds,portrait.CPL_INDM_EDU,aid,startDate,endDate,0).then(function (res) {
                initChart.crossBar($scope.audienceFeature,4,"culturalLevelID");
            });
        };
        $scope.$watch('app.basisFolder', function(newVal, oldVal) {
            init($scope.appid,$scope.app.basisFolder.id,$scope.app.basisFolder.startDate,$scope.app.basisFolder.endDate);
        }, true);



    }]);