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
                    url: admin_ROOT + 'user/userList' + '?username=' + userName,
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
        };
        mainHttp.userListAjax();


        //编辑用户信息
        $scope.userEdit = function (id) {
            for (var i = 0; i < $scope.userManageDataS.length; i++) {
                if ($scope.userManageDataS[i].user_id == id) {
                    $scope.panelData = $scope.userManageDataS[i];
                }
            }
            layer.open({
                title: '编辑用户信息',
                type: 1,
                area: ['900px', '80%'],
                content: $(".panel-body"),
                btn: ['确认', '取消'],
                shade: 0, //不显示遮罩
                yes: function () {
                    // 用户名
                    var m_username = $scope.panelData.username;
                    //创建时间
                    var m_createtime = $scope.panelData.createtime;
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
                btn2: function () {
                    window.location.reload()
                }
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
    }]);