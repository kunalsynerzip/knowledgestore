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
        $scope.init = function() {
            $scope.isAuthUser = false;
            $scope.currentUser = null;
            $http.get("/api/user/current")
                .success(function(data, status, headers, config){
                    console.log('data = ' + data + ', status = ' + status);
                    if(status == 200){
                        $scope.currentUser = data.firstName;
                        $scope.isAuthUser = true;
                    } else if(status == 401){
                        $scope.currentUser = null;
                        $scope.isAuthUser = false;
                    }
                })
                .error(function(data){
                    $scope.currentUser = null;
                    $scope.isAuthUser = false;
                });
            $http.get("/api/courses")
                .success(function(data){
                    console.log(data);
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
        };
    });

angular.module('kinoeduApp')
    .controller("LoginController", function($scope, $http, $location, $window){
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
        var fbLoginUrl = '/api/users/fbLogin';
        var githubLoginUrl = '/api/users/githubLogin';
        var googleLoginUrl = '/api/users/googleLogin';

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
                        //user has been created successfully
                        //TODO - handle it properly
                        $scope.signUpMessage = 'user has been created successfully!';
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
                            $location.path('/');
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

        $scope.fbLogin = function(){
            $window.location.href = fbLoginUrl;
        }
        $scope.githubLogin = function(){
            $window.location.href = githubLoginUrl;
        }
        $scope.googleLogin = function(){
            $window.location.href = googleLoginUrl;
        }

    });

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

angular.module('kinoeduApp')
    .controller('forgotPasswordController', function($scope, $http){

      $scope.sendEmailToForgotPass = function(){

          var userEmail = $scope.userEmail;
          console.log(userEmail);

        var ForgotPassObj = {
            email:userEmail
        }

        $scope.message = '';
        $scope.errorMessage = '';

        $http.post('/api/users/forgotPass',ForgotPassObj)
            .success(function(data, status, headers, config){
                console.log('Data >> ',data);
                console.log('Status >> ',status)
                if(status == 200){
                    $scope.message = 'Email has been sent with reset password.'
                }

            })
            .error(function(data, status, headers, config){
                console.log('Status >> ',status);
                if(404 === status){
                    console.log('Page not found!!!');
                }
                if(status == 400){
                    $scope.errorMessage = 'Invalid Email';

                }
            })

      }

});

angular.module('kinoeduApp')
    .controller('changePasswordController', function($scope, $http){

        $scope.changePass = function(){

            var currentPassword = $scope.currentPassword;
            var newPassword = $scope.newPassword;
            var confirmPassword = $scope.confirmPassword;

            /*
            * validate new and confirm password
            * */

            console.log(currentPassword + ' ' + newPassword + ' ' + confirmPassword);

            var changePassObj = {
                currentPass : currentPassword,
                newPass : newPassword
            }

            $scope.message = '';
            $scope.errorMessage = '';

            $http.post('/api/users/changePass',changePassObj)
                .success(function(data, status, headers, config){
                    console.log('Data >> ',data);
                    console.log('Status >> ',status)
                    if(status == 200){
                        $scope.message = 'Password changed successfully.'
                    }

                })
                .error(function(data, status, headers, config){
                    console.log('Status >> ',status);
                    if(404 === status){
                        console.log('Page not found!!!');
                    }
                    if(status == 400){
                        $scope.errorMessage = 'Invalid password!!';

                    }
                })

        }

    });


