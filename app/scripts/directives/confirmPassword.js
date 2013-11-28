/**
 * Created by kunal on 8/11/13.
 */

/**
 * A custom directive to compare and validate the user password at the time of sign-up
 */
angular.module('kinoEduDirectives')
    .directive('confPwd', [function () {
        return {
            require: 'ngModel',
            link: function (scope, elem, attrs, ctrl) {
                var firstPassword = '#' + attrs.confPwd;
                elem.add(firstPassword).on('keyup', function () {
                    scope.$apply(function () {
                        ctrl.$setValidity('pwdmatch', elem.val() === $(firstPassword).val())//((elem.val() === $(firstPassword).val()) || (elem.val() === '')));
                    });
                });
            }
        }
    }]);
