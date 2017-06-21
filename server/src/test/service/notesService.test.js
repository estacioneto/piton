(function () {
    'use strict';

    let assert = require('assert'),
        chai = require('chai'),
        sinon = require('sinon'),
        should = require('should'),
        clone = require('clone');
    let expect = chai.expect;
    let _ = require('../../main/util/util');

    /**
     * Tests the NotesService. We need to secure the integrity of it's behavior.
     *
     * @author Estácio Pereira.
     */
    describe.only('notesServiceTest', () => {
        let notesService, Note, notesMock, usersService, usersMock;

        before(done => {
            usersService = require('../../main/service/usersService');
            notesService = require('../../main/service/notesService')('PITON-TESTDB');
            usersMock = require('../../mock/usersMock');
            notesMock = require('../../mock/notesMock');
            done();
        });

        // describe('test should', () => {
        //     it('get me a token', (done) => {
        //         notesService.test(response => {
        //             done();
        //         });
        //     });
        // });

        // describe.only('tst should', () => {
        //     it('get me a token', (done) => {
        //         let user = usersMock.getAuth0User();
        //         let token = usersMock.getToken();
        //         usersService.cacheUser(token, user);
        //         let note = notesMock.getValidNote();
        //         note.scheduling = new Date(new Date().getTime() + 65.1 * 60000);
        //         notesService.tst(token, note, (err, result) => {
        //             console.log('YEP', err, result);
        //             done();
        //         });
        //     });
        // });

        describe('saveNote should', () => {
            it('not save a null note', done => {
                let user = usersMock.getAuth0User();
                let token = usersMock.getToken();
                usersService.cacheUser(token, user);
                notesService.saveNote(token, null, (err, result) => {
                    expect(err).to.be.ok;
                    expect(result).to.not.be.ok;
                    done();
                });
            });

            it('save a valid note', done => {
                let user = usersMock.getAuth0User();
                let token = usersMock.getToken();
                usersService.cacheUser(token, user);

                let note = notesMock.getValidNote();
                notesService.saveNote(token, note, (err, result) => {
                    expect(err).to.not.be.ok;
                    expect(result._id).to.be.ok;
                    expect(result.userEmail).to.be.equal(user.email);
                    done();
                });
            });

            it('not save a note with empty todo', done => {
                let user = usersMock.getAuth0User();
                let token = usersMock.getToken();
                usersService.cacheUser(token, user);

                let note = notesMock.getValidNote();
                note.todos = [{
                    title: ''
                }];
                notesService.saveNote(token, note, (err, result) => {
                    expect(err).to.be.ok;
                    expect(result).to.not.be.ok;
                    expect(err.message).to.be.equal('Note validation failed: The note cannot have an empty todo!');
                    done();
                });
            });
        });

        describe('getNotes should', () => {
            it("return all the user's notes, given it's token", done => {
                let user = usersMock.getAuth0User();
                let token = usersMock.getToken();

                usersService.cacheUser(token, user);

                let note = notesMock.getValidNote();
                notesService.saveNote(token, note, (err, result) => {
                    let persistedNote = result;
                    notesService.getNotes(token, (err, result) => {
                        expect(err).to.not.be.ok;
                        expect(result).to.not.be.empty;
                        expect(_.first(result)).to.be.deep.equal(persistedNote);
                        done();
                    });
                });
            });

            it("return an empty list if the user doesn't have notes", done => {
                let user = usersMock.getAuth0User();
                let token = usersMock.getToken();

                usersService.cacheUser(token, user);
                notesService.getNotes(token, (err, result) => {
                    expect(err).to.not.be.ok;
                    expect(result).to.be.empty;
                    done();
                });
            });

            it("return only the logged user's notes", done => {
                let user = usersMock.getAuth0User();
                let token = usersMock.getToken();

                usersService.cacheUser(token, user);

                let note = notesMock.getValidNote();
                notesService.saveNote(token, note, (err, result) => {

                    user.email = user.email + '.auth';
                    // Another email
                    usersService.cacheUser(token, user);
                    notesService.getNotes(token, (err, result) => {
                        expect(err).to.not.be.ok;
                        expect(result).to.be.empty;
                        done();
                    });
                });
            });
        });

        describe('getNotesById should', () => {
            it("return the logged user's note with the correct id", done => {
                let user = usersMock.getAuth0User();
                let token = usersMock.getToken();

                usersService.cacheUser(token, user);

                let note = notesMock.getValidNote();
                notesService.saveNote(token, note, (err, result) => {
                    let persistedNote = result;
                    notesService.getNoteById(token, persistedNote._id, (err, result) => {
                        expect(err).to.not.be.ok;
                        expect(result).to.be.deep.equal(persistedNote);
                        done();
                    });
                });
            });

            it("return an error if there is no note with the id and the logged user as owner", done => {
                let user = usersMock.getAuth0User();
                let token = usersMock.getToken();

                usersService.cacheUser(token, user);

                let note = notesMock.getValidNote();
                notesService.saveNote(token, note, (err, result) => {
                    let persistedNote = result;
                    user.email = user.email + '.con';
                    usersService.cacheUser(token, user);
                    notesService.getNoteById(token, persistedNote._id, (err, result) => {
                        expect(err).to.be.ok;
                        expect(result).to.not.be.ok;
                        expect(err).to.be.equal('The user has no note with this id');
                        done();
                    });
                });
            });
        });

        describe('updateNote should', () => {
            it("properly update the user's note's properties if the updated values are valid", done => {
                let user = usersMock.getAuth0User();
                let token = usersMock.getToken();

                usersService.cacheUser(token, user);

                let note = notesMock.getValidNote();
                notesService.saveNote(token, note, (err, result) => {
                    let persistedNote = result;
                    let newProperties = {
                        title: 'UPDATED: ' + persistedNote.title,
                        todos: []
                    };
                    notesService.updateNote(token, persistedNote._id, newProperties, (err, updatedNote) => {
                        expect(err).to.not.be.ok;
                        expect(updatedNote).to.not.be.empty;
                        expect(JSON.stringify(updatedNote._id)).to.be.equal(JSON.stringify(persistedNote._id));
                        expect(updatedNote.title).to.not.be.equal(persistedNote.title);
                        expect(updatedNote.title).to.be.equal(newProperties.title);
                        expect(updatedNote.todos).to.not.be.equal(persistedNote.todos);
                        expect(updatedNote.todos).to.be.deep.equal(newProperties.todos);
                        expect(updatedNote.createDate).to.be.deep.equal(persistedNote.createDate);
                        expect(updatedNote.editDate).to.not.be.deep.equal(persistedNote.editDate);
                        done();
                    });
                });
            });

            it("not update an archived note if it isn't an unarchive situation", done => {
                let user = usersMock.getAuth0User();
                let token = usersMock.getToken();

                usersService.cacheUser(token, user);

                let note = notesMock.getValidNote();
                note.active = false;
                notesService.saveNote(token, note, (err, result) => {
                    let persistedNote = result;
                    let newProperties = {
                        title: 'UPDATED: ' + persistedNote.title,
                        todos: []
                    };
                    notesService.updateNote(token, persistedNote._id, newProperties, (err, result) => {
                        expect(err).to.be.ok;
                        expect(result).to.not.be.ok;
                        expect(err.status).to.be.equal(_.BAD_REQUEST);
                        expect(err.message).to.be.equal('You cannot update an archived note!');
                        done();
                    });
                });
            });

            it("update an archived note if it is an unarchive situation", done => {
                let user = usersMock.getAuth0User();
                let token = usersMock.getToken();

                usersService.cacheUser(token, user);

                let note = notesMock.getValidNote();
                note.active = false;
                notesService.saveNote(token, note, (err, result) => {
                    let persistedNote = result;
                    let newProperties = {
                        title: 'UPDATED: ' + persistedNote.title,
                        todos: [],
                        active: true
                    };
                    notesService.updateNote(token, persistedNote._id, newProperties, (err, updatedNote) => {
                        expect(err).to.not.be.ok;
                        expect(updatedNote).to.not.be.empty;
                        expect(JSON.stringify(updatedNote._id)).to.be.equal(JSON.stringify(persistedNote._id));
                        expect(updatedNote.title).to.not.be.equal(persistedNote.title);
                        expect(updatedNote.title).to.be.equal(newProperties.title);
                        expect(updatedNote.todos).to.not.be.equal(persistedNote.todos);
                        expect(updatedNote.todos).to.be.deep.equal(newProperties.todos);
                        expect(updatedNote.active).to.not.be.equal(persistedNote.active);

                        expect(updatedNote.active).to.be.deep.equal(newProperties.active);
                        expect(updatedNote.createDate).to.be.deep.equal(persistedNote.createDate);
                        expect(updatedNote.editDate).to.not.be.deep.equal(persistedNote.editDate);
                        done();
                    });
                });
            });

            /**
             * We need to certify that the objects will appear when requested.
             * We need this test to certify that properties, like arrays, are
             * correctly updated. We have some links explaining that on util.js.
             */
            it("properly update the user's note's properties and they should be successfully returned when the note is requested", done => {
                let user = usersMock.getAuth0User();
                let token = usersMock.getToken();

                usersService.cacheUser(token, user);

                let note = notesMock.getValidNote();
                note.tags = ['tag1', 'tag2'];
                notesService.saveNote(token, note, (err, result) => {
                    let persistedNote = result;
                    let newProperties = {
                        title: 'UPDATED: ' + persistedNote.title,
                        'tags.0': 'newTag'
                    };
                    notesService.updateNote(token, persistedNote._id, newProperties, (err, updatedNote) => {
                        expect(err).to.not.be.ok;
                        expect(updatedNote).to.not.be.empty;
                        expect(updatedNote.tags).to.not.be.equal(persistedNote.tags);
                        expect(_.first(updatedNote.tags)).to.be.equal(newProperties['tags.0']);
                        notesService.getNoteById(token, persistedNote._id, (err, updatedNote) => {
                            expect(err).to.not.be.ok;
                            expect(updatedNote).to.not.be.empty;
                            expect(JSON.stringify(updatedNote._id)).to.be.equal(JSON.stringify(persistedNote._id));
                            expect(updatedNote.title).to.not.be.equal(persistedNote.title);
                            expect(updatedNote.title).to.be.equal(newProperties.title);
                            expect(updatedNote.tags).to.not.be.equal(persistedNote.tags);
                            expect(_.first(updatedNote.tags)).to.be.equal(newProperties['tags.0']);
                            expect(updatedNote.createDate).to.be.deep.equal(persistedNote.createDate);
                            expect(updatedNote.editDate).to.not.be.deep.equal(persistedNote.editDate);
                            done();
                        });
                    });
                });
            });
        });

        describe('deleteNote should', () => {
            it("properly delete the user's note", done => {
                let user = usersMock.getAuth0User();
                let token = usersMock.getToken();

                usersService.cacheUser(token, user);

                let note = notesMock.getValidNote();
                notesService.saveNote(token, note, (err, result) => {
                    expect(err).to.not.be.ok;
                    expect(result).to.be.ok;

                    let persistedNote = result;
                    notesService.deleteNote(token, persistedNote._id, (err, result) => {
                        expect(err).to.not.be.ok;
                        expect(result).to.be.equal('Note removed successfully!');

                        notesService.getNoteById(token, persistedNote._id, (err, result) => {
                            expect(err).to.be.equal('The user has no note with this id');
                            done();
                        });
                    });
                });
            });
        });
    });
})();
