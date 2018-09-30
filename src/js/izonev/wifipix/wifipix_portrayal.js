'use wifipix';
app
    .controller('wifipixProCorl', ['$scope', '$http', '$state', '$q', '$filter','$stateParams', function ($scope, $http, $state, $q, $filter,$stateParams) {



        var mainHttp = {
            personAjax:function (storeId,accredit_start_time,nowtime,sign,orderId) {
                $http({
                    method: 'POST',
                    url: WIFIPIX+"flowbox/open-api",
                    data:{
                        "product":"cosmo",
                        "api":"characteristics.person",
                        "encrypt":"{storeId:['"+storeId+"'],date:'"+accredit_start_time+"',resultType:3}",
                        "orderId":orderId,
                        "reqtime":nowtime,
                        "sign":sign,
                    },
                    headers: {'Authorization': 'TFhEYXRhc2VhbjpzZWFu'},
                }).success(function (data, status, headers) {

                }).error(function (data, status, headers) {

                });
            }
        }


        $scope.searchList=function() {
            var storeId = $("#storeId").val();
            var accredit_start_time = $('#accredit_start_time').val().toString();
            $scope.accredit_start_time = accredit_start_time;
            // var accredit_end_time = $('#accredit_end_time').val().toString();
            // $scope.accredit_end_time = accredit_end_time;
            if (storeId == 'NaN' || storeId == undefined || storeId == '') {
                layer.tips('产品id不能为空', '#storeId');
                return false;
            }
            if (accredit_start_time == 'NaN' || accredit_start_time == undefined || accredit_start_time == '') {
                layer.tips('开始时间不能为空', '#accredit_start_time');
                return false;
            }
            // if (accredit_end_time == 'NaN' || accredit_end_time == undefined || accredit_end_time == '') {
            //     layer.tips('结束时间不能为空', '#accredit_end_time');
            //     return false;
            // }
            //获取系统当前时间
            var myDate = new Date();
            var year = myDate.getFullYear(); //获取完整的年份
            var month = myDate.getMonth(); //获取当前月份
            var day = myDate.getDate(); //获取当前日
            var hours = myDate.getHours(); //获取当前小时
            var minunt = myDate.getMinutes(); //获取当前分钟数
            var sencond = myDate.getSeconds(); //获取当前秒数
            var nowdate = year + '-' + month + '-' + day + ' ' + hours + ':' + minunt + ':' + sencond;
            var nowtime = Date.parse(nowdate).toString();

            var orderId = randomString(32);
            var data={
                "product":"cosmo",
                "api":"characteristics.person",
                "encrypt":"{storeId:['"+storeId+"'],date:'"+accredit_start_time+"',resultType:3}",
                "orderId":orderId,
                "reqtime":nowtime
            }
            var sign = $.md5(sortPram(data));
            mainHttp.personAjax(storeId,accredit_start_time,nowtime,sign,orderId);
        }

        var sortPram = function (params) {
            var keys =[]
            for(var param in params) {
                keys.push(param)
            }
            keys.sort()
            var  sb = ""
            for (var i in keys) {
                var value = params[keys[i]]
                if (value != null) {
                    sb += keys[i]+"="+value+","
                }
            }
            return sb.substr(0,sb.length-1)
        }
        function randomString(len) {
            len = len || 32;
            var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
            var maxPos = $chars.length;
            var pwd = '';
            for (i = 0; i < len; i++) {
                pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
            }
            return pwd;
        }
        //初始化开始日期
        laydate.render({
            elem: '#accredit_start_time'
        });

        //初始化结束日期
        // laydate.render({
        //     elem: '#accredit_end_time',
        //     // min:new Date().format("yyyy-MM-dd"),//设置最小时间范围
        //     // max:new Date().format("yyyy-MM-dd")//设置最大时间范围
        // });
    }]);