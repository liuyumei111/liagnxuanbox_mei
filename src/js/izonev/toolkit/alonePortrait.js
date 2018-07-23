'use strict';
app.controller('toolAlonePortraitCtrl', ['$scope', '$http', '$state', '$q', '$interval', function ($scope, $http, $state, $q, $interval) {

    $scope.app.title.Level3="个体画像 | ";
    $scope.app.title.version=" - ";
    $scope.app.title.secondary="";

    $scope.traffic = [];

    $scope.toolName="";
    $scope.toolNameVal="NA";
    $scope.loading=false;
    $scope.ind=1;
    $scope.traffictotalPage=1;

    //http请求数据
    var jhttp = {
        serch:function (index,name) {
            var url=$scope.app.toolUrl+"findPeopleData?cpage="+index+"&pageSize=8&propertis[project_id]="+window.sessionStorage.getItem('projectId')+"&propertis[name]="+name;
            $http({
                mothod:"get",
                url:url,
               headers: { 'Authorization': "Bearer "+$scope.app.token}, withCredentials: true
            }).success(function(res){
                // console.log(res.response.data.data.list)
                // $scope.pagingMax=Math.ceil(res.response.data.data.list.length/8);
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
        getAllLabel:function () {
            var url=$scope.app.toolUrl+"findAllTags?tagid=";
            $http({
                mothod:"get",
                url:url,
                headers: { 'Authorization': "Bearer "+$scope.app.token}, withCredentials: true
            }).success(function(res) {
                $scope.dmpAlltags = res.data;
            })
        },
        downloadTag:function (project_id,aid,tags_id,tags_value) {

            var formData = new FormData();
            formData.append('project_id',project_id);
            formData.append('aid',aid);
            if(tags_id.length==0){

            }else{
                for(var i=0;i<tags_id.length;i++){
                    formData.append('tags_id',tags_id[i]);
                    formData.append('tags_value',tags_value[i]);
                }
            }

            var url=$scope.app.toolUrl+"downTagDatas";
            var postCfg = {
                headers: { 'Content-Type': undefined , 'Authorization': "Bearer "+$scope.app.token}, withCredentials: true,
                transformRequest: angular.identity
            };
            $http.post(url, formData, postCfg).success(function(res) {
                $scope.loading=false;
                window.location.href = "http://183.232.42.231:8080/down_data/people_tags/" + res.data;
            }).error(function (res) {
                $scope.loading=false;
            })
        }
    };
    $scope.serch=function (val) {
        if (val==''){
            jhttp.serch($scope.ind,'NA');
            return false;
        }
        $scope.toolNameVal=val;
        jhttp.serch($scope.ind,$scope.toolNameVal);
    };
    $scope.trafficgopage=function(page){
        if($scope.trafficcpage>=0&&$scope.trafficcpage<=$scope.traffictotalPage){
            $scope.ind=page;
            jhttp.serch($scope.ind,$scope.toolNameVal);
        }
    };

    jhttp.serch($scope.ind,$scope.toolNameVal);



    $scope.downloadTag=function (project_id,aid) {
        $scope.loading=true;
        // project_id=389;
        // aid=390;
        jhttp.downloadTag(project_id,aid,$scope.choseArr_Data,$scope.choseArr_DataV2);
    };

    $scope.dmpAlltags = [];
    jhttp.getAllLabel();
    $scope.choseArr = [];//定义数组用于存放前端显示
    $scope.choseArr_Data = [];
    $scope.choseArr_DataV2 = [];
    var flag = '';//是否点击了全选，是为a
    $scope.isSelected = false;//默认未选中



    $scope.dmpAlltagsBtn = function (c, v) {//全选
        if (c == true) {
            $scope.isSelected = true;
            $scope.choseArr = v;
        } else {
            $scope.isSelected = false;
            $scope.choseArr = [];
        }
        $scope.choseArr_Data = [];
        $scope.choseArr_DataV2 = [];
        for (var i = 0; i < $scope.choseArr.length; i++) {
            $scope.choseArr_Data.push($scope.choseArr[i].id);
            $scope.choseArr_DataV2.push($scope.choseArr[i].tag_name);
        }
        // console.log($scope.choseArr_Data)
        flag = 'a';
    };
    $scope.chkdmpAlltags = function (z, z2, index, x) {//单选或者多选
        if (flag == 'a') {//在全选的基础上操作
            $scope.choseArr_Data = $scope.choseArr_Data;
            $scope.choseArr_DataV2 = $scope.choseArr_DataV2;
        }
        if (x == true) {//选中
            $scope.choseArr_Data.push(z);
            $scope.choseArr_DataV2.push(z2);
        } else {
            $scope.choseArr_Data.splice(index,1);
            $scope.choseArr_DataV2.splice(index,1);
        }
        // console.log($scope.choseArr_Data)
        // console.log($scope.choseArr_DataV2)

    };
}]);