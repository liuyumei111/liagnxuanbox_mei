'use strict';
app.controller('toolGeographyFenceCtrl', ['$scope', '$http', '$state', '$q', '$interval', '$filter', function ($scope, $http, $state, $q, $interval, $filter) {

    $scope.app.title.Level3="地理围栏 | ";
    $scope.app.title.version=" - 基础版";
    $scope.app.title.secondary="";

    $scope.loading=false;
    if(window.sessionStorage.getItem("geoFence")!=null){
        window.sessionStorage.removeItem("geoFence");
    }
    $("#distpicker").distpicker({
        province:"全部省份",
        city:"全部城市",
        autoSelect:false
    });
    $scope.allProvince = "NA";
    $scope.allCity = "NA";

    $scope.traffic = [];

    $scope.state={
        "1":" 待审核",
        "2":" 审核中",
        "3":" 待执行",
        "4":" 驳回",
        "5":" 正在执行",
        "6":" 任务完成",
        "9":" 任务出错"
    };

    $scope.traffictotalPage=1;
    $scope.ind=1;
    //http请求数据
    var jhttp = {
        serch:function (index,province,city) {
            var url=$scope.app.toolUrl+"findAreaData?cpage="+index+"&pageSize=6&propertis[project_id]="+window.sessionStorage.getItem('projectId')+"&propertis[city]="+city+"&propertis[province]="+province;
            $http({
                mothod:"get",
                url:url,
               headers: { 'Authorization': "Bearer "+$scope.app.token}, withCredentials: true
            }).success(function(res){
                // console.log(res)
                $scope.traffic=res.data.data.list;

                $scope.trafficstart = res.data.data.start;
                $scope.traffictotalPage = res.data.data.totalPage;
                $scope.traffictotalRow = res.data.data.totalRow;
                $scope.trafficcpage = res.data.data.cpage;

            }).error(function (err) {
                $scope.traffic=err.data;
                $scope.trafficstart = 0;
                $scope.traffictotalPage = 1;
                $scope.traffictotalRow = 0;
                $scope.trafficcpage = 0;
            })
        },
        delete:function (id) {
            var url=$scope.app.toolUrl+"delTaskData?type=1&id="+id;
            $http({
                mothod:"get",
                url:url,
               headers: { 'Authorization': "Bearer "+$scope.app.token}, withCredentials: true
            }).success(function(res){
                // console.log(res)
                jhttp.serch($scope.ind,$scope.allProvince,$scope.allCity);
            })
        },
        audit:function (id) {
            var url=$scope.app.toolUrl+"updateTaskType?type=1&task_state=2&id="+id;
            $http({
                mothod:"get",
                url:url,
               headers: { 'Authorization': "Bearer "+$scope.app.token}, withCredentials: true
            }).success(function(res){
                // console.log(res)
                jhttp.serch($scope.ind,$scope.allProvince,$scope.allCity);
            })
        }
    };
    $("#allProvince").change(function () {
        $scope.allProvince = $(this).val()==""?"NA":$(this).val();
        jhttp.serch($scope.ind,$scope.allProvince,"NA");
    });
    $("#allCity").change(function () {
        $scope.allCity = $(this).val()==""?"NA":$(this).val();
        jhttp.serch($scope.ind,$("#allProvince").val(),$scope.allCity);
    });
    jhttp.serch($scope.ind,$scope.allProvince,$scope.allCity);

    $scope.trafficgopage=function(page){
        if($scope.trafficcpage>=0&&$scope.trafficcpage<=$scope.traffictotalPage){
            $scope.ind=page;
            jhttp.serch($scope.ind,$scope.allProvince,$scope.allCity);
        }
    };

    $scope.revise=function (t) {
        window.sessionStorage.setItem("geoFence",JSON.stringify(t));
        $state.go("fulls.addGeographyFence");
    };



    $(".mask .modal-header button").click(function () {
        $(".mask").hide();
    });
    $(".mask .modal-footer button").eq(1).click(function () {
        $(".mask").hide();
    });
    $(".mask .modal-footer button").eq(0).click(function () {
        jhttp.delete($scope.deleteId);
        $(".mask").hide();
    });
    $scope.delete=function (id) {
        $scope.deleteId=id;
        $(".mask").show();
    };
    $scope.audit=function (id) {
        jhttp.audit(id);
    };
}]);