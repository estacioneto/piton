(function () {
    "use strict";

    let _ = require('../util/util'),
        request = require('request');

    /**
     * The AuthService deals with the Auth0 system. So, we can access the user
     * by it's identification token. Cool, right?
     */
    let authService = {};

    /**
     * Gets the user from the authorization service (Auth0).
     *
     * @param {String}   idToken  User's identification token.
     * @param {Function} callback Callback function called after the request.
     */
    authService.getUser = (idToken, callback) => {
        let options = {
            url: _.auth0 + _.tokeninfo,
            form: {
                id_token: idToken
            }
        };
        return request.post(options, (err, response, body) => {
            if (response.statusCode >= _.BAD_REQUEST) {
                err = err || 'Algo deu errado. Status da requisição: ' + response.statusCode;
                return callback(err, null);
            }
            return callback(err, JSON.parse(body));
        });
    };

    /**
     * Given an user, the function uses the authorization service (Auth0) to login.
     * (It is not that useful today, actually. Just for tests.)
     *
     * @param {Object}   user     User that wants to login.
     * @param {Function} callback Callback function called after the login.
     */
    authService.login = function (user, callback) {
        let optionsLogin = {
            url: _.auth0 + _.loginEndpoint,
            form: user
        };

        return request.post(optionsLogin, (err, response, body) => {
            if (response.statusCode >= _.BAD_REQUEST) {
                err = err || 'Algo deu errado. Status da requisição: ' + response.statusCode;
            }
            return callback(err, JSON.parse(body).id_token);
        });
    };

    module.exports = authService;
})();
