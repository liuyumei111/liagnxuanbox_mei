'use strict';
app.controller('toolAddGeographyFenceCtrl', ['$scope', '$http', '$state', '$q', '$interval', '$filter', function ($scope, $http, $state, $q, $interval, $filter) {
    $scope.app.title.Level3="添加地理围栏 | ";
    $scope.app.title.version=" - 基础版";
    $scope.app.title.secondary="";

    $scope.loading=false;

    var randomInt = function (nMin, nMax) {
        return Math.floor(Math.random() * (nMax - nMin) + nMin + 0.5);
    };

    $scope.provinceR="北京市";
    $scope.cityR="北京市市辖区";
    $scope.countyR="东城区";


    $("#distpicker1").distpicker({
        province: '---- 省 ----',
        city: '---- 市 ----',
        district: '---- 区 ----'
    });
    $('#province10').val('');
    $('#province10').change();
    $('#city10').val('');
    $('#city10').change();
    $('#district10').val('');
    $('#district10').change();


    var agodate= $filter('date')(new Date(), 'yyyy-MM-dd');
    $scope.startDate=agodate;
    $scope.endDate=agodate;

    laydate.render({
        elem: '#openingDate',
        btns: ['confirm'],
        value: agodate
    });
    laydate.render({
        elem: '#startDate',
        btns: ['confirm'],
        value: $scope.startDate,
        done:function (value) {
            $scope.startDate=value;
        }
    });
    laydate.render({
        elem: '#endDate',
        btns: ['confirm'],
        value: $scope.endDate,
        done:function (value) {
            $scope.endDate=value;
        }
    });


    //********************************************************************************************************************



    //计算多边形面积
    var getArea = function (polygon) {


        // 检查类型：既不是百度类型的范围又不是数组类型的数据，直接返回0
        if (!(polygon instanceof BMap.Polygon) && !(polygon instanceof Array)) {
            return 0;
        }

        //如果是百度类型的，得到点集合，不是的话，另说。
        var pts = new Array();
        if (polygon instanceof BMap.Polygon) {
            pts = polygon.getPath();
        }

        //判断数组的长度，如果是小于3的话，不构成面，无法计算面积
        if (pts.length < 3) {
            return 0;
        }

        var totalArea = 0;// 初始化总面积
        var LowX = 0.0;
        var LowY = 0.0;
        var MiddleX = 0.0;
        var MiddleY = 0.0;
        var HighX = 0.0;
        var HighY = 0.0;
        var AM = 0.0;
        var BM = 0.0;
        var CM = 0.0;
        var AL = 0.0;
        var BL = 0.0;
        var CL = 0.0;
        var AH = 0.0;
        var BH = 0.0;
        var CH = 0.0;
        var CoefficientL = 0.0;
        var CoefficientH = 0.0;
        var ALtangent = 0.0;
        var BLtangent = 0.0;
        var CLtangent = 0.0;
        var AHtangent = 0.0;
        var BHtangent = 0.0;
        var CHtangent = 0.0;
        var ANormalLine = 0.0;
        var BNormalLine = 0.0;
        var CNormalLine = 0.0;
        var OrientationValue = 0.0;
        var AngleCos = 0.0;
        var Sum1 = 0.0;
        var Sum2 = 0.0;
        var Count2 = 0;
        var Count1 = 0;
        var Sum = 0.0;
        var Radius = 6378137.0;// ,WGS84椭球半径
        var Count = pts.length;
        for (var i = 0; i < Count; i++) {
            if (i == 0) {
                LowX = pts[Count - 1].lng * Math.PI / 180;
                LowY = pts[Count - 1].lat * Math.PI / 180;
                MiddleX = pts[0].lng * Math.PI / 180;
                MiddleY = pts[0].lat * Math.PI / 180;
                HighX = pts[1].lng * Math.PI / 180;
                HighY = pts[1].lat * Math.PI / 180;
            } else if (i == Count - 1) {
                LowX = pts[Count - 2].lng * Math.PI / 180;
                LowY = pts[Count - 2].lat * Math.PI / 180;
                MiddleX = pts[Count - 1].lng * Math.PI / 180;
                MiddleY = pts[Count - 1].lat * Math.PI / 180;
                HighX = pts[0].lng * Math.PI / 180;
                HighY = pts[0].lat * Math.PI / 180;
            } else {
                LowX = pts[i - 1].lng * Math.PI / 180;
                LowY = pts[i - 1].lat * Math.PI / 180;
                MiddleX = pts[i].lng * Math.PI / 180;
                MiddleY = pts[i].lat * Math.PI / 180;
                HighX = pts[i + 1].lng * Math.PI / 180;
                HighY = pts[i + 1].lat * Math.PI / 180;
            }
            AM = Math.cos(MiddleY) * Math.cos(MiddleX);
            BM = Math.cos(MiddleY) * Math.sin(MiddleX);
            CM = Math.sin(MiddleY);
            AL = Math.cos(LowY) * Math.cos(LowX);
            BL = Math.cos(LowY) * Math.sin(LowX);
            CL = Math.sin(LowY);
            AH = Math.cos(HighY) * Math.cos(HighX);
            BH = Math.cos(HighY) * Math.sin(HighX);
            CH = Math.sin(HighY);
            CoefficientL = (AM * AM + BM * BM + CM * CM) / (AM * AL + BM * BL + CM * CL);
            CoefficientH = (AM * AM + BM * BM + CM * CM) / (AM * AH + BM * BH + CM * CH);
            ALtangent = CoefficientL * AL - AM;
            BLtangent = CoefficientL * BL - BM;
            CLtangent = CoefficientL * CL - CM;
            AHtangent = CoefficientH * AH - AM;
            BHtangent = CoefficientH * BH - BM;
            CHtangent = CoefficientH * CH - CM;
            AngleCos = (AHtangent * ALtangent + BHtangent * BLtangent + CHtangent * CLtangent) / (Math.sqrt(AHtangent * AHtangent + BHtangent * BHtangent + CHtangent * CHtangent) * Math.sqrt(ALtangent * ALtangent + BLtangent * BLtangent + CLtangent * CLtangent));
            AngleCos = Math.acos(AngleCos);
            ANormalLine = BHtangent * CLtangent - CHtangent * BLtangent;
            BNormalLine = 0 - (AHtangent * CLtangent - CHtangent * ALtangent);
            CNormalLine = AHtangent * BLtangent - BHtangent * ALtangent;
            if (AM != 0)
                OrientationValue = ANormalLine / AM;
            else if (BM != 0)
                OrientationValue = BNormalLine / BM;
            else
                OrientationValue = CNormalLine / CM;
            if (OrientationValue > 0) {
                Sum1 += AngleCos;
                Count1++;
            } else {
                Sum2 += AngleCos;
                Count2++;
            }
        }

        var tempSum1, tempSum2;
        tempSum1 = Sum1 + (2 * Math.PI * Count2 - Sum2);
        tempSum2 = (2 * Math.PI * Count1 - Sum1) + Sum2;
        if (Sum1 > Sum2) {
            if ((tempSum1 - (Count - 2) * Math.PI) < 1)
                Sum = tempSum1;
            else
                Sum = tempSum2;
        } else {
            if ((tempSum2 - (Count - 2) * Math.PI) < 1)
                Sum = tempSum2;
            else
                Sum = tempSum1;
        }
        totalArea = (Sum - (Count - 2) * Math.PI) * Radius * Radius;

        return totalArea; // 返回总面积
    };

    $scope.arrarrnum=0;
    $scope.mapArea=0;
    $scope.area="";
    var ply=[];
    var map = new BMap.Map('dlmap', {enableMapClick:false});
    function G(id) {
        return document.getElementById(id);
    }
    // var poi = new BMap.Point(113.93005,40.994275);
    var poi = new BMap.Point(104.059276,35.711483);
    map.centerAndZoom(poi, 5);
    map.enableScrollWheelZoom();
    //关键字查找
    var ac = new BMap.Autocomplete(
        {
            "input" : "suggestId",
            "location" : map
        }
    );
    ac.addEventListener("onhighlight", function(e) {  //鼠标放在下拉列表上的事件
        var str = "";
        var _value = e.fromitem.value;
        var value = "";
        if (e.fromitem.index > -1) {
            value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
        }
        str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;

        value = "";
        if (e.toitem.index > -1) {
            _value = e.toitem.value;
            value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
        }
        str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
        G("searchResultPanel").innerHTML = str;
    });
    var myValue;
    ac.addEventListener("onconfirm", function(e) {    //鼠标点击下拉列表后的事件
        var _value = e.item.value;
        myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
        G("searchResultPanel").innerHTML ="onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;

        setPlace();
    });
    var markers="";
    function setPlace(){
        function myFun(){
            if(markers!=""){
                map.removeOverlay(markers);
            }
            var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
            map.centerAndZoom(pp, 18);
            markers=new BMap.Marker(pp);
            map.addOverlay(markers);
        }
        var local = new BMap.LocalSearch(map, { //智能搜索
            onSearchComplete: myFun
        });
        local.search(myValue);
    };
    //比例尺
    var top_left_control = new BMap.ScaleControl({
        anchor: BMAP_ANCHOR_TOP_LEFT,
        offset: new BMap.Size(20, 420)
    });
    map.addControl(top_left_control);
    //添加平移缩放控件
    var top_left_navigation = new BMap.NavigationControl();
    map.addControl(top_left_navigation);
    //切换卫星
    var mapType = new BMap.MapTypeControl({
        // mapTypes:[BMAP_NORMAL_MAP,BMAP_SATELLITE_MAP],
        mapTypes:[BMAP_NORMAL_MAP,BMAP_SATELLITE_MAP,BMAP_HYBRID_MAP],
        anchor: BMAP_ANCHOR_TOP_RIGHT,
        offset: new BMap.Size(20, 420)
    });
    map.setCurrentCity("北京");
    map.addControl(mapType);
    setTimeout(function () {
        $(".BMap_checkbox").parent().parent().remove();
    },1);
    //修改时把图形重构
    function hDraw(aaa) {
        $scope.areala=0;
        var overlays=[];
        $scope.area2=aaa;
        $.each(aaa.split("&"), function(i, partition){
            var str = partition.split(",");
            var secRing = [];
            $.each(str, function(j, item){
                var poi = item.split("_");
                secRing.push(new BMap.Point(poi[0],poi[1]));
            });
            //创建多边形
            var secRingPolygon = new BMap.Polygon(secRing, {
                strokeColor:"#03a9f4",    //边线颜色。
                fillColor:"rgba(35,183,229,.7)",      //填充颜色。当参数为空时，圆形将没有填充效果。
                strokeWeight: 3,       //边线的宽度，以像素为单位。
                strokeOpacity: 0.8,    //边线透明度，取值范围0 - 1。
                fillOpacity: 0.6,      //填充的透明度，取值范围0 - 1。
                strokeStyle: 'solid' //边线的样式，solid或dashed。
            });
            //添加多边形到地图上
            $scope.mapArea+=parseInt(getArea(secRingPolygon));
            $scope.$apply();
            // console.log(getArea(secRingPolygon));
            map.addOverlay(secRingPolygon);
            overlays.push(secRingPolygon);
            $scope.areala=overlays.length;

            var rectangleMenu = new BMap.ContextMenu();
            rectangleMenu.addItem(new BMap.MenuItem('删除图形', function () {
                map.removeOverlay(secRingPolygon);
                // console.log(secRingPolygon.po)
                for (var i=0;i<overlays.length;i++){
                    if(overlays[i].getPath()==secRingPolygon.getPath()){
                        overlays.splice(i,1);
                        var arrarrx=[];
                        for(var i=0;i<secRingPolygon.getPath().length;i++){
                            arrarrx.push(
                                [secRingPolygon.getPath()[i].lng,
                                    secRingPolygon.getPath()[i].lat]
                            );
                        }
                        var secRingx = [];
                        if(arrarrx.length != 0){
                            var numArx=0;
                            $.each(arrarrx, function(i, partition){
                                var poix = partition;
                                secRingx.push(new BMap.Point(poix[0],poix[1]));
                                var secRingPolygonx = new BMap.Polygon(secRingx);
                                numArx=parseInt(getArea(secRingPolygonx));
                            });
                            // console.log(numArx)
                        }
                    }
                }

                // console.log(numArx)
                $scope.mapArea-=numArx;
                if($scope.areaxa!=0){
                    $scope.arrarrnum=overlays.length+$scope.areaxa;
                }else{
                    $scope.arrarrnum=overlays.length;
                }
                $scope.areala=overlays.length;
                $scope.$apply();



                var areas='';
                overlays.forEach(function (v) {
                    var arrarr=[];
                    for(var i=0;i<v.getPath().length;i++){
                        arrarr.push(
                            [v.getPath()[i].lng,
                                v.getPath()[i].lat]
                        );
                    }

                    var arrarr2=[];
                    arrarr.forEach(function (v) {
                        arrarr2.push(v.join("_"));
                    });
                    areas+=arrarr2.join(",")+"&";
                });
                if($scope.area1!=undefined){
                    $scope.area=areas+$scope.area1;
                }else{
                    $scope.area=areas;
                }
                $scope.area2=areas;

            }));

            secRingPolygon.addContextMenu(rectangleMenu);
            if(i==0){
                setTimeout(function () {
                    map.panTo(secRing[0]);
                    setTimeout(function () {
                        map.setZoom(17)
                    },500);
                },600);
            }
        });

        window.clearAllla=function () {
            for(var i = 0; i < overlays.length; i++){
                map.removeOverlay(overlays[i]);
            }
            $scope.areala=0;
            $scope.area2=undefined;
        };

    };
    //获取行政区域地块
    function getBoundary(getcity) {
        var bdary = new BMap.Boundary();
        bdary.get(getcity, function (rs) {       //获取行政区域
            if(ply.length!=0){
                for(var i in ply){
                    map.removeOverlay(ply[i]);        //清除地图覆盖物
                }
            }
            var count = rs.boundaries.length; //行政区域的点有多少个
            if (count === 0) {
                // alert('未能获取当前输入行政区域');
                var poi = new BMap.Point(113.93005,40.994275);
                map.centerAndZoom(poi, 5);
                return;
            }
            var pointArray = [];
            ply=[];
            for (var i = 0; i < count; i++) {
                var plys = new BMap.Polygon(rs.boundaries[i], {strokeWeight: 2, strokeColor: "#ff0000",fillOpacity: 0.2}); //建立多边形覆盖物
                ply.push(plys);
                map.addOverlay(plys);  //添加覆盖物
                pointArray = pointArray.concat(plys.getPath());
            }
            map.setViewport(pointArray);    //调整视野

        });
    };
    $("#province10").change(function () {
        getBoundary($("#province10 option:selected").html() + $("#city10 option:selected").html() + $("#district10 option:selected").html());
    });
    $("#city10").change(function () {
        getBoundary($("#province10 option:selected").html() + $("#city10 option:selected").html() + $("#district10 option:selected").html());
    });
    $("#district10").change(function () {
        getBoundary($("#province10 option:selected").html() + $("#city10 option:selected").html() + $("#district10 option:selected").html());
    });
    var overlays = [];
    var labels=[];
    //回调获得覆盖物信息
    $scope.areaxa=0;
    function overlaycomplete(e){
        overlays.forEach(function (v) {
            v.disableEditing();
        });
        overlays.push(e.overlay);
        var arrarr=[];
        for(var i=0;i<e.overlay.getPath().length;i++){
            arrarr.push(
                [e.overlay.getPath()[i].lng,
                    e.overlay.getPath()[i].lat]
            );
            // console.log(e.overlay.getPath()[i])
        }

        var arrarr2=[];
        arrarr.forEach(function (v) {
            arrarr2.push(v.join("_"));
        });
        $scope.area+=arrarr2.join(",")+"&";
        $scope.area1+=arrarr2.join(",")+"&";
        // console.log(e.overlay)
        $scope.areaxa=overlays.length;
        if($scope.areala!=undefined){
            $scope.arrarrnum=overlays.length+$scope.areala;
        }else{
            $scope.arrarrnum=overlays.length;
        }
        $scope.$apply();

        var secRing = [];
        if(arrarr.length != 0){
            var numAr=0;
            $.each(arrarr, function(i, partition){
                var poi = partition;
                secRing.push(new BMap.Point(poi[0],poi[1]));
                var secRingPolygon = new BMap.Polygon(secRing);
                numAr=parseInt(getArea(secRingPolygon));
                // if(e.drawingMode=="circle"){
                //     numAr=parseInt(Math.PI*Math.pow(parseInt(e.overlay.getRadius()),2));
                // }else{
                //     var poi = partition;
                //     secRing.push(new BMap.Point(poi[0],poi[1]));
                //     var secRingPolygon = new BMap.Polygon(secRing);
                //     numAr=parseInt(getArea(secRingPolygon));
                // }
            });
            // console.log(numAr)
            $scope.mapArea+=numAr;
            $scope.$apply();
        }

        switch (e.drawingMode) {
            case "polygon":
            {
                var polygon = e.overlay;
                /*-----------------多边形右键删除-------------------------*/
                var polygonMenu = new BMap.ContextMenu();
                polygonMenu.addItem(new BMap.MenuItem('删除图形', function () {
                    map.removeOverlay(polygon);
                    for (var i=0;i<overlays.length;i++){
                        if(overlays[i].getPath()==polygon.getPath()){
                            overlays.splice(i,1);
                            var arrarrx=[];
                            for(var i=0;i<polygon.getPath().length;i++){
                                arrarrx.push(
                                    [polygon.getPath()[i].lng,
                                        polygon.getPath()[i].lat]
                                );
                            }
                            var secRingx = [];
                            if(arrarrx.length != 0){
                                var numArx=0;
                                $.each(arrarrx, function(i, partition){
                                    var poix = partition;
                                    secRingx.push(new BMap.Point(poix[0],poix[1]));
                                    var secRingPolygonx = new BMap.Polygon(secRingx);
                                    numArx=parseInt(getArea(secRingPolygonx));
                                });
                                // console.log(numArx)
                            }
                        }
                    }

                    $scope.mapArea-=numArx;
                    if($scope.areala!=undefined){
                        $scope.arrarrnum=overlays.length+$scope.areala;
                    }else{
                        $scope.arrarrnum=overlays.length;
                    }
                    $scope.areaxa=overlays.length;
                    $scope.$apply();

                    var areax='';
                    overlays.forEach(function (v) {
                        var arrarr=[];
                        for(var i=0;i<v.getPath().length;i++){
                            arrarr.push(
                                [v.getPath()[i].lng,
                                    v.getPath()[i].lat]
                            );

                        }

                        var arrarr2=[];
                        arrarr.forEach(function (v) {
                            arrarr2.push(v.join("_"));
                        });
                        areax+=arrarr2.join(",")+"&";
                    });
                    if($scope.area2!=undefined){
                        $scope.area=areax+$scope.area2;
                    }else{
                        $scope.area=areax;
                    }
                    $scope.area1=areax;
                }));
                polygon.addContextMenu(polygonMenu);
            }
                break;
            case "rectangle":
            {
                var rectangle = e.overlay;
                /*-----------------矩形右键删除-------------------------*/
                var rectangleMenu = new BMap.ContextMenu();
                rectangleMenu.addItem(new BMap.MenuItem('删除图形', function () {
                    map.removeOverlay(rectangle);
                    // console.log(rectangle.po)
                    for (var i=0;i<overlays.length;i++){
                        if(overlays[i].getPath()==rectangle.getPath()){
                            overlays.splice(i,1);

                            var arrarrx=[];
                            for(var i=0;i<rectangle.getPath().length;i++){
                                arrarrx.push(
                                    [rectangle.getPath()[i].lng,
                                        rectangle.getPath()[i].lat]
                                );
                            }
                            var secRingx = [];
                            if(arrarrx.length != 0){
                                var numArx=0;
                                $.each(arrarrx, function(i, partition){
                                    var poix = partition;
                                    secRingx.push(new BMap.Point(poix[0],poix[1]));
                                    var secRingPolygonx = new BMap.Polygon(secRingx);
                                    numArx=parseInt(getArea(secRingPolygonx));
                                });
                                // console.log(numArx)
                            }
                        }
                    }

                    $scope.mapArea-=numArx;
                    if($scope.areala!=undefined){
                        $scope.arrarrnum=overlays.length+$scope.areala;
                    }else{
                        $scope.arrarrnum=overlays.length;
                    }
                    $scope.areaxa=overlays.length;
                    $scope.$apply();


                    var areax='';
                    overlays.forEach(function (v) {
                        var arrarr=[];
                        for(var i=0;i<v.getPath().length;i++){
                            arrarr.push(
                                [v.getPath()[i].lng,
                                    v.getPath()[i].lat]
                            );

                        }

                        var arrarr2=[];
                        arrarr.forEach(function (v) {
                            arrarr2.push(v.join("_"));
                        });
                        areax+=arrarr2.join(",")+"&";
                    });
                    if($scope.area2!=undefined){
                        $scope.area=areax+$scope.area2;
                    }else{
                        $scope.area=areax;
                    }
                    $scope.area1=areax;

                }));
                rectangle.addContextMenu(rectangleMenu);
            }
                break;
            case "circle":
            {
                var circle = e.overlay;

                var secRingCenter = circle.getCenter();
                var opts = {
                    position : secRingCenter,    // 指定文本标注所在的地理位置
                    offset   : new BMap.Size(0, 0)    //设置文本偏移量
                };
                var label = new BMap.Label("半径："+$filter('number')(parseInt(circle.getRadius()))+"m", opts);  // 创建文本标注对象
                label.setStyle({
                    color : "red",
                    fontSize : "12px",
                    height : "20px",
                    lineHeight : "20px",
                    fontFamily:"微软雅黑",
                    border: "none",
                    backgroundColor: "transparent"
                });
                map.addOverlay(label);
                labels.push(label);
                /*-----------------圆形右键删除-------------------------*/
                var circleMenu = new BMap.ContextMenu();
                circleMenu.addItem(new BMap.MenuItem('删除图形', function () {
                    map.removeOverlay(circle);
                    map.removeOverlay(label);

                    for (var i=0;i<overlays.length;i++){
                        if(overlays[i].getPath()==circle.getPath()){
                            overlays.splice(i,1);
                            var arrarrx=[];
                            for(var i=0;i<circle.getPath().length;i++){
                                arrarrx.push(
                                    [circle.getPath()[i].lng,
                                        circle.getPath()[i].lat]
                                );
                            }
                            var secRingx = [];
                            if(arrarrx.length != 0){
                                var numArx=0;
                                $.each(arrarrx, function(i, partition){
                                    var poix = partition;
                                    secRingx.push(new BMap.Point(poix[0],poix[1]));
                                    var secRingPolygonx = new BMap.Polygon(secRingx);
                                    numArx=parseInt(getArea(secRingPolygonx));

                                    // numArx=parseInt(Math.PI*Math.pow(parseInt(circle.getRadius()),2));
                                });
                                // console.log(numArx)
                            }
                        }
                    }

                    $scope.mapArea-=numArx;
                    if($scope.areala!=undefined){
                        $scope.arrarrnum=overlays.length+$scope.areala;
                    }else{
                        $scope.arrarrnum=overlays.length;
                    }
                    $scope.areaxa=overlays.length;
                    $scope.$apply();

                    var areax='';
                    overlays.forEach(function (v) {
                        var arrarr=[];
                        for(var i=0;i<v.getPath().length;i++){
                            arrarr.push(
                                [v.getPath()[i].lng,
                                    v.getPath()[i].lat]
                            );

                        }

                        var arrarr2=[];
                        arrarr.forEach(function (v) {
                            arrarr2.push(v.join("_"));
                        });
                        areax+=arrarr2.join(",")+"&";
                    });
                    if($scope.area2!=undefined){
                        $scope.area=areax+$scope.area2;
                    }else{
                        $scope.area=areax;
                    }
                    $scope.area1=areax;
                }));


                circleMenu.addItem(new BMap.MenuItem('开始编辑', function () {
                    for (var i=0;i<overlays.length;i++){
                        if(overlays[i].getPath()==circle.getPath()){
                            $scope.editIndex=i;
                        }
                    }
                    circle.enableEditing();
                    circle.addEventListener("lineupdate",function () {
                        map.removeOverlay(label);
                        label.point=circle.getCenter();
                        label.content="半径："+$filter('number')(parseInt(circle.getRadius()))+"m";
                        map.addOverlay(label);

                        overlays.splice($scope.editIndex,1,circle);
                        var arrarrx=[];
                        for(var i=0;i<circle.getPath().length;i++){
                            arrarrx.push(
                                [circle.getPath()[i].lng,
                                    circle.getPath()[i].lat]
                            );
                        }
                        var secRingx = [];
                        if(arrarrx.length != 0){
                            var numArx=0;
                            $.each(arrarrx, function(i, partition){
                                var poix = partition;
                                secRingx.push(new BMap.Point(poix[0],poix[1]));
                                var secRingPolygonx = new BMap.Polygon(secRingx);
                                numArx=parseInt(getArea(secRingPolygonx));

                                // numArx=parseInt(Math.PI*Math.pow(parseInt(circle.getRadius()),2));
                            });
                            // console.log(numArx)
                        }
                        $scope.mapArea+=numArx;
                        var areax='';
                        overlays.forEach(function (v) {
                            var arrarr=[];
                            for(var i=0;i<v.getPath().length;i++){
                                arrarr.push(
                                    [v.getPath()[i].lng,
                                        v.getPath()[i].lat]
                                );
                            }
                            var arrarr2=[];
                            arrarr.forEach(function (v) {
                                arrarr2.push(v.join("_"));
                            });
                            areax+=arrarr2.join(",")+"&";
                        });
                        if($scope.area2!=undefined){
                            $scope.area=areax+$scope.area2;
                        }else{
                            $scope.area=areax;
                        }
                        $scope.area1=areax;

                    });
                }));
                circleMenu.addItem(new BMap.MenuItem('取消编辑', function () {
                    circle.disableEditing();
                }));
                circle.addContextMenu(circleMenu);
            }
                break;

        }

        $scope.mapCenter=map.getCenter();
        $scope.mapZoom=map.getZoom();

        drawingManager.close();
    };

    var styleOptions = {
        strokeColor:"#03a9f4",    //边线颜色。
        fillColor:"rgba(35,183,229,.7)",      //填充颜色。当参数为空时，圆形将没有填充效果。
        strokeWeight: 3,       //边线的宽度，以像素为单位。
        strokeOpacity: 0.8,    //边线透明度，取值范围0 - 1。
        fillOpacity: 0.6,      //填充的透明度，取值范围0 - 1。
        strokeStyle: 'solid' //边线的样式，solid或dashed。
    };
    //实例化鼠标绘制工具
    var drawingManager = new BMapLib.DrawingManager(map, {
        isOpen: false, //是否开启绘制模式
        enableDrawingTool: true, //是否显示工具栏
        drawingToolOptions: {
            anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
            offset: new BMap.Size(5, 5), //偏离值
            scale: 0.8 //工具栏缩放比例
        },
        circleOptions: styleOptions, //圆的样式
        polylineOptions: styleOptions, //线的样式
        polygonOptions: styleOptions, //多边形的样式
        rectangleOptions: styleOptions //矩形的样式
    });
    //添加鼠标绘制工具监听事件，用于获取绘制结果
    drawingManager.addEventListener('overlaycomplete', overlaycomplete);
    function clearAll() {
        for(var i = 0; i < overlays.length; i++){
            map.removeOverlay(overlays[i]);
        }
        for (var j = 0; j < labels.length; j++){
            map.removeOverlay(labels[j]);
        }
        overlays.length = 0;
        $scope.areaxa = 0;
        $scope.area1=undefined;
    };




    $scope.attr="居住区";
    $scope.attrList=["居住区","商超","写字楼","公园","医院"];
    $scope.rate="每天";
    $scope.rateList=["每天","每周","每月"];

    $scope.check=[
        {id:1,con:"快递、送餐、路过"},
        {id:2,con:"该区域工作人群"},
        {id:3,con:"该区域居民"},
        {id:4,con:"出差、游购人群"}
    ];


    $scope.name="";
    $scope.province="";
    $scope.city="";
    $scope.county="";
    $scope.address="";
    $scope.remarks="";
    $scope.openingDate=agodate;
    $scope.houseType="";
    $scope.housePrice="";

    $scope.excludePeoples="";
    $scope.id=0;
    $scope.myImage='';
    $scope.myCroppedImage='';
    $scope.file="";

    $scope.state={
        "1":" 待审核",
        "2":" 审核中",
        "3":" 待执行",
        "4":" 驳回",
        "5":" 正在执行",
        "6":" 任务完成",
        "9":" 任务出错"
    };

    $scope.fileerror="";
    $scope.filechange=function (evt) {
        // console.log(evt.files[0])
        if(evt.files[0].size/1024>500){
            $scope.fileerror="最大上传图片为500kb，请重新上传";
            return false;
        }
        $scope.fileerror="";
        $scope.file=evt.files[0];
        var file=evt.files[0];
        var reader = new FileReader();
        reader.onload = function (evt) {
            $scope.$apply(function($scope){
                $scope.myImage=evt.target.result;
            });
        };
        reader.readAsDataURL(file);
    };
    $scope.ind=1;
    //http请求数据
    var jhttp = {
        create:function (data,is) {
            var url=$scope.app.toolUrl+"uploadAreaData";
            $.ajax({
                url: url,
                type: 'post',
                data:data,
                async: false,
                cache: false,
                headers: { 'Authorization': "Bearer "+$scope.app.token},
                processData: false,
                contentType: false,
                success:function (res) {
                    if(is!=0){
                        jhttp.audit($scope.id);
                        return false;
                    }
                    window.sessionStorage.removeItem("geoFence");
                    clearScope();
                    $state.go("fulls.geographyFence");
                },
                eorror:function () {
                    // alert("添加失败，请重新添加！");
                    mask("添加失败，请重新添加！");
                }
            });
        },
        audit:function (id) {
            var url=$scope.app.toolUrl+"updateTaskType?type=1&task_state=2&id="+id;
            $http({
                mothod:"get",
                url:url,
                headers: { 'Authorization': "Bearer "+$scope.app.token}, withCredentials: true
            }).success(function(res){
                window.sessionStorage.removeItem("geoFence");
                clearScope();
                $state.go("fulls.geographyFence");
            })
        }
    };


    $scope.clearAllK=function () {
        clearAll();
        if (window.clearAllla!=undefined){
            window.clearAllla();
        }
        $scope.arrarrnum=0;
        $scope.mapArea=0;
        $scope.area="";
    };

    setInterval(function () {
        if($("#city10 option:selected").html()=="---- 市 ----"||$scope.name==""||$("#province10 option:selected").html()=="---- 省 ----"||$("#district10 option:selected").html()=="---- 区 ----"||$scope.area==""||$scope.cycleDay==""){
            $scope.disab= true;
            $scope.$apply();
        }else{
            if(window.sessionStorage.getItem('UserName')!="demo"){
                if($scope.startDate.split('-').join('')<=$scope.endDate.split('-').join('')){
                    $scope.disab= false;
                    $scope.$apply();
                }else{
                    $scope.disab= true;
                    $scope.$apply();
                }
            }
        }
        // if($scope.id!=0){
        //     $(".BMapLib_Drawing ").hide();
        // }else{
        //     $(".BMapLib_Drawing ").show();
        // }
    },1);

    if(window.sessionStorage.getItem("geoFence")!=null){
        var data=JSON.parse(window.sessionStorage.getItem("geoFence"));
        revise(data);
    }else{
        addgeo();
    }
    function revise(e) {
        $scope.fileerror="";
        clearAll();
        if (window.clearAllla!=undefined){
            window.clearAllla();
        }
        $scope.id=e.id;
        $scope.myImage="https://jdi.jiguang.cn/iZone/2017/"+e.photo;
        $scope.name=e.name;
        $scope.attr=e.type;
        $scope.rate=$scope.rateList[e.cycleDay];
        $scope.address=e.address;
        $scope.remarks=e.remarks;
        $scope.houseType=e.houseType;
        $scope.housePrice=Number(e.housePrice);

        $scope.provinceR=e.province;
        $scope.cityR=e.city;
        $scope.countyR=e.county;


        for (var i = 0; i < $('#province10 option').length; i++) {
            if($('#province10 option').eq(i).val()==e.province){
                $('#province10').val(e.province);
                $('#province10').change();
            }
        }
        for (var i = 0; i < $('#city10 option').length; i++) {
            if($('#city10 option').eq(i).val()==e.city){
                $('#city10').val(e.city);
                $('#city10').change();
            }
        }
        for (var i = 0; i < $('#district10 option').length; i++) {
            if($('#district10 option').eq(i).val()==e.county){
                $('#district10').val(e.county);
                $('#district10').change();
            }
        }

        // getBoundary(e.province + e.city + e.county);
// setTimeout(function () {
//     var poii = new BMap.Point(e.area.split(",")[0].split("_")[0],e.area.split(",")[0].split("_")[1]);
//     map.centerAndZoom(poii, 16);
// },1100)

        $scope.startDate=e.startDate;
        $scope.endDate=e.endDate;
        $scope.openingDate=e.openingDate;
        setTimeout(function () {
            e.excludePeople.split(",").forEach(function (v) {
                $("input[type=checkbox]").eq(v-1).prop('checked',true);
            });
        },1);

        $scope.area=e.area;
        $scope.arrarrnum=e.area.split("&").length;
        setTimeout(function () {
            hDraw($scope.area);
            $scope.area+='&';
            $scope.arrarrnum=e.area.split("&").length;
        },700);


        $scope.file=e.photo;
        var file=$("#browse");
        file.after(file.clone().val(""));
        file.remove();

        $scope.oka=1;
    };
    function addgeo() {
        if($scope.oka==1){
            clearScope();
            $scope.oka=0;
        }else{
            var poi = new BMap.Point(104.059276,35.711483);
            map.centerAndZoom(poi, 5);
        }
    };

    $scope.create=function () {

        var data = new FormData(document.getElementById("formId"));
        if($scope.area[$scope.area.length-1]=="&"){
            $scope.area=$scope.area.substring(0,$scope.area.length-1);
        }
        data.append('area',$scope.area);
        if(window.sessionStorage.getItem('UserName')==null){
            data.append('contacter',window.localStorage.getItem('userName'));
        }else{
            data.append('contacter',window.sessionStorage.getItem('UserName'));
        }
        data.append('project_id',window.sessionStorage.getItem('projectId'));
        data.append('startDate',$scope.startDate);
        data.append('endDate',$scope.endDate);

        if($scope.id==0){
            data.append('file',$scope.file);
        }else{
            if($scope.file.size){
                data.append('file',$scope.file);
            }else{
                data.append('photo',$scope.file);
            }
        }

        data.append('id',$scope.id);
        $scope.formdata=data;

        if(window.sessionStorage.getItem("geoFence")!=null) {
            var sessiondata = JSON.parse(window.sessionStorage.getItem("geoFence"));
            var peopelarr=[];
            for(var i=0;i<$(".excludePeoples").length;i++){
                if($("input[type=checkbox]").eq(i).prop('checked')){
                    peopelarr.push($("input[type=checkbox]").eq(i).val())
                }
            }

            if ($scope.startDate != sessiondata.startDate || $scope.endDate != sessiondata.endDate || $scope.rate != $scope.rateList[sessiondata.cycleDay] || peopelarr.join(",") != (sessiondata.excludePeople=="NA"?"":sessiondata.excludePeople) || $scope.area != sessiondata.area) {
                // console.log(sessiondata)
                // console.log($scope.startDate == sessiondata.startDate)
                // console.log($scope.endDate == sessiondata.endDate)
                // console.log($scope.rate == $scope.rateList[sessiondata.cycleDay])
                // console.log($scope.area == sessiondata.area)
                // console.log(peopelarr.join(",")== (sessiondata.excludePeople=="NA"?"":sessiondata.excludePeople))
                $('#estateModal').modal('show');
                return false;
            }
        }
        $scope.loading=true;
        jhttp.create(data,0);

        $scope.loading=false;
    };
    $scope.createtrue=function () {
        $scope.loading=true;
        jhttp.create($scope.formdata,1);

        $scope.loading=false;
    };
    $scope.back=function () {
        if(window.sessionStorage.getItem("geoFence")!=null) {
            window.sessionStorage.removeItem("geoFence");
        }
        clearScope();
        $state.go("fulls.geographyFence");
    };
    function clearScope() {
        $scope.id=0;
        $scope.fileerror="";
        $scope.excludePeoples="";
        $scope.area="";
        $scope.myImage="";
        $("#im").removeAttr("src");
        $scope.name="";
        $scope.attr="居住区";
        $scope.rate="每天";
        $scope.province="";
        $scope.city="";
        $scope.county="";
        $('#province10').val('');
        $('#province10').change();
        $('#city10').val('');
        $('#city10').change();
        $('#district10').val('');
        $('#district10').change();
        $scope.address="";
        $scope.remarks="";
        $scope.openingDate="";
        $scope.houseType="";
        $scope.housePrice="";
        $scope.startDate="";
        $scope.endDate="";
        var dates = $filter('date')(new Date(), 'yyyy-MM-dd');
        // $("#startDate").val(dates);
        // $("#endDate").val(dates);
        // $("#openingDate").val(dates);
        $scope.startDate=dates;
        $scope.endDate=dates;
        $scope.openingDate=dates;
        $("input[type=checkbox]").prop('checked',false);
        $scope.file="";
        var file=$("#browse");
        file.after(file.clone().val(""));
        file.remove();
        $scope.arrarrnum=0;
        $scope.mapArea=0;
        clearAll();
        if (window.clearAllla!=undefined){
            window.clearAllla();
        }
    };



    function mask(txt) {
        $("body").append(`
            <div id="mask" style="display: none;">
            <div class="modal-backdrop fade  in" ng-class="{in: animate}" ng-style="{'z-index': 1040 + (index &amp;&amp; 1 || 0) + index*10}" modal-backdrop="" ></div>
             <div tabindex="-1" role="dialog" class="modal fade ng-isolate-scope in" ng-class="{in: animate}" ng-style="{'z-index': 1050 + index*10, display: 'block'}" ng-click="close($event)" modal-window="" size="sm" index="0" animate="animate" style="z-index: 1050; display: block;">
    <div class="modal-dialog modal-sm" ng-class="{'modal-sm': size == 'sm', 'modal-lg': size == 'lg'}" style="margin-top: 180px;"><div class="modal-content" modal-transclude="">
            <!-- ngInclude: 'tpl/modal.html' --><div ng-include="'tpl/modal.html'" class="ng-scope">
            <div class="ng-scope">
    
</div>
<div class="modal-body ng-scope m-t-lg">
    <div class="text-center">${txt}</div>
</div>
<div class="ng-scope text-center wrapper-md">     

</div>
</div>
          </div></div>
</div>
            </div>
        `);
        $("#mask").fadeIn(1000);
        setTimeout(function () {
            $("#mask").fadeOut(1000);
            setTimeout(function () {
                $("#mask").remove();
            },1000);
        },4000);

    };
}]);