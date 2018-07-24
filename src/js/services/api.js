'use strict';

/* Services */

// Demonstrate how to register services
// In this case it is a simple value service.
var USP_SERVER_ROOT = 'api/login';
//正式
// var USP_SERVER_ROOT1 = 'http://54.223.30.252:8080/lx_box_pro/v1/';
var USP_SERVER_ROOT1 = 'http://192.168.1.116:8080/lx_box_pro/v1/';
// var USP_SERVER_ROOT1 = 'http://214a3s8745.iok.la:22403/lx_box_pro/v1/';
//用户管理正式
// var admin_ROOT = 'http://54.223.30.252:8080/lx_box_pro/v1/';
//测试
var admin_ROOT = 'http://192.168.1.116:8080/lx_box_pro/v1/';
// var admin_ROOT = 'http://214a3s8745.iok.la:22403/lx_box_pro/v1/';
// var admin_ROOT = 'http://52.80.137.218:8080/lx_box_pro/v1/';
//测试
// var USP_SERVER_ROOT1 = 'http://192.168.1.177:8080/lx_box_pro/v1/';
//水街
// var USP_SERVER_ROOT1 = 'http://192.168.0.105:8080/lx_box_pro/v1/';

//测试
// var API_FORMAL="http://183.232.42.231:8088/jdi-api/v1/manage";
//正式
var API_FORMAL="https://api-jdi.jiguang.cn/v1/manage";
var token = localStorage.getItem("access_token");
var api = angular.module('api.service', []);
api.factory('AdministrativeUnit', [
    function () {
        var retrieve_suburb_by_id = function(bid) {
            for (var i = 0; i < suburbs.length; i++) {
                if (suburbs[i].suburb_id == bid) {
                    return suburbs[i];
                }
            };
            return null;
        };
        return {
            getSuburbById: function(bid) { return retrieve_suburb_by_id(bid); }
        };
    }
]);


api.factory('apiStorage',
    function () {
        return {
            //sessionStorage
            put: function(key, value) { return sessionStorage.setItem(key, value); },
            get: function(key) { return sessionStorage.getItem(key);},
            putObject: function(key, value) { return sessionStorage.setItem(key, JSON.stringify(value));},
            getObject: function(key) { return JSON.parse(sessionStorage.getItem(key)); },
            //localStorage
            putLoc: function(key, value) { return localStorage.setItem(key, value); },
            getLoc: function(key) { return localStorage.getItem(key);},
            putObjectLoc: function(key, value) { return localStorage.setItem(key, JSON.stringify(value));},
            getObjectLoc: function(key) { return JSON.parse(localStorage.getItem(key)); },
            //remove、clear
            remove: function(key) { return sessionStorage.removeItem(key); },
            clear: function() { return sessionStorage.clear(); },
            removeLoc: function(key) { return localStorage.removeItem(key); },
            clearLoc: function() { return localStorage.clear(); }
        };
    }
);


//系统用户 登陆
api.factory('Sysuser', ['$http',
    function ($http) {
        return {
         /*   //登陆验证 get Token
            login: function(name,pwd) {
                var pName=name+":"+pwd;
                var e64 = Base64.encode(pName);
                return $http({
                    method: 'GET',
                    url: USP_SERVER_ROOT1+'?username='+"liangxuan"+"&password="+"888888",

                });
            },*/
          /*  disable: function() {
                var token = localStorage.getItem("access_token");
                return $http({
                    method: 'PUT',
                    url: USP_SERVER_ROOT+'/token/disable',
                    headers: { 'Authorization': "Bearer "+token},

                });
            },*/
            findUserProject: function(name,cpage,pageSize) {
                var getData="?propertis[username]="+name+"&cpage="+cpage+"&pageSize="+pageSize;
                var token = localStorage.getItem("access_token");
                return $http({
                    method: 'GET',
                    url: API_FORMAL+'/findUserProject'+getData,
                    headers: {'Authorization': "Bearer "+token},
                    withCredentials: true
                });
            },
         /*   findMenu: function(pid) {
                var token = localStorage.getItem("access_token");
                return $http({
                    method: 'GET',
                    // url: API_FORMAL+'/findMenuData?project_id='+pid,
                    url: USP_SERVER_ROOT1+'login?aaaaa',
                    headers: {'Authorization': "Bearer "+token},
                    withCredentials: true
                });
            },
*/


            retrieve: function(p, token) {
                var postData = {
                    page:p,
                    user_token:token
                };
                return $http.post(USP_SERVER_ROOT+'/admin/lists', postData);
            },

        };
    }
]);

//客户画像
api.factory('Advertising', ['$http',
    function ($http) {
        return {
            uploadImg: function(img, token) {
                var postData = {
                    "image": img,
                    "user_token": token
                };
                return $http.post(USP_SERVER_ROOT+'/ads/upload_image', postData);
            }
        };
    }
]);

//其他
api.factory('Experts', ['$http',
    function ($http) {
        return {
            retrieve: function(p) {
                var postData = {pagination:{page: p, pagesize: 11}};
                return $http.post(USP_SERVER_ROOT+'/app/consultant/search', postData);
            },
            searchByKeyword: function(token, kw, p) {
                var postData = {access_token: token, keyword: kw, pagination:{page: p, pagesize: 10}};
                return $http.post(USP_SERVER_ROOT+'/secure/consultant/search', postData);
            }
        };
    }
]);

api.factory('Bargain', ['$http',
    function ($http) {
        return {
            retrieve: function(p) {
                var postData = {pagination:{page: p, pagesize: 11}};
                return $http.post(USP_SERVER_ROOT+'/app/consultant/search', postData);
            }
        };
    }
]);