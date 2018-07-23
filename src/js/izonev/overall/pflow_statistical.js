'use strict';
app.controller('ostatisticalCtrl', ['$scope', '$http', '$state', '$q', '$interval', function ($scope, $http, $state, $q, $interval) {

    $scope.app.title.version=" - 基础版 +";
    $scope.app.title.secondary="";
    $scope.app.title.Level3="客流统计 | ";
    $scope.loading=true;
    $scope.app.exhibition.id=window.sessionStorage.getItem('basePlusId');
    var projectId=window.sessionStorage.getItem("projectId");

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
    var thttp={
        serch:function () {
            var url=$scope.app.fullUrl+"/manage/findProjectAreaData?project_id="+projectId+"&type=1";
            $http({
                method: "get",
                url: url,
                headers: {
                    'Authorization': "Bearer "+$scope.app.token
                },
                withCredentials: true
            }).success(function(res){
                (res.data[0].project_province==undefined) && (res.data[0].project_province="");
                (res.data[0].project_city==undefined) && (res.data[0].project_city="");
                (res.data[0].project_county==undefined) && (res.data[0].project_county="");
                var city=res.data[0].project_city;
                sessionStorage.setItem('city',city);
                $scope.traffic=res.data[0];
                if($scope.traffic.project_url1==undefined){
                    $scope.traffic.project_url1="";
                }
            }).error(function(data){

            });
        },
        revise:function (data) {
            var formdata=new FormData();
            for(var i in data){
                formdata.append(i,data[i]);
            }
            var url=$scope.app.fullUrl+"/manage/updateProjectData";
            var postCfg = {
                headers: { 'Content-Type': undefined , 'Authorization': "Bearer "+$scope.app.token}, withCredentials: true,
                transformRequest: angular.identity
            };
            $http.post(url, formdata, postCfg).success(function(res){
                thttp.serch();
            }).error(function(data){

            });
        }
    };
    thttp.serch();
    // alert($scope.app.exhibition.dataflag)
    $scope.filechange=function (e) {
        if(e.files[0]==undefined){
            return false;
        }
        if(e.files[0].size/1024>2048){
            $scope.fileerror="最大上传图片为2M，请重新上传";
            return false;
        }
        var data={
            file:e.files[0],
            project_id:projectId,
            project_url1:$scope.traffic.project_url1,
            type:1
        };
        thttp.revise(data);
    };
    $scope.titlefalg=[false,false];
    $scope.titlechange=function (i) {
        $scope.titlefalg[i]=true;
    };
    // $scope.reply=function (i) {
    //     $scope.titlefalg[i]=false;
    // };
    $scope.fouc=function () {
        $scope.colorred=false;
    };
    $scope.save=function (i) {
        if(i==0){
            if($scope.traffic.project_name.length<4){
                $scope.colorred=true;
                return false;
            }
            var data={
                project_name:$scope.traffic.project_name,
                project_id:projectId,
                type:3
            };
            thttp.revise(data);
        }else if(i==1){
            var data={
                project_desc_client:$scope.traffic.project_desc_client,
                project_id:projectId,
                type:3
            };
            thttp.revise(data);
        }
        $scope.titlefalg[i]=false;
    };
    $scope.cancel=function (i) {
        $scope.titlefalg[i]=false;
    };


    $scope.audienceStatistical = {legend: ['到访一次','重复到访','常驻人员','总客流量']};
    $scope.PFlow1 = {legend: [ '到访一次', '重复到访', '常驻人员','总客流量']};
    $scope.PFlow2 = {legend: ['E1馆', 'E2馆', 'E3馆', 'E4馆', 'E5馆', 'E6馆', 'E7馆']};
    $scope.PFlow3 = {"xAxis": ['总客流量','到访一次', '重复到访', '常驻人员']};
    var run = function(url) {
        $scope.loading=true;
        var deferred = $q.defer();
        $http({
            method: "get",
            url: url,
           headers: { 'Authorization': "Bearer "+$scope.app.token}, withCredentials: true
        }).success(function(res){

            $scope.loading=false;
            deferred.resolve(res);
        }).error(function(data){

            $scope.loading=false;
        });
        return deferred.promise;
    };
    var mainHttp = {
        passengerFlowScaleID:function (url) {
            run(url).then(function (res) {
                $scope.PFlow3 = {
                    "xAxis": ['总客流','到访一次', '重复到访', '常驻人员'],
                    "legend": [],
                    "series": [
                        {
                            type: 'bar',
                            stack:  '总量',
                            itemStyle: {
                                normal: {
                                    barBorderColor: 'rgba(0,0,0,0)',
                                    color: 'rgba(0,0,0,0)'
                                },
                                emphasis: {
                                    barBorderColor: 'rgba(0,0,0,0)',
                                    color: 'rgba(0,0,0,0)'
                                }
                            },
                            data: []
                        },
                        {
                            type: 'bar',
                            stack: '总量',
                            label: {
                                normal: {
                                    show: true,
                                    position: 'inside',
                                    formatter: function (obj){
                                        return fcomdify(obj.value)
                                    }
                                }
                            },
                            itemStyle: {
                                normal: {color: izone.color[1]}
                            },
                            "data": []
                        }
                    ]
                };
                var allPeopleCount=0,newCount=0,oldCount=0,residentStaffCount=0;
                for (var i=0;i<res.data.length;i++) {
                    allPeopleCount = res.data[i].allPeopleCount;
                    newCount = res.data[i].newCount;
                    oldCount = res.data[i].oldCount;
                    residentStaffCount = res.data[i].residentStaffCount;
                }
                $scope.PFlow3.series[0].data=[0,0,allPeopleCount-newCount-oldCount,0];
                $scope.PFlow3.series[1].data=[allPeopleCount,newCount,oldCount,residentStaffCount];
                initChart.crossBarAndLine($scope.PFlow3.legend,$scope.PFlow3.xAxis,$scope.PFlow3.series,"passengerFlowScaleID");
            });
        },
        pavilionScalepFlowID:function (url) {
            run(url).then(function (res) {
                if(res.data!=null){
                    var xc;
                    for (var s=0;s<res.data.length;s++){
                        // if(res.data[s].date==$scope.app.exhibition.date-1){
                        if(res.data[s].tuples.length==0){
                            xc=s-1;
                        }else{
                            xc=s;
                        }
                        // }
                        if(res.data[xc]!=undefined){
                            if(res.data[xc].tuples.length!=0){
                                $scope.PFlow1 = {
                                    legend: ['到访一次', '重复到访', '常驻人员', '总客流量'],
                                    xAxis: [],
                                    series: []
                                };
                                $scope.newTimes=[];
                                $scope.oldTimes=[];
                                $scope.residentStaffTimes=[];
                                $scope.allPeopleTimes=[];
                                for(var i=0;i<res.data[xc].tuples.length;i++) {
                                    $scope.PFlow1.xAxis.push(res.data[xc].tuples[i].pavilionName);
                                    $scope.newTimes.push(res.data[xc].tuples[i].newCount);
                                    $scope.oldTimes.push(res.data[xc].tuples[i].oldCount);
                                    $scope.residentStaffTimes.push(res.data[xc].tuples[i].residentStaffCount);
                                    $scope.allPeopleTimes.push(res.data[xc].tuples[i].allPeopleCount)
                                }
                                var t_arr=[$scope.newTimes,$scope.oldTimes,$scope.residentStaffTimes,$scope.allPeopleTimes];
                                for(var j=0;j<$scope.PFlow1.legend.length;j++){
                                    $scope.PFlow1.series.push(
                                        {
                                            name: $scope.PFlow1.legend[j],
                                            type: $scope.PFlow1.legend[j]=='总客流量'?'line':'bar',
                                            itemStyle: {
                                                normal: {color: $scope.PFlow1.legend[j]=='总客流量'?izone.color[5]:izone.color[j]}
                                            },
                                            label : {
                                                normal:{
                                                    show: $scope.PFlow1.legend[j]=='总客流量'?true:null,
                                                    formatter: function (obj){
                                                        return fcomdify(obj.value)
                                                    }
                                                }
                                            },
                                            data: t_arr[j]
                                        }
                                    )
                                }
                                initChart.crossBarAndLine($scope.PFlow1.legend,$scope.PFlow1.xAxis,$scope.PFlow1.series,"pavilionScalepFlowID");
                            }
                        }


                    }

                }
            });
        }
    };
    var initChart = {
        crossBarAndLine:function (legend, x, series,id) {
            var dom = document.getElementById(id);
            var myChart = echarts.init(dom);
            var option = {
                tooltip: $scope.tooltip,
                toolbox: {
                    itemSize:17,
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
                                var series = opt.series;
                                var tdHeads = '<td  class="NoNewline">--</td>'; //表头
                                var tdBodys = ''; //数据
                                series.forEach(function (item) {
                                    if(item.name==undefined){
                                        item.name="--"
                                    }else {
                                        title.push(item.name);
                                    }

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
                            name:"liangXuan",
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
                                    if(item.name==undefined){
                                        item.name="--"
                                    }else {
                                        title.push(item.name);
                                    }
                                });
                                title.unshift("--");

                                for (var i = 0, l = exXAxis.length; i < l; i++) {
                                    var val=[];
                                    for (var j = 0; j < exSeries.length; j++) {
                                        val.push(exSeries[j].data[i])
                                    }
                                    val.unshift(exXAxis[i]);
                                    res.push(val)
                                }
                                res.unshift(title);
                                console.log(title)
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
                        name: '人数(人)',

                        axisLabel: {
                            show: true,
                            // formatter: function (obj){
                            //     var val = (obj/1*1).toFixed(0);// $scope.TOP_APP_LIST_VALUE_sum
                            //     return val;
                            // }
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
        crossLine: function (legend, x, series,id) {
            var dom = document.getElementById(id);
            var myChart = echarts.init(dom);
            var option = {
                tooltip: $scope.tooltip,
                toolbox: {
                    itemSize:17,
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
                                var series = opt.series;
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
                                    title.push(item.name);
                                });
                                title.unshift("--");
                                for (var i = 0, l = exXAxis.length; i < l; i++) {
                                    var val=[];
                                    for (var j = 0; j < exSeries.length; j++) {
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
                        name: '时间',
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
                        name: '单位:万人次',
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
                series: series
            };
            if (option && typeof option === "object") {
                myChart.setOption(option, true);
                window.onresize = myChart.resize;
            }


        },

    };
    $scope.OnSelectTime=function (x) {
        var url0=$scope.app.exhibitionDev+"&exhibitionId="+$scope.app.exhibition.id+"&startDate="+$scope.app.exhibition.startDate+"&endDate="+$scope.app.exhibition.endDate+"&index=0";
        run(url0).then(function (res){
            window.n_zong=[];
            for(var i=0;i<res.data.length;i++){
                // if(res.data[i].date==$scope.app.exhibition.date){
                window.n_zong.push(res.data[i].allPeopleCount);
                // }
            }
        });
        var url=$scope.app.exhibitionDev+"&exhibitionId="+$scope.app.exhibition.id+"&startDate="+$scope.app.exhibition.startDate+"&endDate="+$scope.app.exhibition.endDate+"&index="+x;
        if(x=='12'){
            if($scope.timeName.split(" - ")[0].split("-").join("")!=$scope.timeName.split(" - ")[1].split("-").join("")){
                run(url).then(function (res) {
                    $scope.PFlow2 = {
                        legend: ['总客流量'],
                        xAxis: [],
                        series: []
                    };
                    var xc;
                    $scope.allPeopleCount=[];
                    for (var x=0;x<res.data.length;x++){
                        // if(res.data[x].date==$scope.app.exhibition.date){
                        if(res.data[x].tuples.length==0){
                            xc=x-1;
                            // console.log(res.data[xc])
                        }else{
                            xc=x;
                        }
                        // }
                    }
                    for(var i=0;i<res.data[xc].tuples.length;i++){
                        $scope.PFlow2.xAxis.push(res.data[xc].tuples[i].hour);
                        $scope.allPeopleCount.push(res.data[xc].tuples[i].allPeopleCount);

                    }
                    for(var o=0;o<$scope.PFlow2.legend.length;o++){
                        $scope.PFlow2.series.push(
                            {
                                name: $scope.PFlow2.legend[o],
                                type: 'line',
                                itemStyle: {
                                    normal: {
                                        color: izone.color[o]
                                    }
                                },
                                label : {
                                    normal:{
                                        show: true,
                                        formatter: function (obj){
                                            return fcomdify(obj.value)
                                        }
                                    }
                                },
                                data: $scope.allPeopleCount
                            }
                        )
                    }
                    initChart.crossBarAndLine($scope.PFlow2.legend,$scope.PFlow2.xAxis,$scope.PFlow2.series,"pFlowTrendID");
                })
            }
            else{
                var url11=$scope.app.exhibitionDev+"&exhibitionId="+$scope.app.exhibition.id+"&startDate="+$scope.app.exhibition.startDate+"&endDate="+$scope.app.exhibition.endDate+"&index="+11;
                run(url11).then(function (res) {
                    $scope.PFlow2 = {
                        legend: ['总客流量'],
                        xAxis: [],
                        series: []
                    };
                    $scope.allPeopleCount=[];
                    for(var i=0;i<res.data[0].tuples.length;i++){
                        $scope.PFlow2.xAxis.push(res.data[0].tuples[i].hour);
                        $scope.allPeopleCount.push(res.data[0].tuples[i].allPeopleCount);

                    }
                    for(var o=0;o<$scope.PFlow2.legend.length;o++){
                        $scope.PFlow2.series.push(
                            {
                                name: $scope.PFlow2.legend[o],
                                type: 'line',
                                itemStyle: {
                                    normal: {
                                        color: izone.color[o]
                                    }
                                },
                                label : {
                                    normal:{
                                        show: true,
                                        formatter: function (obj){
                                            return fcomdify(obj.value)
                                        }
                                    }
                                },
                                data: $scope.allPeopleCount
                            }
                        )
                    }
                    initChart.crossBarAndLine($scope.PFlow2.legend,$scope.PFlow2.xAxis,$scope.PFlow2.series,"pFlowTrendID");
                })
            }
        }else if(x=='2'){
            run(url).then(function (res) {
                $scope.PFlow2 = {
                    legend: ['E1馆', 'E2馆', 'E3馆', 'E4馆', 'E5馆', 'E6馆', 'E7馆','W1馆','W2馆','N3馆','N4馆','N5馆','总客流量'],
                    xAxis: [],
                    series: []
                };
                $scope.e1_allPeopleTimes=[];
                $scope.e2_allPeopleTimes=[];
                $scope.e3_allPeopleTimes=[];
                $scope.e4_allPeopleTimes=[];
                $scope.e5_allPeopleTimes=[];
                $scope.e6_allPeopleTimes=[];
                $scope.e7_allPeopleTimes=[];
                $scope.e8_allPeopleTimes=[];
                $scope.e9_allPeopleTimes=[];
                $scope.e10_allPeopleTimes=[];
                $scope.e11_allPeopleTimes=[];
                $scope.e12_allPeopleTimes=[];
                $scope.PFlow2.legend=[];
                for(var k=0;k<res.data.length;k++){
                    $scope.PFlow2.xAxis.push(res.data[k].date);
                    for (var l=0;l<res.data[k].tuples.length;l++){
                        if($scope.PFlow2.legend.indexOf(res.data[k].tuples[l].pavilionName)==-1){
                            $scope.PFlow2.legend.push(res.data[k].tuples[l].pavilionName);
                        }
                        // switch (l){
                        //     case 0 : $scope.e1_allPeopleTimes.push(res.data[k].tuples[l].allPeopleTimes);
                        //         break;
                        //     case 1 : $scope.e2_allPeopleTimes.push(res.data[k].tuples[l].allPeopleTimes);
                        //         break;
                        //     case 2 : $scope.e3_allPeopleTimes.push(res.data[k].tuples[l].allPeopleTimes);
                        //         break;
                        //     case 3 : $scope.e4_allPeopleTimes.push(res.data[k].tuples[l].allPeopleTimes);
                        //         break;
                        //     case 4 : $scope.e5_allPeopleTimes.push(res.data[k].tuples[l].allPeopleTimes);
                        //         break;
                        //     case 5 : $scope.e6_allPeopleTimes.push(res.data[k].tuples[l].allPeopleTimes);
                        //         break;
                        //     case 6 : $scope.e7_allPeopleTimes.push(res.data[k].tuples[l].allPeopleTimes);
                        //         break;
                        //     case 7 : $scope.e8_allPeopleTimes.push(res.data[k].tuples[l].allPeopleTimes);
                        //         break;
                        //     case 8 : $scope.e9_allPeopleTimes.push(res.data[k].tuples[l].allPeopleTimes);
                        //         break;
                        //     case 9 : $scope.e10_allPeopleTimes.push(res.data[k].tuples[l].allPeopleTimes);
                        //         break;
                        //     case 10 : $scope.e11_allPeopleTimes.push(res.data[k].tuples[l].allPeopleTimes);
                        //         break;
                        //     case 11 : $scope.e12_allPeopleTimes.push(res.data[k].tuples[l].allPeopleTimes);
                        //         break;
                        // }
                        switch (res.data[k].tuples[l].pavilionName){
                            case $scope.PFlow2.legend[0]: $scope.e1_allPeopleTimes.push(res.data[k].tuples[l].allPeopleTimes);
                                break;
                            case $scope.PFlow2.legend[1]: $scope.e2_allPeopleTimes.push(res.data[k].tuples[l].allPeopleTimes);
                                break;
                            case $scope.PFlow2.legend[2]: $scope.e3_allPeopleTimes.push(res.data[k].tuples[l].allPeopleTimes);
                                break;
                            case $scope.PFlow2.legend[3]: $scope.e4_allPeopleTimes.push(res.data[k].tuples[l].allPeopleTimes);
                                break;
                            case $scope.PFlow2.legend[4]: $scope.e5_allPeopleTimes.push(res.data[k].tuples[l].allPeopleTimes);
                                break;
                            case $scope.PFlow2.legend[5]: $scope.e6_allPeopleTimes.push(res.data[k].tuples[l].allPeopleTimes);
                                break;
                            case $scope.PFlow2.legend[6]: $scope.e7_allPeopleTimes.push(res.data[k].tuples[l].allPeopleTimes);
                                break;
                            case $scope.PFlow2.legend[7]: $scope.e8_allPeopleTimes.push(res.data[k].tuples[l].allPeopleTimes);
                                break;
                            case $scope.PFlow2.legend[8]: $scope.e9_allPeopleTimes.push(res.data[k].tuples[l].allPeopleTimes);
                                break;
                            case $scope.PFlow2.legend[9]: $scope.e10_allPeopleTimes.push(res.data[k].tuples[l].allPeopleTimes);
                                break;
                            case $scope.PFlow2.legend[10] : $scope.e11_allPeopleTimes.push(res.data[k].tuples[l].allPeopleTimes);
                                break;
                            case $scope.PFlow2.legend[11] : $scope.e12_allPeopleTimes.push(res.data[k].tuples[l].allPeopleTimes);
                                break;

                        }
                    }
                }
                $scope.PFlow2.legend.push("总客流量");
                var t_arr2=[$scope.e1_allPeopleTimes,$scope.e2_allPeopleTimes,$scope.e3_allPeopleTimes,$scope.e4_allPeopleTimes,$scope.e5_allPeopleTimes,$scope.e6_allPeopleTimes,$scope.e7_allPeopleTimes,$scope.e8_allPeopleTimes,$scope.e9_allPeopleTimes,$scope.e10_allPeopleTimes,$scope.e11_allPeopleTimes,$scope.e12_allPeopleTimes];
                for(var o=0;o<$scope.PFlow2.legend.length;o++){
                    $scope.PFlow2.series.push(
                        {
                            name: $scope.PFlow2.legend[o],
                            type: $scope.PFlow2.legend[o]=='总客流量'?'line':'bar',
                            itemStyle: {
                                normal: {
                                    color: izone.color[o]
                                }
                            },
                            label : {
                                normal:{
                                    show: $scope.PFlow2.legend[o]=='总客流量'?true:null,
                                    formatter: function (obj){
                                        return fcomdify(obj.value)
                                    }
                                }
                            },
                            data: $scope.PFlow2.legend[o]=='总客流量'?window.n_zong:t_arr2[o]
                        }
                    )
                }
                initChart.crossBarAndLine($scope.PFlow2.legend,$scope.PFlow2.xAxis,$scope.PFlow2.series,"pFlowTrendID");
            })
        }
    };
    //初始化图表
    var init=function () {
        //展会总体客流趋势
        var url0=$scope.app.exhibitionDev+"&exhibitionId="+$scope.app.exhibition.id+"&startDate="+$scope.app.exhibition.startDate+"&endDate="+$scope.app.exhibition.endDate+"&index=0";
        run(url0).then(function (res) {
            window.n_zong=[];

            for(var i=0;i<res.data.length;i++){
                window.n_zong.push(res.data[i].allPeopleCount);
            }
            if(res.data!=null){
                $scope.audienceStatistical = {
                    legend: ['到访一次','重复到访','常驻人员','总客流量'],
                    xAxis: [],
                    series: []
                };
                $scope.newTotalTimes=[];
                $scope.oldTotalTimes=[];
                $scope.residentStaffTotalTimes=[];
                $scope.allPeopleTimes=[];
                for (var i=0;i<res.data.length;i++){
                    if($scope.timeName.split(" - ")[0].split("-").join("")!=$scope.timeName.split(" - ")[1].split("-").join("")){
                        // $scope.audienceStatistical.xAxis=['20171031','20171101','20171102','20171103'];
                        $scope.audienceStatistical.xAxis.push(res.data[i].date);
                    }else{
                        $scope.audienceStatistical.xAxis.push(res.data[i].date);
                    }
                    $scope.newTotalTimes.push(res.data[i].newCount);
                    $scope.oldTotalTimes.push(res.data[i].oldCount);
                    $scope.residentStaffTotalTimes.push(res.data[i].residentStaffCount);
                    $scope.allPeopleTimes.push(res.data[i].allPeopleCount);
                }
                var arrr=[$scope.newTotalTimes,$scope.oldTotalTimes,$scope.residentStaffTotalTimes,$scope.allPeopleTimes];
                for (var j=0;j< $scope.audienceStatistical.legend.length;j++){
                    $scope.audienceStatistical.series.push(
                        {
                            name: $scope.audienceStatistical.legend[j],
                            type: $scope.audienceStatistical.legend[j]=='总客流量'?'line':'bar',
                            // stack: '总量',
                            itemStyle: {
                                normal: {
                                    color: izone.color[j]
                                }
                            },
                            label : {
                                normal:{
                                    show: $scope.audienceStatistical.legend[j]=='总客流量'?true:null,
                                    formatter: function (obj){
                                        return fcomdify(obj.value)
                                    }
                                }
                            },
                            areaStyle: $scope.audienceStatistical.legend[j]=='总客流量'?null:{normal: {}},
                            data:arrr[j]
                        }
                    )
                }
                initChart.crossBarAndLine($scope.audienceStatistical.legend,$scope.audienceStatistical.xAxis,$scope.audienceStatistical.series,"audienceStatisticalD");


            }
            //展会客流趋势
            var url2=$scope.app.exhibitionDev+"&exhibitionId="+$scope.app.exhibition.id+"&startDate="+$scope.app.exhibition.startDate+"&endDate="+$scope.app.exhibition.endDate+"&index=2";
            run(url2).then(function (res) {
                $scope.PFlow2 = {
                    legend: ['E1馆', 'E2馆', 'E3馆', 'E4馆', 'E5馆', 'E6馆', 'E7馆','W1馆','W2馆','N3馆','N4馆','N5馆','总客流量'],
                    xAxis: [],
                    series: []
                };
                $scope.e1_allPeopleTimes=[];
                $scope.e2_allPeopleTimes=[];
                $scope.e3_allPeopleTimes=[];
                $scope.e4_allPeopleTimes=[];
                $scope.e5_allPeopleTimes=[];
                $scope.e6_allPeopleTimes=[];
                $scope.e7_allPeopleTimes=[];
                $scope.e8_allPeopleTimes=[];
                $scope.e9_allPeopleTimes=[];
                $scope.e10_allPeopleTimes=[];
                $scope.e11_allPeopleTimes=[];
                $scope.e12_allPeopleTimes=[];
                $scope.PFlow2.legend=[];
                for(var k=0;k<res.data.length;k++){
                    $scope.PFlow2.xAxis.push(res.data[k].date);
                    // console.log(res.data[k].tuples)
                    for(var l=0;l<res.data[k].tuples.length;l++){
                        if ($scope.PFlow2.legend.indexOf(res.data[k].tuples[l].pavilionName) == -1) {
                            $scope.PFlow2.legend.push(res.data[k].tuples[l].pavilionName);
                        }
                        switch (res.data[k].tuples[l].pavilionName){
                            case $scope.PFlow2.legend[0]: $scope.e1_allPeopleTimes.push(res.data[k].tuples[l].allPeopleTimes);
                                break;
                            case $scope.PFlow2.legend[1]: $scope.e2_allPeopleTimes.push(res.data[k].tuples[l].allPeopleTimes);
                                break;
                            case $scope.PFlow2.legend[2]: $scope.e3_allPeopleTimes.push(res.data[k].tuples[l].allPeopleTimes);
                                break;
                            case $scope.PFlow2.legend[3]: $scope.e4_allPeopleTimes.push(res.data[k].tuples[l].allPeopleTimes);
                                break;
                            case $scope.PFlow2.legend[4]: $scope.e5_allPeopleTimes.push(res.data[k].tuples[l].allPeopleTimes);
                                break;
                            case $scope.PFlow2.legend[5]: $scope.e6_allPeopleTimes.push(res.data[k].tuples[l].allPeopleTimes);
                                break;
                            case $scope.PFlow2.legend[6]: $scope.e7_allPeopleTimes.push(res.data[k].tuples[l].allPeopleTimes);
                                break;
                            case $scope.PFlow2.legend[7]: $scope.e8_allPeopleTimes.push(res.data[k].tuples[l].allPeopleTimes);
                                break;
                            case $scope.PFlow2.legend[8]: $scope.e9_allPeopleTimes.push(res.data[k].tuples[l].allPeopleTimes);
                                break;
                            case $scope.PFlow2.legend[9]: $scope.e10_allPeopleTimes.push(res.data[k].tuples[l].allPeopleTimes);
                                break;
                            case $scope.PFlow2.legend[10] : $scope.e11_allPeopleTimes.push(res.data[k].tuples[l].allPeopleTimes);
                                break;
                            case $scope.PFlow2.legend[11] : $scope.e12_allPeopleTimes.push(res.data[k].tuples[l].allPeopleTimes);
                                break;

                        }
                    }
                }
                $scope.PFlow2.legend.push("总客流量");
                var t_arr2=[$scope.e1_allPeopleTimes,$scope.e2_allPeopleTimes,$scope.e3_allPeopleTimes,$scope.e4_allPeopleTimes,$scope.e5_allPeopleTimes,$scope.e6_allPeopleTimes,$scope.e7_allPeopleTimes,$scope.e8_allPeopleTimes,$scope.e9_allPeopleTimes,$scope.e10_allPeopleTimes,$scope.e11_allPeopleTimes,$scope.e12_allPeopleTimes];
                for(var o=0;o<$scope.PFlow2.legend.length;o++){
                    $scope.PFlow2.series.push(
                        {
                            name: $scope.PFlow2.legend[o],
                            type: $scope.PFlow2.legend[o]=='总客流量'?'line':'bar',
                            itemStyle: {
                                normal: {
                                    color: izone.color[o]

                                }
                            },
                            label : {
                                normal:{
                                    show: $scope.PFlow2.legend[o]=='总客流量'?true:null,
                                    formatter: function (obj){
                                        return fcomdify(obj.value)
                                    }
                                }
                            },
                            data: $scope.PFlow2.legend[o]=='总客流量'?window.n_zong:t_arr2[o]
                        }
                    )
                }
                initChart.crossBarAndLine($scope.PFlow2.legend,$scope.PFlow2.xAxis,$scope.PFlow2.series,"pFlowTrendID");
            });
        });

        if($scope.timeName.split(" - ")[0].split("-").join("")!=$scope.timeName.split(" - ")[1].split("-").join("")){
            //展会总体客流规模
            var url1=$scope.app.exhibitionDev+"&exhibitionId="+$scope.app.exhibition.id+"&startDate="+$scope.app.exhibition.startDate+"&endDate="+$scope.app.exhibition.endDate+"&index=1";
            mainHttp.passengerFlowScaleID(url1);
            //各展馆客流规模
            var url3=$scope.app.exhibitionDev+"&exhibitionId="+$scope.app.exhibition.id+"&startDate="+$scope.app.exhibition.startDate+"&endDate="+$scope.app.exhibition.endDate+"&index=3";
            mainHttp.pavilionScalepFlowID(url3);
        }else{
            //展会总体客流规模
            var url0=$scope.app.exhibitionDev+"&exhibitionId="+$scope.app.exhibition.id+"&startDate="+$scope.app.exhibition.startDate+"&endDate="+$scope.app.exhibition.endDate+"&index=0";
            mainHttp.passengerFlowScaleID(url0);
            //各展馆客流规模
            var url2=$scope.app.exhibitionDev+"&exhibitionId="+$scope.app.exhibition.id+"&startDate="+$scope.app.exhibition.startDate+"&endDate="+$scope.app.exhibition.endDate+"&index=2";
            mainHttp.pavilionScalepFlowID(url2);
        }
    };
    $scope.$watch('app.exhibition', function(newVal, oldVal) {
        if($scope.app.exhibition.dataflag==true){
            init();
        }else{
            $scope.loading=false;
        }
    }, true);
}]);