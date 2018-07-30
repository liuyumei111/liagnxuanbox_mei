app
    .controller('umoduleCtrl', ['$scope', '$rootScope', '$http', '$state', '$q', '$stateParams', 'Sysuser', 'apiStorage', function ($scope, $rootScope, $http, $state, $q, $stateParams, Sysuser, apiStorage) {

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

            //查找增加的项目模块
            notShowAjax: function (project_Id) {
                $http({
                    method: 'GET',
                    url: admin_ROOT + 'project/notShow' + '?project_id=' +project_Id,
                }).success(function (data, status, headers) {
                    if(data.success=='200'){
                        $scope.loading = false;
                        if(data.list.length==0){
                            layer.open({
                                title: '提示~'
                                ,content: '没有项目模块可以增加'
                            });
                        }
                        $('.moduleMask').show();
                        $scope.setting = {
                            //check属性放在data属性之后，复选框不起作用
                            check: {
                                //是否显示多选框
                                enable: true
                            },
                            data: {
                                key: {
                                    //每个节点的名称
                                    name: "module_name"
                                },
                               /* simpleData: {
                                    //开启解析普通json格式数据，如果是正常数据格式 false即可
                                    enable: true,
                                    //父节点id
                                    pIdKey: "two_level",
                                    //当前节点id
                                    idKey: "module_name"
                                }*/
                            }
                        };
                        var datas =data.list;
                        var jsonToNavList = function (json) {
                            //找出所有一级菜单
                            var navOnes = init(["pro_level"]);
                            //找出所有二级菜单
                            var navTwos = init(["pro_level", "two_level"]);
                            //找出所有三级菜单
                            var newTrees = json;

                            //三级菜单归类到二级菜单中
                            newTrees.map(function(c) {
                                navTwos.map(function(b){
                                    if (c.pro_level == b.pro_level && c.two_level == b.two_level && c.three_level)
                                        b.children.push(c)
                                })
                            })
                            // 二级菜单归类到一级菜单中
                            navTwos.map(function(b) {
                                navOnes.map(function(a) {
                                    if (b.pro_level == a.pro_level && b.two_level)
                                        a.children.push(b)
                                })
                            })

                            /**
                             * 根据指定的属性值去重 要去重的属性值需为字符串类型
                             * @param {String} keys 属性值数组
                             */
                            function init(keys) {
                                var newList = [], _tmp = [];
                                for (var i = 0; i < json.length; i++) {
                                    var item = JSON.parse(JSON.stringify(json[i]));
                                    var keyVal = "";
                                    for (var j = 0; j < keys.length; j++) keyVal += item[keys[j]];

                                    if (keys.length == 1) //获取一级跳过二、三级
                                        if (item.three_level || item.two_level) continue;
                                    if (keys.length == 2) //获取二级跳过三级
                                        if (item.three_level) continue;

                                    if (_tmp.indexOf(keyVal) === -1) {
                                        _tmp.push(keyVal);
                                        item.children = [];//为每个菜单初始化一个容器
                                        newList.push(item);
                                    }
                                }
                                return newList;
                            }
                            return navOnes;
                        };
                        // console.log(jsonToNavList(datas))
                        $.fn.zTree.init($("#tree"), $scope.setting, jsonToNavList(datas));
                        // console.log(jsonToNavList(datas))
                        var treeObj = $.fn.zTree.getZTreeObj("tree");
                        treeObj.expandAll(true);
                    }else if(data.success=='400'){
                        layer.open({
                            title: '提示~'
                            ,content: '没有项目模块可以增加'
                        });
                        console.log('没有项目模块可以增加400')
                        $.fn.zTree.init($("#tree"), $scope.setting,'');
                    }
                })
                    .error(function (data, status, headers) {
                        $scope.authError = data.message;
                        $scope.loading = false;
                    });
            },

            //查找删除的项目模块
            endAddAjax: function (project_Id) {
                $http({
                    method: 'GET',
                    url: admin_ROOT + 'project/endAdd' + '?project_id=' +project_Id,
                }).success(function (data, status, headers) {
                    if(data.success=='200'){
                        $scope.loading = false;

                        if(data.list.length==0){
                            layer.open({
                                title: '提示~'
                                ,content: '没有项目模块可以删除'
                            });
                        }
                        //把后台返回的一维数组处理成二维数组
                        $('.moduleMask').show();
                        $scope.setting1 = {
                            //check属性放在data属性之后，复选框不起作用
                            check: {
                                //是否显示多选框
                                enable: true
                            },
                            data: {
                                key: {
                                    //每个节点的名称
                                    name: "module_name"
                                },
                                /* simpleData: {
                                     //开启解析普通json格式数据，如果是正常数据格式 false即可
                                     enable: true,
                                     //父节点id
                                     pIdKey: "two_level",
                                     //当前节点id
                                     idKey: "module_name"
                                 }*/
                            }
                        };
                        var datas =data.list;
                        var jsonToNavList = function (json) {
                            //找出所有一级菜单
                            var navOnes = init(["pro_level"]);
                            //找出所有二级菜单
                            var navTwos = init(["pro_level", "two_level"]);
                            //找出所有三级菜单
                            var newTrees = json;

                            //三级菜单归类到二级菜单中
                            newTrees.map(function(c) {
                                navTwos.map(function(b){
                                    if (c.pro_level == b.pro_level && c.two_level == b.two_level && c.three_level)
                                        b.children.push(c)
                                })
                            })
                            //二级菜单归类到一级菜单中
                            navTwos.map(function(b){
                                navOnes.map(function(a){
                                    if (b.pro_level == a.pro_level && b.two_level)
                                        a.children.push(b)
                                })
                            })

                            /**
                             * 根据指定的属性值去重 要去重的属性值需为字符串类型
                             * @param {String} keys 属性值数组
                             */
                            function init(keys) {
                                var newList = [], _tmp = [];
                                for (var i = 0; i < json.length; i++) {
                                    var item = JSON.parse(JSON.stringify(json[i]));
                                    var keyVal = "";
                                    for (var j = 0; j < keys.length; j++) keyVal += item[keys[j]];

                                    if (keys.length == 1) //获取一级跳过二、三级
                                        if (item.three_level && item.two_level) continue;
                                    if (keys.length == 2) //获取二级跳过三级
                                        if (item.three_level) continue;

                                    if (_tmp.indexOf(keyVal) === -1) {
                                        _tmp.push(keyVal);
                                        item.children = [];//为每个菜单初始化一个容器
                                        newList.push(item);
                                    }
                                }
                                return newList;
                            }
                            return navOnes;
                        }
                        $.fn.zTree.init($("#tree"), $scope.setting1, jsonToNavList(datas));
                        // console.log(jsonToNavList(datas))
                        var treeObj = $.fn.zTree.getZTreeObj("tree");
                        treeObj.expandAll(true);

                    }else if(data.success=='400'){
                        layer.open({
                            title: '提示~'
                            ,content: '没有项目模块可以删除'
                        });
                        $.fn.zTree.init($("#tree"), $scope.setting1,'');
                    }
                })
                    .error(function (data, status, headers) {
                        $scope.authError = data.message;
                        $scope.loading = false;
                    });
            },

            //增加/删除模块    operation_type=1  增加     operation_type=2  删除
            projectManageAjax: function (operation_type,project_type,project_id,moduleId,module_name) {
                $http({
                    method: 'GET',
                    url: admin_ROOT + 'project/projectManage' + '?operation_type=' + operation_type+'&project_type='+project_type+'&project_id='+project_id+'&moduleId='+moduleId+'&module_name='+module_name,
                }).success(function (data, status, headers) {
                    $scope.loading = false;
                    // console.log(data);
                    layer.msg('操作成功', {icon: 1});
                    setTimeout(function () {
                        layer.closeAll();
                    },500)
                    // $('.moduleMask').hide()
                    // window.location.reload()
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
        $scope.moduleAdd=function (project_Id) {
            //渲染可增加列表
            mainHttp.notShowAjax(project_Id);
            layer.open({
                title: '增加',
                type: 1,
                area: ['500px', '80%'],
                content: $(".moduleMask"),
                btn: ['确认', '取消'],
                shade: 0, //不显示遮罩
                yes: function(){
                    var operation_type='1';
                    var project_type='2';
                    var module_id = '';
                    var module_name='';
                    var treeObj = $.fn.zTree.getZTreeObj("tree");
                    var checked = treeObj.getCheckedNodes(true);
                    for(var i=0;i<checked.length;i++){
                        if(checked[i].module_id=='1'||checked[i].module_id=='18'){
                            continue;
                        }
                        if(checked[i].module_id=='11'||checked[i].module_id=='10'){
                            continue;
                        }
                        module_id+= checked[i].module_id+',';
                        module_name+= checked[i].module_name+',';
                    }
                    //去除末尾逗号
                    module_id = module_id.substr(0, module_id.length - 1);
                    module_name = module_name.substr(0, module_name.length - 1);

                    // console.log(module_id);
                    mainHttp.projectManageAjax(operation_type,project_type,project_Id,module_id,module_name)
                },
                btn2: function(){
                    // window.location.reload()
                }
            });
            return;
        };
        //删除
        $scope.moduleDel=function (project_Id) {
            //渲染可删除列表
            mainHttp.endAddAjax(project_Id);
            layer.open({
                title: '删除',
                type: 1,
                area: ['500px', '80%'],
                content: $(".moduleMask"),
                btn: ['确认', '取消'],
                shade: 0, //不显示遮罩
                yes: function(){
                    var operation_type='2';
                        var project_type='2';
                        var module_id = '';
                        var module_name = '';
                        var treeObj = $.fn.zTree.getZTreeObj("tree");
                        var checked = treeObj.getCheckedNodes(true);
                        for(var i=0;i<checked.length;i++){
                            if(checked[i].module_id=='1'||checked[i].module_id=='18'){
                                continue;
                            }
                            if(checked[i].module_id=='11'||checked[i].module_id=='10'){
                                continue;
                            }
                            module_id+= checked[i].module_id+','
                            module_name+= checked[i].module_name+','
                        }
                        //去除末尾逗号
                        module_id = module_id.substr(0, module_id.length - 1);
                        module_name = module_name.substr(0, module_name.length - 1);
                        // console.log(module_id)
                        mainHttp.projectManageAjax(operation_type,project_type,project_Id,module_id,module_name)
                },
                btn2: function(){
                    // window.location.reload()
                }
            });
        };
        //搜索
        $scope.search = function () {
            if ($scope.searchInput == undefined) {
                alert('没搜啥')
            } else if ($scope.searchInput == '') {
                //展示所有内容
                mainHttp.userListAjax();
            } else {
                //按照关键字搜索
                mainHttp.searchAjax($scope.searchInput)
            }
        };

        //普通用户点击提示无权限
        $scope.identity=function(){
            layer.msg('暂无权限，请联系管理员');
        };

        //input没有值的时候显示默认数据
        $('#searchInput').bind('input oninput', function () {
            if ($(this).val() == '') {
                mainHttp.userListAjax();
            }
        });

    }]);