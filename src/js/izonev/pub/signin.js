'use strict';

/* Controllers */
// signin controller
app.controller('SigninFormController', ['$scope', '$http', '$state', '$rootScope', '$q', 'apiStorage', 'Sysuser',
    function ($scope, $http, $state, $rootScope, $q, apiStorage, Sysuser) {
        $scope.loginv2 = function () {
            signin();
        };
        $scope.register = function () {
            registerFun()
        };
        // 已经有了账号
        $scope.yesNumber = function () {
            $('.signin-box').show()
            $('.register-box').hide()

        };
        //注册
        $scope.goYesNumber = function () {
            $('.signin-box').hide();
            $('.register-box').show()
        };
        //登录
        var signin = function () {
            if ($scope.userName == undefined) {
                layer.tips('请输入用户名!', '.username');
                return false
            } else {
            }
            if ($scope.userPassword == undefined) {
                layer.tips('请输入密码!', '.password');
                return false
            } else {
            }

            $http({
                method: 'GET',
                url: USP_SERVER_ROOT1 + 'login' + '?username=' + $scope.userName + "&password=" + $scope.userPassword + "&pageNumber=" + "1" + "&pageSize=" + '20'
            }).success(function (data, status, headers) {
                if (data.sucess == 200) {
                    //用户信息、token、存起来
                    var pName = $scope.userName + ":" + $scope.userPassword;
                    var access_token = Base64.encode(pName);
                    apiStorage.putLoc('userName', $scope.userName);
                    apiStorage.putLoc('userPas', $scope.userPassword);
                    apiStorage.putLoc('access_token', access_token);
                    $rootScope.projectS = data.project_list;
                    // $state.go('access.home');
                    $state.go('access.selections');
                } else {
                    $('.promptError').html('用户名或密码错误')
                }
            })
                .error(function (data, status, headers) {
                    // $scope.authError = data.message;
                    $('.promptError').html('平台服务异常，请联系管理员')
                });
        };
        //注册
        var registerFun = function () {
            //邮箱正则
            var regEmil = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
            //电话正则
            var regTel = /^[1][3,4,5,7,8][0-9]{9}$/

            if ($scope.regName == undefined) {
                layer.tips('请输入用户名!', '.username');
                return false
            } else {
            }
            if ($scope.regEmil == undefined) {
                alert('请输入邮箱')
                return false
            } else if (!regEmil.test($scope.regEmil)) { //正则验证不通过，格式不对
                alert("邮箱格式有误！");
                return false;
            } else {
            }
            if ($scope.regPass == undefined) {
                alert('请设置密码')
                return false
            } else {
            }
            if ($scope.regPassS == undefined) {
                alert('请再次输入密码')
                return false
            } else {
            }
            if ($scope.regPass == $scope.regPassS) {
            } else {
                alert('两次输入密码不一致')
                return false
            }
            if ($scope.regComName == undefined) {
                alert('请输入公司名称')
                return false
            } else {
            }
            if ($scope.regTel == undefined) {
                alert('请输入电话')
                return false
            } else if (!regTel.test($scope.regTel)) {
                alert("电话输入错误！");
            } else {
            }
            //滑动验证
            $(".inner").mousedown(function (e) {
                var el = $(".inner"), os = el.offset(), dx, $span = $(".outer>span"), $filter = $(".filter-box"),
                    _differ = $(".outer").width() - el.width();
                $(document).mousemove(function (e) {
                    dx = e.pageX - os.left;
                    if (dx < 0) {
                        dx = 0;
                    } else if (dx > _differ) {
                        dx = _differ;
                    }
                    $filter.css('width', dx);
                    el.css("left", dx);
                });
                $(document).mouseup(function (e) {
                    $(document).off('mousemove');
                    $(document).off('mouseup');
                    dx = e.pageX - os.left;
                    if (dx < _differ) {
                        dx = 0;
                        $span.html("滑动解锁");
                    } else if (dx >= _differ) {
                        dx = _differ;
                        $(".outer").addClass("act");
                        $span.html("验证通过！");
                        el.html('&radic;');
                    }
                    $filter.css('width', dx);
                    el.css("left", dx);

                })
            })
            if ($('.outer').find('span').html() == '滑动解锁') {
                alert('未解锁')
                return false
            }

            $http({
                method: 'GET',
                url: USP_SERVER_ROOT1 + 'user/registerUser' + '?username=' + $scope.regName + "&password=" + $scope.regPass + "&company=" + $scope.regComName + "&phone=" + $scope.regTel + "&email=" + $scope.regEmil,
            }).success(function (data, status, headers) {
                if (data.sucess == '200') {
                    alert('注册成功，去登录')
                    location.reload();
                }
                if (data.exists == 'username exists!') {
                    alert('用户已存在')
                }
            })
                .error(function (data, status, headers) {
                    alert('服务器异常')
                });


        }

    }])
;