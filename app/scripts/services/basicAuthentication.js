/**
 * Created by kunal on 12/11/13.
 */

/**
 * A factory created for storing the basic authentication information of user within the cookie. Also the factory is responsible to set the basic authentication information to request header.
 */
angular.module('kinoEduServices')
    .factory('BasicAuth', ['Base64', '$cookieStore', '$http',function (Base64,$cookieStore,$http) {
        // initialize to whatever is in the cookie, if anything
        $http.defaults.headers.common['Authorization'] = 'Basic ' + $cookieStore.get('authData');
        var BasicAuth = {};
        /**
         * A function is used to set the username and password; required for basic authentication. In addition username and password is encoded with 'Base64' encryption for security reasons
         * @param username
         * @param password
         */
        BasicAuth.setCredentials = function (username, password) {
            var encoded = Base64.encode(username + ':' + password);
            $http.defaults.headers.common.Authorization = 'Basic ' + encoded;
            $cookieStore.put('authData', encoded);
        }

        /**
         * A function deleted the values from the cookies when user logout from app or his session is terminated.
         * @todo Session scenario is not yet develop
         */
        BasicAuth.clearCredentials = function () {
             document.execCommand("ClearAuthenticationCache");
             $cookieStore.remove('authData');
             $http.defaults.headers.common.Authorization = 'Basic ';
        }

        return BasicAuth;
    }]);
