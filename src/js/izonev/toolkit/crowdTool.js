'use strict';
app.controller('toolCrowdToolCtrl', ['$scope', '$http', '$state', '$q', '$interval', function ($scope, $http, $state, $q, $interval) {

    $scope.app.title.Level3="人群号码包 | ";
    $scope.app.title.version=" - 基础版";
    $scope.app.title.secondary="";

    var randomInt = function (nMin, nMax) {
        return Math.floor(Math.random() * (nMax - nMin) + nMin + 0.5);
    };

    $scope.traffic = [];
    //********************************************************************************************************************

    $scope.ask=[
        "1、支持txt或csv格式， <a href='dl/号码包示例文件.zip' download='dl/号码包示例文件.zip' class='text-info'>示例文件</a> 下载；",
        "2、可以用zip格式压缩后上传，每个压缩包里一个文件；",
        "3、对于采集的iPhone MAC地址，请先进行伪MAC清理后再上传，否则匹配率可能偏低。",
        "4、支持上传多个文件，将对重复人群取并集；",
        "5、只有不少于500条匹配记录的号码包，才支持进行画像；",
        "6、只有不少于10000条匹配记录的号码包，才支持相似人群扩展。"
    ];

    $scope.toolName="";
    $scope.toolNameVal="NA";

    $scope.select="";
    $scope.optionList=[
        {name:"手机号",value:"phone"},
        {name:"手机号-MD5",value:"phone-md5",data:[
            "中国手机号 13855657687"
        ]},
        {name:"MAC",value:"mac"},
        {name:"MAC-MD5",value:"mac-md5",data:[
            "小写带冒号  a8:86:dd:8d:65:02",
            "大写带冒号  A8:86:DD:8D:65:02"
        ]},
        {name:"IDFA",value:"idfa"},
        {name:"IDFA-MD5",value:"idfa-md5",data:[
            "字母大写  E2DFA89-496A-47FD-9941-DF1FC4E6484A",
            "字母小写  e2dfa89-496a-47fd-9941-df1fc4e6484a"
        ]},
        {name:"IMEI",value:"imei"},
        {name:"IMEI-MD5",value:"imei-md5"}
    ];
    $scope.state={
        "1":" 待审核",
        "2":" 审核中",
        "3":" 待执行",
        "4":" 驳回",
        "5":" 正在执行",
        "6":" 任务完成",
        "9":" 任务出错"
    };
    $scope.if=false;
    $scope.rule="";
    $scope.linkage=function (e) {
        if(e==null){
            $scope.if=false;
        }
        $scope.optionList.forEach(function (v,i) {
            if(v.value==e){
                if (v.data!=undefined){
                    $scope.if=true;
                    $scope.ruleList=v.data;
                    $("#format").html("");
                    v.data.forEach(function (v,i) {
                        $("#format").append(`
                            <option value="${i+1}">${v}</option>
                        `)
                    });
                }else{
                    $scope.if=false;
                }
            }
        });
    };
    $scope.ind=1;
    $scope.traffictotalPage=1;

    $scope.inpName="";
    $scope.txtCon="";
    $scope.na="";
    $scope.filechange=function (e) {
        $scope.na=e.files[0];
        $(":text:disabled").val(e.files[0].name);
    };


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
        create:function (data) {
            var url=$scope.app.toolUrl+"uploadPeople";
            // var postCfg = {
            //     headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            //    headers: { 'Authorization': "Bearer "+$scope.app.token}, withCredentials: true,
            //     transformRequest: function (data) {
            //         return $.param(data);
            //     }
            // };
            var postCfg = {
               headers: { 'Content-Type': undefined , 'Authorization': "Bearer "+$scope.app.token}, withCredentials: true,
                transformRequest: angular.identity
            };
            $http.post(url, data, postCfg).success(function(res){
                // console.log(res)
                jhttp.serch($scope.ind,$scope.toolNameVal);
            }).error(function (res) {
                if (res.code==4007){
                    mask('上传失败，文件数据小于500或者大于10万；请重新上传！');
                }else if(res.code==4004){
                    mask('上传失败，文件数据错误数大于总数据一半；请重新上传！');
                }else if(res.code==4000){
                    mask('上传失败，文件格式错误；请重新上传！');
                }
                // console.log(res)
            })
        },
        delete:function (id) {
            var url=$scope.app.toolUrl+"delTaskData?type=2&id="+id;
            $http({
                mothod:"get",
                url:url,
               headers: { 'Authorization': "Bearer "+$scope.app.token}, withCredentials: true
            }).success(function(res){
                // console.log(res)
                jhttp.serch($scope.ind,$scope.toolNameVal);
            })
        },
        audit:function (id) {
            var url=$scope.app.toolUrl+"updateTaskType?type=2&task_state=2&id="+id;
            $http({
                mothod:"get",
                url:url,
               headers: { 'Authorization': "Bearer "+$scope.app.token}, withCredentials: true
            }).success(function(res){
                // console.log(res)
                jhttp.serch($scope.ind,$scope.toolNameVal);
            })
        },
        peopleDraw:function (user,file) {
            var url=$scope.app.toolUrl+"findPeoPlePortrayal?username="+user+"&resulturl="+file;
            $http({
                mothod:"get",
                url:url,
               headers: { 'Authorization': "Bearer "+$scope.app.token}, withCredentials: true
            }).success(function(res){
                console.log(res)
            })
        }
    };

    setInterval(function () {
        if($scope.inpName==""||$scope.select==""||$scope.na==""){
            $scope.disab= true;
            $scope.$apply();
        }else{
            if(window.sessionStorage.getItem('UserName')!="demo") {
                $scope.disab = false;
                $scope.$apply();
            }
        }
    },1);
    $scope.create=function () {
        // var data={
        //     peopleName:$scope.inpName,
        //     peopelDisc:$scope.txtCon,
        //     dataType:$scope.select,
        //     userName:window.sessionStorage.getItem('UserName'),
        //     file:$scope.na
        // };
        // console.log(data)
        if($scope.if==false){
            $scope.rule=0;
        }else{
            $scope.rule=Number($("#format").val());
        }
        var formData = new FormData();
        formData.append('name',$scope.inpName);
        formData.append('peopleDisc',$scope.txtCon);
        formData.append('dataType',$scope.select);
        if(window.sessionStorage.getItem('UserName')==null){
            formData.append('contacter',window.localStorage.getItem('userName'));
        }else{
            formData.append('contacter',window.sessionStorage.getItem('UserName'));
        }
        formData.append('project_id',window.sessionStorage.getItem('projectId'));
        formData.append('file',$scope.na);
        formData.append('rule',$scope.rule);
        jhttp.create(formData);
        $scope.inpName="";
        $scope.txtCon="";
        $scope.select="";
        $scope.na="";
        $scope.rule="";
        var file=$("#browse");
        file.after(file.clone().val(""));
        file.remove();
        $(":text:disabled").val($scope.na);
    };
    $scope.delete=function (id) {
        jhttp.delete(id);
    };
    $scope.audit=function (id) {
        jhttp.audit(id);
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