'use strict';
angular.module('kinoeduApp', ['ngRoute','ngCookies','ngSanitize','passwordConfirmation'])
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
            .when('/newCourse', {
                templateUrl: 'views/createCourse.html',
                controller: 'NewCourseController',
                action:"newCourse"
            })
            .otherwise({
                redirectTo: '/',
                action:"/"
            });

        $locationProvider
            .html5Mode(true);
    });



