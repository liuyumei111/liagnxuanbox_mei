'use strict';
app.controller('asourceCtrl', ['$scope', '$http', '$state', '$q', '$interval', function ($scope, $http, $state, $q, $interval) {
    $scope.selectMallModel = "exhibition";
    $scope.app.title.version=" - 基础版 +";
    $scope.app.title.secondary="";
    $scope.app.title.Level3="客流来源 | ";
    $scope.RadiusValue = 10;
    $scope.maxinputValue = 20;
    $scope.opacityValue = 80;
    $scope.loading = true;


    $scope.dataToken = sessionStorage.getItem("dataToken");
    $scope.pid=window.sessionStorage.getItem("pid");
    $scope.projectId=window.sessionStorage.getItem("projectId");
    var city=window.sessionStorage.getItem("city");
    function isContains(str, substr) {
        return new RegExp(substr).test(str);
    }

    $scope.alllabel = [
        {
        "chartype": "客源分析",
        "label": [
        {
            "type": "7",
            "height": "600px",
            "class": "col-md-8",
            "id": "charID47",
            "chart_id": 47,
            "title": "客户来源展示"
        },

        {
            "type": "8",
            "height": "600px",
            "class": "col-md-4",
            "id": "charID51",
            "chart_id": 51,
            "title": "客户来源对比_POI"
        },{
            "type": "1",
            "height": "400px",
            "class": "col-md-12",
            "id": "charID48",
            "chart_id": 48,
            "title": "客户来源对比"
        },
    ]
    }
    ];
    var par = "par";
    /**
     * 定义公共样式
     * tooltip
     *
     * */
    $scope.addType = [
        {"id": 48, "name": "按省份"},
        {"id": 49, "name": "按城市"},
        {"id": 50, "name": "按区县"},
        // {"id":"consumption","name":"按常去消费地"}
    ];
    $scope.homeOrWork = [
        {"id": "home", "name": "按居住地"},
        {"id": "work", "name": "按工作地"}
        // {"id":"consumption","name":"按常去消费地"}
    ];

    $scope.homeOrWorkData="home";
    $scope.granularity=48;
    $scope.regionName="按省份";
    $scope.anatype=1;
    $scope.top=15;
    $scope.maptype="mapHot";
    $scope.loading = true;


    $scope.province="ALL";
    $scope.city="ALL";
    $scope.district="ALL";
    $scope.onselectHomeOrWork = function (id) {
        var province = $("#province10 option:selected").html();
        var city = $("#city10 option:selected").html();
        var district = $("#district10 option:selected").html();
        if (isContains(city, "市辖区")) {
            var str = city;
            var reg = new RegExp("市辖区", "g");
            city = str.replace(reg, "");
        }

        $scope.province=province;
        $scope.city=city;
        $scope.district=district;


    };


    var mainHttp = {
        getPortrayalDatas: function (pid, aid, chart_id, anatype, start_date, end_date, top, cid, ctype,type) {
            var data={
                "pid":pid,
                "aid":aid,
                "chart_id":chart_id,
                "anatype":anatype,
                "start_date":start_date,
                "end_date":end_date,
                "top":top,
                "type":type,
                [$scope.app.basisFolder.parameters]:[],
            };
            if(chart_id==53||chart_id==52){
                delete  data.type
            }

            $scope.loading = true;
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: $scope.app.devUrl + "v1/portrayal/getPortrayalData",
                data:JSON.stringify(data),
                headers: {
                    'Authorization': "Bearer "+$scope.app.token
                },
                withCredentials: true,
                transformRequest: angular.identity
            }).success(function (res) {
                $scope.cid = cid;
                $scope.chart_id = chart_id;
                $scope.ctype = ctype;
                if(res.data!==undefined){
                    res.data.legend = $scope.basisName;
                    $scope.resData = res.data;
                }else {
                    $scope.resData = res.data;
                    initializeChart();
                }

                deferred.resolve();
                $scope.loading = false;
            }).error(function (res) {
                $scope.cid = cid;
                $scope.chart_id = chart_id;
                $scope.ctype = ctype;
                $scope.resData = res.data;
                initializeChart();
                console.log("加载失败");
                $scope.loading = false;


            });
            return deferred.promise;

        },
    };

    //初始化图表
    var lng = '121.4689000000';
    var lat = '31.2323530000';
    var zoom = 12;
    var init = function (url) {
        var startDate=$scope.app.exhibition.startDate;
        var endDate=$scope.app.exhibition.endDate;


        for (var i = 0; i < $scope.alllabel.length; i++) {
            for (var j = 0; j < $scope.alllabel[i].label.length; j++) {
                var cid = $scope.alllabel[i].label[j].id;
                var ctype = $scope.alllabel[i].label[j].type;
                var chart_id = $scope.alllabel[i].label[j].chart_id;
                initHttp($scope.projectId, "ALL", chart_id,$scope.anatype, startDate, endDate,$scope.top,cid, ctype);
            }
        }

    };
    var initializeChart=function () {
        if($scope.chart_id===48||$scope.chart_id===49||$scope.chart_id===50){
            $scope.xname="占比(%)";
        }else {
            $scope.xname="人数";
        }
        showChart.chart($scope.ctype,$scope.resData, 2, $scope.cid, $scope.xname,$scope.app.devUrl);
        if($scope.ctype==="7"){
            $scope.heatMapData = $scope.resData;
            $scope.HeatMapRes = $scope.heatMapData;
            if($scope.heatMapData!==undefined){
                $scope.centerPoint = $scope.heatMapData[0];
                $scope.lng = $scope.centerPoint[0];
                $scope.lat = $scope.centerPoint[1];
            }else {
                $scope.lng=116.4136103013;
                $scope.lat=39.9110666857;
            }

            initChart_v1.runmap($scope.cid, $scope.lng, $scope.lat, zoom, $scope.HeatMapRes, $scope.maptype,city,1);
        }else if($scope.ctype==="8"){
            if($scope.resData!=null){
                var tablethg=[{bus:[]}];
                var tabledatag=[];

                tablethg[0].bus.push(
                    "比例"
                );

                for(var j=0;j<$scope.resData.xAxis.length;j++){
                    tabledatag.push(
                        {
                            name:$scope.resData.xAxis[j],
                            value:[]
                        }
                    );
                    for(var m=0;m<$scope.resData.series.length;m++){
                        tabledatag[j].value.push($scope.resData.series[m].data[j]);
                    }
                }
                $scope.TableTh = tablethg;
                $scope.TableData = tabledatag;
            }else{
                $scope.TableTh = [];
                $scope.TableData = [];
            }
        }

    };
    var initHttp=function (pid, aid, chart_id,anatype, startDate, endDate,top,cid, ctype,type) {
        mainHttp.getPortrayalDatas(pid, aid, chart_id, anatype, startDate, endDate, top, cid, ctype,type).then(function (res) {
            //cid 图表ID
            //ctype图表展示形式
            initializeChart();

        });
    };
    $scope.selectConditions=function (dataModel,label,type) {

        var startDate = $scope.app.exhibition.startDate;
        var endDate = $scope.app.exhibition.endDate;
        // var startDate = "2017-01-01";
        // var endDate = "2019-12-31";
        if(type=="2"){
            $scope.granularity=dataModel;
            for(var i=0;i<$scope.addType.length;i++){
                if($scope.granularity==$scope.addType[i].id){
                    $scope.regionName=$scope.addType[i].name;
                }
            }
            initHttp($scope.projectId,"ALL",$scope.granularity,$scope.anatype,
                startDate,endDate,$scope.top,label.id,label.type);
        }else if(type=="1"){
            $scope.homeOrWorkData=dataModel;
            var t=$scope.homeOrWorkData;
            initHttp($scope.projectId,"ALL",label.chart_id,$scope.anatype,
                startDate,endDate,$scope.top,label.id,label.type,t);

        }else if(type=="3"){
            $scope.maptype=dataModel;
            initChart_v1.runmap("charID47", $scope.lng, $scope.lat, zoom, $scope.HeatMapRes, $scope.maptype,city,1);
            // initHttp($scope.appid,$scope.app.basisFolder.id,label.chart_id,$scope.anatype,
            //     startDate,endDate,$scope.top,label.id,label.type);

        }


    };
    $scope.$watch('app.exhibition', function (newVal, oldVal) {
        // console.log($scope.app.exhibition.startDate)
        if($scope.app.exhibition.dataflag) {
            init();
        }else{
            $scope.loading=false;
        }
    }, true);


}]);