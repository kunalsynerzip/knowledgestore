'use strict';

/**
 * Main controller for KinoEdu App. All the app level functionality and variable will be defined here.
 */
angular.module('kinoEduApp')
    .controller("AppController",['$window','$scope','$rootScope','$http','$route','$routeParams','$location','$cookieStore',function($window,$scope,$rootScope,$http,$route,$routeParams,$location,$cookieStore){
        $rootScope.authUserName = '';
        $rootScope.authUserPwd = '';
        $rootScope.currentNavRoute = '/';

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
angular.module('kinoEduApp')
    .controller("CoursesController",['ApiCommunicationService','$scope','$http','$rootScope',function(ApiCommObj,$scope, $http,$rootScope){
        $rootScope.currentNavRoute = '/';
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
            /*$rootScope.isAuthUser = false;
            $rootScope.currentUser = null;*/
            /*ApiCommObj.getData("/api/user/current")
                .success(function(data, status, headers, config){
                    console.log('data = ' , data , ', status = ' , status);
                    if(status == 200){
                        $rootScope.currentUser = data.firstName + " " + data.lastName;
                        $rootScope.isAuthUser = true;
                    } else if(status == 401){
                        $rootScope.currentUser = null;
                        $rootScope.isAuthUser = false;
                    }
                })
                .error(function(data){
                    $rootScope.currentUser = null;
                    $rootScope.isAuthUser = false;
                });*/

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
        ApiCommObj.getData("/api/courses")
            .success(function(data){
                angular.forEach(data, function(value, index){
                    //console.log("Object value is >>> " + value.title);
                })
            })
            .error(function(data){
                console.log("Error: " + data);
            })
    }]);


/**
 * Controller for the Login and Sign-up route
 */
angular.module('kinoEduApp')
    .controller("LoginController",['ApiCommunicationService','$scope','$rootScope','$http','$location','$window',function(ApiCommObj,$scope,$rootScope, $http, $location,$window){
        $rootScope.currentNavRoute = '/login';
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
        var fbLoginUrl = '/api/users/fbLogin';
        var githubLoginUrl = '/api/users/githubLogin';
        var googleLoginUrl = '/api/users/googleLogin';

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


            ApiCommObj.postData(signupUrl,signUpObj)
                .success(function(data, status, headers, config){
                    if(200 === status){
                        //TODO: Handle the success appropriately i.e. redirect user to appropriate page.
                        $scope.signUpMessage = 'User has been created successfully!';
                    }
                })
                .error(function(data, status, headers, config){
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

            ApiCommObj.postData(loginUrl,{email:userEmail,password:userPassword})
                .success(function(data, status, headers, config){
                    if(status == 200){
                        $rootScope.currentUser = data.firstName+" "+data.lastName;
                        $rootScope.isAuthUser = true;
                        console.log('$rootScope.isAuthUser >>> ',$rootScope.isAuthUser)
                        $location.path('/');
                    }

                })
                .error(function(data, status, headers, config){
                    if(404 === status){
                        console.log('Page not found!!!');
                    }
                    if(status == 401){
                        $scope.loginMessage = 'Invalid email or password';
                        $rootScope.currentUser = null;
                        $rootScope.isAuthUser = false;
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
        $scope.fbLogin = function(){
            $window.location.href = fbLoginUrl;
        }
        $scope.githubLogin = function(){
            $window.location.href = githubLoginUrl;
        }
        $scope.googleLogin = function(){
            $window.location.href = googleLoginUrl;
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
angular.module('kinoEduApp')
    .controller("LogoutController",['ApiCommunicationService','$scope','$rootScope','$http','$location',function(ApiCommObj,$scope,$rootScope, $http, $location){
        $rootScope.currentNavRoute = '/logout';
        var logOutUrl = '/api/logOut';
        ApiCommObj.getData(logOutUrl)
            .success(function(data, status){
                if(status == 200){
                    $rootScope.currentUser = null;
                    $rootScope.isAuthUser = false;
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
angular.module('kinoEduApp')
    .controller("NavbarController",function($scope, $location){
        $scope.isActive = function (viewLocation) {
            //console.log('isActive >>> '+viewLocation +" === "+ $location.path());
            return viewLocation === $location.path();
        };
    });

/**
 *  A controller for the create course route
 */
angular.module('kinoEduApp')
    .controller("CreateCourseController",['CreateCourseData','ApiCommunicationService','$scope','$location','$rootScope',function(CreateCourseData,ApiCommObj,$scope,$location,$rootScope){
        $rootScope.currentNavRoute = '/newCourse';
        $scope.courseTitle = CreateCourseData.courseTitle;
        $scope.courseCategoryArr = CreateCourseData.courseCategoryArr;
        $scope.selectedCategory = CreateCourseData.selectedCategory;
        $scope.courseLevelArr = CreateCourseData.courseLevelArr
        $scope.selectedLevel = CreateCourseData.selectedLevel;
        $scope.courseSummary = CreateCourseData.courseSummary;
        $scope.courseTags = CreateCourseData.courseTags;
        $scope.courseKeyword = '';
        $scope.courseDetails = CreateCourseData.courseDetails;
        $scope.coursePromoVideo = CreateCourseData.coursePromoVideo;
        $scope.courseAuthor = CreateCourseData.courseAuthor;
        $scope.sectionData = CreateCourseData.sectionData;

        /*$scope.addTopic = CreateCourseData.addTopic;
         $scope.addSection = CreateCourseData.addSection;*/

        $scope.addTopic = function($event,sectionId){
            CreateCourseData.addTopic($event,sectionId);
        }

        $scope.addSection = function($event){
            CreateCourseData.addSection($event);
        }

        $scope.addTag = function() {
            if ($scope.courseKeyword.length == 0) {
                return;
            }
            $scope.courseTags.push({name: $scope.courseKeyword});
            $scope.courseKeyword = '';
        }

        $scope.deleteTag = function(key) {
            if ($scope.courseTags.length > 0 &&
                $scope.courseKeyword.length == 0 &&
                key === undefined) {
                $scope.courseTags.pop();
            } else if (key != undefined) {
                $scope.courseTags.splice(key, 1);
            }
        }

        $scope.$watchCollection('[courseTitle,courseCategoryArr,selectedCategory,courseLevelArr,selectedLevel,courseSummary,courseDetails,coursePromoVideo,courseAuthor,courseKeyword,sectionData]',function(watchValArr){
            CreateCourseData.courseTitle = watchValArr[0];
            CreateCourseData.courseCategoryArr = watchValArr[1];
            CreateCourseData.selectedCategory = watchValArr[2];
            CreateCourseData.courseLevelArr = watchValArr[3];
            CreateCourseData.selectedLevel = watchValArr[4];
            CreateCourseData.courseSummary = watchValArr[5];
            CreateCourseData.courseDetails = watchValArr[6];
            CreateCourseData.coursePromoVideo = watchValArr[7];
            CreateCourseData.courseAuthor = watchValArr[8];
            CreateCourseData.courseKeyword = watchValArr[9];
            CreateCourseData.sectionData = watchValArr[10];
        })

        $scope.createCourse = function($event){
            if($event.keyCode == 13 ){
                $event.preventDefault();
                return;
            }

            var courseData = {
                title: $scope.courseTitle,
                summary: $scope.courseSummary,
                vidLink : $scope.coursePromoVideo,
                comments: [{body: ''}],
                tags: $scope.courseTags,
                preRequisite : $scope.courseDetails,
                category : $scope.selectedCategory,
                authors : $scope.courseAuthor,
                level : $scope.selectedLevel,
                rating : 0,
                courseMaterial : $scope.sectionData
            }

            ApiCommObj.postData('api/courses',courseData)
                .success(function(data,status){
                    if(status == 200){
                        console.log('The course with following data is created!!!\n',data);
                    }
                    $scope.resetCourseForm();
                    $location.path('/viewCourse');
                })
                .error(function(data,status,headers, config){
                    if(404 === status){
                        console.log('Page not found!!!');
                    }
                    if(401 === status){
                        console.log('ERROR!!!',data)
                    }

                    if(400 === status){
                        console.log(data)
                    }
                })

            if($scope.isCreated){

            } else {

            }
        }

        $scope.resetCourseForm = function(){
            $scope.createCourseForm.$setPristine();

            var courseTagLength = $scope.courseTags.length;
            for(var i=0 ; i< courseTagLength; i++){
                $scope.deleteTag(0);
            }

            $scope.courseTitle = '';
            $scope.selectedCategory = '';
            $scope.selectedLevel = '';
            $scope.courseSummary = '';
            $scope.courseTags = [];
            $scope.courseKeyword = '';
            $scope.courseDetails = '';
            $scope.coursePromoVideo = '';
            $scope.courseAuthor = '';
            $scope.sectionData = [
                {
                    sectionNumber:1,
                    sectionTitle:"",
                    topics:[
                        {
                            topicNumber:1,
                            topicTitle:"",
                            topicContent:"",
                            topicVidLink:""
                        }
                    ]
                }
            ];
        }
    }]);

/**
 * A controller for the View Course route
 * @todo Functionality is yet to be implemented
 */
angular.module('kinoEduApp')
    .controller("ViewCourseController",function($scope,$http,$rootScope){
        $rootScope.currentNavRoute = '/viewCourse';
    });

/**
 * A controller for the Contact Us route
 * @todo Functionality is yet to be implemented
 */
angular.module('kinoEduApp')
    .controller("ContactController",function($scope,$http,$rootScope){
        $rootScope.currentNavRoute = '/contact';
    });

/**
 * A controller to handle the 'Forgot Password' task/route
 */
angular.module('kinoEduApp')
    .controller('ForgotPasswordController',['ApiCommunicationService','$scope','$http',function(ApiCommObj,$scope, $http){

        $scope.sendEmailToForgotPass = function(){

            var userEmail = $scope.userEmail;
            var ForgotPassObj = {
                email:userEmail
            }

            $scope.message = '';
            $scope.errorMessage = '';

            ApiCommObj.postData('/api/users/forgotPass',ForgotPassObj)
                .success(function(data, status, headers, config){
                    if(status == 200){
                        $scope.message = 'Email has been sent with reset password.'
                    }

                })
                .error(function(data, status, headers, config){
                    if(404 === status){
                        console.log('Page not found!!!');
                    }
                    if(status == 400){
                        $scope.errorMessage = 'Invalid Email';

                    }
                })

        }

    }]);

angular.module('kinoEduApp')
    .controller('ChangePasswordController',['ApiCommunicationService','$scope','$htttp',function(ApiCommObj,$scope, $http){

        $scope.changePass = function(){

            var currentPassword = $scope.currentPassword;
            var newPassword = $scope.newPassword;
            var confirmPassword = $scope.confirmPassword;

            /*
             * validate new and confirm password
             * */

            var changePassObj = {
                currentPass : currentPassword,
                newPass : newPassword
            }

            $scope.message = '';
            $scope.errorMessage = '';

            ApiCommObj.postData('/api/users/changePass',changePassObj)
                .success(function(data, status, headers, config){
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

    }]);
/**
 * A controller for the Blog route
 * @todo Functionality is yet to be implemented
 */
angular.module('kinoEduApp')
    .controller("BlogController",function($scope,$http,$rootScope){
        $rootScope.currentNavRoute = '/blog';
    });
