(function () {
    'use strict';

    var noteModule = angular.module('note');

    noteModule.controller('NotesController', ['$scope', '$state', 'ModalService', 'NoteService', 'AuthService', 'ToastService', '$mdSidenav', 'Note', 'SearchService', '$rootScope',
        function ($scope, $state, ModalService, NoteService, AuthService, ToastService, $mdSidenav, Note, SearchService, $rootScope) {

            var self = this;

            var THREE_SECONDS = 3000;

            this.auth = AuthService;

            this.user = this.auth.getLoggedUser();

            this.notes = [];

            this.search = '';

            this.tags = [];

            this.availableStates = [{
                name: 'archive',
                icon: 'fa fa-archive'
            }];

            var searchCounter = 0;

            /**
             * Toggles the main sidebar.
             */
            this.toggleSidenav = function () {
                var sidenav = $mdSidenav('main-sidenav');
                if (sidenav.isOpen()) {
                    sidenav.close();
                } else {
                    sidenav.toggle();
                }
            };

            /**
             * Filters the notes according to the search parameters already
             * set.
             *
             * @param {String=}  attr         Additional attribute to be included in filter.
             * @param {*=}       value        Value of the additional attribute.
             * @param {boolean=} isConstraint Indicates if the additional attribute is a constraint in filter.
             */
            this.filter = function (attr, value, isConstraint) {
                if (attr && value) {
                    SearchService.addParam(attr, value, isConstraint);
                }
                self.notes = SearchService.filter(NoteService.notes, self.search);
                refreshTags();
            };

            /**
             * @return {Array} Notes tags.
             */
            this.getTags = function () {
                return self.tags;
            };

            /**
             * @return User's notes.
             */
            this.getNotes = function () {
                return self.notes;
            };

            /**
             * Calls a modal with Note's view.
             *
             * @param {Note}   note   Note to be viewed.
             * @param {$event} $event Angular $event.
             */
            this.viewNote = function (note, $event) {
                var promise = ModalService.viewNote(note, null, $event, self.tags);
                promise.then(function (answer) {
                    self.filter();
                }, function () {
                    self.filter();
                });
                return promise;
            };

            /**
             * Creates a new Note.
             */
            this.addNote = function ($event) {
                var newNote = new Note();
                self.viewNote(newNote, null, $event).then(function (answer) {
                    self.filter();
                }, function () {
                    self.filter();
                });
            };

            /**
             * Make a Note inactive, if it's already inactive,
             * deletes the Note.
             * @param note Note to be updated.
             */
            this.removeNote = function (note) {
                var promise = NoteService.disableNote(note);
                promise.then(
                    function (data) {
                        self.filter();
                        ToastService.showActionToast({
                            textContent: 'Note successfully archived!',
                            action: 'OK',
                            position: 'bottom left',
                            hideDelay: THREE_SECONDS
                        });
                    }, function (error) {
                        ToastService.showActionToast({
                            textContent: 'Note not archived... ' + error.data + '.',
                            action: 'OK',
                            position: 'bottom left',
                            hideDelay: THREE_SECONDS
                        });
                    }
                );
                return promise;
            };

            /**
             * @returns {string | undefined} The tag search param.
             */
            this.getSearchedTag = function () {
                return (SearchService.searchParams.tags) ? SearchService.searchParams.tags.value : undefined;
            };

            /**
             * Removes the tag param and then filters the notes.
             */
            this.removeSearchTag = function () {
                SearchService.deleteParam('tags');
                self.filter();
            };

            this.focusSearchInput = function () {
                searchCounter++;
                if (searchCounter === 100) {
                    ToastService.showActionToast('Para de clicar nessa porra, doido.');
                }
                return angular.element(document.getElementById('searchbarInput')).focus();
            };

            /**
             * Counts all tags present in the user's Notes.
             */
            function refreshTags() {
                var existingTagsCount = {};
                self.tags = [];
                _.each(NoteService.notes, function (note) {
                    if (note.active === SearchService.searchParams.active.value) {
                        _.each(note.tags, function (tag) {
                            if (!existingTagsCount[tag]) {
                                existingTagsCount[tag] = 0;
                            }
                            existingTagsCount[tag]++;
                        });
                    }
                });
                _.each(existingTagsCount, function (value, key) {
                    self.tags.push(new Tag(key, value));
                });
                if (self.tags.length > 25) {
                    self.tags.push(new Tag("Not an Easter Egg", 0));
                }
            }

            /**
             * Loads user's notes.
             */
            this.loadNotes = function () {
                var promise = NoteService.loadNotes(self.userId);
                promise.then(function (data) {
                    self.notes = [];
                    _.each(data.data, function (value) {
                        self.notes.push(new Note(value));
                    });
                    self.filter();
                }, function (err) {
                    ModalService.error('Could not load the notes. ' + err.status + '.');
                });
                return promise;
            };

            /**
             * Creates a Tag object.
             * @param name Tag's name.
             * @param count Occurrence of the tag.
             */
            function Tag(name, count) {
                return {
                    name: name,
                    count: count
                };
            }

            /**
             * Main function, loads user's notes.
             */
            (function () {
                SearchService.addParam('active', true, true);
                self.loadNotes();
            })();
        }
    ]);
} ());