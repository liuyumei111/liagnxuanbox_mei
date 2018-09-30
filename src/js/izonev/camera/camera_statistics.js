'use strict';
app.controller('ccameracCtrl', ['$scope', '$http', '$state', '$q', '$filter', function ($scope, $http, $state, $q, $filter) {
        $scope.m_project_name = window.sessionStorage.getItem('project_name');
        $scope.projectId = window.sessionStorage.getItem('projectId');

        $scope.loading = true;
        $scope.show = true;
        $scope.toShow = false;
        var myChart = echarts.init(document.getElementById('sexID'));
        var ageChart = echarts.init(document.getElementById('ageID'));
        var personChart = echarts.init(document.getElementById('personID'));
        var appId = '';
        var storeId= '';
        var type = '';
        if($scope.projectId == '245'){
            $scope.toShow = true;
        }
        var mainHttp={
            storeAjax:function(){
                console.log($scope.projectId);
                $http({
                    method: 'get',
                    url: USP_SERVER_ROOT1 + 'project/findCamera?project_id='+$scope.projectId,
                }).success(function (data, status, headers) {
                    if(data.code=='200'){

                        appId =data.list[0].appId;
                        storeId =data.list[0].storeId;
                        //获取系统当前时间
                        var myDate = new Date();
                        myDate.setDate(myDate.getDate() - 7);
                        var yearend=myDate.getFullYear();
                        var monthend=myDate.getMonth()+1;
                        var dayend=myDate.getDate();
                        var hoursend = myDate.getHours(); //获取当前小时
                        var minuntend = myDate.getMinutes(); //获取当前分钟数
                        var sencondend = myDate.getSeconds(); //获取当前秒数
                        if (monthend<10) {
                            monthend='0'+monthend;
                        };
                        if (dayend<10) {
                            dayend='0'+dayend;
                        };
                        if (hoursend<10) {
                            hoursend='0'+hoursend;
                        };
                        if (minuntend<10) {
                            minuntend='0'+minuntend;
                        };
                        if (sencondend<10) {
                            sencondend='0'+sencondend;
                        };

                        var dateTemp = yearend+'-'+monthend+'-'+dayend+' '+hoursend+':'+minuntend+':'+sencondend;
                        var date = new Date();
                        var seperator1 = "-";
                        var seperator2 = ":";
                        var month = date.getMonth() + 1;
                        var strDate = date.getDate();
                        var hours = date.getHours();
                        var minutes = date.getMinutes();
                        var seconds = date.getSeconds();
                        if (month >= 1 && month <= 9) {
                            month = "0" + month;
                        }
                        if (strDate >= 0 && strDate <= 9) {
                            strDate = "0" + strDate;
                        }
                        if (hours >= 1 && hours <= 9) {
                            hours = "0" + hours;
                        }
                        if (minutes >= 0 && minutes <= 9) {
                            minutes = "0" + minutes;
                        }
                        if (seconds >= 0 && seconds <= 9) {
                            seconds = "0" + seconds;
                        }
                        var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
                            + " " + hours + seperator2 + minutes
                            + seperator2 + seconds;
                        $scope.searchList = function () {
                            var dateTemp = $('#accredit_start_time').val().toString();
                            var currentdate = $('#accredit_end_time').val().toString();
                            if(accredit_start_time == 'NaN' || accredit_start_time == undefined || accredit_start_time == ''){
                                layer.tips('开始时间不能为空', '#accredit_start_time');
                                return false;
                            }
                            if(accredit_end_time == 'NaN' || accredit_end_time == undefined || accredit_end_time == ''){
                                layer.tips('结束时间不能为空', '#accredit_end_time');
                                return false;
                            }
                            mainHttp.listAjax(appId, storeId, dateTemp,currentdate)
                        }
                        mainHttp.listAjax(appId,storeId,dateTemp,currentdate)
                        type = '1';
                        mainHttp.personAjax(type);
                        console.info(appId,storeId);
                    }
                })
                    .error(function (data, status, headers) {
                        $scope.authError = data.message;
                        $scope.loading = false;
                    });
            },
            listAjax:function(appId, storeId, dateTemp,currentdate){
                console.info(appId, storeId, dateTemp,currentdate)
                $http({
                    method: 'get',
                    url: USP_SERVER_ROOT1 + 'carmer/passenger?appId='+appId+'&storeId='+storeId+'&start='+dateTemp+'&end='+currentdate,
                }).success(function (data, status, headers) {
                    if(data.code=="200"){
                        $scope.loading = false
                        var man = data.list.passengerFlowStatisticsDTO.man;
                        var woman = data.list.passengerFlowStatisticsDTO.woman;
                        $scope.totalNumber = data.list.passengerFlowStatisticsDTO.totalNumber;
                        var young = data.list.passengerFlowStatisticsDTO.young;
                        var youth = data.list.passengerFlowStatisticsDTO.youth;
                        var old = data.list.passengerFlowStatisticsDTO.old;
                        if(man == null || woman == null || youth == null ||youth == null || old == null){
                            layer.msg('查询无数据', {icon: 2});
                            $scope.show = false;
                        }else{
                            $scope.show = true;
                            var option = {
                                tooltip: {
                                    trigger: 'item',
                                    formatter: "{a} <br/>{b}: {c} ({d}%)"
                                },
                                legend: {
                                    orient: 'vertical',
                                    x: 'left',
                                    data:['女性占比','男性占比']
                                },
                                series: [
                                    {
                                        name:'访问来源',
                                        type:'pie',
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
                                        data:[
                                            {value:woman, name:'女性占比'},
                                            {value:man, name:'男性占比'},
                                        ]
                                    }
                                ]
                            };
                            var ageoption = {
                                tooltip: {
                                    trigger: 'item',
                                    formatter: "{a} <br/>{b}: {c} ({d}%)"
                                },
                                legend: {
                                    orient: 'vertical',
                                    x: 'left',
                                    data:['0-15岁','16-55岁','55岁以上']
                                },
                                series: [
                                    {
                                        name:'访问来源',
                                        type:'pie',
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
                                        data:[
                                            {value:young, name:'0-15岁'},
                                            {value:youth, name:'16-55岁'},
                                            {value:old, name:'55岁以上'},
                                        ]
                                    }
                                ]
                            };
                            myChart.setOption(option);
                            ageChart.setOption(ageoption);
                        }

                    }else{
                        layer.msg('查询无数据', {icon: 2});
                    }
                })
                    .error(function (data, status, headers) {
                        $scope.authError = data.message;
                        $scope.loading = false;
                    });
            },
            personAjax:function(type){
                $http({
                    method: 'get',
                    url: USP_SERVER_ROOT1 + 'camera/people?type='+type,
                }).success(function (data, status, headers) {
                    if(data.code=='200'){
                        console.info(data.list);
                        var customer = data.list[0].customer;
                        var member = data.list[0].member;
                        $scope.total = data.list[0].total;
                        var option = {
                            color: ['#3398DB'],
                            tooltip : {
                                trigger: 'axis',
                                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                                }
                            },
                            grid: {
                                left: '3%',
                                right: '4%',
                                bottom: '3%',
                                containLabel: true
                            },
                            xAxis : [
                                {
                                    type : 'category',
                                    data : ['会员', '普通顾客'],
                                    axisTick: {
                                        alignWithLabel: true
                                    }
                                }
                            ],
                            yAxis : [
                                {
                                    type : 'value'
                                }
                            ],
                            series : [
                                {
                                    name:'直接访问',
                                    type:'bar',
                                    barWidth: '60%',
                                    data:[member,customer]
                                }
                            ]
                        };
                        personChart.setOption(option);
                    }
                })
                    .error(function (data, status, headers) {
                        $scope.authError = data.message;
                        $scope.loading = false;
                    });
            }
        }



    mainHttp.storeAjax();
    $scope.daytime = function(){
        type = '1';
        mainHttp.personAjax(type);
    }
    $scope.weektime = function(){
        type = '2';
        mainHttp.personAjax(type);
    }
    $scope.mounthtime = function(){
        type='3';
        mainHttp.personAjax(type);
    }
    console.info(appId,storeId);
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