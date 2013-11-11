/**
 * Created by kunal on 8/11/13.
 */
angular.module('passwordConfirmation', [])
    .directive('confPwd', [function () {
        return {
            require: 'ngModel',
            link: function (scope, elem, attrs, ctrl) {
                var firstPassword = '#' + attrs.confPwd;
                elem.add(firstPassword).on('keyup', function () {
                    scope.$apply(function () {
                        // console.info(elem.val() === $(firstPassword).val());
                        ctrl.$setValidity('pwdmatch', elem.val() === $(firstPassword).val())//((elem.val() === $(firstPassword).val()) || (elem.val() === '')));
                    });
                });
            }
        }
    }]);
