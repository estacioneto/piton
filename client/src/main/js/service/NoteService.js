(function () {
    'use strict';

    var noteModule = angular.module('note');

    noteModule.service('NoteService', ['$http', '$rootScope', 'Note', 'ModalService', 'ToastService', function ($http, $rootScope, Note, ModalService, ToastService) {

        var self = this;

        var NOTES = $rootScope.apiRoot + "/notes";

        this.notes = [];

        this.filterParam = null;

        /**
         * Loads all notes from a User.
         */
        this.loadNotes = function () {
            var promise = $http.get(NOTES);
            promise.then(function (data) {
                self.notes = [];
                data.data.forEach(function (note) {
                    note = new Note(note);
                    self.notes.push(note);
                });
                checkNotesStatus();
            }, function (err) {
            });
            return promise;
        };

        /**
         * Disables a Note, making it inactive.
         * @param {Object} note note to be updated.
         */
        this.disableNote = function (note) {
            note.active = false;
            var promise = note.save();
            promise.then(function () {
            }, function (err) {
                ModalService.error('The note could not be updated. ' + err.data + '.');
            });
            return promise;
        };

        /**
         * Deletes a note permanently
         *
         * @param   {Note}    note Note to de be deleted.
         * @returns {Promise} Delete promise.
         */
        this.deleteNote = function (note) {
            var promise = note.del();
            promise.then(function (data) {
                removeNote(note);
            }, function (err) {
            });
            return promise;
        };

        /**
         * Checks and updates notes status, changing it's
         * colors depending on how far each one is from
         * the scheduling time.
         */
        function checkNotesStatus() {
            _.each(self.notes, function (note) {
                note.updateSchedulingColor();
            });
        }

        /**
         * Removes a note from the list, after it's deletion.
         * @param note Note to be removed.
         */
        function removeNote(note) {
            for (var i = 0; i < self.notes.length; i++) {
                if (self.notes[i]._id === note._id) {
                    self.notes.splice(i, 1);
                    return;
                }
            }
        }

        (function () {
            var halfHour = 1000 * 60 * 60 * 30;
            var halfMinute = 1000 * 30;
            setInterval(checkNotesStatus, halfMinute);
        }());
    }]);
}());