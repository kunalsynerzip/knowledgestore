'use strict';

angular.module('kinoEduApp', ['ngRoute','ngCookies','ngSanitize','kinoEduDirectives','kinoEduServices','kinoEduFilters'])
    .config(function ($routeProvider,$locationProvider,$provide) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'CoursesController',
                action:"/"
            })
            .when('/login', {
                templateUrl: 'views/loginForm.html',
                controller: 'LoginController',
                action:"login"
            })
            .when('/logout', {
                templateUrl: 'views/main.html',
                controller: 'LogoutController',
                action:"logout"
            })
            .when('/contact', {
                templateUrl: 'views/contactUs.html',
                controller: 'ContactController',
                action:"contact"
            })
            .when('/blog', {
                templateUrl: 'views/blog.html',
                controller: 'BlogController',
                action:"blog"
            })
            .when('/forgotPassword', {
                templateUrl: 'views/forgotPassword.html',
                controller: 'ForgotPasswordController'
            })
            .when('/activation', {
                templateUrl: 'views/userActivation.html'
            })
            .when('/changePass', {
                templateUrl: 'views/changePassword.html',
                controller : 'ChangePasswordController'
            })
            .when('/newCourse', {
                templateUrl: 'views/createCourse.html',
                controller: 'CreateCourseController',
                action:"newCourse"
            })
            .when('/viewCourse', {
                templateUrl: 'views/viewCourse.html',
                controller: 'ViewCourseController',
                action:"viewCourse"
            })
            .otherwise({
                redirectTo: '/',
                action:"/"
            });

        $locationProvider
            .html5Mode(true);
    });

/**
 * Initialize Services Module
 */

angular.module('kinoEduServices',[]);

/**
 * Initialize Directives Module
 */
angular.module('kinoEduDirectives',[]);

/**
 * Initialize Filters Module
 */
angular.module('kinoEduFilters',[]);


