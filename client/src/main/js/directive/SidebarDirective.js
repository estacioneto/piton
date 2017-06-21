(function () {
    'use strict';

    var sidebar = angular.module('sidebarModule', []);

    sidebar.directive('sidebarPiton', ['$state', '$rootScope', 'AuthService',
        function ($state, $rootScope, AuthService) {
            return {
                restrict: 'AE',
                templateUrl: './view/sidebarPiton.html',
                scope : {
                    controller: '='
                },
                link: function (scope, element, attrs) {
                    scope.auth = AuthService;
                    scope.user = scope.auth.getLoggedUser();
                }
            };
        }]);
})();
