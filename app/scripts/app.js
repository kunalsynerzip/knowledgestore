'use strict';
angular.module('kinoEduApp', ['ngRoute','ngCookies','ngSanitize','kinoEduDirectives','kinoEduServices','kinoEduFilters','http-auth-interceptor'])
    .config(function ($routeProvider,$locationProvider,$httpProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'CoursesController',
                action:"/",
                isAuthReq:'N'
            })
            .when('/login', {
                templateUrl: 'views/loginForm.html',
                controller: 'LoginController',
                action:"login",
                isAuthReq:'N'
            })
            .when('/logout', {
                templateUrl: 'views/main.html',
                controller: 'LogoutController',
                action:"logout",
                isAuthReq:'N'
            })
            .when('/contact', {
                templateUrl: 'views/contactUs.html',
                controller: 'ContactController',
                action:"contact",
                isAuthReq:'Y'
            })
            .when('/blog', {
                templateUrl: 'views/blog.html',
                controller: 'BlogController',
                action:"blog",
                isAuthReq:'Y'
            })
            .when('/forgotPassword', {
                templateUrl: 'views/forgotPassword.html',
                controller: 'ForgotPasswordController',
                action:'forgotPassword',
                isAuthReq:'N'
            })
            .when('/activation', {
                templateUrl: 'views/userActivation.html',
                isAuthReq:'N'
            })
            .when('/changePass', {
                templateUrl: 'views/changePassword.html',
                controller : 'ChangePasswordController',
                isAuthReq:'Y'
            })
            .when('/newCourse', {
                templateUrl: 'views/createCourse.html',
                controller: 'CreateCourseController',
                action:"newCourse",
                isAuthReq:'Y'
            })
            .when('/viewCourse', {
                templateUrl: 'views/viewCourse.html',
                controller: 'ViewCourseController',
                action:"viewCourse",
                isAuthReq:'N'
            })
            .otherwise({
                redirectTo: '/',
                action:"/",
                isAuthReq:'N'
            });

        $locationProvider
            .html5Mode(true);
    })
    .run(['ApiCommunicationService','$rootScope','$location',function(ApiCommObj,$rootScope,$location){
        $rootScope.$on('$routeChangeStart',function(evnt,next,current){
            if(next.$$route.isAuthReq === 'Y'){
                ApiCommObj.getData("/api/user/current")
                    .success(function(data, status, headers, config){
                        console.log('data = ' , data , ', status = ' , status);
                        if(status == 200){
                            $rootScope.currentUser = data.firstName + " " + data.lastName;
                            //$rootScope.isAuthUser = true;
                        } else if(status == 401){
                            console.log('ERROR!!!')
                            $rootScope.currentUser = null;
                            //$rootScope.isAuthUser = false;
                        }
                    })
                    .error(function(data){
                        $rootScope.currentUser = null;
                        //$rootScope.isAuthUser = false;
                    });
            }
        })
    }]);

/**
 * Initialize Services Module
 */

angular.module('kinoEduServices',[])

/**
 * Initialize Directives Module
 */
angular.module('kinoEduDirectives',['http-auth-interceptor']);

/**
 * Initialize Filters Module
 */
angular.module('kinoEduFilters',[]);


