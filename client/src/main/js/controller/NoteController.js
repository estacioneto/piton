(function () {
    'use strict';

    var noteModule = angular.module('note');

    noteModule.controller('NoteController', ['$scope', '$timeout', 'NoteService', 'ModalService', 'Note', '$mdColorPalette', '$mdDialog', 'ToastService','_note_', '_tempNote_', '_availableTags_',
        function ($scope, $timeout, NoteService, ModalService, Note, $mdColorPalette, $mdDialog, ToastService, _note_, _tempNote_, _availableTags_) {

            var self = this;

            this.note = _note_;
            this.tempNote = _tempNote_;
            this.availableTags = _availableTags_;

            this.searchTag = null;

            var isErrorOpen = false;

            /**
             * Callback when a chip is selected or created
             * 
             * @param {Object | string} chip The selected/created chip.
             * @returns The correct chip.
             */
            this.createChip = function (chip) {
                return chip.name || chip;
            };

            $scope.colors = Object.keys($mdColorPalette);
            _.each($scope.colors, function (name, index) {
                $scope.colors[index] = name + '-A100';
            });

            this.querySearchTags = function (searchTag) {
                return self.availableTags.filter(function (tag) {
                    return _.includes(tag.name, searchTag);
                });
            };

            /**
             * @return Controller's Note.
             */
            this.getNote = function () {
                return self.tempNote;
            };

            /**
             * Verifies if there's any Easter Egg to be triggered.
             */
            function triggerEasterEgg() {
                var triggered = false;
                _.each(self.getNote().todos, function (todo) {
                    if (!triggered && todo.title === 'todo') {
                        ToastService.showActionToast('Hm, é mesmo?');
                    }
                });
            }

            /**
             * Updates the Note with current changes.
             */
            this.save = function () {
                var isNewNote = !self.getNote()._id;
                var promise = self.getNote().save();
                promise.then(function (data) {
                    self.note.buildThis(self.getNote());
                    if (isNewNote) {
                        NoteService.notes.push(self.note);
                    }
                    triggerEasterEgg();
                    $mdDialog.hide('Saved');
                }, function (err) {
                    ModalService.error('The note could not be saved. ' + err.data + '.').then(function () {
                        ModalService.viewNote(self.note, self.tempNote, undefined, self.availableTags);
                    });
                });
                return promise;
            };

            /**
             * Removes scheduling and timeAndDate from note.
             */
            this.removeScheduling = function () {
                self.getNote().scheduling = null;
                self.getNote().dateAndTime = null;
            };

            /**
             * Discards all changes in the Note.
             */
            this.discard = function () {
                $mdDialog.hide('discard');
            };

            /**
             * Add a todo to this Note.
             */
            this.addTodo = function () {
                self.getNote().todos.push(new Todo());
                $timeout(function () {
                    var lastTodoSelected = document.getElementById('todo-input-' + (self.getNote().todos.length - 1));
                    var lastTodoInput = angular.element(lastTodoSelected);
                    lastTodoInput.focus();
                });
            };

            /**
             * Modifies the todo's input to line-through the text if the todo is done
             *
             * @param   {Number} index Todo's index.
             * @returns {Object | {}} The style of the input
             */
            this.getTodoInputStyle = function (index) {
                var todo = self.getNote().todos[index];
                var style = {};
                if (todo.done) {
                    style['text-decoration'] = 'line-through';
                }
                return style;
            };

            /**
             * Opens the color picker.
             */
            this.openColorMenu = function ($mdOpenMenu, event) {
                $mdOpenMenu(event);
            };

            /**
             * Creates a simple Todo.
             * @return {Object} Todo object.
             */
            function Todo() {
                return {
                    title: '',
                    textContent: '',
                    done: false
                };
            }

            /**
             * Verifies if any change has been done in the Note.
             * @return {boolean} True if there are changes not saved.
             */
            function hasChanges() {
                return !angular.equals(self.note._data, self.tempNote._data) ||
                    !angular.equals(self.note.dateAndTime, self.tempNote.dateAndTime);
            }

            /**
             * Adds a listener which opens an Error modal if the Esc key is
             * pressed and there are changes not saved in the Note.
             */
            function addCloseListener() {
                document.onkeydown = function (evt) {
                    evt = evt || window.event;
                    var isEscape = false;
                    if ("key" in evt) {
                        isEscape = (evt.key == "Escape" || evt.key == "Esc");
                    } else {
                        isEscape = (evt.keyCode == 27);
                    }
                    if (isEscape) {
                        if (hasChanges() && !isErrorOpen && self.note.active) {
                            ModalService.error('Save or discard the note.')
                                .then(function () {
                                    ModalService.viewNote(self.note, self.tempNote, undefined, self.availableTags);
                                });
                        } else if (!hasChanges() || !self.note.active) {
                            self.discard();
                        }
                        isErrorOpen = !isErrorOpen;
                    }
                };
            }

            /**
             * Main function
             */
            (function () {
                self.tempNote = self.tempNote || new Note(self.note);
                addCloseListener();
            })();
        }
    ]);
} ());