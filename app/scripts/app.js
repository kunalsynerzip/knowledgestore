'use strict';

angular.module('kinoeduApp', ['ngRoute', 'ngSanitize'])
    .config(function ($routeProvider, $locationProvider) {
//    .config(function ($routeProvider) {
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
                controller: 'forgotPasswordController'
            })
            .otherwise({
                redirectTo: '/',
                action:"/"
            });
        $locationProvider.html5Mode(true);
    });



