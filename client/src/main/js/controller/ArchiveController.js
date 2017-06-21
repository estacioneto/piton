(function () {
    'use strict';

    var noteModule = angular.module('note');

    noteModule.controller('ArchiveController', ['$scope', '$state', 'ModalService', 'NoteService', 'AuthService', 'ToastService', '$mdSidenav', 'Note', 'SearchService', '$rootScope',
        function ($scope, $state, ModalService, NoteService, AuthService, ToastService, $mdSidenav, Note, SearchService, $rootScope) {

            var self = this;
            var THREE_SECONDS = 3000;

            this.auth = AuthService;

            this.user = this.auth.getLoggedUser();

            this.notes = [];

            this.search = '';

            this.tags = [];

            this.availableStates = [{
                name: 'home',
                icon: 'fa fa-home'
            }];

            /**
             * Makes an disabled note active again.
             * @param note Note to be re-activated.
             */
            this.makeActive = function (note) {
                note.active = true;
                var promise = note.save();
                promise.then(
                    function (data) {
                        self.filter();
                        refreshTags();
                        ToastService.showActionToast({
                            textContent: 'Note successfully unarchived!',
                            action: 'OK',
                            position: 'bottom left',
                            hideDelay: THREE_SECONDS
                        });
                    }, function (error) {
                        ToastService.showActionToast('Note not unarchived... ' + error.data + '.');
                    }
                );
                return promise;
            };

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

            var msgEasterEgg = "";

            /**
             * Indicates if should trigger an Easter Egg.
             * @return True if an Easter Egg was triggered.
             */
            function shouldTriggerEE() {
                var eaemen = "Kkk eae men bem interessante seu post aí como vc pode ver provocou varias risadas entre o pessoal desse grupo mais eu venho lhe trazer um ultimato aqui que me foi dito e parece que esse seu meme aí é um kibe da south america memes mano n queria falar assim mas olha foi a informação que me passaram né então se eu fosse você eu apagava porque o pessoal da south america memes é brabo.";

                var sp = self.search;

                var ret = false;
                var triggers = [
                    ["Piton > Keep.", ['google keep', 'gkeep', 'googlekeep', 'piton vs keep', 'piton']],
                    ["South America Memes > All", ['south america memes', 'sam']],
                    [eaemen, ['eae men', 'kibe', 'memeguy', 'ilha', 'rxrx']],
                    ['A tampa do teu cu, viado. Trollei.', ['cade a tampa', 'where is the tampa', 'the tampa', 'coe jc', 'pega a tampa']]
                ];

                _.each(triggers, function (el) {
                    if (!ret && _.indexOf(el[1], sp) !== -1) {
                        ret = true;
                        msgEasterEgg = el[0];
                    }
                });
                return ret;
            }

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
                if (shouldTriggerEE()) {
                    ToastService.showActionToast(msgEasterEgg);
                }
                self.notes = SearchService.filter(NoteService.notes, self.search);
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
                var promise = ModalService.viewNote(note, null, $event);
                promise.then(function (answer) {
                    refreshTags();
                }, function () {
                    refreshTags();
                });
                return promise;
            };

            /**
             * Make a Note inactive, if it's already inactive,
             * deletes the Note.
             * @param note Note to be updated.
             */
            this.removeNote = function (note) {
                var promise = NoteService.deleteNote(note);
                promise.then(
                    function (data) {
                        self.filter();
                        refreshTags();
                        var toast = ToastService.showUndoToast({
                            textContent: 'Note successfully deleted!',
                            position: 'bottom left',
                        });
                        toast.then(function (action) {
                            if (!_.isUndefined(action)) {
                                note._id = undefined;
                                note.save();
                                self.loadNotes();
                            }
                        });
                    }, function (error) {
                        ToastService.showActionToast({
                            textContent: 'Note not deleted... ' + error.data + '.',
                            action: 'OK',
                            position: 'bottom left',
                            hideDelay: THREE_SECONDS
                        });
                    }
                );
                return promise;
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
                    self.tags.push(new Tag("Easter Egg", 0));
                }
            }

            this.focusSearchInput = function () {
                return angular.element(document.getElementById('searchbarInput')).focus();
            };

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
                    refreshTags();
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

            /**
             * Main function, loads user's notes.
             */
            (function () {
                SearchService.addParam('active', false, true);
                self.loadNotes();
            })();
        }
    ]);
} ());