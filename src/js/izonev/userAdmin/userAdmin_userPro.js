app
    .controller('uuserproCtrl', ['$scope', '$rootScope', '$http', '$state', '$q', '$stateParams', 'Sysuser', 'apiStorage', function ($scope, $rootScope, $http, $state, $q, $stateParams, Sysuser, apiStorage) {

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
                $http({
                    method: 'GET',
                    url: admin_ROOT + 'user/userList' + '?username=' + $scope.userRName,
                }).success(function (data, status, headers) {
                    $scope.loading = false;
                    $scope.userManageDataS = data.userManage;
                })
                    .error(function (data, status, headers) {
                        $scope.authError = data.message;
                        $scope.loading = false;
                    });
            },

            //查找可增加项目列表
            searchCustomerNoExistsProAjax: function (name, id, project_name) {
                if (project_name == undefined) {
                    project_name = ''
                }
                $http({
                    method: 'GET',
                    url: admin_ROOT + 'user/searchCustomerNoExistsPro' + '?user_id=' + id + '&username=' + name + '&project_name=' + project_name,
                }).success(function (data, status, headers) {
                    $scope.loading = false;
                    if (data.sucess == '200') {
                        $scope.NoExistsData = data.result;

                    } else if (data.error == "没有此项目") {
                        layer.msg('没有此项目', {icon: 2});
                    }else if(data.error == '500'){
                        layer.msg('没有可增加项目', {icon: 2});
                        $scope.NoExistsData =[]
                    }
                })
                    .error(function (data, status, headers) {
                        $scope.authError = data.message;
                        $scope.loading = false;
                    });
            },

            //确定增加项目
            addProjectToCustomerAjax: function (name, id, project_id) {
                $http({
                    method: 'GET',
                    url: admin_ROOT + 'user/addProjectToCustomer' + '?user_id=' + id + '&username=' + name + '&project_id=' + project_id,
                }).success(function (data, status, headers) {
                    $scope.loading = false;
                    if (data.sucess == '200') {
                        layer.msg('添加成功', {icon: 1});
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

            //查找可删除项目列表
            prolistAjax: function (name, project_name) {
                if (project_name == undefined) {
                    project_name = ''
                }
                $http({
                    method: 'GET',
                    url: admin_ROOT + 'project/prolist' + '?username=' + name + '&project_name=' + project_name,
                }).success(function (data, status, headers) {
                    $scope.loading = false;
                    if (data.sucess == '200') {
                        $scope.project_listData = data.project_list;

                    } else if (data.findProId == '601') {
                        $scope.project_listData = [];
                        layer.msg('此用户无可删除项目');
                    }
                })
                    .error(function (data, status, headers) {
                        $scope.authError = data.message;
                        $scope.loading = false;
                    });
            },

            //确定删除项目
            delCustomerProjectAjax: function (name, id, project_id) {
                $http({
                    method: 'GET',
                    url: admin_ROOT + 'user/delCustomerProject' + '?user_id=' + id + '&username=' + name + '&project_id=' + project_id,
                }).success(function (data, status, headers) {
                    $scope.loading = false;
                    if (data.sucess == '200') {
                        layer.msg('删除成功', {icon: 1});
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

            //搜索
            searchAjax: function (inputVal) {
                $http({
                    method: 'GET',
                    url: admin_ROOT + 'manage/search' + '?username=' + $scope.userRName + '&project_name=' + inputVal,
                }).success(function (data, status, headers) {
                    $scope.loading = false;
                    $scope.project_listData = data.sucess;
                })
                    .error(function (data, status, headers) {
                        $scope.authError = data.message;
                        $scope.loading = false;
                    });
            },
        };
        mainHttp.userListAjax();

        //增加
        $scope.addProBtn = function (name, id) {
            $scope.searchInputAdd='';
            // console.log('增加项目')
            layer.open({
                title: '增加项目',
                type: 1,
                area: ['800px', '80%'],
                content: $(".addProCon"),
                btn: ['确认', '取消'],
                shade: 0, //不显示遮罩
                yes: function () {
                    var project_id = '';
                    $("input[name=box]").each(function (index, item) {
                        if ($(item).is(':checked')) {
                            if ($(this).attr('id') == undefined) {
                                return;
                            } else {
                                project_id += $(this).attr('id') + ','
                            }
                        }
                    });

                    //去除末尾逗号
                    project_id = project_id.substr(0, project_id.length - 1);
                    // console.log(project_id)
                    if (project_id == '' || project_id == undefined || project_id == 'null') {
                        layer.msg('没有选择项目', {icon: 1});
                        return;
                    }
                    mainHttp.addProjectToCustomerAjax(name, id, project_id);
                },
                btn2: function () {
                }
            });

            mainHttp.searchCustomerNoExistsProAjax(name, id);

            //搜索
            $scope.search = function () {
                if ($scope.searchInputAdd == undefined) {
                    console.log('没搜啥')
                } else if ($scope.searchInputAdd == '') {
                    console.log('显示全部')
                    mainHttp.searchCustomerNoExistsProAjax(name, id)
                } else {
                    //按搜索词搜索
                    mainHttp.searchCustomerNoExistsProAjax(name, id, $scope.searchInputAdd)
                }
            };

            //input没有值的时候显示默认数据
            $('#searchInputAdd').bind('input oninput', function () {
                if ($(this).val() == '') {
                    console.log('input没有值')
                    mainHttp.searchCustomerNoExistsProAjax(name, id)
                }
            });


            //全选
            $("#all").click(function () {
                // this 全选的复选框
                var userids = this.checked;
                //获取name=box的复选框 遍历输出复选框
                $("input[name=box]").each(function () {
                    this.checked = userids;
                });
            });
        };
        //删除
        $scope.remProBtn = function (name, id) {
            $scope.searchInputDel='';
            // console.log('删除项目');
            layer.open({
                title: '删除项目',
                type: 1,
                area: ['800px', '80%'],
                content: $(".removeProCon"),
                btn: ['确认', '取消'],
                shade: 0, //不显示遮罩
                yes: function () {
                    var project_id = '';
                    $(".removeProCon").find("input[name=box]").each(function (index, item) {
                        if ($(item).is(':checked')) {
                            project_id += $(this).attr('remoId') + ','
                        }
                    });
                    //去除末尾逗号
                    project_id = project_id.substr(0, project_id.length - 1);
                    if (project_id == '' || project_id == undefined || project_id == 'null') {
                        layer.msg('没有选择项目', {icon: 1});
                        return;
                    }
                    mainHttp.delCustomerProjectAjax(name, id, project_id);
                },
                btn2: function () {
                }
            });

            mainHttp.prolistAjax(name);

            //搜索
            $scope.search = function () {
                if ($scope.searchInputDel == undefined) {
                    console.log('没搜啥')
                } else if ($scope.searchInputDel == '') {
                    console.log('显示全部')
                    mainHttp.prolistAjax(name)
                } else {
                    //按搜索词搜索
                    mainHttp.prolistAjax(name, $scope.searchInputDel)
                }
            };

            //input没有值的时候显示默认数据
            $('#searchInputDel').bind('input oninput', function () {
                if ($(this).val() == '') {
                    console.log('input没有值')
                    mainHttp.prolistAjax(name)
                }
            });


            //全选
            $("#remAll").click(function () {
                // this 全选的复选框
                var userids = this.checked;
                //获取name=box的复选框 遍历输出复选框
                $("input[name=box]").each(function () {
                    this.checked = userids;
                });
            });

            // //确定删除
            // $scope.yesRem=function () {
            //     var project_id = ''
            //     $("input[name=box]").each(function (index, item) {
            //         if ($(item).is(':checked')) {
            //             project_id += $(this).attr('remoId') + ','
            //         }
            //     });
            //     //去除末尾逗号
            //     project_id = project_id.substr(0, project_id.length - 1);
            //     mainHttp.delCustomerProjectAjax(name, id,project_id);
            // }


        }


    }]);