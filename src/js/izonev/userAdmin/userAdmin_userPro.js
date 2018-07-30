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
            searchCustomerNoExistsProAjax: function (name, id) {
                $http({
                    method: 'GET',
                    url: admin_ROOT + 'user/searchCustomerNoExistsPro' + '?user_id=' + id + '&username=' + name,
                }).success(function (data, status, headers) {
                    $scope.loading = false;
                    if (data.sucess == '200') {
                        $scope.NoExistsData = data.result
                    }
                })
                    .error(function (data, status, headers) {
                        $scope.authError = data.message;
                        $scope.loading = false;
                    });
            },

            //确定增加项目
            addProjectToCustomerAjax: function (name, id,project_id) {
                $http({
                    method: 'GET',
                    url: admin_ROOT + 'user/addProjectToCustomer' + '?user_id=' + id + '&username=' + name+'&project_id='+project_id,
                }).success(function (data, status, headers) {
                    $scope.loading = false;
                    if (data.sucess == '200') {
                        layer.msg('添加成功', {icon: 1});
                        setTimeout(function () {
                            layer.closeAll();
                        },1000)
                    }
                })
                    .error(function (data, status, headers) {
                        $scope.authError = data.message;
                        $scope.loading = false;
                    });
            },

            //查找可删除项目列表
            prolistAjax: function (name) {
                $http({
                    method: 'GET',
                    url: admin_ROOT + 'project/prolist' + '?username=' + name,
                }).success(function (data, status, headers) {
                    $scope.loading = false;
                    if (data.sucess == '200') {

                        $scope.project_listData = data.project_list
                    }else if(data.findProId=='601'){
                        $scope.project_listData = [];
                        layer.msg('此用户无可删除项目');
                        setTimeout(function () {
                            // window.location.reload()
                        },1000)
                    }
                })
                    .error(function (data, status, headers) {
                        $scope.authError = data.message;
                        $scope.loading = false;
                    });
            },

            //确定删除项目
            delCustomerProjectAjax: function (name, id,project_id) {
                $http({
                    method: 'GET',
                    url: admin_ROOT + 'user/delCustomerProject' + '?user_id=' + id + '&username=' + name+'&project_id='+project_id,
                }).success(function (data, status, headers) {
                    $scope.loading = false;
                    if (data.sucess == '200') {
                        layer.msg('删除成功', {icon: 1});
                        setTimeout(function () {
                            // window.location.reload()
                            layer.closeAll();
                        },1000)
                    }
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
            // console.log('增加项目')
            layer.open({
                title: '增加项目',
                type: 1,
                area: ['800px', '80%'],
                content: $(".addProCon"),
                btn: ['确认', '取消'],
                shade: 0, //不显示遮罩
                yes: function(){
                    var project_id = '';
                    $("input[name=box]").each(function (index, item) {
                        if ($(item).is(':checked')) {
                            if($(this).attr('id')==undefined){
                                return;
                            }else {
                                project_id += $(this).attr('id') + ','
                            }
                        }
                    });

                    //去除末尾逗号
                    project_id = project_id.substr(0, project_id.length - 1);
                    // console.log(project_id)
                    if(project_id==''||project_id==undefined||project_id=='null'){
                        layer.msg('没有选择项目', {icon: 1});
                        return;
                    }
                    mainHttp.addProjectToCustomerAjax(name, id,project_id);
                },
                btn2: function(){}
            });

            mainHttp.searchCustomerNoExistsProAjax(name, id);

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
        $scope.remProBtn = function (name,id) {
            // console.log('删除项目');
            layer.open({
                title: '删除项目',
                type: 1,
                area: ['800px', '80%'],
                content: $(".removeProCon"),
                btn: ['确认', '取消'],
                shade: 0, //不显示遮罩
                yes: function(){
                    var project_id = '';
                    $(".removeProCon").find("input[name=box]").each(function (index, item) {
                        if ($(item).is(':checked')) {
                            project_id += $(this).attr('remoId') + ','
                        }
                    });
                    //去除末尾逗号
                    project_id = project_id.substr(0, project_id.length - 1);
                    if(project_id==''||project_id==undefined||project_id=='null'){
                        layer.msg('没有选择项目', {icon: 1});
                        return;
                    }
                    mainHttp.delCustomerProjectAjax(name, id,project_id);
                },
                btn2: function(){}
            });

            mainHttp.prolistAjax(name);
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