/**
 * Created by kunal on 3/12/13.
 */

angular.module('kinoEduDirectives')
    .directive('authUser', ['$location',function ($location) {
        return {
            restrict: 'A',
            link: function (scope, elem, attrs, ctrl) {
                scope.$on('event:auth-loginRequired', function() {
                    console.log('User authentication is required!!!');
                    $location.path('/login')
                });
                scope.$on('event:auth-loginConfirmed', function() {
                    console.log('User is authenticated now!!!');
                });
            }
        }
    }]);
