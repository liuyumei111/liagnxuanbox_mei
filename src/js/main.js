'use strict';

/* Controllers */
var ip='http://54.223.30.252:8080/'

angular.module('app')
    .controller('AppCtrl', ['$scope', '$http', '$state', '$translate', '$localStorage', '$window', '$rootScope', '$q','apiStorage','AdministrativeUnit','Sysuser',
      function ($scope, $http, $state, $translate, $localStorage, $window, $rootScope, $q,apiStorage,AdministrativeUnit,Sysuser) {

      // add 'ie' classes to html
      var isIE = !!navigator.userAgent.match(/MSIE/i);
      if(isIE){ angular.element($window.document.body).addClass('ie');}
      if(isSmartDevice( $window ) ){ angular.element($window.document.body).addClass('smart')};
          //获取登录用于信息以及access_token
          var token = apiStorage.getLoc('access_token');
          var userName = apiStorage.getLoc('userName');
          if (token === undefined || token === '' || token === null) {
              $state.go('access.signin');
          } else {
              $state.go('access.home');
          }
          //api接口
          var api={
              //测试接口
              // apiFormal:"http://183.232.42.231:8088/jdi-api/",
              //正式接口
              apiFormal:"https://api-jdi.jiguang.cn/",
          };

          //退出登陆
          $scope.exit = function () {
              apiStorage.clearLoc();
              // Sysuser.disable().success(function(res, status, headers) {
              // });
              $state.go('access.signin');
          };
          $scope.toUrl = function(state){
              $state.go(state);
          }
          //路由跳转
          var estateFolders = "";
          $scope.getMenuOld = function () {

              var ProjectName = sessionStorage.getItem("ProjectName");
              var projectType = sessionStorage.getItem("projectType");
              var projectId=sessionStorage.getItem("projectId");
              projectId=parseInt(projectId)

          };
          $scope.LevelMenu = [];
          $scope.getMenuNew=function (pid) {
        /*      Sysuser.findMenu(pid)
                  .success(function(res, status, headers) {
                      if(res.code===2000){
                          $scope.LevelMenu=res.data;
                          var m=modifyJosnKey($scope.LevelMenu,"menu_name","menuName");
                          $scope.LevelMenu=modifyJosnKey(m,"menu_url","url")
                      }
                  })
                  .error(function(data, status, headers) {

                  });*/
          };
          var getMenuOld = function (url) {
              var deferred = $q.defer();
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
                  deferred.resolve();
              }).error(function (res) {
                  console.log("出错了")


              });
              return deferred.promise;
          };
          var myDate = new Date();
          var day=myDate.getDate()<10?'0'+myDate.getDate():myDate.getDate();
          var dlsa=myDate.getFullYear()+''+(myDate.getMonth()+1)+day;

          // config
          // $scope.jiguang_favicon = "img/favicon.ico";
          $scope.jiguang_favicon = "img/liangxuan_ico.ico";
          $scope.jiguang_logo = "img/liangxuan_logo.png";
          $scope.jiguang_slogan = "img/liangxuan_slogan.png";
          $scope.jiguang_title = "良轩科技";
          $scope.jiguang_name = "良轩科技";
      $scope.app = {
        token:token,
        userName:userName,
        favicon: $scope.jiguang_favicon,
        logo: $scope.jiguang_logo,
        slogan: $scope.jiguang_slogan,
        name: $scope.jiguang_name,
        copyright: $scope.jiguang_title,
        title:{
          home: $scope.jiguang_title,
          version : '',
          secondary:'',
          Level3:'',

        },
        basisTem:{
          oIndex:0
        },
        estateFolder: {
          Folder:"",
          estateDate:"",
        },
        basisFolder: {
          Folder:"",
          basisDate:"",
          basisTemaid:"",
          startDate:"",
          endDate:""

        },
        basisFolderTemV:{
          basisDate:"",
          basisTemaid:"",
          startDate:"",
          endDate:""
        },

        retailStoresFolder: {
          Folder:'',
          retailStoresDate:"",
        },
        exhibitionDev:api.apiFormal+"v1/mall/getExhibition",
        appUrl:"",
        devUrl: api.apiFormal,
        permisUrl: api.apiFormal+'/v1/login/findUserProject?username=',
        fullUrl: api.apiFormal+'v1',
        izoneUrl: api.apiFormal+'v1/mall/',
        url: 'js/data/',
        toolUrl:api.apiFormal+"v1/tool/",
        mallsUrl: api.apiFormal+"v1/mall/findCharts",
        apiUrl: api.apiFormal+"v1/izone/",
        echartsDl: api.apiFormal+"v1/mall/downData",

        icon:{
          screenshots:"image://"+ip+"imges/2.png",
          table:"image://"+ip+"imges/1.png",
          download:"image://"+ip+"imges/3.png",
        },

        exhibition:{
          pavilion_idPlus:1,
          pavilion_id:1,
          token:'ECAD2345ACISEREJF',
          id:'1',
          startDate:'20171031',
          endDate:'20171103',
          date:dlsa
        },
        version: '1.3.3',
        // for chart colors
        color: {
          primary: '#7266ba',
          info: '#23b7e5',
          success: '#27c24c',
          warning: '#fad733',
          danger: '#f05050',
          light: '#e8eff0',
          dark: '#3a3f51',
          black: '#1c2b36'
        },
        chart: {
          color: ["#6e67fa", "#67c9fa", "#58c0a1", "#96e8d7", "#eccb44", "#fefa53"],
          lineColor: "#6a6b6b",
          fontColor: "#434444",
          show: true,
          hide: false,
          fontSize: 12,
          lineStyle: "dashed",
          lineStyle2: "solid",
          white: "#fff",
          gray: "#686762",
          borderColor: "#303333"


        },
        mapStyle: {},
        settings: {
          themeID: 1,
          navbarHeaderColor: 'bg-white-only',
          navbarHeaderColor2: 'bg-white-only-g',
          navbarHeaderColorv3: 'bg-black-v3',
          izoneborde: 'izone-border-1',
          navbarCollapseColor: 'bg-white-only',
          asideColor: 'bg-black',
          lyonmenubg: 'ly-onmenu-bg',
          tablestriped: 'table-striped',
          //主题设置app-content-body
          contentBody: {
            "background-color": ""
          },
          Panel: {
            "background-color": ""
          },
          Panelbg: {
            "background-color": ""
          },
          Paneleading: {
            "background-color": ""
          },
          fontColor: {
            "color": "#434444"
          },
          bgLight: {
            "background-color": ""
          },
          bgLightTop: {
            "background-color": "",
            "border-top": "1px solid #dee5e7"
          },
          borderBottom: {
            "border-bottom": ""
          },
          tabContainer: {
            "background-color": "#f0f3f4!important"
          },
          button: {
            "background-color": "",
            "border-color": "",
            "color": ""

          },
          select: {
            "background-color": "",
            "border-color": "",
            "color": ""
          },
          listItem: {
            "background-color": "",
            "border-color": ""
          },
          input: {
            "background-color": "",
            "color": "",
            "border-color": ""
          },
          bbcolor: {
            "border-bottom": "1px solid #dee5e7",
            "border-color": "#edf1f2"
          },
          headerFixed: true,
          asideFixed: false,
          asideFolded: false,
          asideDock: false,
          container: false
        }
      };

          $rootScope.$on('$stateChangeSuccess', function (ev, toState, toParams, from, fromParams) {
              $scope.userRName = apiStorage.getLoc('userName');
              var ProjectName = sessionStorage.getItem("ProjectName");
              // $scope.app.token = apiStorage.getLoc('access_token');
              var appkey="9c418970093b352d1a8fb7e8";
              var secret="13f9644a74ba92c3ebe916a3";
              $scope.app.token =Base64.encode(appkey+":"+secret);
              if ($scope.app.token === '' || $scope.app.token === null || $scope.app.token === undefined) {
                  $state.go('access.signin');
                  return false;
              }else {
                  $scope.app.exhibitionDev=api.apiFormal+"v1/mall/getExhibition?";
                  $scope.app.echartsDl=api.apiFormal+"v1/mall/downData";
                  $scope.app.url = 'js/data/' + ProjectName;
                  $scope.app.permisUrl = 'api/izone/pro' + '_' + $scope.userRName + '.json';

              }
              if (ProjectName !== undefined&&ProjectName!== null) {
                  var projectId=sessionStorage.getItem("projectId");
                  projectId=parseInt(projectId);
                  $scope.getMenuNew(projectId);

              }

          });
      // save settings to local storage
      if ( angular.isDefined($localStorage.settings) ) {
        $scope.app.settings = $localStorage.settings;
      } else {
        $localStorage.settings = $scope.app.settings;
      }
      $scope.$watch('app.settings', function(){
        if( $scope.app.settings.asideDock  &&  $scope.app.settings.asideFixed ){
          // aside dock and fixed must set the header fixed.
          $scope.app.settings.headerFixed = true;
        }
        // for box layout, add background image
        $scope.app.settings.container ? angular.element('html').addClass('bg') : angular.element('html').removeClass('bg');
        // save to local storage
        $localStorage.settings = $scope.app.settings;
      }, true);

      // angular translate
      $scope.lang = { isopen: false };
      $scope.langs = {en:'English', de_DE:'German', it_IT:'Italian'};
      $scope.selectLang = $scope.langs[$translate.proposedLanguage()] || "English";
      $scope.setLang = function(langKey, $event) {
        // set the current lang
        $scope.selectLang = $scope.langs[langKey];
        // You can change the language during runtime
        $translate.use(langKey);
        $scope.lang.isopen = !$scope.lang.isopen;
      };

      function isSmartDevice( $window )
      {
          // Adapted from http://www.detectmobilebrowsers.com
          var ua = $window['navigator']['userAgent'] || $window['navigator']['vendor'] || $window['opera'];
          // Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
          return (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
      }

  }]);
