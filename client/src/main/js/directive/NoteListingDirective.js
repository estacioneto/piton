(function () {
    'use strict';

    var noteModule = angular.module('note');

    /**
     * Directive used for note listing in main page.
     * @param note Note to be shown.
     * @param notesCtrl Controller instance.
     *
     * @author Eric Breno, Estácio Pereira.
     */
    noteModule.directive('noteListing', ['$window', function ($window) {
        return {
            strict: 'E',
            templateUrl: './view/noteListing.html',
            scope: {
                note: '=',
                notesCtrl: '=controller'
            },
            link: function (scope, element, attr) {
                var INITIAL_INDEX = 0;
                var MAX_LENGTH_TITLE_WORD = 15;
                var MAX_LENGTH_TITLE = 40;
                scope.getFormattedTitle = function () {
                    var title = scope.note.title.split(' ');
                    var formattedTitle = '';
                    var canAddToTitle = true;
                    _.each(title, function (word) {
                        if (canAddToTitle) {
                            if (!_.isEmpty(formattedTitle)) {
                                formattedTitle += ' ';
                            }
                            if (word.length >= MAX_LENGTH_TITLE_WORD) {
                                formattedTitle += word.substring(INITIAL_INDEX, MAX_LENGTH_TITLE_WORD) + '...';
                                canAddToTitle = false;
                            } else {
                                formattedTitle += word;
                            }
                        }
                        canAddToTitle = canAddToTitle && title.length < MAX_LENGTH_TITLE;
                    });
                    return formattedTitle;
                };
            }
        };
    }]);
} ());