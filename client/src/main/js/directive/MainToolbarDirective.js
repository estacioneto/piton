(function () {
    'use strict';

    var toolbar = angular.module('toolbarModule', []);

    toolbar.directive('mainToolbar', ['$state', '$rootScope', 'AuthService', 'ToastService', 'SearchService', 'User',
        function ($state, $rootScope, AuthService, ToastService, SearchService, User) {
            return {
                restrict: 'AE',
                templateUrl: './view/mainToolbar.html',
                scope: {
                    availableStates: '=',
                    showMenu: '=',
                    searchedTag: '=',
                    removeTag: '&',
                    menuFunction: '&'
                },
                link: function (scope, element, attrs) {
                    scope.auth = AuthService;

                    if (scope.menuFunction) {
                        scope.menuFunction = scope.menuFunction();
                    }

                    if (scope.removeTag) {
                        scope.removeTag = scope.removeTag();
                    }

                    /**
                     * Configures the Auth0 lock modal.
                     */
                    if (!scope.auth.isAuthenticated()) {
                        // https://auth0.com/docs/libraries/custom-signup#using-lock
                        // user.user_metadata é onde fica os valores dos campos extras
                        scope.lock = new Auth0Lock(AUTH0_CLIENT_ID, AUTH0_DOMAIN, LOCK_CONFIG);
                        scope.lock.on('authenticated', authenticate);
                    }

                    scope.user = AuthService.getLoggedUser();

                    /**
                     * Responsible for the logout logic related to the controller
                     * (states and service calls).
                     */
                    scope.logout = function () {
                        scope.auth.logout();
                        $state.go('login');
                    };

                    /**
                     * This function is responsible for, basically, show the Auth0 lock modal.
                     */
                    scope.signIn = function () {
                        scope.lock.show();
                    };

                    function redirect(user) {
                        if (user.email_verified) {
                            scope.showActionToast('Your e-mail is verified! You can use the app!');
                            $state.go('home');
                        } else {
                            scope.showActionToast('Verify your e-mail and then reload the page!');
                        }
                    }

                    /**
                     * Contains the authentication logic related to the controller after the lock.
                     *
                     * @param authResult The result returned from the lock.
                     */
                    function authenticate(authResult) {
                        return scope.lock.getProfile(authResult.idToken, function (err, user) {
                            if (err) {
                                return console.log('Auth error: ' + error);
                            }
                            scope.user = new User(user);
                            AuthService.authenticate(authResult.idToken, scope.user);
                            redirect(user);
                        });
                    }

                    scope.showActionToast = function (message) {
                        return ToastService.showActionToast({
                            textContent: message,
                            action: 'OK',
                            hideDelay: 5000
                        });
                    };

                    scope.getCurrentStateName = function () {
                        var currentState = $state.current;
                        if (currentState.name !== 'home' && currentState.name !== 'login') {
                            return $state.current.name.toUpperCase();
                        }
                        return 'PITON';
                    };

                    scope.goHome = function () {
                        $state.go(scope.auth.isAuthenticated() ? 'home' : 'login');
                    };
                }
            };
        }]);
})();
