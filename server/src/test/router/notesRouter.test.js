(function () {
    'use strict';

    let assert = require('assert'),
        chai = require('chai'),
        sinon = require('sinon'),
        should = require('should'),
        request = require('supertest'),
        clone = require('clone');
    let expect = chai.expect;
    let _ = require('../../main/util/util');

    /**
     * Tests the NotesRouter. We need to secure the integrity of our REST API.
     *
     * @author Estácio Pereira.
     */
    describe('notesRouterTest', () => {
        let app, routesMiddleware, notesMock, usersService, usersMock;
        let NOTES_ENDPOINT = '/api/notes';
        before(done => {
            app = require('express')();
            routesMiddleware = require('../../main/middleware/routesMiddleware');
            routesMiddleware.set(app);

            usersService = require('../../main/service/usersService');
            usersMock = require('../../mock/usersMock');
            notesMock = require('../../mock/notesMock');
            done();
        });

        describe('POST /notes should', () => {
            it('correctly save a valid note', done => {
                let user = usersMock.getAuth0User();
                let token = usersMock.getToken();
                usersService.cacheUser(token, user);
                let note = notesMock.getValidNote();

                request(app).post(NOTES_ENDPOINT).send(note)
                    .set('Authorization', 'Bearer ' + token).set('id_token', token)
                    .expect(_.CREATED).end((err, res) => {

                    expect(err).to.be.not.ok;
                    let note = res.body;
                    expect(note._id).to.be.ok;
                    expect(note.userEmail).to.be.equal(user.email);
                    done();
                });
            });

            it('not save an invalid note', done => {
                let user = usersMock.getAuth0User();
                let token = usersMock.getToken();
                usersService.cacheUser(token, user);
                let note = notesMock.getValidNote();
                note.color = null;

                request(app).post(NOTES_ENDPOINT).send(note)
                    .set('Authorization', 'Bearer ' + token).set('id_token', token)
                    .expect(_.BAD_REQUEST).end((err, res) => {

                    expect(err).to.be.not.ok;
                    let message = res.body;
                    expect(message).to.be.ok;
                    // After we create someone to parse the mongoose error message
                    // expect(message).to.be.equal('');
                    expect(message).to.be.equal('Note validation failed: The note needs a color');
                    done();
                });
            });
        });

        describe('GET /notes should', () => {
            it("return an empty array if the user doesn't have any note", done => {
                let user = usersMock.getAuth0User();
                let token = usersMock.getToken();
                usersService.cacheUser(token, user);

                request(app).get(NOTES_ENDPOINT)
                    .set('Authorization', 'Bearer ' + token).set('id_token', token)
                    .expect(_.OK).end((err, res) => {

                    expect(err).to.be.not.ok;
                    let notes = res.body;
                    (notes instanceof Array).should.be.ok;
                    expect(notes.length).to.not.be.undefined;
                    expect(notes).to.be.empty;
                    done();
                });
            });

            it("return a not empty array if the user has a note", done => {
                let user = usersMock.getAuth0User();
                let token = usersMock.getToken();
                usersService.cacheUser(token, user);

                let note = notesMock.getValidNote();
                request(app).post(NOTES_ENDPOINT).send(note)
                    .set('Authorization', 'Bearer ' + token).set('id_token', token)
                    .expect(_.CREATED).end((err, res) => {

                    request(app).get(NOTES_ENDPOINT)
                        .set('Authorization', 'Bearer ' + token).set('id_token', token)
                        .expect(_.OK).end((err, res) => {

                        expect(err).to.be.not.ok;
                        let notes = res.body;
                        (notes instanceof Array).should.be.ok;
                        expect(notes.length).to.not.be.undefined;
                        expect(notes).to.not.be.empty;
                        done();
                    });
                });
            });
        });

        describe('GET /notes/:id should', () => {
            it("return an error if the user doesn't have any note", done => {
                let user = usersMock.getAuth0User();
                let token = usersMock.getToken();
                usersService.cacheUser(token, user);

                let note = notesMock.getValidNote();
                request(app).post(NOTES_ENDPOINT).send(note)
                    .set('Authorization', 'Bearer ' + token).set('id_token', token)
                    .expect(_.CREATED).end((err, res) => {

                    /* We created a note with one user and we are trying to access it from
                     another one. */
                    user = usersMock.getAuth0User();
                    usersService.cacheUser(token, user);
                    let persistedNote = res.body;
                    expect(user.email).to.not.be.equal(persistedNote.userEmail);
                    expect(usersService.cache[token]).to.be.deep.equal(JSON.stringify(user));
                    request(app).get(NOTES_ENDPOINT + '/' + persistedNote._id)
                        .set('Authorization', 'Bearer ' + token).set('id_token', token)
                        .expect(_.BAD_REQUEST).end((err, res) => {

                        expect(err).to.be.not.ok;
                        let message = res.body;
                        expect(message).to.not.be.empty;
                        expect(message).to.be.equal('The user has no note with this id');
                        done();
                    });
                });
            });

            it("return the correct note if the user is really it's owner", done => {
                let user = usersMock.getAuth0User();
                let token = usersMock.getToken();
                usersService.cacheUser(token, user);

                let note = notesMock.getValidNote();
                request(app).post(NOTES_ENDPOINT).send(note)
                    .set('Authorization', 'Bearer ' + token).set('id_token', token)
                    .expect(_.CREATED).end((err, res) => {

                    let persistedNote = res.body;
                    request(app).get(NOTES_ENDPOINT + '/' + persistedNote._id)
                        .set('Authorization', 'Bearer ' + token).set('id_token', token)
                        .expect(_.OK).end((err, res) => {

                        expect(err).to.be.not.ok;
                        let note = res.body;
                        expect(note).to.not.be.empty;
                        expect(note).to.be.deep.equal(persistedNote);
                        done();
                    });
                });
            });
        });

        describe('PATCH /notes/:id should', () => {
            it("update the note correctly according with the new properties", done => {
                let user = usersMock.getAuth0User();
                let token = usersMock.getToken();
                usersService.cacheUser(token, user);

                let note = notesMock.getValidNote();
                request(app).post(NOTES_ENDPOINT).send(note)
                    .set('Authorization', 'Bearer ' + token).set('id_token', token)
                    .expect(_.CREATED).end((err, res) => {

                    let persistedNote = res.body;
                    let newProperties = {
                        active: !persistedNote.active,
                        textContent: 'UPDATED: ' + persistedNote.textContent,
                        scheduling: Date.now()
                    };
                    request(app).patch(NOTES_ENDPOINT + '/' + persistedNote._id).send(newProperties)
                        .set('Authorization', 'Bearer ' + token).set('id_token', token)
                        .expect(_.OK).end((err, res) => {

                        expect(err).to.be.not.ok;
                        let note = res.body;
                        expect(note).to.not.be.empty;
                        expect(JSON.stringify(note._id)).to.be.equal(JSON.stringify(persistedNote._id));
                        expect(note.active).to.not.be.equal(persistedNote.active);
                        expect(note.active).to.be.equal(newProperties.active);
                        expect(note.textContent).to.not.be.equal(persistedNote.textContent);
                        expect(note.textContent).to.be.equal(newProperties.textContent);
                        expect(new Date(note.scheduling)).to.not.be.deep.equal(new Date(persistedNote.scheduling));
                        expect(new Date(note.scheduling)).to.be.deep.equal(new Date(newProperties.scheduling));
                        done();
                    });
                });
            });
        });

        describe('DELETE /notes/:id should', () => {
            it("delete the note correctly", done => {
                let user = usersMock.getAuth0User();
                let token = usersMock.getToken();
                usersService.cacheUser(token, user);

                let note = notesMock.getValidNote();
                request(app).post(NOTES_ENDPOINT).send(note)
                    .set('Authorization', 'Bearer ' + token).set('id_token', token)
                    .expect(_.CREATED).end((err, res) => {

                    let persistedNote = res.body;
                    request(app).delete(NOTES_ENDPOINT + '/' + persistedNote._id)
                        .set('Authorization', 'Bearer ' + token).set('id_token', token)
                        .expect(_.OK).end((err, res) => {
                        expect(err).to.be.not.ok;
                        let message = res.body;
                        expect(message).to.be.equal('Note removed successfully!');
                        request(app).get(NOTES_ENDPOINT + '/' + persistedNote._id)
                            .set('Authorization', 'Bearer ' + token).set('id_token', token)
                            .expect(_.BAD_REQUEST).end((err, res) => {
                            expect(err).to.not.be.ok;
                            let message = res.body;
                            expect(message).to.be.equal('The user has no note with this id');
                            done();
                        });
                    });
                });
            });
        });
    });
})();
