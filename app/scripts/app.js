'use strict';

angular.module('kinoeduApp', ['ngSanitize','passwordConfirmation'])
    .config(function ($routeProvider,$locationProvider) {
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
            .otherwise({
                redirectTo: '/',
                action:"/"
            });
        $locationProvider.html5Mode(true);
    });



