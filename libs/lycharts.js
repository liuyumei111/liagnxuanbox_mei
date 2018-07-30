
function nofind(img,imgName){
    if(imgName===undefined){
        imgName= "ditu1.png";
    }
    img.src="https://izone.jiguang.cn/img/izone/bsis/"+imgName;
    img.onerror=null; //如果错误图片也不存在就会死循环一直跳，所以要设置成null，也可以不加
}
function modifyJosnKey(json,oddkey,newkey){
    for(var i=0;i<json.length;i++){
        var val=json[i][oddkey];
        delete json[i][oddkey];
        json[i][newkey]=val;
    }
    return json
}
function jsonSum(array,key){
    var sum = 0;
    for (var i = 0; i < array.length; i++){
        var tem=array[i][key]/1;
        sum += tem;
    }
    return sum.toFixed(3);
}

var chartapp = {
    chart: {
        date:new Date().format("yyyy-MM-dd HH:mm:ss"),
        color: ["#6e67fa", "#67c9fa", "#58c0a1", "#96e8d7", "#eccb44", "#fefa53"],
        lineColor: "#6a6b6b",
        fontColor: "#434444",
        show: true,
        hide: false,
        fontSize: 12,
        lineStyle: "dashed",
        lineStyle2: "solid",
        white: "#fff",
        gray: "#686762",
        borderColor: "#303333",
        icon: {
            screenshots: 'path://M858.157881 862.823134 166.296467 862.823134c-19.764136 0-35.786041-16.020882-35.786041-35.785018L130.510426 349.891925c0-19.764136 16.021905-35.787064 35.786041-35.787064l152.83999 0 57.308217-57.307194c6.534833-8.614192 16.779152-14.264888 28.424376-14.264888L619.585297 242.532779c10.050913 0 19.10308 4.172019 25.604144 10.844999l0.031722-0.031722 60.758806 60.757782 152.177911 0c19.764136 0 35.786041 16.022928 35.786041 35.787064l0 477.146191C893.943922 846.802252 877.922017 862.823134 858.157881 862.823134zM512.227174 361.820606c-118.584815 0-214.715223 96.132454-214.715223 214.715223 0 118.585839 96.131431 214.715223 214.715223 214.715223s214.715223-96.130408 214.715223-214.715223C726.942397 457.95306 630.810966 361.820606 512.227174 361.820606zM512.227174 704.672184c-70.76674 0-128.134309-57.369615-128.134309-128.135332s57.367569-128.134309 128.134309-128.134309 128.134309 57.367569 128.134309 128.134309S582.993914 704.672184 512.227174 704.672184z',
            table: "path://M811.658847 127.059837 212.341153 127.059837c-26.524097 0-50.15633 12.558014-65.310472 32.025391l-0.733711 0 0 0.933255c-10.478655 13.864776-16.706497 31.112602-16.706497 49.79101l0 604.378967c0 45.629223 37.121456 82.750679 82.750679 82.750679l599.317695 0c45.629223 0 82.750679-37.121456 82.750679-82.750679L894.409526 209.810516C894.409526 164.181293 857.288071 127.059837 811.658847 127.059837zM380.329145 876.474039 212.341153 876.474039c-34.344203 0-62.284555-27.941376-62.284555-62.284555L150.056598 665.158239l230.273571 0L380.330168 876.474039zM380.329145 650.831952 150.056598 650.831952 150.056598 437.614849l230.273571 0L380.330168 650.831952zM380.329145 423.288562 150.056598 423.288562 150.056598 210.250538l230.273571 0L380.330168 423.288562zM630.121258 876.474039 394.655432 876.474039 394.655432 665.158239l235.465826 0L630.121258 876.474039zM630.121258 650.831952 394.655432 650.831952 394.655432 437.614849l235.465826 0L630.121258 650.831952zM630.121258 423.288562 394.655432 423.288562 394.655432 210.250538l235.465826 0L630.121258 423.288562zM873.943402 814.189484c0 34.344203-27.941376 62.284555-62.284555 62.284555L644.447545 876.474039 644.447545 665.158239l229.495858 0L873.943402 814.189484zM873.943402 650.831952 644.447545 650.831952 644.447545 437.614849l229.495858 0L873.943402 650.831952zM873.943402 423.288562 644.447545 423.288562 644.447545 210.250538l229.495858 0L873.943402 423.288562z",
            download: "path://M748.892315 816.572764c0 18.508539-15.33322 33.841759-33.841759 33.841759-18.505469 0-33.841759-15.33322-33.841759-33.841759 0-18.505469 15.33629-33.841759 33.841759-33.841759C733.559095 782.731004 748.892315 798.068318 748.892315 816.572764zM884.260375 816.572764c0 18.508539-15.33629 33.841759-33.841759 33.841759-18.508539 0-33.841759-15.33322-33.841759-33.841759 0-18.505469 15.33322-33.841759 33.841759-33.841759C868.924085 782.731004 884.260375 798.068318 884.260375 816.572764zM951.940824 698.128141c0-28.02324-22.734794-50.761104-50.761104-50.761104L655.828756 647.367037l-71.913866 71.913866c-19.566638 19.035542-44.945655 29.612435-71.913866 29.612435-26.968212 0-52.350298-10.57587-71.913866-29.612435l-71.38277-71.913866L122.82335 647.367037c-28.02631 0-50.764174 22.737864-50.764174 50.761104l0 169.20982c0 28.02324 22.737864 50.761104 50.764174 50.761104l778.357394 0c28.02631 0 50.761104-22.737864 50.761104-50.761104L951.941847 698.128141zM780.089851 397.254629c-5.288446-12.161994-17.450441-20.621667-31.197536-20.621667L613.527324 376.632963 613.527324 139.742694c0-18.508539-15.33629-33.841759-33.841759-33.841759L444.317505 105.900935c-18.505469 0-33.841759 15.33322-33.841759 33.841759l0 236.891292L275.110755 376.633986c-13.748119 0-25.910113 8.459672-31.197536 20.621667-5.288446 12.69002-2.644223 27.495214 7.401574 37.014009l236.891292 236.891292c6.346545 6.873548 15.33629 10.048867 23.796986 10.048867 8.459672 0 17.450441-3.174296 23.792892-10.048867l236.894362-236.891292C782.734074 424.750867 785.378298 409.94465 780.089851 397.254629z",
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                label: {
                    textStyle: {
                        color: "#fff",
                    },
                    backgroundColor: "#686762",
                },
                type: 'cross',
                crossStyle: {
                    color: "#434444",
                }
            }
        },
        textStyle: {
            color: "#434444",
            fontSize: 12
        },

    },
};

