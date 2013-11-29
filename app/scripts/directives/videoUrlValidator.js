/**
 * Created by kunal on 25/11/13.
 */
/**
 * A custom directive for create course form validation
 */
angular.module('kinoEduDirectives')
    .directive('videoUrlValidation', [function () {
        return {
            restrict:'A',
            require: 'ngModel',
            link: function (scope, elem, attrs, ctrl) {
                var videoUrlPattern = "^http:\/\/(?:www\\.)?youtube.com\/watch\\?v=\\w+(&\\S*)?$";
                var videoUrlExp = new RegExp(videoUrlPattern,'');
                // add a parser that will process each time the value is
                // parsed into the model when the user updates it.
                ctrl.$parsers.unshift(function(value) {
                    // test and set the validity after update.
                    var valid = videoUrlExp.test(value);
                    ctrl.$setValidity('validVideo', valid);

                    // if it's valid, return the value to the model,
                    // otherwise return undefined.
                    return valid ? value : undefined;
                });

                // add a formatter that will process each time the value
                // is updated on the DOM element.
                ctrl.$formatters.unshift(function(value) {
                    // validate.
                    ctrl.$setValidity('validVideo', videoUrlExp.test(value));

                    // return the value or nothing will be written to the DOM.
                    return value;
                });
            }
        }
    }]);
