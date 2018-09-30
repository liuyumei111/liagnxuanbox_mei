'use wifipix';
app
    .controller('wifipixManageCorl', ['$scope', '$http', '$state', '$q', '$filter', function ($scope, $http, $state, $q, $filter) {

        $scope.app.title.version=" - 基础版 +";
        $scope.app.title.secondary="";
        $scope.app.title.Level3="客流统计 | ";
        $scope.loading=true;
        $scope.app.exhibition.id=window.sessionStorage.getItem('basePlusId');
        var projectId=window.sessionStorage.getItem("projectId");

        // var base = new Base64Utils()
        // var __name_password = "LXDatasean:sean"
        // var __name_password_encode = base.encode(__name_password)
        // console.info($.md5('{pageNo:1,pageSize:10}'))
        //'TFhEYXRhc2VhbjpzZWFu'
        var pageNo = 1;
        var mainHTTP = {
            //确定查询接口
            storeAjax: function (orderId,nowtime,sign,pageNo) {
                $http({
                    method: 'POST',
                    url: WIFIPIX+"flowbox/open-api",
                    data:{
                        "product":"cosmo",
                        "api":"store.list",
                        "encrypt":'{pageNo:'+pageNo+',pageSize:10}',
                        "orderId":orderId,
                        "reqtime":nowtime,
                        "sign":sign,
                    },
                    headers: {'Authorization': 'TFhEYXRhc2VhbjpzZWFu'},
                }).success(function (data, status, headers) {
                    $scope.loading = false;
                    if (data.code == 208) {
                        layer.msg('查询失败', {icon: 2});
                        $scope.isShow = false
                    } else if (data.code == 200) {
                        console.info(data.data.storeList);
                        $scope.isShow = true;
                        $scope.storeList = data.data.storeList;
                        // $scope.totalCount = data.totalCount;//总个数
                        //分页渲染
                        var totalPage = data.data.totalPages;
                        $scope.totalRecord=data.totalCount
                        var pageStr = ''
                        for (var i = 1; i <= totalPage; i++) {
                            var pageStr1 = '<li data=' + 1 + '><a href="javascript:;">' + '首页' + '</a></li>'
                            pageStr += '<li data=' + i + '><a href="javascript:;">' + i + '</a></li>'
                            var pageStr2 = '<li data=' + totalPage + '><a href="javascript:;">' + '尾页' + '</a></li>'
                        }
                        $('.pagination').html(pageStr1 + pageStr + pageStr2)
                        // $('.pagination').find('a').eq($scope.cpage - 1).css('background', '#b2afaf')
                        $('.pagination').find('a').eq($scope.cpage).css('background', '#b2afaf')
                        $('.pagination li').click(function () {
                            $scope.cpage = $(this).attr('data')
                            pageNo = $scope.cpage;
                            mainHTTP.storeAjax(orderId,nowtime,sign,pageNo)
                        })
                    } else if (data.code == 'null' || '') {
                        layer.msg('查询无数据', {icon: 2});
                        $scope.isShow = false
                    }
                })
                    .error(function (data, status, headers) {
                        // $scope.authError = data.message;
                        // $scope.loading = false;
                    });
            },
        };
        $scope.searchList = function () {
            var product = $('#product').val();
            var api = $('#api').val();
            // var encrypt = $('#encrypt').val();
            var orderId = $('#orderId').val();
            // var reqtime = $('#reqtime').val();
            var sign = $('#sign').val();
            // console.info(product, api,orderId)
            // console.info(manage, api, encrypt,orderId,reqtime,sign)

            if (product == 'NaN' || product == 'undefined' || product == '') {
                layer.tips('产品名称不能为空', '#product');
                return false;
            }
            if (api == 'NaN' || api == 'undefined' || api == '') {
                layer.tips('接口名称不能为空', '#api');
                return false;
            }
            // if (encrypt == 'NaN' || encrypt == 'undefined' || encrypt == '') {
            //     layer.tips('访问数据不能为空', '#encrypt');
            //     return false;
            // }
            if (orderId == 'NaN' || orderId == 'undefined' || orderId == '') {
                layer.tips('流水编号不能为空', '#orderId');
                return false;
            }
            // if (reqtime == 'NaN' || reqtime == 'undefined' || reqtime == '') {
            //     layer.tips('请求时间不能为空', '#reqtime');
            //     return false;
            // }
            if (sign == 'NaN' || sign == 'undefined' || sign == '') {
                layer.tips('请求时间不能为空', '#sign');
                return false;
            }

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
        //获取系统当前时间
        var myDate = new Date();
        var year = myDate.getFullYear(); //获取完整的年份
        var month = myDate.getMonth(); //获取当前月份
        var day = myDate.getDate(); //获取当前日
        var hours = myDate.getHours(); //获取当前小时
        var minunt = myDate.getMinutes(); //获取当前分钟数
        var sencond = myDate.getSeconds(); //获取当前秒数
        var nowdate = year+'-'+month+'-'+day+' '+hours+':'+minunt+':'+sencond;
        var nowtime = Date.parse(nowdate).toString();
        var orderId = randomString(32);
        var data = {
            "product":"cosmo",
            "api":"store.list",
            "encrypt":'{pageNo:1,pageSize:10}',
            "orderId":orderId,
            "reqtime":nowtime
        }
        sortPram(data)
        console.info(sortPram(data))
        console.info($.md5(sortPram(data)));
        var sign = $.md5(sortPram(data));

        mainHTTP.storeAjax(orderId,nowtime,sign,pageNo)
    }]);