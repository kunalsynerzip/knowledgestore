'use strict';

/**
 * Main controller for KinoEdu App. All the app level functionality and variable will be defined here.
 */
angular.module('kinoeduApp')
    .controller("AppController",['$window','BasicAuth','$scope','$rootScope','$http','$route','$routeParams','$location','$cookieStore',function($window,BasicAuth,$scope,$rootScope,$http,$route,$routeParams,$location,$cookieStore){
        $rootScope.authUserName = '';
        $rootScope.authUserPwd = '';

        if($cookieStore.get('authData')){
            $rootScope.isAuthUser = true;
        }  else {
            $rootScope.isAuthUser = false;
        }
        $scope.$on(
            "$routeChangeSuccess",
            function( $currentRoute, $previousRoute ){
                $location.path($route.current.action);
            }
        );
        /**
         * TODO: Clear user authentication cookie on window close.
         */
    }]);

/**
 *   Controller for the course route
 */
angular.module('kinoeduApp')
    .controller("CoursesController", function($scope, $http){
        $scope.apiKey = "3a77627518497615f3a8661542e8ec86";
        $scope.results = [];
        $scope.filterText = null;
        $scope.availableGenres = [];
        $scope.genreFilter = null;
        $scope.orderFields = ["Air Date", "Rating"];
        $scope.orderDirections = ["Descending", "Ascending"];
        $scope.orderField = "Air Date"; //Default order field
        $scope.orderReverse = false;

        $scope.init = function() {
            //API requires a start date
            var today = new Date();
            //Create the date string and ensure leading zeros if required
            var apiDate = today.getFullYear() + ("0" + (today.getMonth() + 1)).slice(-2) + "" + ("0" + today.getDate()).slice(-2);
            $http.jsonp('http://api.trakt.tv/calendar/premieres.json/' + $scope.apiKey + '/' + apiDate + '/' + 30 + '/?callback=JSON_CALLBACK').success(function(data) {
                //As we are getting our data from an external source, we need to format the data so we can use it to our desired affect
                //For each day get all the episodes
                angular.forEach(data, function(value, index){
                    //The API stores the full date separately from each episode. Save it so we can use it later
                    var date = value.date;
                    //For each episodes add it to the results array
                    angular.forEach(value.episodes, function(tvshow, index){
                        //Create a date string from the timestamp so we can filter on it based on user text input
                        tvshow.date = date; //Attach the full date to each episode
                        $scope.results.push(tvshow);
                        //Loop through each genre for this episode
                        angular.forEach(tvshow.show.genres, function(genre, index){
                            //Only add to the availableGenres array if it doesn't already exist
                            var exists = false;
                            angular.forEach($scope.availableGenres, function(avGenre, index){
                                if (avGenre == genre) {
                                    exists = true;
                                }
                            });
                            if (exists === false) {
                                $scope.availableGenres.push(genre);
                            }
                        });
                    });
                });
            }).error(function(error) {

                });
        };
        $scope.setGenreFilter = function(genre) {
            $scope.genreFilter = genre;
        }
        $scope.customOrder = function(tvshow) {
            switch ($scope.orderField) {
                case "Air Date":
                    return tvshow.episode.first_aired;
                    break;
                case "Rating":
                    return tvshow.episode.ratings.percentage;
                    break;
            }
        };

        /**
         * TODO: Implement the courses list functionality here and later put into $scope.init().
         */
        $http.get("/api/courses")
            .success(function(data){
                angular.forEach(data, function(value, index){
                    //console.log("Object value is >>> " + value.title);
                })
                //$scope.movies = results.data;
            })
            .error(function(data){
                //error
                console.log("Error: " + data);
            })

    });

/**
 * Controller for the Login and Sign-up route
 */
