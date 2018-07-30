app
    .controller('uprolistCtrl', ['$scope', '$rootScope', '$http', '$state', '$q', '$stateParams', 'Sysuser', 'apiStorage', function ($scope, $rootScope, $http, $state, $q, $stateParams, Sysuser, apiStorage) {

        //获取到用户名
        $scope.userRName = apiStorage.getLoc('userName');
        $scope.app.title.Level3 = "客流盒子 | ";
        $scope.app.title.version = " ";
        $scope.app.title.secondary = "";
        $scope.pageSize = 16;
        $scope.cpage = 1;
        $scope.stateNum = "NA";
        $scope.loading = true;


        var minHttp = {
            //项目信息列表
            userListAjax: function () {
                $http({
                    method: 'GET',
                    url: admin_ROOT + 'project/prolist' + '?username=' + $scope.userRName,
                }).success(function (data, status, headers) {
                    $scope.loading = false;
                    $scope.project_listData = data.project_list;
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
            //删除
            projectManageAjax: function (operation_type,module_id,project_id,project_type,project_name) {
                $http({
                    method: 'GET',
                    url: admin_ROOT + 'project/projectManage?'+'operation_type='+operation_type+'&module_id='+module_id+"&project_id="+project_id+'&project_type='+project_type,
                }).success(function (data, status, headers) {
                    $scope.loading = false;
                    console.log(data)
                    if(data.success=='200'){
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

            //增加项目
            addProjectAjax: function (operation_type, module_id, project_type, pid, project_id, project_name, project_desc, accredit_start_time, accredit_end_time, project_company, project_city, project_address, project_province, project_county, project_desc_client) {
                $http({
                    method: 'GET',
                    url: admin_ROOT + 'project/projectManage' + '?operation_type=' + operation_type + '&module_id=' + module_id + '&project_type=' + project_type + '&pid=' + pid + '&project_id=' + project_id + '&project_name=' + project_name + '&project_desc=' + project_desc + '&accredit_start_time=' + accredit_start_time + '&accredit_end_time=' + accredit_end_time + '&project_company=' + project_company + '&project_city=' + project_city + '&project_address=' + project_address + '&project_province=' + project_province + '&project_county=' + project_county + '&project_desc_client=' + project_desc_client,
                }).success(function (data, status, headers) {
                    $scope.loading = false;
                    // console.log(data)
                    if (data.success == '200') {
                        layer.msg('添加项目成功', {icon: 1});
                        setTimeout(function () {
                            layer.closeAll()
                        }, 1000)
                    } else if (data.success == '400') {
                        layer.msg('项目id重复，增加失败');
                    }

                })
                    .error(function (data, status, headers) {
                        $scope.authError = data.message;
                        $scope.loading = false;
                    });
            },

            //查找项目原本信息--编辑项目
            findAllByProject_idAjax: function (project_id) {
                $http({
                    method: 'GET',
                    url: admin_ROOT + 'project/findAllByProject_id' + '?project_id=' + project_id,
                }).success(function (data, status, headers) {
                    $scope.loading = false;
                    // console.log(data)
                    $scope.pid = data.pid;
                    // $scope.project_id=data.project_id;
                    $scope.project_name = data.project_name;
                    $scope.project_desc = data.project_desc;
                    $scope.accredit_start_time = data.accredit_start_time;
                    $scope.accredit_end_time = data.accredit_end_time;
                    $scope.project_company = data.project_company;
                    $scope.project_city = data.project_city;
                    $scope.project_address = data.project_address;
                    $scope.project_province = data.project_province;
                    $scope.project_county = data.project_county;
                    $scope.project_desc_client = data.project_desc_client;

                    //后台是根据project_id进行修改项目，前端隐藏
                    $('.project_id-box').hide()

                })
                    .error(function (data, status, headers) {
                        $scope.authError = data.message;
                        $scope.loading = false;
                    });
            },

            //确定修改
            projectManageAjax1: function (operation_type, module_id, pid, project_name, project_desc, accredit_start_time, accredit_end_time, project_company, project_city, project_address, project_province, project_county, project_desc_client, project_id) {
                $http({
                    method: 'GET',
                    url: admin_ROOT + 'project/projectManage' + '?operation_type=' + operation_type + '&module_id=' + module_id + '&pid=' + pid + '&project_name=' + project_name + '&project_desc=' + project_desc + '&accredit_start_time=' + accredit_start_time + '&accredit_end_time=' + accredit_end_time + '&project_company=' + project_company + '&project_city=' + project_city + '&project_address=' + project_address + '&project_province=' + project_province + '&project_county=' + project_county + '&project_desc_client=' + project_desc_client + '&project_id=' + $scope.project_idYes,
                }).success(function (data, status, headers) {
                    $scope.loading = false;
                    // console.log(data)
                    if (data.success == 200) {
                        layer.msg('项目编辑成功', {icon: 1});
                        setTimeout(function () {
                            layer.closeAll()
                            window.location.reload()
                        }, 1000)
                    }
                })
                    .error(function (data, status, headers) {
                        $scope.authError = data.message;
                        $scope.loading = false;
                    });
            },

        };
        minHttp.userListAjax();

        //搜索
        $scope.search = function () {
            if ($scope.searchInput == undefined) {
                console.log('没搜啥')
            } else if ($scope.searchInput == '') {
                minHttp.userListAjax()
            } else {
                //按搜索词搜索
                minHttp.searchAjax($scope.searchInput)
            }
        };

        //input没有值的时候显示默认数据
        $('#searchInput').bind('input oninput', function () {
            if ($(this).val() == '') {
                minHttp.userListAjax()
            }
        });

        //删除项目
        $scope.proDel=function(project_id,project_name){
            //1增加   2删除   3修改
            var operation_type='2';
            var module_id='1';
            var project_id=project_id;
            //1项目信息管理   2模块管理
            var project_type='1';

            layer.confirm('确定删除' + project_name + '这个项目吗？', {
                btn: ['取消', '删除'] //按钮
            }, function () {
                layer.msg('取消成功', {icon: 1});
            }, function () {
                minHttp.projectManageAjax(operation_type,module_id,project_id,project_type);
            });
        };

        //增加项目
        $scope.addProClick=function () {
            $('.project_id-box').show();
            //清空所有值
            $scope.pid = '';
            $scope.project_id='';
            $scope.project_name = '';
            $scope.project_desc = '';
            $scope.accredit_start_time = '';
            $scope.accredit_end_time = '';
            $scope.project_company = '';
            $scope.project_city = '';
            $scope.project_address = '';
            $scope.project_province = '';
            $scope.project_county = '';
            $scope.project_desc_client = '';
            layer.open({
                title: '增加项目',
                type: 1,
                area: ['900px', '80%'],
                content: $(".editCon"),
                btn: ['确认', '取消'],
                shade: 0, //不显示遮罩
                yes: function () {
                    var warningText = ''
                    //正则
                    var regNumber = /^[0-9]*$/;
                    // 1增加项目   2删除项目   3修改项目
                    var operation_type = '1';
                    //模块id  暂时写死
                    var module_id = '1,2,3,4,5,6,7,8,9,10,11,18,19,20,21,22,23,24,25,26,27,28,29,30';
                    //1项目信息管理   2模块管理
                    var project_type = '1';

                    var pid = $('#pid').val();
                    var project_id = $('#project_id').val();
                    var project_name = $('#project_name').val();
                    var project_desc = $('#project_desc').val();
                    var accredit_start_time = $('#accredit_start_time').val();
                    var accredit_end_time = $('#accredit_end_time').val();
                    var project_company = $('#project_company').val();
                    var project_city = $('#project_city').val();
                    var project_address = $('#project_address').val();
                    var project_province = $('#project_province').val();
                    var project_county = $('#project_county').val();
                    var project_desc_client = $('#project_desc_client').val();



                    if (pid == undefined || pid == '') {
                        layer.msg('警告！pid不可为空');
                        return false
                    } else if (!regNumber.test(pid)) {
                        layer.msg('警告！pid不符合规范');
                        return false
                    }
                    if (project_id == undefined || project_id == '') {
                        layer.msg('警告！项目id不可为空');
                        return false
                    } else if (!regNumber.test(project_id)) {
                        layer.msg('警告！项目id不符合规范');
                        return false
                    }
                    if (project_name == undefined || project_name == '') {
                        layer.msg('警告！项目名称不可为空');
                        return false
                    }
                    if (accredit_start_time == undefined || accredit_start_time == '') {
                        layer.msg('警告！项目开始时间不可为空');
                        return false
                    }
                    if (accredit_end_time == undefined || accredit_end_time == '') {
                        layer.msg('警告！项目结束时间不可为空');
                        return false
                    }
                    if (project_company == undefined || project_company == '') {
                        layer.msg('警告！项目所属公司不可为空');
                        return false
                    }

                    minHttp.addProjectAjax(operation_type, module_id, project_type, pid, project_id, project_name, project_desc, accredit_start_time, accredit_end_time, project_company, project_city, project_address, project_province, project_county, project_desc_client)


                },
                btn2: function () {
                    // window.location.reload()
                }
            });

        }

        //编辑项目
        $scope.editClick=function(project_id){
            minHttp.findAllByProject_idAjax(project_id);
            $scope.project_idYes = project_id;
            layer.open({
                title: '编辑项目',
                type: 1,
                area: ['900px', '80%'],
                content: $(".editCon"),
                btn: ['确认', '取消'],
                shade: 0, //不显示遮罩
                yes: function (project_id) {

                    var warningText = ''
                    //正则
                    var regNumber = /^[0-9]*$/;
                    // 1增加项目   2删除项目   3修改项目
                    var operation_type = '3';
                    //模块id  暂时写死
                    var module_id = '1';
                    //1项目信息管理   2模块管理
                    var project_type = '1';


                    var pid = $('#pid').val();
                    var project_id = $('#project_id').val();
                    var project_name = $('#project_name').val();
                    var project_desc = $('#project_desc').val();
                    var accredit_start_time = $('#accredit_start_time').val();
                    var accredit_end_time = $('#accredit_end_time').val();
                    var project_company = $('#project_company').val();
                    var project_city = $('#project_city').val();
                    var project_address = $('#project_address').val();
                    var project_province = $('#project_province').val();
                    var project_county = $('#project_county').val();
                    var project_desc_client = $('#project_desc_client').val();


                    if (pid == undefined || pid == '') {
                        layer.msg('警告！pid不可为空');
                        return false
                    } else if (!regNumber.test(pid)) {
                        layer.msg('警告！pid不符合规范');
                        return false
                    }
                    if (project_name == undefined || project_name == '') {
                        layer.msg('警告！项目名称不可为空');
                        return false
                    }
                    if (accredit_start_time == undefined || accredit_start_time == '') {
                        layer.msg('警告！项目开始时间不可为空');
                        return false
                    }
                    if (accredit_end_time == undefined || accredit_end_time == '') {
                        layer.msg('警告！项目结束时间不可为空');
                        return false
                    }
                    if (project_company == undefined || project_company == '') {
                        layer.msg('警告！项目所属公司不可为空');
                        return false
                    }

                    minHttp.projectManageAjax1(operation_type, module_id, pid, project_name, project_desc, accredit_start_time, accredit_end_time, project_company, project_city, project_address, project_province, project_county, project_desc_client, project_id)

                },
                btn2: function () {
                    // window.location.reload()
                }
            });

        };

        //普通用户点击提示无权限
        $scope.identity=function(){
            layer.msg('暂无权限，请联系管理员');
        };



        /**
         * laydate 文档地址：http://www.layui.com/doc/modules/laydate.html
         * */

        //初始化开始日期
        laydate.render({
            elem: '#accredit_start_time'
        });

        //初始化结束日期
        laydate.render({
            elem: '#accredit_end_time',
            // min:new Date().format("yyyy-MM-dd"),//设置最小时间范围
            // max:new Date().format("yyyy-MM-dd")//设置最大时间范围
        });

    }]);