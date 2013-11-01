'use strict';

angular.module('kinoeduApp')
    .controller("AppController",function($scope,$http,$route,$routeParams,$location){
        $scope.$on(
            "$routeChangeSuccess",
            function( $currentRoute, $previousRoute ){
                console.log($route.current.action)
                $location.path($route.current.action)
            }
        );
    });
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
         * Implement the courses list functionality here and later put into $scope.init().
         */
        $http.get("/api/courses")
            .success(function(data){
                //Success;
                //console.log("Success: " + data);
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

angular.module('kinoeduApp')
    .controller("LoginController",['$scope', '$http', '$location', 'appConfig'
        ,function($scope, $http, $location, appConfig){
        $scope.isSignup = false;
        $scope.isLogin = true;
        /**
         * Signup and login form variable decelerations
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

        $scope.signup = function(){

            console.log('in sign up');

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
                    console.log('Data >> ',data);
                    console.log('Status >> ',status);
                    if(200 === status){

                     if(data.statusCode == appConfig.statusCodeSuccess){
                         //user has been created successfully
                         //TODO - handle it properly
                         $scope.signUpMessage = 'user has been created successfully!';
                     }
                     else{
                       //something failed :(
                         $scope.signUpErrorMessage = 'failure : ' + data.msg
                     }
                    }
                })
                .error(function(data, status, headers, config){
                    console.log('status >> ' + status);
                    if(404 === status){
                        console.log('Page not found!!!');
                        //$scope.signUpMessage = 'user has been created successfully!';
                        $scope.signUpErrorMessage = 'user has not been created properly : ' + data;
                    console.log('Status >> ',status)
                    }
                })
        }

        $scope.login = function(){
            var userEmail = $scope.userLogEmail;
            var userPassword = $scope.userLogPassword;

            var loginObj = {
                email:$scope.userLogEmail,
                password:$scope.userLogPassword
            }

            $http.post(loginUrl,loginObj)
                .success(function(data, status, headers, config){
                    console.log('Data >> ',data);
                    console.log('Status >> ',status)
                    if(status == 200){

                        if(data.statusCode == appConfig.statusCodeSuccess){
                            //handle successful login
                            //redirect to home.. ??
                            $location.path('/');
                        }
                        else{
                            $scope.loginMessage = data.msg
                        }

                    }

                })
                .error(function(data, status, headers, config){
                    if(404 === status){
                        console.log('Page not found!!!');
                    }
                    if(status == 401){
                      $scope.loginMessage = 'invalid email or password';

                    }
                })
        }

        $scope.setForm = function(selectForm){
            if(selectForm === 'signup'){
                $scope.isSignup = true;
                $scope.isLogin = false;
            } else {
                $scope.isSignup = false;
                $scope.isLogin = true;
            }
        }
    }]);

angular.module('kinoeduApp')
    .controller("navbarController",function($scope, $location){
        $scope.isActive = function (viewLocation) {
            //console.log(viewLocation);
            return viewLocation === $location.path();
        };
    });

angular.module('kinoeduApp')
    .controller("ContactController",function($scope,$http){

    });

angular.module('kinoeduApp')
    .controller("BlogController",function($scope,$http){

    });