angular.module('kinoeduApp')
    .controller("LoginController",['BasicAuth','$scope','$rootScope','$http','$location',function(BasicAuth,$scope,$rootScope, $http, $location){
        $scope.isSignup = false;
        $scope.isLogin = true;
        /**
         * Signup and Login form models decelerations
         * @param selectForm
         */

        $scope.userName;
        $scope.userEmail;
        $scope.password;
        $scope.confPassword;
        $scope.userLogEmail;
        $scope.userLogPassword;

        var loginUrl = "/api/users/logIn";
        var signupUrl = "/api/users/signUp";

        /**
         * @desc The function is responsible to register a user
         */
        $scope.signUp = function(){
            var nameStr = $scope.userName.split(" ");
            var firstNameStr = nameStr[0];
            var lastNameStr = nameStr[1];

            var signUpObj = {
                firstName:firstNameStr,
                lastName:lastNameStr,
                email:$scope.userEmail,
                password:$scope.password
            }
            $scope.signUpErrorMessage = '';
            $scope.signUpMessage = '';


            $http.post(signupUrl,signUpObj)
                .success(function(data, status, headers, config){
                    if(200 === status){
                        //TODO: Handle the success appropriately i.e. redirect user to appropriate page.
                        $scope.signUpMessage = 'User has been created successfully!';
                    }
                })
                .error(function(data, status, headers, config){
                    console.log('status >> ' + status);
                    if(404 === status){
                        console.log('Page not found!!!');
                    }
                    else if (status == 400){
                      console.log('validation failed');
                      console.log(data);

                      for (var key in data.errors){
                        var err = data.errors[key];
                        if(err.type){
                            if($scope.signUpErrorMessage == ''){
                                $scope.signUpErrorMessage = err.type;
                            }
                            else{
                                $scope.signUpErrorMessage = $scope.signUpErrorMessage  + ', ' +
                                    err.type;
                            }
                            console.log(err.type);
                        }
                      }
                    }
                })
        }

        /**
         *  @desc Function is responsible for validating user and successfully authenticate
         */
        $scope.login = function(){
            var userEmail = $scope.userLogEmail;
            var userPassword = $scope.userLogPassword;

            BasicAuth.setCredentials(userEmail,userPassword);

            $http.post(loginUrl)
                .success(function(data, status, headers, config){
                    if(status == 200){
                        $rootScope.isAuthUser = true;
                        $location.path('/');
                    }

                })
                .error(function(data, status, headers, config){
                    if(404 === status){
                        console.log('Page not found!!!');
                    }
                    if(status == 401){
                      $scope.loginMessage = 'Invalid email or password';
                      $rootScope.isAuthUser = false;
                      BasicAuth.clearCredentials();
                    }
                })
        }

        /**
         * @param selectForm  - Pass user selection for further processing
         * @desc Responsible to display the appropriate form as per user selection i.e. Sign-up or Login
         */
        $scope.setForm = function(selectForm){
            if(selectForm === 'signup'){
                $scope.isSignup = true;
                $scope.isLogin = false;
            } else {
                $scope.isSignup = false;
                $scope.isLogin = true;
            }
        }

        /**
         * @desc The function is responsible to reset the forms i.e. Sign-up and Login
         * @todo Use these function effectively to erase the user information when he switch between the forms.
         */
        $scope.resetForms = function(){
            $scope.userName = '';
            $scope.userEmail = '';
            $scope.password = '';
            $scope.confPassword = '';
            $scope.userLogEmail = '';
            $scope.userLogPassword = '';
        }
    }]);

/**
 * A controller for the Logout route
 * @todo Integrate the functionality within the login controller itself as there is no need for the Logout route
 */
angular.module('kinoeduApp')
    .controller("LogoutController",['BasicAuth','$scope','$rootScope','$http','$location',function(BasicAuth,$scope,$rootScope, $http, $location){
        var logOutUrl = '/api/logOut';
        $http.post(logOutUrl)
            .success(function(data, status){
                if(status == 200){
                    $rootScope.isAuthUser = false;
                    BasicAuth.clearCredentials();
                    $location.path('/');
                }
            })
            .error(function(data, status, headers, config){
                console.log('Error!!!')
                if(404 === status){
                    console.log('Page not found!!!');
                }
                if(status == 401){

                }
            })
    }]);

/**
 * A controller for the applications navigation menu
 */
angular.module('kinoeduApp')
    .controller("NavbarController",function($scope, $location){
        $scope.isActive = function (viewLocation) {
            console.log('isActive >>> '+viewLocation +" === "+ $location.path());
            return viewLocation === $location.path();
        };
    });

/**
 *  A controller for the create course route
 */
angular.module('kinoeduApp')
    .controller("NewCourseController",function($scope,$http){
        $scope.courseTitle = '';
    });
/**
 * A controller for the Contact Us route
 * @todo Functionality is yet to be implemented
 */
angular.module('kinoeduApp')
    .controller("ContactController",function($scope,$http){

    });

/**
 * A controller for the Blog route
 * @todo Functionality is yet to be implemented
 */
angular.module('kinoeduApp')
    .controller("BlogController",function($scope,$http){

    });