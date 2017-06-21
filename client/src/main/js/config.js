(function () {
    'use strict';

    var app = angular.module('pitonApp', ['ui.router', 'ui.bootstrap', 'ngAria', 'ngMaterial', 'auth0', 'angular-storage', 'angular-jwt', 'auth0.lock',
        'modalModule', 'note', 'login', 'authModule', 'userModule', 'toolbarModule', 'toastModule', 'sidebarModule', 'ADM-dateTimePicker', 'searchModule',
        'aboutModule', 'footerModule']);

    app.constant('_', window._)
        /**
         * Auth config
         */
        .config(['$urlRouterProvider', '$provide', '$httpProvider', 'ADMdtpProvider',
            function ($urlRouterProvider, $provide, $httpProvider, ADMdtpProvider) {

                ADMdtpProvider.setOptions({
                    calType: 'gregorian',
                    format: 'DD-MM-YYYY (hh:mm)',
                    default: ''
                });

                /**
                 * Adds watchers for requests open and close. While there's an
                 * open request the loading indicator keeps shown.
                 */
                function loadingInterceptor($rootScope, $q) {
                    var _openRequests_ = 0;

                    return {
                        request: function (config) {
                            _openRequests_++;
                            $rootScope.$broadcast('loading_show');
                            return config || $q.when(config);
                        },
                        response: function (response) {
                            if (!(--_openRequests_)) {
                                $rootScope.$broadcast('loading_hide');
                            }
                            return response || $q.when(response);
                        },
                        responseError: function (response) {
                            if (!(--_openRequests_)) {
                                $rootScope.$broadcast('loading_hide');
                            }
                            return $q.reject(response);
                        }
                    };
                }

                $provide.factory('loadingInterceptor', ['$rootScope', '$q', loadingInterceptor]);

                $urlRouterProvider.otherwise('/');

                $httpProvider.interceptors.push('loadingInterceptor');
            }])
        /**
         * State config
         */
        .config(['$stateProvider', function ($stateProvider) {
            var view = './view/';
            $stateProvider
                .state('login', {
                    url: '/',
                    templateUrl: view + 'login.html',
                    controller: 'LoginController as loginCtrl'
                })
                /**
                 * Main home page.
                 */
                .state('home', {
                    url: '/home',
                    templateUrl: view + 'home.html',
                    controller: 'NotesController as notesCtrl'
                })
                /**
                 * Archive page.
                 */
                .state('archive', {
                    url: '/archive',
                    templateUrl: view + 'archive.html',
                    controller: 'ArchiveController as archiveCtrl'
                });
        }])
        .config(['$mdThemingProvider', function ($mdThemingProvider) {
            $mdThemingProvider.setNonce();
            $mdThemingProvider.theme('default')
                .primaryPalette('purple', { default: '800' })
                .accentPalette('purple', { default: 'A200' });
        }]);
    app.run(['$rootScope', 'ModalService', function ($rootScope, ModalService) {
        $rootScope._ = window._;
        $rootScope.apiRoot = '/api';

        $rootScope.appPrimaryColor = 'teal';
        $rootScope.appSecondaryColor = 'teal';

        var _modalResp_ = null;
        $rootScope.$on('loading_show', function () {
            if (!_modalResp_) {
                _modalResp_ = ModalService.loadingIndicatorModal();
                _modalResp_.open();
            } else {
                _modalResp_.show();
            }
        });

        $rootScope.$on('loading_hide', function () {
            if (_modalResp_) {
                _modalResp_.hide();
            }
        });
    }]);
} ());
