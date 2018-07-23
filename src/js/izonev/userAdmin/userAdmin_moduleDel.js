app
    .controller('umoduleDelCtrl', ['$scope', '$rootScope', '$http', '$state', '$q', '$stateParams', 'Sysuser', 'apiStorage', function ($scope, $rootScope, $http, $state, $q, $stateParams, Sysuser, apiStorage) {

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
        var project_Id=$stateParams.projectId;
        console.log(project_Id)

        var mainHttp = {
            //查找有的项目模块
            endAddAjax: function () {
                $http({
                    method: 'GET',
                    url: admin_ROOT + 'project/endAdd' + '?project_id=' +project_Id,
                }).success(function (data, status, headers) {
                    if(data.success=='200'){
                        $scope.loading = false;
                        //把后台返回的一维数组处理成二维数组
                        var json=data.list;
                        // console.log(json)
                        let jsonToNavList = function (json) {
                            //找出所有一级菜单
                            let navOnes = init(["pro_level"]);
                            //找出所有二级菜单
                            let navTwos = init(["pro_level", "two_level"]);
                            //找出所有三级菜单
                            let newTrees = json;

                            //三级菜单归类到二级菜单中
                            newTrees.map(c => {
                                navTwos.map(b => {
                                    if (c.pro_level == b.pro_level && c.two_level == b.two_level && c.three_level)
                                        b.list.push(c)
                                })
                            })
                            //二级菜单归类到一级菜单中
                            navTwos.map(b => {
                                navOnes.map(a => {
                                    if (b.pro_level == a.pro_level && b.two_level)
                                        a.list.push(b)
                                })
                            })

                            /**
                             * 根据指定的属性值去重 要去重的属性值需为字符串类型
                             * @param {String} keys 属性值数组
                             */
                            function init(keys) {
                                let newList = [], _tmp = [];
                                for (let i = 0; i < json.length; i++) {
                                    let item = { ...json[i] };
                                    let keyVal = "";
                                    for (let j = 0; j < keys.length; j++) keyVal += item[keys[j]];
                                    if (item.three_level) continue;
                                    if (_tmp.indexOf(keyVal) === -1) {
                                        _tmp.push(keyVal);
                                        item.list = [];//为每个菜单初始化一个容器
                                        newList.push(item);
                                    }
                                }
                                return newList;
                            }

                            return navOnes;
                        };
                        $scope.arrData=jsonToNavList(json)[0];
                        console.log($scope.arrData)
                    }else if(data.success=='400'){
                        layer.open({
                            title: '提示~'
                            ,content: '没有项目模块可以删除'
                        });
                        setTimeout(function () {
                            $state.go('userAdmin.module');
                        },1000)
                    }
                })
                    .error(function (data, status, headers) {
                        $scope.authError = data.message;
                        $scope.loading = false;
                    });
            },

            //删除模块
            projectManageAjax: function (operation_type,project_type,project_id,moduleId) {
                $http({
                    method: 'GET',
                    url: admin_ROOT + 'project/projectManage' + '?operation_type=' + operation_type+'&project_type='+project_type+'&project_id='+project_id+'&moduleId='+moduleId,
                }).success(function (data, status, headers) {
                    $scope.loading = false;
                    console.log(data);
                    layer.msg('删除成功', {icon: 1});
                    // $state.go('userAdmin.module');
                })
                    .error(function (data, status, headers) {
                        $scope.authError = data.message;
                        $scope.loading = false;
                    });
            },
        };
        mainHttp.endAddAjax();


        //确定删除
        $scope.panelBtn=function () {
            var operation_type='2';
            var project_type='2';
            // var projectId='27';
            var module_id = '';

            $("input[name=box]").each(function (index, item) {
                if ($(item).is(':checked')) {
                    module_id += $(this).attr('module_id') + ','
                }
            });
            //去除末尾逗号
            module_id = module_id.substr(0, module_id.length - 1);
            console.log(module_id)

            mainHttp.projectManageAjax(operation_type,project_type,project_Id,module_id)
        }










    }]);