//===============================================================================================================
var echartsDl = function (url, data) {
    var access_token = localStorage.getItem("access_token");
    data = JSON.parse(data);
    data = data.data;
    var d = [];
    $.ajax({
        url: url+"v1/mall/downData",
        type: 'post',
        async: true,
        data: JSON.stringify(data),
        contentType: 'application/json;charset=utf-8', //设置请求头信息
        headers: {'Authorization': "Token " + access_token},
        success: function (response, status, request) {
            if (response !== "" && response != undefined) {
                // window.location.href = "http://izone-apitest-in.jpushoa.com/down_data/chart_data/" + response.data;
                window.location.href = apis.apiFormal+"down_data/chart_data/" + response.data;
            }
        },
    });
};
// myChart.on('mousemove', function (params) {
//     myChart.setOption({
//         toolbox: {
//             show:true,
//
//         },
//     });
// });


function clickhouseData(data, num) {
    var x = data.xAxis;
    var legend = data.legend;
    var series = [];
    var  legendi="";
    if (data.series != undefined) {
        for (var i = 0; i < data.series.length; i++) {
            if(legend==undefined){
                legendi="";
            }else {
               legendi=legend[i];
            }
            series.push(
                {
                    name: legendi,
                    type: 'bar',
                    // barWidth:"50%",
                    itemStyle: {
                        normal: {color: izone.color[i + num]}
                    },
                    data: data.series[i].data

                }
            )
        }
    }
    return [x, legend, series]
}
var initChart_v1 = {
    verticalBar: function (data, num, id, name, apiurl,chartTitle) {

        var series=[];
        var x=[];
        var legend = [];
        if(data!==undefined&&data.length!==0){
            var datas = clickhouseData(data, num);
             x = datas[0];
             legend = datas[1];
             series = datas[2];
        }

        var dom = document.getElementById(id);
        var myChart = echarts.init(dom);
        var option = {
            tooltip: chartapp.chart.tooltip,
            toolbox: {
                feature: {
                    dataView: {
                        lang: ['数据表格', '关闭', '下载'],
                        show: true,
                        readOnly: true,
                        title: ['视图模式'],
                        icon: chartapp.chart.icon.table,
                        iconStyle: {
                            normal: {
                                borderColor: chartapp.chart.fontColor
                            }
                        },
                        optionToContent: function (opt) {
                            var axisData = opt.yAxis[0].data; //坐标数据
                            var series = opt.series; //折线图数据
                            var tdHeads = '<td  class="NoNewline v-middle">' + chartTitle + '</td>'; //表头
                            var tdBodys = ''; //数据
                            series.forEach(function (item) {

                                tdHeads += '<td class="NoNewline v-middle">' + item.name + '</td>';
                            });
                            var table = '<table class="table table-striped m-b-none table-bordered table-hover"><tbody><tr>' + tdHeads + ' </tr>';
                            for (var i = 0, l = axisData.length; i < l; i++) {
                                for (var j = 0; j < series.length; j++) {
                                    //组装表数据
                                    tdBodys += '<td>' + series[j].data[i] + '</td>';
                                }
                                table += '<tr><td class="NoNewline v-middle">' + axisData[i] + '</td>' + tdBodys + '</tr>';
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
                        name: chartTitle+"-"+chartapp.chart.date,
                        icon: chartapp.chart.icon.screenshots,
                        iconStyle: {
                            normal: {
                                borderColor: chartapp.chart.fontColor
                            }
                        }
                        // icon:"img/copy@2x.svg"
                    },
                    mydownload: {
                        show: true,
                        title: '图表下载',
                        icon: chartapp.chart.icon.download,
                        onclick: function (opt) {
                            var res = [];
                            var title = [];
                            var exSeries = opt.option.series;
                            var exXAxis = opt.option.yAxis[0].data;
                            exSeries.forEach(function (item) {
//                                        console.log(item.name )
                                title.push(item.name);

                            });
                            title.unshift(chartTitle);
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
                            echartsDl(apiurl, str)

                        }
                    }
                },
                bottom: 0,
                right: 10
            },
            legend: {
                type: 'scroll',
                width: '60%',
                data: legend,
                bottom: 0,
                left: 10,
                textStyle:chartapp.chart.textStyle
            },
            grid: {
                left: '2%',
                right: '10%',
                bottom: '8%',
                top: '4%',
                containLabel: true
            },
            yAxis: [
                {
                    type: 'category',
                    data: x,
                    inverse: true,
                    axisPointer: {
                        type: 'shadow'
                    },
                    axisLabel:{
                        formatter:function(val){
                            if(val.length>6){
                                val= val.substring(0,5)+"...";
                            }
                            return val;
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            width: 1,
                            color: chartapp.chart.fontColor,
                            opacity: 1
                        }
                    },
                    axisTick: {
                        show: chartapp.chart.hide
                    }

                }
            ],
            xAxis: [
                {
                    type: 'value',
                    name: name,
                    axisLabel: {
                        show: true,
                        formatter: function (obj) {
                            var val = (obj / 100 * 100).toFixed(0);// $scope.TOP_APP_LIST_VALUE_sum
                            return val;
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            width: 1,
                            color: chartapp.chart.fontColor,
                            opacity: 1
                        }
                    },
                    axisTick: {
                        show: chartapp.chart.hide
                    },
                    splitLine: {
                        show: chartapp.chart.show,
                        lineStyle: {
                            type: chartapp.chart.lineStyle
                        }
                    }
                }
            ],
            series: series
        };
        if (option && typeof option === "object") {
            myChart.setOption(option, true);
        }
        window.onresize = function () {
            myChart.resize();
        }

    },
    crossBar: function (data, num, id, name, apiurl,chartTitle) {
        var series=[];
        var x=[];
        var legend = [];
        if(data!==undefined&&data.length!==0){
            var datas = clickhouseData(data, num);
             x = datas[0];
             legend = datas[1];
             series = datas[2];
        }


        var dom = document.getElementById(id);
        var myChart = echarts.init(dom);
        var option = {
            tooltip: chartapp.chart.tooltip,
            toolbox: {
                feature: {
                    dataView: {
                        lang: ['数据表格', '关闭', '下载'],
                        show: true,
                        readOnly: true,
                        title: ['视图模式'],
                        icon: chartapp.chart.icon.table,
                        iconStyle: {
                            normal: {
                                borderColor: chartapp.chart.fontColor
                            }
                        },
                        optionToContent: function (opt) {
                            var axisData = opt.xAxis[0].data; //坐标数据
                            var series = opt.series; //折线图数据
                            var tdHeads = '<td  class="NoNewline v-middle">' + chartTitle + '</td>'; //表头
                            var tdBodys = ''; //数据
                            series.forEach(function (item) {

                                tdHeads += '<td class="NoNewline v-middle">' + item.name + '</td>';
                            });
                            var table = '<table class="table table-striped m-b-none table-bordered table-hover"><tbody><tr>' + tdHeads + ' </tr>';
                            for (var i = 0, l = axisData.length; i < l; i++) {
                                for (var j = 0; j < series.length; j++) {
                                    //组装表数据
                                    tdBodys += '<td>' + series[j].data[i] + '</td>';
                                }
                                table += '<tr><td class="NoNewline v-middle">' + axisData[i] + '</td>' + tdBodys + '</tr>';
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
                        name: chartTitle+"-"+chartapp.chart.date,
                        icon: chartapp.chart.icon.screenshots,
                        iconStyle: {
                            normal: {
                                borderColor: chartapp.chart.fontColor
                            }
                        }
                    },
                    mydownload: {
                        show: true,
                        title: '图表下载',
                        icon: chartapp.chart.icon.download,
                        onclick: function (opt) {
                            var res = [];
                            var title = [];
                            var exSeries = opt.option.series;
                            var exXAxis = opt.option.xAxis[0].data;
                            exSeries.forEach(function (item) {
//                                        console.log(item.name )
                                title.push(item.name);

                            });
                            title.unshift(chartTitle);
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
                            echartsDl(apiurl, str)

                        }
                    }
                },
                bottom: 0,
                right: 10
            },
            legend: {
                type: 'scroll',
                width: '60%',
                data: legend,
                bottom: 0,
                left: 10, textStyle:chartapp.chart.textStyle
            },
            grid: {
                left: '2%',
                right: '5%',
                bottom: '12%',
                top: '8%',
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
                            color: chartapp.chart.fontColor,
                            opacity: 1
                        }
                    },
                    axisTick: {
                        show: chartapp.chart.hide
                    },
                    axisLabel: {
                        show: chartapp.chart.show
                    },
                    splitLine: {
                        show: chartapp.chart.show
                    }

                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: name,

                    axisLabel: {
                        show: true,
                        formatter: function (obj) {
                            var val = (obj / 100 * 100).toFixed(0);// $scope.TOP_APP_LIST_VALUE_sum
                            return val;
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            width: 1,
                            color: chartapp.chart.fontColor,
                            opacity: 1
                        }
                    },
                    axisTick: {
                        show: chartapp.chart.hide
                    },
                    splitLine: {
                        show: chartapp.chart.show,
                        lineStyle: {
                            type: chartapp.chart.lineStyle
                        }
                    }
                }
            ],
            series: series
        };
        if (option && typeof option === "object") {
            myChart.setOption(option, true);
        }
        window.onresize = function () {
            myChart.resize();
        }

    },
    radarBar: function (data, num, id, name, apiurl,chartTitle) {
        var indicator = [];

        var series = [];
        if(data!==undefined&&data.length!==0){
            var legend = data.legend;
            if (data.series != undefined) {
                var dd = data.series;
                var res = [];
                for (var i = 0; i < dd.length; i++) {
                    for (var j = 0; j < dd[i].data.length; j++) {
                        res.push(dd[i].data[j])

                    }
                }
                for (var j = 0; j < data.series[0].data.length; j++) {
                    indicator.push(
                        {
                            name: data.xAxis[j], max: 100
                        }
                    )
                }
                for (var i = 0; i < data.series.length; i++) {
                    legend.push(legend[i]);

                    series.push(
                        {
                            name: legend[i],
                            itemStyle: {
                                normal: {color: izone.color[i + num]}
                            },
                            value: data.series[i].data

                        }
                    )


                }
            }
        }

        var dom = document.getElementById(id);
        var myChart = echarts.init(dom);
        var option = {
            tooltip: {},
            legend: {
                type: 'scroll',
                width: '60%',
                bottom: 0,
                left: 10,
                textStyle:chartapp.chart.textStyle,
                data: legend
            },
            toolbox: {
                feature: {
                    dataView: {
                        lang: ['数据表格', '关闭', '下载'],
                        show: true,
                        readOnly: true,
                        title: ['视图模式'],
                        icon: chartapp.chart.icon.table,
                        iconStyle: {
                            normal: {
                                borderColor: chartapp.chart.fontColor
                            }
                        },
                        optionToContent: function (opt) {
                            var axisData = opt.radar[0].indicator; //坐标数据
                            var series = opt.series[0].data; //折线图数据
                            var tdHeads = '<td  style="padding: 0 10px">' + chartTitle + '</td>'; //表头
                            var tdBodys = ''; //数据
                            axisData.forEach(function (item) {

                                tdHeads += '<td class="NoNewline v-middle">' + item.name + '</td>';
                            });
                            var table = '<table class="table table-striped m-b-none table-bordered table-hover"><tbody><tr>' + tdHeads + ' </tr>';
                            for (var i = 0, l = series.length; i < l; i++) {
                                for (var j = 0; j < series[i].value.length; j++) {
                                    //组装表数据
                                    tdBodys += '<td>' + series[i].value[j] + '</td>';
                                }
                                table += '<tr><td class="NoNewline v-middle">' + series[i].name + '</td>' + tdBodys + '</tr>';
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
                        name: chartTitle+"-"+chartapp.chart.date,
                        icon: chartapp.chart.icon.screenshots,
                        iconStyle: {
                            normal: {
                                borderColor: chartapp.chart.fontColor
                            }
                        }
                    },
                    mydownload: {
                        show: true,
                        title: '图表下载',
                        icon: chartapp.chart.icon.download,
                        onclick: function (opt) {
                            var res = [];
                            var title = [];
                            var exSeries = opt.option.series[0].data;
                            var exXAxis = opt.option.radar[0].indicator;
                            exSeries.forEach(function (item) {
//                                        console.log(item.name )
                                title.push(item.name);

                            });
                            title.unshift(chartTitle);
                            for (var i = 0, l = exXAxis.length; i < l; i++) {
                                var val = [];
                                for (var j = 0; j < exSeries.length; j++) {
//                                           console.log(exSeries[j].data[i])

                                    val.push(exSeries[j].value[i])

                                }
                                val.unshift(exXAxis[i].name);
                                res.push(
                                    val
                                )
                            }
                            res.unshift(title);
                            var str = JSON.stringify(res);
                            str = '{' + '"data":' + str + '}';
                            echartsDl(apiurl, str)

                        }
                    }
                },
                bottom: 0,
                right: 10
            },
            radar: {
                // shape: 'circle',
                name: {
                    textStyle: {
                        color: chartapp.chart.fontColor,

                        borderRadius: 3,
                        padding: [3, 5]
                    }
                },
                indicator: indicator
            },
            series: [
                {
                    type: 'radar',
                    data: series
                }]
        };
        if (option && typeof option === "object") {
            myChart.setOption(option, true);
        }
    },
    runmap: function (id, lng, lat, zoom, data, typeMap,address,type,geo_area,geo_name) {

        if(address==undefined){
            zoom=5;
            address="北京";
        }
        var dataRes = [];
        if(data!==undefined){
            for (var i = 0; i < data.length; i++) {
                var tmp = "";
                if (data[i].count < 1) {
                    tmp = 1;
                } else {
                    tmp = data[i].count
                }
                dataRes.push(
                    {
                        lng: data[i].lng,
                        lat: data[i].lat,
                        count: tmp
                    }
                )
            }
        }


        var bmaphot = new BMap.Map(id, {
            enableMapClick: false
        });
        var styleOptions={
            strokeColor:"#03a9f4",    //边线颜色。
            fillColor:"#03a9f4",      //填充颜色。当参数为空时，圆形将没有填充效果。
            strokeWeight: 5,       //边线的宽度，以像素为单位。
            strokeOpacity: 0.8,    //边线透明度，取值范围0 - 1。
            fillOpacity: 0.1,      //填充的透明度，取值范围0 - 1。
            strokeStyle: 'solid' //边线的样式，solid或dashed。
        };
        if(geo_area==""||geo_area==undefined){

        }else{
            $.each(geo_area, function(i, geoareas) {
                var geoname = geo_name[i];
                $.each(geoareas.split("&"), function (i, partition) {
                    if(partition!=geoname){
                        var str = partition.split(",");
                        var label = new BMap.Label(geoname, {
                            position: new BMap.Point(str[0].split("_")[0], str[0].split("_")[1]),    // 指定文本标注所在的地理位置
                            offset: new BMap.Size(0, 0)    //设置文本偏移量
                        });  // 创建文本标注对象
                        label.setStyle({
                            color: "#fff",
                            fontSize: "14px",
                            height: "40px",
                            padding: "0px 12px",
                            lineHeight: "40px",
                            fontFamily: "微软雅黑",
                            background: "rgba(0,0,0,0.35)",

                            border: "none"
                        });
                        if (str[1].split("_").length == 1) {
                            var circle = new BMap.Circle(new BMap.Point(str[0].split("_")[0], str[0].split("_")[1]), str[1], styleOptions); //创建圆
                            bmaphot.addOverlay(circle);
                            circle.addEventListener("mouseover", function () {
                                bmaphot.addOverlay(label);

                            });
                            circle.addEventListener("mouseout", function () {
                                bmaphot.removeOverlay(label);
                            });
                        } else {
                            var secRing = [];
                            $.each(str, function (j, item) {
                                var poi = item.split("_");
                                secRing.push(new BMap.Point(poi[0], poi[1]));
                            });
                            //创建多边形
                            var secRingPolygon = new BMap.Polygon(secRing, styleOptions);
                            bmaphot.addOverlay(secRingPolygon);
                            secRingPolygon.addEventListener("mouseover", function () {
                                bmaphot.addOverlay(label);

                            });
                            secRingPolygon.addEventListener("mouseout", function () {
                                bmaphot.removeOverlay(label);
                            });
                        }
                    }
                });
            });


        }
        var markers=[];
        var labels=[];
        window.serchmapinterest=function (city,arr) {
            if(city==undefined){
                city="北京市";
            }
            if(city.indexOf("市辖区")!=-1){
                city=city.substr(0,city.indexOf("市辖区"));
            }
            // console.log(city,arr)
            for(var i=0;i<markers.length;i++){
                bmaphot.removeOverlay(markers[i]);
                bmaphot.removeOverlay(labels[i]);
            }
            var local = new BMap.LocalSearch(city, {
                onSearchComplete: function (results) {
                    if (local.getStatus() == BMAP_STATUS_SUCCESS) {
                        for(var i=0;i<results.length;i++){
                            for (var j = 0; j < results[i].getCurrentNumPois(); j++) {
                                // s.push(results.getPoi(i).city + ","+results.getPoi(i).title + "," + results.getPoi(i).address + "," + results.getPoi(i).point.lat + ","+results.getPoi(i).point.lng);
                                var label = new BMap.Label(results[i].getPoi(j).title, {
                                    position: new BMap.Point(results[i].getPoi(j).point.lng, results[i].getPoi(j).point.lat),
                                    offset: new BMap.Size(10, -30)    //设置文本偏移量
                                });  // 创建文本标注对象
                                label.setStyle({
                                    color: "#fff",
                                    fontSize: "12px",
                                    height: "30px",
                                    padding: "0px 12px",
                                    lineHeight: "30px",
                                    fontFamily: "微软雅黑",
                                    // opacity: 0.5,
                                    background:"rgba(0,0,0,0.35)",

                                    border: "none"
                                });
                                var myIcon=new BMap.Icon("https://izone.jiguang.cn/img/map-marker.png", new BMap.Size(18,27));
                                var marker = new BMap.Marker(new BMap.Point(results[i].getPoi(j).point.lng, results[i].getPoi(j).point.lat),{icon:myIcon});
                                labels.push(label);
                                markers.push(marker);
                                bmaphot.addOverlay(label);
                                bmaphot.addOverlay(marker);
                                // marker.setLabel(label);
                            }
                        }
                    }
                }
            });
            local.setPageCapacity(100);
            local.search(arr);
        };
        if(type==1){
            bmaphot.centerAndZoom(address,zoom);
        }else {
            bmaphot.centerAndZoom(new BMap.Point(lng, lat), zoom); // 初始化地图,设置中心坐标和地图级别

        }

        var ctrl_nav = new BMap.NavigationControl({
            anchor: BMAP_ANCHOR_TOP_LEFT,
            type: BMAP_NAVIGATION_CONTROL_ZOOM
        });
        bmaphot.addControl(ctrl_nav);
        var mapv = new Mapv({
            drawTypeControl: true,
            map: bmaphot  // 百度地图的map实例
        });
        if (typeMap === "mapHot") {
            var layer = new Mapv.Layer({
                mapv: mapv, // 对应的mapv实例
                zIndex: -99999999999, // 图层层级
                dataType: 'point', // 数据类型，点类型
                data: dataRes, // 数据
                drawType: "heatmap", // 展示形式
                drawOptions: { // 绘制参数
                    blur: true, // 是否有模糊效果
                    unit: 'px', // 单位,px:像素(默认),m:米
                    max: 1, // 设置显示的权重最大值
                    type: 'circle', // 形状,可选circle:圆形(默认),rect:矩形
                    size: 6, // 半径大小
                    maxOpacity: 0.8,
                    gradient: { // 显示的颜色渐变范围
                        '0': 'blue',
                        '0.25': 'cyan',
                        '0.55': 'lime',
                        '0.85': 'yellow',
                        '1.0': 'red'
                    }
                }
            });
        } else if (typeMap === "grid") {
            var layer = new Mapv.Layer({
                mapv: mapv, // 对应的mapv实例
                zIndex: -99999999999, // 图层层级
                dataType: 'point', // 数据类型，点类型
                data: dataRes, // 数据
                drawType: "density", // 展示形式
                drawOptions: { // 绘制参数
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
                    }
                }
            });
        }



        var setRadiusValue = function (max,size,opacity) {
            layer.set('drawOptions', { // 绘制参数
                blur: true, // 是否有模糊效果
                unit: 'px', // 单位,px:像素(默认),m:米
                max: max, // 设置显示的权重最大值
                type: 'circle', // 形状,可选circle:圆形(默认),rect:矩形
                size: size, // 半径大小
                maxOpacity: opacity/100,
                gradient: { // 显示的颜色渐变范围
                    '0': 'blue',
                    '0.25': 'cyan',
                    '0.55': 'lime',
                    '0.85': 'yellow',
                    '1.0': 'red'
                }
            });
        };
        //zoom_changed  zoomend
        bmaphot.addEventListener("zoomend", function(){
            var oom=bmaphot.getZoom();
            if(typeMap==="mapHot"){
            switch (oom) {
                case 1:
                    setRadiusValue(1,1,80);
                    break;
                case 2:
                    setRadiusValue(1,1,80);
                    break;
                case 3:
                    setRadiusValue(1,1,80);
                    break;
                case 4:
                    setRadiusValue(1,1,80);
                    break;
                case 5:
                    setRadiusValue(1,2,80);
                    break;
                case 6:
                    setRadiusValue(1,2,80);
                    break;
                case 7:
                    setRadiusValue(1,2,80);
                    break;
                case 8:
                    setRadiusValue(1,3,80);
                    break;
                case 9:
                    setRadiusValue(1,3,80);
                    break;
                case 10:
                    setRadiusValue(1,3,80);
                    break;
                case 11:
                    setRadiusValue(1,4,80);
                    break;
                case 12:
                    setRadiusValue(1,4,80);
                    break;
                case 13:
                    setRadiusValue(1,5,80);
                    break;
                case 14:
                    setRadiusValue(1,6,80);
                    break;
                case 15:
                    setRadiusValue(1,9,80);
                    break;
                case 16:
                    setRadiusValue(1,16,80);
                    break;

                default:

            }
            }

        });
        var canvas = document.querySelectorAll('canvas');

    },
    crossLineArea: function (data, num, id, name, apiurl,chartTitle) {
        var series = [];
        var x=[];
        var legend=[];
        if(data!==undefined&&data.length!==0){
            var x = data.xAxis;
            var legend = data.legend;
            if (data.series != undefined) {
                for (var i = 0; i < data.series.length; i++) {
                    series.push(
                        {
                            name: legend[i],
                            type: 'line',
                            smooth: true, //是否平滑曲线显示
                            areaStyle: {normal: {}},
                            itemStyle: {
                                normal: {color: izone.color[i + num]}
                            },
                            data: data.series[i].data

                        }
                    )
                }
            }
        }


        var dom = document.getElementById(id);
        var myChart = echarts.init(dom);
        var option = {
            tooltip: chartapp.chart.tooltip,
            toolbox: {
                feature: {
                    dataView: {
                        lang: ['数据表格', '关闭', '下载'],
                        show: true,
                        readOnly: true,
                        title: ['视图模式'],
                        icon: chartapp.chart.icon.table,
                        iconStyle: {
                            normal: {
                                borderColor: chartapp.chart.fontColor
                            }
                        },
                        optionToContent: function (opt) {
                            var axisData = opt.xAxis[0].data; //坐标数据
                            var series = opt.series; //折线图数据
                            var tdHeads = '<td  class="NoNewline v-middle">' + chartTitle + '</td>'; //表头
                            var tdBodys = ''; //数据
                            series.forEach(function (item) {

                                tdHeads += '<td class="NoNewline v-middle">' + item.name + '</td>';
                            });
                            var table = '<table class="table table-striped m-b-none table-bordered table-hover"><tbody><tr>' + tdHeads + ' </tr>';
                            for (var i = 0, l = axisData.length; i < l; i++) {
                                for (var j = 0; j < series.length; j++) {
                                    //组装表数据
                                    tdBodys += '<td>' + series[j].data[i] + '</td>';
                                }
                                table += '<tr><td class="NoNewline v-middle">' + axisData[i] + '</td>' + tdBodys + '</tr>';
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
                        name: chartTitle+"-"+chartapp.chart.date,
                        icon: chartapp.chart.icon.screenshots,
                        iconStyle: {
                            normal: {
                                borderColor: chartapp.chart.fontColor
                            }
                        }
                        // icon:"img/copy@2x.svg"
                    },
                    mydownload: {
                        show: true,
                        title: '图表下载',
                        icon: chartapp.chart.icon.download,
                        onclick: function (opt) {
                            var res = [];
                            var title = [];
                            var exSeries = opt.option.series;
                            var exXAxis = opt.option.xAxis[0].data;
                            exSeries.forEach(function (item) {
//                                        console.log(item.name )
                                title.push(item.name);

                            });
                            title.unshift(chartTitle);
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
                            echartsDl(apiurl, str)

                        }
                    }
                },
                bottom: 0,
                right: 10
            },
            legend: {
                type: 'scroll',
                width: '60%',
                data: legend,
                bottom: 0,
                left: 10, textStyle:chartapp.chart.textStyle
            },
            grid: {
                left: '5%',
                right: '8%',
                bottom: '12%',
                top: '8%',
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
                            color: chartapp.chart.fontColor,
                            opacity: 1
                        }
                    },
                    axisTick: {
                        show: chartapp.chart.hide
                    }

                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: name,

                    axisLabel: {
                        show: true,
                        formatter: function (obj) {
                            var val = (obj / 100 * 100).toFixed(0);// $scope.TOP_APP_LIST_VALUE_sum
                            return val;
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            width: 1,
                            color: chartapp.chart.fontColor,
                            opacity: 1
                        }
                    },
                    axisTick: {
                        show: chartapp.chart.hide
                    },
                    splitLine: {
                        show: chartapp.chart.show,
                        lineStyle: {
                            type: chartapp.chart.lineStyle
                        }
                    }
                }
            ],
            series: series
        };
        if (option && typeof option === "object") {
            myChart.setOption(option, true);
        }
        window.onresize = function () {
            myChart.resize();
        }

    },
    crossLine: function (data, num, id, name, apiurl,chartTitle) {

        var series = [];
        var x=[];
        var legend=[];
        if(data!==undefined&&data.length!==0){
            var x = data.xAxis;
            var legend = data.legend;
            if (data.series != undefined) {
                for (var i = 0; i < data.series.length; i++) {
                    series.push(
                        {
                            name: legend[i],
                            type: 'line',
                            smooth: true, //是否平滑曲线显示
                            itemStyle: {
                                normal: {color: izone.color[i + num]}
                            },
                            data: data.series[i].data

                        }
                    )
                }
            }
        }

        var dom = document.getElementById(id);
        var myChart = echarts.init(dom);
        var option = {
            tooltip: chartapp.chart.tooltip,
            toolbox: {
                feature: {
                    dataView: {
                        lang: ['数据表格', '关闭', '下载'],
                        show: true,
                        readOnly: true,
                        title: ['视图模式'],
                        icon: chartapp.chart.icon.table,
                        iconStyle: {
                            normal: {
                                borderColor: chartapp.chart.fontColor
                            }
                        },
                        optionToContent: function (opt) {
                            var axisData = opt.xAxis[0].data; //坐标数据
                            var series = opt.series; //折线图数据
                            var tdHeads = '<td  class="NoNewline v-middle">' + chartTitle + '</td>'; //表头
                            var tdBodys = ''; //数据
                            series.forEach(function (item) {

                                tdHeads += '<td class="NoNewline v-middle">' + item.name + '</td>';
                            });
                            var table = '<table class="table table-striped m-b-none table-bordered table-hover"><tbody><tr>' + tdHeads + ' </tr>';
                            for (var i = 0, l = axisData.length; i < l; i++) {
                                for (var j = 0; j < series.length; j++) {
                                    //组装表数据
                                    tdBodys += '<td>' + series[j].data[i] + '</td>';
                                }
                                table += '<tr><td class="NoNewline v-middle">' + axisData[i] + '</td>' + tdBodys + '</tr>';
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
                        name: chartTitle+"-"+chartapp.chart.date,
                        icon: chartapp.chart.icon.screenshots,
                        iconStyle: {
                            normal: {
                                borderColor: chartapp.chart.fontColor
                            }
                        }
                        // icon:"img/copy@2x.svg"
                    },
                    mydownload: {
                        show: true,
                        title: '图表下载',
                        icon: chartapp.chart.icon.download,
                        onclick: function (opt) {
                            var res = [];
                            var title = [];
                            var exSeries = opt.option.series;
                            var exXAxis = opt.option.xAxis[0].data;
                            exSeries.forEach(function (item) {
//                                        console.log(item.name )
                                title.push(item.name);

                            });
                            title.unshift(chartTitle);
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
                            echartsDl(apiurl, str)

                        }
                    }
                },
                bottom: 0,
                right: 10
            },
            legend: {
                type: 'scroll',
                width: '60%',
                data: legend,
                bottom: 0,
                left: 10, textStyle:chartapp.chart.textStyle
            },
            grid: {
                left: '5%',
                right: '8%',
                bottom: '12%',
                top: '8%',
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
                            color: chartapp.chart.fontColor,
                            opacity: 1
                        }
                    },
                    axisTick: {
                        show: chartapp.chart.hide
                    }

                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: name,

                    axisLabel: {
                        show: true,
                        formatter: function (obj) {
                            var val = (obj / 100 * 100).toFixed(0);
                            return val;
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            width: 1,
                            color: chartapp.chart.fontColor,
                            opacity: 1
                        }
                    },
                    axisTick: {
                        show: chartapp.chart.hide
                    },
                    splitLine: {
                        show: chartapp.chart.show,
                        lineStyle: {
                            type: chartapp.chart.lineStyle
                        }
                    }
                }
            ],
            series: series
        };
        if (option && typeof option === "object") {
            myChart.setOption(option, true);
        }
        window.onresize = function () {
            myChart.resize();
        }

    },
    pie: function (data, num, id, name, apiurl,chartTitle) {

        var series = [];
        var x=[];
        var legend=[];
        if(data!==undefined&&data.length!==0){
            var x = data.xAxis;
            var legend = data.legend;
            if (data.series != undefined) {
                for (var i = 0; i < data.series.length; i++) {
                    series.push(
                        {
                            name: legend[i],
                            type: 'line',
                            smooth: true, //是否平滑曲线显示
                            itemStyle: {
                                normal: {color: izone.color[i + num]}
                            },
                            data: data.series[i].data

                        }
                    )
                }
            }

        }

        var dom = document.getElementById(id);
        var myChart = echarts.init(dom);
        var option = {
            tooltip: chartapp.chart.tooltip,
            toolbox: {
                feature: {
                    dataView: {
                        lang: ['数据表格', '关闭', '下载'],
                        show: true,
                        readOnly: true,
                        title: ['视图模式'],
                        icon: chartapp.chart.icon.table,
                        iconStyle: {
                            normal: {
                                borderColor: chartapp.chart.fontColor
                            }
                        },
                        optionToContent: function (opt) {
                            var axisData = opt.xAxis[0].data; //坐标数据
                            var series = opt.series; //折线图数据
                            var tdHeads = '<td  class="NoNewline v-middle">' + chartTitle + '</td>'; //表头
                            var tdBodys = ''; //数据
                            series.forEach(function (item) {

                                tdHeads += '<td class="NoNewline v-middle">' + item.name + '</td>';
                            });
                            var table = '<table class="table table-striped m-b-none table-bordered table-hover"><tbody><tr>' + tdHeads + ' </tr>';
                            for (var i = 0, l = axisData.length; i < l; i++) {
                                for (var j = 0; j < series.length; j++) {
                                    //组装表数据
                                    tdBodys += '<td>' + series[j].data[i] + '</td>';
                                }
                                table += '<tr><td class="NoNewline v-middle">' + axisData[i] + '</td>' + tdBodys + '</tr>';
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
                        name: chartTitle+"-"+chartapp.chart.date,
                        icon: chartapp.chart.icon.screenshots,
                        iconStyle: {
                            normal: {
                                borderColor: chartapp.chart.fontColor
                            }
                        }
                        // icon:"img/copy@2x.svg"
                    },
                    mydownload: {
                        show: true,
                        title: '图表下载',
                        icon: chartapp.chart.icon.download,
                        onclick: function (opt) {
                            var res = [];
                            var title = [];
                            var exSeries = opt.option.series;
                            var exXAxis = opt.option.xAxis[0].data;
                            exSeries.forEach(function (item) {
//                                        console.log(item.name )
                                title.push(item.name);

                            });
                            title.unshift(chartTitle);
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
                            echartsDl(apiurl, str)

                        }
                    }
                },
                bottom: 0,
                right: 10
            },
            legend: {
                type: 'scroll',
                width: '60%',
                data: legend,
                bottom: 0,
                left: 10, textStyle:chartapp.chart.textStyle
            },
            grid: {
                left: '5%',
                right: '8%',
                bottom: '12%',
                top: '8%',
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
                            color: chartapp.chart.fontColor,
                            opacity: 1
                        }
                    },
                    axisTick: {
                        show: chartapp.chart.hide
                    }

                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: name,

                    axisLabel: {
                        show: true,
                        formatter: function (obj) {
                            var val = (obj / 100 * 100).toFixed(0);
                            return val;
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            width: 1,
                            color: chartapp.chart.fontColor,
                            opacity: 1
                        }
                    },
                    axisTick: {
                        show: chartapp.chart.hide
                    },
                    splitLine: {
                        show: chartapp.chart.show,
                        lineStyle: {
                            type: chartapp.chart.lineStyle
                        }
                    }
                }
            ],
            series: series
        };
        if (option && typeof option === "object") {
            myChart.setOption(option, true);
        }
        window.onresize = function () {
            myChart.resize();
        }

    },

};
var showChart={
    chart:function (ctype,resData,num,cid,name,url,chartTitle) {
        if(chartTitle==undefined||chartTitle==""||chartTitle==null){
            chartTitle="";
        }
        switch (ctype) {
            case '1':

                initChart_v1.crossBar(resData, num, cid, name,url,chartTitle);
                break;
            case '2':
                initChart_v1.pie(resData, num, cid, name,url,chartTitle);
                break;
            case '3':
                initChart_v1.verticalBar(resData, num, cid, name,url,chartTitle);
                break;
            case '4':
                initChart_v1.radarBar(resData, num, cid, name,url,chartTitle);
                break;
            case '5':
                initChart_v1.crossLine(resData, num, cid, name,url,chartTitle);
                break;
            case '6':
                initChart_v1.crossLineArea(resData, num, cid, name,url,chartTitle);
                break;

            default:

        }
        
    }
    
};