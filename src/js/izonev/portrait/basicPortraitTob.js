'use strict';
app
    .controller('basicPortraitTobCtrl', ['$scope', '$http', '$state', '$q','$stateParams', function ($scope, $http, $state, $q, $stateParams) {
        //全局
        $scope.app.title.Level3="基本画像 | ";
        $scope.app.title.version=" - ";
        $scope.app.title.secondary="";
        $scope.passengerSource={
            folder:'basicPortrait',
            file:'d'
        };
        console.log($stateParams.filename, $stateParams.project_id, $stateParams.type)
        $scope.filename=$stateParams.filename;
        $scope.project_id=$stateParams.project_id;
        $scope.type=$stateParams.type;
        if($stateParams.filename==undefined){
            $scope.filename='NA';
        }
        if($stateParams.username==undefined){
            $scope.username=window.sessionStorage.getItem('UserName');
        }
        if($stateParams.type==undefined){
            $scope.type='';
        }
        $scope.ChartJointOne="ChartJointOne";
        //目录公告部分
        $scope.basicFolder ="b/basicPortrait/";
        $scope.app.basisFolder.Folder = "portrait";
        $scope.table=[
            {app:"汽车之家",value:"54.8%",compare:"+5.1%"},
            {app:"易车网",value:"54.8%",compare:"+5.1%"},
            {app:"蔚来",value:"54.8%",compare:"+5.1%"},
            {app:"汽车报价",value:"54.8%",compare:"-5.1%"},
            {app:"优信二手车",value:"54.8%",compare:"-5.1%"},
            {app:"瓜子二手车",value:"54.8%",compare:"+5.1%"},
            {app:"爱卡汽车",value:"54.8%",compare:"+5.1%"},
            {app:"二手车之家",value:"54.8%",compare:"+5.1%"},
            {app:"汽车报价大全",value:"54.8%",compare:"+5.1%"},
        ];

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
            getBasicPortraitTob:function (filename,username,type) {
                var deferred = $q.defer();
                $http({
                    method: 'get',
                    url: $scope.app.toolUrl+"/findPortrayal?filename="+$scope.filename+"&project_id="+$scope.project_id+"&type="+$scope.type,
                   headers: { 'Authorization': "Bearer "+$scope.app.token},
                    withCredentials: true
                }).success(function (res) {
                    if(res.code==2000){
                        if(res.data!=null){
                            $scope.dataRes =res.data;
                            $scope.gender_Res = $scope.dataRes.gender;
                            $scope.age_Res = $scope.dataRes.age;
                            $scope.culturalLevel_Res = $scope.dataRes.culturalLevel;
                            $scope.professionalTypes_Res = $scope.dataRes.professionalTypes;
                            $scope.enterpriseType_Res = $scope.dataRes.age;
                            $scope.internetPurpose_Res = $scope.dataRes.interests;
                            $scope.readingPreference_Res = $scope.dataRes.readingPreference;
                            $scope.appPreferences_Res = $scope.dataRes.consumerPreferences;

                            $scope.dateTime = $scope.age_Res.dataTime;
                        }

                    }

                    deferred.resolve();
                }).error(function (res) {
                    console.log("加载失败")
                });
                return deferred.promise;

            }

        };

        var initChart= {
            crossBar:function (data,num,id) {
                var legend=[];
                var series=[];
                var x=[];
                if(data!=undefined){
                    var x=data.xAxis;

                if(data.data!=undefined){
                    for(var i=0;i<data.data.length;i++){
                        legend.push(
                            data.data[i].legend[0]

                        );
                        series.push(
                            {
                                name:data.data[i].legend[0],
                                type:'bar',
                                // barWidth:"50%",
                                itemStyle: {
                                    normal: {color: izone.color[i+num]}
                                },
                                data:data.data[i].data

                            }
                        )
                    }
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

            },
            verticalBar:function (data,num,id) {
                var legend=[];
                var series=[];
                var x=[];
                if(data!=undefined){
                    var x=data.xAxis;


                if(data.data!=undefined){
                    for(var i=0;i<data.data.length;i++){
                        legend.push(
                            data.data[i].legend[0]

                        );
                        series.push(
                            {
                                name:data.data[i].legend[0],
                                type:'bar',
                                // barWidth:"50%",
                                itemStyle: {
                                    normal: {color: izone.color[i+num]}
                                },
                                data:data.data[i].data

                            }
                        )
                    }
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
                                title: ['视图模式' ],
                                icon:$scope.app.icon.table,
                                iconStyle: {
                                    normal: {
                                        borderColor: $scope.app.chart.fontColor
                                    }
                                },
                                optionToContent:  function (opt) {
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
                                    var exXAxis=opt.option.yAxis[0].data;
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
                        left: '2%',
                        right: '10%',
                        bottom: '8%',
                        top:'4%',
                        containLabel: true
                    },
                    yAxis: [
                        {
                            type: 'category',
                            data: x,
                            inverse:true,
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
                            axisTick:{
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

            },
        };


        var init=function () {
            jhttp.getBasicPortraitTob($scope.app.basisFolder.Folder,$scope.ChartJointOne,$scope.basicFolder).then(function () {

                initChart.crossBar($scope.gender_Res,0,"genderID");
                initChart.crossBar($scope.age_Res,1,"ageID");
                initChart.crossBar($scope.culturalLevel_Res,4,"culturalLevelID");
                initChart.crossBar($scope.professionalTypes_Res,1,"professionalTypesID");
                initChart.crossBar($scope.enterpriseType_Res,5,"enterpriseTypeID");
                initChart.verticalBar($scope.internetPurpose_Res,5,"internetPurposeID");
                initChart.verticalBar($scope.readingPreference_Res,5,"readingPreferenceID");
                initChart.verticalBar($scope.appPreferences_Res,5,"appPreferencesID");


            });

        };

       $scope.$watch('app.chart.fontColor',function(newValue,oldValue, scope){


        });
        $scope.$watch('app.basisFolder', function(newVal, oldVal) {
            init();
        }, true);



    }]);