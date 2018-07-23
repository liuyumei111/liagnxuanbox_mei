app
    .controller('uaddProjectCtrl', ['$scope', '$rootScope', '$http', '$state', '$q', '$stateParams', 'Sysuser', 'apiStorage', function ($scope, $rootScope, $http, $state, $q, $stateParams, Sysuser, apiStorage) {

        //获取到用户名
        $scope.userRName = apiStorage.getLoc('userName');
        $scope.app.title.Level3 = "客流盒子 | ";
        $scope.app.title.version = " ";
        $scope.app.title.secondary = "";
        $scope.pageSize = 16;
        $scope.cpage = 1;
        $scope.stateNum = "NA";
        $scope.loading = true;
        //修改的参数
        var project_id = $stateParams.project_id;

        var mainHttp = {
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
                            $state.go('userAdmin.proList');
                        }, 1000)
                    } else if (data.success == '400') {
                        layer.msg('项目id重复，增加项目失败');
                        setTimeout(function () {
                            window.location.reload()
                        }, 1000)
                    }


                })
                    .error(function (data, status, headers) {
                        $scope.authError = data.message;
                        $scope.loading = false;
                    });
            },
            //修改项目
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
            projectManageAjax: function (operation_type, module_id, pid, project_name, project_desc, accredit_start_time, accredit_end_time, project_company, project_city, project_address, project_province, project_county, project_desc_client, project_id) {
                $http({
                    method: 'GET',
                    url: admin_ROOT + 'project/projectManage' + '?operation_type=' + operation_type + '&module_id=' + module_id + '&pid=' + pid + '&project_name=' + project_name + '&project_desc=' + project_desc + '&accredit_start_time=' + accredit_start_time + '&accredit_end_time=' + accredit_end_time + '&project_company=' + project_company + '&project_city=' + project_city + '&project_address=' + project_address + '&project_province=' + project_province + '&project_county=' + project_county + '&project_desc_client=' + project_desc_client + '&project_id=' + $scope.project_idYes,
                }).success(function (data, status, headers) {
                    $scope.loading = false;
                    // console.log(data)
                    if (data.success == 200) {
                        layer.msg('项目编辑成功', {icon: 1});
                        setTimeout(function () {
                            $state.go('userAdmin.proList');
                        }, 1000)
                    }
                })
                    .error(function (data, status, headers) {
                        $scope.authError = data.message;
                        $scope.loading = false;
                    });
            },
        };

        if (project_id === undefined) {
            // console.log('增加代码')
            $scope.panelBtn = function () {
                var warningText = ''
                //正则
                var regNumber = /^[0-9]*$/;
                // 1增加项目   2删除项目   3修改项目
                var operation_type = '1';
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

                mainHttp.addProjectAjax(operation_type, module_id, project_type, pid, project_id, project_name, project_desc, accredit_start_time, accredit_end_time, project_company, project_city, project_address, project_province, project_county, project_desc_client)
            };
        } else {
            // console.log('修改代码')
            //project_id确定修改的地方要用到
            $scope.project_idYes = project_id

            mainHttp.findAllByProject_idAjax(project_id);
            $scope.panelBtn = function () {
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

                mainHttp.projectManageAjax(operation_type, module_id, pid, project_name, project_desc, accredit_start_time, accredit_end_time, project_company, project_city, project_address, project_province, project_county, project_desc_client, project_id)

            };

        }

        //警告弹窗
        $scope.warning = function (value) {
            $('.warning').show()
            $('.warningText').html(value)
            $('.close').click(function () {
                $('.warning').hide()
            })
        }


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