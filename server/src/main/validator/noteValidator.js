(function(){
    'use strict';

    let _ = require('../util/util');
    /**
     * The NoteValidator deals with all the logic about, as it's name says, validation. But an
     * important thing is that database and data validations should not be done here (should be
     * done at 'Note.js').
     *
     * @author Estácio Pereira.
     */
    let noteValidator = {};

    /**
     * Verifies if the note is a valid one to be saved.
     *
     * @param  {Object} user The note's owner.
     * @param  {Object} note The note to be saved.
     * @return {Object | undefined} Object containing the error status and message if the note is not valid.
     */
    noteValidator.validateSave = (user, note) => {
        if (_.isEmpty(note))
            return {status: _.BAD_REQUEST, message: 'Note cannot be null or empty.'};
    };

    /**
     * Validates the note update, given the original note and the updated one.
     *
     * @param   {Object} originalNote The original note.
     * @param   {Object} updatedNote  The updated note.
     * @returns {{status: Number, message: String} | undefined}
     */
    noteValidator.validateUpdate = (originalNote, updatedNote) => {
        if (JSON.stringify(originalNote._id) !== JSON.stringify(updatedNote._id))
            return {status: _.BAD_REQUEST, message: "You cannot update the note's id!"};
        if (!originalNote.active && !updatedNote.active)
            return {status: _.BAD_REQUEST, message: 'You cannot update an archived note!'};
    };

    /**
     * Validates the note deletion.
     *
     * @param {Object} note Note to be deleted.
     */
    noteValidator.validateRemove = note => {
    };

    module.exports = noteValidator;
})();