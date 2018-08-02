app
    .controller('uuserlistCtrl', ['$scope', '$rootScope', '$http', '$state', '$q', '$stateParams', 'Sysuser', 'apiStorage', function ($scope, $rootScope, $http, $state, $q, $stateParams, Sysuser, apiStorage) {

        //获取到用户名
        $scope.userRName = apiStorage.getLoc('userName');
        $scope.app.title.Level3 = "客流盒子 | ";
        $scope.app.title.version = " ";
        $scope.app.title.secondary = "";
        $scope.pageSize = 16;
        $scope.cpage = 1;
        $scope.stateNum = "NA";
        $scope.loading = true;

        var mainHttp = {
            //用户列表
            userListAjax: function () {
                var userName = localStorage.getItem('userName')
                $http({
                    method: 'GET',
                    url: admin_ROOT + 'user/usernameList' + '?username=' + userName,
                }).success(function (data, status, headers) {
                    $scope.loading = false;
                    $scope.userManageDataS = data.userManage;
                })
                    .error(function (data, status, headers) {
                        $scope.authError = data.message;
                        $scope.loading = false;
                    });
            },
            //提交编辑信息
            updateUserInfoAjax: function (m_username, m_createtime, m_company, m_password, m_tpl, m_email) {
                $http({
                    method: 'GET',
                    url: admin_ROOT + 'user/updateUserInfo' + '?username=' + m_username + '&password=' + m_password + '&company=' + m_company + '&phone=' + m_tpl + '&email=' + m_email,
                }).success(function (data, status, headers) {
                    $scope.loading = false;
                    // console.log(data)
                    if (data.sucess == '200') {
                        layer.msg('修改成功', {icon: 1});
                        setTimeout(function () {
                            layer.closeAll();
                            window.location.reload()
                        }, 1000)
                    }
                })
                    .error(function (data, status, headers) {
                        $scope.authError = data.message;
                        $scope.loading = false;
                    });
            },
            //删除用户
            deleteUserAjax: function (name) {
                $http({
                    method: 'GET',
                    url: admin_ROOT + 'user/deleteUser' + '?username=' + name,
                }).success(function (data, status, headers) {
                    $scope.loading = false;
                    // console.log(data)
                    if (data.sucess == '200') {
                        layer.msg('删除成功', {icon: 1});
                        setTimeout(function () {
                            window.location.reload();
                        }, 1000);

                    }
                })
                    .error(function (data, status, headers) {
                        $scope.authError = data.message;
                        $scope.loading = false;
                    });
            },
            //注册新用户
            registerUserAjax:function (username,company,password,phone,email) {
                $http({
                    method: 'GET',
                    url: admin_ROOT + 'user/registerUser' + '?username=' + username + "&password=" + password + "&company=" + company + "&phone=" + phone + "&email=" + email,
                }).success(function (data, status, headers) {
                    if (data.sucess == '200') {
                        layer.msg('注册成功', {icon: 1});
                        setTimeout(function () {
                            window.location.reload();
                        }, 1000);
                    }
                    if (data.exists == 'username exists!') {
                        layer.msg('用户已存在', {icon: 2});
                    }
                })
                    .error(function (data, status, headers) {
                        layer.msg('服务器异常', {icon: 2});
                    });

            }
        };
        mainHttp.userListAjax();


        //编辑用户信息
        $scope.userEdit = function (id) {
            for (var i = 0; i < $scope.userManageDataS.length; i++) {
                if ($scope.userManageDataS[i].user_id == id) {
                    $('#m_username').val($scope.userManageDataS[i].username)
                    $('#m_createtime').val($scope.userManageDataS[i].createtime)
                    $('#m_company').val($scope.userManageDataS[i].company)
                    $('#m_password').val($scope.userManageDataS[i].password)
                    $('#m_tpl').val($scope.userManageDataS[i].phone)
                    $('#m_email').val($scope.userManageDataS[i].email)
                }
            }
            layer.open({
                title: '编辑用户信息',
                type: 1,
                area: ['900px', '80%'],
                content: $(".updateUser"),
                btn: ['确认', '取消'],
                shade: 0, //不显示遮罩
                yes: function () {
                    // 用户名
                    var m_username = $('#m_username').val();
                    //创建时间
                    var m_createtime = $('#m_createtime').val();
                    //所属公司
                    var m_company = $('#m_company').val();
                    //密码
                    var m_password = $('#m_password').val();
                    //手机号
                    var m_tpl = $('#m_tpl').val();
                    //邮箱
                    var m_email = $('#m_email').val();

                    //邮箱正则
                    var regEmil = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
                    //电话正则
                    var regTel = /^[1][3,4,5,7,8][0-9]{9}$/;
                    //密码正则
                    var regPass = /^.{6,}$/;

                    if (m_company == undefined || m_company == '') {
                        layer.tips('所属公司不能为空', '#m_company');
                        return false
                    }

                    if (m_password == undefined || m_password == '') {
                        layer.tips('密码不能为空', '#m_password');
                        return false
                    } else if (!regPass.test(m_password)) {
                        layer.tips('密码不符合规定', '#m_password');
                        return false
                    }

                    if (m_tpl == undefined || m_tpl == '') {
                        layer.tips('手机号不能为空', '#m_tpl');
                        return false
                    } else if (!regTel.test(m_tpl)) {
                        layer.tips('手机号格式错误', '#m_tpl');
                        return false
                    }

                    if (m_email == undefined || m_email == '') {
                        layer.tips('邮箱不能为空', '#m_email');
                        return false
                    } else if (!regEmil.test(m_email)) {
                        layer.tips('邮箱格式错误', '#m_email');
                        return false
                    }

                    //调用修改信息接口
                    mainHttp.updateUserInfoAjax(m_username, m_createtime, m_company, m_password, m_tpl, m_email)

                },
                btn2: function () {}
            });
        };

        //删除用户信息
        $scope.userRemove = function (name) {
            layer.confirm('确定删除' + name + '这个用户吗？', {
                btn: ['取消', '删除'] //按钮
            }, function () {
                layer.msg('取消成功', {icon: 1});
            }, function () {
                mainHttp.deleteUserAjax(name)
            });


        }

        //普通用户点击提示无权限
        $scope.identity=function(){
            layer.msg('暂无权限，请联系管理员');
        };

    //    增加用户
        $scope.addUser = function () {
            layer.open({
                title: '增加用户',
                type: 1,
                area: ['900px', '80%'],
                content: $(".addUser"),
                btn: ['确认', '取消'],
                shade: 0, //不显示遮罩
                yes: function () {
                    // 用户名
                    var m_username = $('#add_username').val();
                    //公司
                    var m_company = $('#add_company').val();
                    //密码
                    var m_password = $('#add_password').val();
                    //手机号
                    var m_tpl = $('#add_tpl').val();
                    //邮箱
                    var m_email = $('#add_email').val();

                    //邮箱正则
                    var regEmil = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
                    //电话正则
                    var regTel = /^[1][3,4,5,7,8][0-9]{9}$/;
                    //密码正则
                    var regPass = /^.{6,}$/;

                    if (m_username == undefined || m_username == '') {
                        layer.tips('用户名不能为空', '#add_username');
                        return false
                    }

                    if (m_company == undefined || m_company == '') {
                        layer.tips('所属公司不能为空', '#add_company');
                        return false
                    }

                    if (m_password == undefined || m_password == '') {
                        layer.tips('密码不能为空', '#add_password');
                        return false
                    } else if (!regPass.test(m_password)) {
                        layer.tips('密码不符合规定', '#add_password');
                        return false
                    }

                    if (m_tpl == undefined || m_tpl == '') {
                        layer.tips('手机号不能为空', '#add_tpl');
                        return false
                    } else if (!regTel.test(m_tpl)) {
                        layer.tips('手机号格式错误', '#add_tpl');
                        return false
                    }

                    if (m_email == undefined || m_email == '') {
                        layer.tips('邮箱不能为空', '#add_email');
                        return false
                    } else if (!regEmil.test(m_email)) {
                        layer.tips('邮箱格式错误', '#add_email');
                        return false
                    }

                    //调用注册接口
                    mainHttp.registerUserAjax(m_username, m_company, m_password, m_tpl, m_email)

                },
                btn2: function () {}
            });
        };



    }]);