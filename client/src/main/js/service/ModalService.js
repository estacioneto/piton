(function () {
    'use strict';
    var modalModule = angular.module('modalModule', []);

    /**
     * Modal Service. It encapsulates the operations with the panel and dialog services.
     *
     * @author Eric Breno.
     */
    modalModule.service('ModalService', ['$mdDialog', '$mdPanel', function ($mdDialog, $mdPanel) {

        var self = this;

        /**
         * Opens an Error modal.
         * @param message Error message.
         * @param title Modal title.
         * @return Promise, which evaluates to fulfilled when closed.
         */
        this.error = function (message, title) {
            title = title || "Erro";
            return $mdDialog.show({
                templateUrl: './view/simpleModal.html',
                controller: 'ModalCtrl',
                clickOutsideToClose: false,
                escapeToClose: false,
                attachTo: angular.element(document.body),
                resolve: {
                    message: function () {
                        return message;
                    },
                    title: function () {
                        return title;
                    }
                }
            });
        };

        /**
         * Opens Note view modal.
         *
         * @param {Note}   note          Note to be viewed/edited.
         * @param {Note}   tempNote      To be on view.
         * @param {Array}  availableTags A list with all the available tags to be used on auto complete
         * @param {$event} $event        Angular $event.
         */
        this.viewNote = function (note, tempNote, $event, availableTags) {
            return $mdDialog.show({
                controller: 'NoteController as noteCtrl',
                templateUrl: './view/noteModal.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                clickOutsideToClose: false,
                bindToController: true,
                escapeToClose: false,
                resolve: {
                    _note_: function () {
                        return note;
                    },
                    _tempNote_: function () {
                        return tempNote;
                    },
                    _availableTags_: function () {
                        return availableTags || [];
                    }
                }
            });
        };

        this.loadingIndicatorModal = function () {
            return $mdPanel.create({
                template: '<div layout="row" layout-sm="column" layout-align="space-around"><md-progress-circular md-mode="indeterminate"></md-progress-circular></div>',
                attachTo: angular.element(document.body),
                position: $mdPanel.newPanelPosition().center(),
                hasBackdrop: true,
            });
        };

        /**
         * Creates a modal with infos about the application.
         */
        this.aboutModal = function () {
            return $mdPanel.create({
                template: '<about></about>',
                attachTo: angular.element(document.body),
                position: $mdPanel.newPanelPosition().center(),
                hasBackdrop: true,
                clickOutsideToClose: true,
                escapeToClose: true
            });
        };
    }])

    /**
     * Default modal controller.
     */
        .controller('ModalCtrl', ["$scope", "message", "title", '$mdDialog', function ($scope, message, title, $mdDialog) {

            $scope.message = message;

            $scope.title = title;

            $scope.ok = function () {
                $mdDialog.hide("close");
            };
        }]);
}());