(function () {
    'use strict';

    let clone = require('clone');

    let Note = require('../model/Note'),
        noteValidator = require('../validator/noteValidator'),
        usersService = require('./usersService'),
        _ = require('../util/util');

    /**
     * The NotesService deals with the more complex notes detail/logic. It's
     * responsible for anything related to database operations too.
     *
     * @author Estácio Pereira.
     */
    let notesService = {};

    /**
     * Saves a new note on our app if it's a valid one.
     *
     * @param {String}   token    User's identification token.
     * @param {Object}   note     Note to be persisted.
     * @param {Function} callback Callback function called after persistence or error.
     *
     */
    notesService.saveNote = (token, note, callback) =>
        usersService.getUser(token, (err, user) => {
            err = err || noteValidator.validateSave(user, note);
            if (err) return callback(err, null);
            note.userEmail = user.email;
            note.userId = user.user_id;
            return persistNote(new Note(note), callback);
        });

    /**
     * Gets all the user's notes.
     *
     * @param {String}   token    Logged user's identification token.
     * @param {Function} callback Callback function called after the query or on error.
     */
    notesService.getNotes = (token, callback) =>
        usersService.getUser(token, (err, user) => {
            if (err) return callback(err, null);
            return Note.findByUsersEmail(user.email, (err, result) => {
                if (err) return callback(err, result);
                let notes = [];
                _.each(result, function (note, index) {
                    notes.push(note.toObject());
                });
                return callback(null, notes);
            });
        });

    /**
     * Gets the note with the given id.
     *
     * @param {String}   token    Logged user's identification token.
     * @param {String}   noteId   Desired note's id.
     * @param {Function} callback Callback function called after the query or on error.
     */
    notesService.getNoteById = (token, noteId, callback) =>
        getNoteById(token, noteId, (err, note) => {
            if (err) return callback(err, note);
            return callback(null, note.toObject());
        });

    /**
     * Updates the note's information given the properties to be updated (not necessarily the entire
     * note object).
     *
     * @param {String}   token    The user's identification token.
     * @param {String}   noteId   Id of the note to be updated.
     * @param {Object}   newNote  Object containing the properties to be updated and the new values to them.
     * @param {Function} callback Callback function that will be called after the update or on error.
     */
    notesService.updateNote = (token, noteId, newNote, callback) =>
        getNoteById(token, noteId, (err, note) => {
            if (err) return callback(err, null);

            let originalNote = note.toObject();
            _.updateModel(note, newNote);
            err = noteValidator.validateUpdate(originalNote, note.toObject());

            if (err) return callback(err, null);
            return persistNote(note, callback);
        });

    /**
     * Deletes the note, given it's id.
     *
     * @param {String}   token    User's identification token.
     * @param {String}   noteId   Note's id.
     * @param {Function} callback Callback function called after the delete or on error.
     */
    notesService.deleteNote = (token, noteId, callback) =>
        getNoteById(token, noteId, (err, note) => {
            noteValidator.validateRemove(note.toObject());
            return note.remove(err => {
                return callback(err, (err) ? null : 'Note removed successfully!');
            });
        });

    /**
     * Encapsulates the operation of getting the user by the token
     * and query the database searching by the note with the given id.
     *
     * @param {String}   token    User's identification token.
     * @param {String}   noteId   Note's id.
     * @param {Function} callback Callback function called on error or right after the query.
     */
    function getNoteById(token, noteId, callback) {
        return usersService.getUser(token, (err, user) => {
            if (err) return callback(err, null);
            return Note.findById(user.email, noteId, callback);
        });
    }

    /**
     * Persists a note at our database. Encapsulates the database operation.
     *
     * @param {Note}     note     Note object to be persisted.
     * @param {Function} callback Callback function called after the database operation.
     */
    function persistNote(note, callback) {
        return note.save((err, result) => {
            if (err) return callback(err, result);
            return callback(null, result.toObject());
        });
    }

    function notifyUser(user, note) {
        let userIdentity = _.first(user.identities);
        if (userIdentity.isSocial && userIdentity.provide === 'facebook') {
            notifyOnFacebook(userIdentity.user_id, note.title, response => console.log(response));
        }
    }

    module.exports = (db_profile) => {
        db_profile = db_profile || 'PITON';
        let db = require('../config/db_config')(db_profile);
        return notesService;
    }
})();
