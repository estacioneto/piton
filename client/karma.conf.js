(function () {
    'use strict';
    // Karma configuration
    // Generated on Mon Dec 26 2016 19:59:43 GMT-0300 (BRT)

    module.exports = function (config) {
        config.set({

            // base path that will be used to resolve all patterns (eg. files, exclude)
            basePath: '',


            // frameworks to use
            // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
            frameworks: ['mocha', 'chai-as-promised', 'chai', 'sinon'],

            // list of files / patterns to load in the browser
            files: [
                '../node_modules/jquery/dist/jquery.min.js',
                '../node_modules/lodash/lodash.min.js',
                '../node_modules/angular/angular.js',
                '../node_modules/angular-mocks/angular-mocks.js',
                '../node_modules/angular-ui-router/release/angular-ui-router.js',
                '../node_modules/angular-animate/angular-animate.min.js',
                '../node_modules/bootstrap/dist/js/bootstrap.min.js',
                '../node_modules/angular-touch/angular-touch.min.js',
                '../node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js',
                '../node_modules/angular-aria/angular-aria.min.js',
                '../node_modules/angular-material/angular-material.min.js',
                '../node_modules/auth0-angular/build/auth0-angular.min.js',
                '../node_modules/angular-storage/dist/angular-storage.min.js',
                '../node_modules/angular-lock/dist/angular-lock.min.js',
                '../node_modules/angular-jwt/dist/angular-jwt.min.js',
                '../node_modules/adm-dtp/dist/ADM-dateTimePicker.min.js',
                './resources/auth0lock.min.js',
                'src/main/config/Auth0Variables.js',
                'src/main/js/config.js',
                'src/main/js/factory/NoteFactory.js',
                'src/main/js/directive/AboutDirective.js',
                'src/main/js/directive/MainToolbarDirective.js',
                'src/main/js/directive/SidebarDirective.js',
                'src/main/js/directive/MainFooterDirective.js',
                'src/main/js/service/NoteService.js',
                'src/main/js/service/ModalService.js',
                'src/main/js/service/SearchService.js',
                'src/main/js/service/AuthService.js',
                'src/main/js/service/ToastService.js',
                'src/main/js/factory/User.js',
                'src/main/js/controller/LoginController.js',
                'src/main/js/controller/ArchiveController.js',
                'src/main/js/controller/NoteController.js',
                'src/main/js/controller/NotesController.js',
                'src/test/testSetup.js',
                'src/test/Mocks.js',
                'src/test/mock/*.js',
                'src/test/spec/**/*.js'
            ],
            client: {
                mocha: {
                    timeout: '50000'
                }
            },


            // list of files to exclude
            exclude: [],


            // preprocess matching files before serving them to the browser
            // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
            preprocessors: {},


            // test results reporter to use
            // possible values: 'dots', 'progress'
            // available reporters: https://npmjs.org/browse/keyword/karma-reporter
            reporters: ['nyan'],

            nyanReporter: {
                bail: true
            },

            // web server port
            port: 9876,


            // enable / disable colors in the output (reporters and logs)
            colors: true,


            // level of logging
            // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
            logLevel: config.LOG_INFO,


            // enable / disable watching file and executing tests whenever any file changes
            autoWatch: true,


            // start these browsers
            // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
            browsers: ['Chrome'],


            // Continuous Integration mode
            // if true, Karma captures browsers, runs the tests and exits
            singleRun: false,

            // Concurrency level
            // how many browser should be started simultaneous
            concurrency: Infinity
        })
    };
})();
