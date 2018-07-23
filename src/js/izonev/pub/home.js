app
    .controller('homeCtrl', ['$scope', '$rootScope', '$http', '$state', '$q', '$stateParams', 'Sysuser', 'apiStorage', function ($scope, $rootScope, $http, $state, $q, $stateParams, Sysuser, apiStorage) {

        //获取到用户名
        $scope.userRName = apiStorage.getLoc('userName');
        $scope.app.title.Level3 = "客流盒子 | ";
        $scope.app.title.version = " ";
        $scope.app.title.secondary = "";
        $scope.pageSize = 16;
        $scope.cpage = 1;
        $scope.stateNum = "NA";
        $scope.loading = true;

        //方法定义阶段
        var mainHttp = {
            /*   findUserProject: function (name, cpage, pageSize) {
                   $http({
                       method: 'GET',
                       url: USP_SERVER_ROOT1+'?username='+"liangxuan"+"&password="+"888888",
                   }).success(function (res, status, headers) {
                           if (res.code === 2000) {
                               $scope.projectList = res.data.list;
                               //条件
                               var TYPE = "menu_id";
                               //数据容器
                               var m_data = [];
                               //清洗数据
                               for (var i = 0; i < res.data.list.length; i++) {
                                   pushData(res.data.list[i])
                               }

                               function pushData(data) {
                                   //处理数据为空的情况
                                   if (m_data.length == 0) {
                                       brother(data)
                                   } else {
                                       for (var j = 0; j < m_data.length; j++) {
                                           if (data[TYPE] == m_data[j][TYPE]) {
                                               m_data[j].list.push(data)
                                               return;
                                           }
                                       }
                                       brother(data)
                                   }

                                   function brother(data) {
                                       var a = m_box(data[TYPE])
                                       a.list.push(data)
                                       m_data.push(a)

                                   }
                               }
                               //创建对象
                               function m_box(value) {
                                   var box = {list: []}
                                   box[TYPE] = value;
                                   return box;
                               }





                               $scope.m_data=m_data


                               //用户名
                               $scope.proUserName = res.data.propertis.username;

                               $scope.totalPage = res.data.totalPage;
                               $scope.totalRow = res.data.totalPage;
                               $scope.cpage = res.data.cpage;

                           }
                           $scope.loading = false;

                       })
                       .error(function (data, status, headers) {
                           $scope.loading = false;
                           $scope.authError = data.message;
                       });
               },*/

            findUserProject: function (name, cpage, pageSize) {
                $('.m_none').hide()
                var userName = localStorage.getItem('userName')
                var userPas = localStorage.getItem('userPas')

                /* console.log(projectS)
                 $scope.projectList = projectS;
                 //条件
                 var TYPE = "project_id";
                 //数据容器
                 var m_data = [];
                 //清洗数据
                 for (var i = 0; i < projectS.length; i++) {
                     pushData(projectS[i])
                 }

                 function pushData(data) {
                     //处理数据为空的情况
                     if (m_data.length == 0) {
                         brother(data)
                     } else {
                         for (var j = 0; j < m_data.length; j++) {
                             if (data[TYPE] == m_data[j][TYPE]) {
                                 m_data[j].list.push(data)
                                 return;
                             }
                         }
                         brother(data)
                     }

                     function brother(data) {
                         var a = m_box(data[TYPE])
                         a.list.push(data)
                         m_data.push(a)

                     }
                 }
                 //创建对象
                 function m_box(value) {
                     var box = {list: []}
                     box[TYPE] = value;
                     return box;
                 }

                 $scope.m_data=m_data

                /!* //用户名
                 $scope.proUserName = projectS.username;

                 $scope.totalPage = res.data.totalPage;
                 $scope.totalRow = res.data.totalPage;
                 $scope.cpage = res.data.cpage;*!/*/
                $http({
                    method: 'GET',
                    url: USP_SERVER_ROOT1 + 'login' + '?username=' + userName + "&password=" + userPas + "&pageNumber=" + $scope.cpage + "&pageSize=" + $scope.pageSize,
                }).success(function (data, status, headers) {
                    $scope.loading = false;
                    $('.pagination').show()
                    $scope.projectS = data.project_list.list;

                    //分页渲染
                    var totalPage = data.project_list.totalPage
                    $scope.totalRecord=data.project_list.totalRecord
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
                        mainHttp.findUserProject()
                    })
                })
                    .error(function (data, status, headers) {
                        $scope.authError = data.message;
                        $scope.loading = false;
                    });
            },

            /* getPid: function (url) {
                 $http({
                     method: 'get',
                     url: url + "/menu.json",
                     withCredentials: true
                 }).success(function (res) {
                     if (res.basePlusId != undefined) {
                         $scope.basePlusId = res.basePlusId;
                         sessionStorage.setItem("basePlusId", $scope.basePlusId);
                         sessionStorage.setItem("pid", $scope.basePlusId);
                     }

                 }).error(function (res) {
                     console.log("出错了")
                 });
             },*/
        };
        //方法调用
        mainHttp.findUserProject($scope.userRName, $scope.cpage, $scope.pageSize);
        //    搜索
        $scope.search = function () {
            $('.m_none').hide()
            if ($scope.searchInput == undefined) {
                console.log('没搜啥')
            } else if ($scope.searchInput == '') {
                mainHttp.findUserProject($scope.userRName, $scope.cpage, $scope.pageSize);

            } else {
                $http({
                    method: 'GET',
                    url: USP_SERVER_ROOT1 + 'manage/search' + '?username=' + $scope.userRName + "&project_name=" + $scope.searchInput,
                }).success(function (data, status, headers) {
                    $scope.projectS = data.sucess
                    $('.pagination').hide()
                    if (data.searchFail == 'No match found!') {
                        $('.m_none').show()
                        $('.m_item').hide()
                    }
                })
                    .error(function (data, status, headers) {
                        $scope.authError = data.message;
                    });
            }
        }

        /*  //手动选择跳转分页
          $scope.selectPage = function (page) {
              $scope.cpage = page;
              mainHttp.findUserProject($scope.userRName, $scope.cpage, $scope.pageSize);
          };
          */

        //进入单个项目：
        $scope.getProjectName = function (pro) {
            //对于sessionStorage的操作，存值，删值
            sessionStorage.removeItem("basisFolder");
            if (pro.file_name !== undefined) {
                sessionStorage.setItem("ProjectName", pro.file_name);
                sessionStorage.setItem("projectType", pro.file_type);
            } else {
                sessionStorage.setItem("projectId", pro.project_id);
                sessionStorage.setItem("ProjectName", pro.project_id);
                sessionStorage.setItem("projectType", pro.project_version_name);
            }
            sessionStorage.setItem("projectVersion", pro.project_version_name);
            sessionStorage.setItem("mktime", pro.accredit_start_time);
            if (pro.accredit_end_time == "" || pro.accredit_end_time == undefined) {
                var myDate = new Date().format("yyyy-MM-dd");
                sessionStorage.setItem("endtime", myDate);
            } else {
                sessionStorage.setItem("endtime", pro.accredit_end_time);
            }
            // sessionStorage.setItem("city", pro.city);
            sessionStorage.setItem("pid", pro.pid);
            sessionStorage.setItem("key", pro.key);
            sessionStorage.setItem("projectId", pro.project_id);
            sessionStorage.setItem("project_name", pro.project_name);
            $scope.app.projectName = pro.project_name;
            /*   if (pro.basePlusId != undefined) {
                   sessionStorage.setItem("basePlusId", pro.basePlusId);
                   // sessionStorage.setItem("basePluspavilionId", basePlusId[1]);
               } else {
                   var purl = 'js/data/' + pro.project_id;
                   mainHttp.getPid(purl);

               }*/

            sessionStorage.setItem("basePlusId", pro.pid);


            // $state.go(pro.menu_url);
            $state.go("overall.statistical");
            $scope.getMenuNew(pro.project_id)
        };
        //项目id
        var projectId = sessionStorage.getItem("projectId");
        //暂时没有用到
        $scope.$on('$destroy', function () {
            var ProjectName = sessionStorage.getItem("ProjectName");
            if (ProjectName == null || ProjectName == undefined) {
                var url = window.location.href;
                var loc = url.substring(url.lastIndexOf('/') + 1, url.length);
                sessionStorage.setItem("ProjectName", loc);
            }
        });
        //类目切换
        $(function () {

            var width = 1101; //跟外面盒子的宽度一样，或者写成 var width = $(".content").width();
            var ulNum = $(".content ul").length; //获取ul的个数
            var contentWidth = width * ulNum; //获取整个box应该的长度，刚开始box设置成了1100，但是应该把所有的ul防到一行里面去，这样box向左移动的时候才是无缝滚动

            $(".box").width(contentWidth); //给box设置宽度  .width() 是获取宽度  .width(value)是设置宽度

            $(".nav span").click(function () {

                //$(this)表示点击的这个元素 ，.addClass()表示添加的样式名称，.siblings()表示这个元素的所有兄弟级元素，此处表示span，
                // .removeClass()表示删除的样式名称
                $(this).addClass('active').siblings().removeClass('active');

                var clickNum = $(this).index(); //判断点击的是第几个span .index()方法返回第几个，从0开始算起
                //alert(clickNum);

                var moveLeft = clickNum * width * -1; //应该向左移动的距离

                $(".box").animate({'left': moveLeft}, 600);  //通过操作box的left来使box向左移动， .animate 是动画函数
                                                             //第一个参数用{}包含起来，里面的内容形式为 {'left':100,'top':100}，多个用逗号隔开，
                                                             // 表示从当前位置移动到left为100px、top为100px的位置（即left:100px;top:100px处），
                                                             //第二个参数为时间，表示从当前位置移动到第一个参数用时，单位为ms，1000ms=1秒
                                                             //点击的时候一定要点开审查元素，查看box元素的行内样式
            })

        })

        //input没有值的时候显示默认数据
        $('#searchInput').bind('input oninput', function () {
            if ($(this).val() == '') {
                mainHttp.findUserProject($scope.userRName, $scope.cpage, $scope.pageSize);
            }
        });


    }]);