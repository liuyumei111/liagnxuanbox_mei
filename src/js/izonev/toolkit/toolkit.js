'use strict';
app.controller('toolkitController', ['$scope', '$http', '$state', '$q', '$interval', function ($scope, $http, $state, $q, $interval) {
    $scope.app.title.version=" ";
    $scope.app.title.secondary="";
    $scope.app.title.Level3="工具箱 | ";
    var randomInt = function (nMin, nMax) {
        return Math.floor(Math.random() * (nMax - nMin) + nMin + 0.5);
    };
    $scope.show=false;
    $scope.toggle=function () {
        $scope.show=!$scope.show;
    };

    var par = "par";
    if(window.sessionStorage.getItem("geoFence")!=null){
        window.sessionStorage.removeItem("geoFence");
    }
    $scope.traffic=[
        {
            title:"数据接入",
            ticon:"icon icon-user m-r",
            data:[
                {
                    state:"1",
                    img:"img/izone/bsis/u43.png",
                    tit:"上传号码包",
                    con:"号码包是手机号、MAC、IDFA等一系列号码的集合，通过号码包匹配，我们可以找到对应人群。",
                    succ:["号码包管理","上传号码包"],
                    url:["fulls.crowdTool","fulls.crowdTool"],
                    err:"研发中，敬请期待..."
                },
                {
                    state:"1",
                    img:"img/izone/bsis/u181.png",
                    tit:"圈选地理围栏",
                    con:"地理围栏是虚拟的围栏区域，我们可以统计分析进入任意地理围栏的人群。",
                    succ:["地理围栏管理","添加地理围栏"],
                    url:["fulls.geographyFence","fulls.addGeographyFence"],
                    err:"研发中，敬请期待..."
                },
                {
                    state:"1",
                    img:"img/izone/bsis/u229.png",
                    tit:"客流感知器",
                    con:"客流感知器是安装在现场的设备，可以感知开启wifi的手机进场轨迹，并匹配相应人群。",
                    succ:["部署客流感知器"],
                    url:["projecset.blacklis"],
                    err:"研发中，敬请期待..."
                }
            ]
        },
        {
            title:"数据分析",
            ticon:"icon-screen-desktop",
            data:[
                // {
                //     state:"0",
                //     img:"img/izone/bsis/u4496.png",
                //     tit:"区域监测（地理围栏）",
                //     con:"通过热力图、网格的方式，对圈选的地理围栏内的人流量、人流分布进行准实时监测。",
                //     succ:["打开区域监测","数据源设置"],
                //     url:["fulls.geographyFence","fulls.geographyFence"],
                //     err:"研发中，敬请期待..."
                // },
                {
                    state:"1",
                    // img:"img/izone/bsis/u200.png",
                    img:"img/izone/bsis/u4535.png",
                    tit:"人群画像",
                    con:"从基本画像、兴趣偏好、客户价值等维度，对客群进行360度分析刻画。",
                    succ:["客群画像"],
                    url:["fulls.basicPortraitToc"],
                    err:"研发中，敬请期待..."
                },
                {
                    state:"1",
                    img:"img/izone/bsis/u200.png",
                    tit:"个体画像",
                    con:"从基本画像、兴趣偏好、客户价值等维度，对单个个体进行360度分析刻画。",
                    succ:["进入个体画像"],
                    url:["fulls.alonePortrait"],
                    err:"研发中，敬请期待..."
                },
                {
                    state:"1",
                    img:"img/izone/bsis/u208.png",
                    tit:"对比分析",
                    con:"对比分析各个竞品的客流规模、画像、客户价值，帮助企业差异化竞争。",
                    succ:["去对比竞品"],
                    url:["contrastAnalysis.passengerSource"],
                    err:"研发中，敬请期待..."
                },
                // {
                //     state:"0",
                //     img:"img/izone/bsis/u4528.png",
                //     tit:"多层级分析",
                //     con:"通过对项目划分层级结构，在每个区域部署客流感知器。",
                //     succ:["进入分析","区域及层级设置"],
                //     url:["fulls.geographyFence","fulls.geographyFence"],
                //     err:"研发中，敬请期待..."
                // },
                {
                    state:"0",
                    img:"img/izone/bsis/u202.png",
                    tit:"客源地图",
                    con:"客源地图可以通过热力图、网格等方式，形象的展示、筛查出各类客户的来源地。",
                    succ:["查看客源地图"],
                    url:["fulls.geographyFence"],
                    err:"研发中，敬请期待..."
                },
                {
                    state:"0",
                    img:"img/izone/bsis/u241.png",
                    tit:"自由查询",
                    con:"支持通过拖拽，对多数据源进行自选多维度灵活查询，结果可生成分析图表或导出。",
                    succ:["",""],
                    url:["fulls.geographyFence","fulls.geographyFence"],
                    err:"研发中，敬请期待..."
                }
            ]
        },
        {
            title:"客群整理",
            ticon:"icon-users",
            data:[
                {
                    state:"0",
                    img:"img/izone/bsis/u227.png",
                    tit:"客户分群",
                    con:"依据客户的画像和行为特征将客群进行分类，从而对不同的群体采取不同的营销策略。",
                    succ:[""],
                    url:["fulls.geographyFence","fulls.geographyFence"],
                    err:"研发中，敬请期待..."
                },
                {
                    state:"0",
                    img:"img/izone/bsis/u223.png",
                    tit:"相似客群扩展（LookaLike）",
                    con:"选取一类客户，根据这些客户全维度的显著特征，进行相似扩展，帮助企业扩大精准营销人群。",
                    succ:[""],
                    url:["fulls.geographyFence","fulls.geographyFence"],
                    err:"研发中，敬请期待..."
                }
            ]
        },
        {
            title:"营销触达",
            ticon:"icon-users",
            data:[
                {
                    state:"1",
                    img:"img/izone/bsis/u347.png",
                    tit:"电话营销",
                    con:"支持对自定义客群通过匿名电话进行营销。请您先 开户 ，并提交 话术模板 以供审核。",
                    succ:["登录话务系统"],
                    url:["fulls.geographyFence"],
                    urlx:["http://bsy.cloudox.net/login/index/cn/dpitest"],
                    err:"研发中，敬请期待..."
                },
                {
                    state:"0",
                    img:"img/izone/bsis/u217.png",
                    tit:"效果评估",
                    con:"触达验证，统计分析营销效果。",
                    succ:[""],
                    url:["fulls.geographyFence"],
                    err:"研发中，敬请期待..."
                }
            ]
        }
    ];


    var mainHttp={
        geMenu:function (date) {
            var deferred = $q.defer();
            $http({
                method: 'get',
                url: $scope.app.url+"/menu3.json",
               headers: { 'Authorization': "Bearer "+$scope.app.token}, withCredentials: true
            }).success(function (res) {
                $scope.menuSecondaryRes=res.response;
                deferred.resolve();
            }).error(function (res) {
                console.log("加载失败")

            });
            return deferred.promise;
        }
    };
    mainHttp.geMenu();


}]);