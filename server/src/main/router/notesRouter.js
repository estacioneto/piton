(function () {
    'use strict';
    let express = require('express');

    let notesService = require('../service/notesService')(),
        _ = require('../util/util');

    /**
     * This is the router to access the notes of our app.
     * The owner of the notes will be the logged user.
     *
     * Endpoint: /notes
     * @author Estácio Pereira
     */
    let notesRouter = express.Router();

    /**
     * Gets all the user's notes.
     */
    notesRouter.get('/', (req, res) =>
        notesService.getNotes(_.getToken(req), (err, result) => {
            if (err) return res.status(err.status || _.BAD_REQUEST).json(err.message || err);
            return res.status(_.OK).json(result);
        })
    );

    /**
     * Gets the user's note with the given id.
     */
    notesRouter.get('/:id', (req, res) =>
        notesService.getNoteById(_.getToken(req), req.params.id, (err, result) => {
            if (err) return res.status(err.status || _.BAD_REQUEST).json(err.message || err);
            return res.status(_.OK).json(result);
        })
    );

    /**
     * Saves a new note at our app.
     */
    notesRouter.post('/', (req, res) =>
        notesService.saveNote(_.getToken(req), req.body, (err, result) => {
            if (err) return res.status(err.status || _.BAD_REQUEST).json(err.message || err);
            return res.status(_.CREATED).json(result);
        })
    );

    /**
     * Updates the note that has the given id.
     */
    notesRouter.patch('/:id', (req, res) =>
        notesService.updateNote(_.getToken(req), req.params.id, req.body, (err, result) => {
            if (err) return res.status(err.status || _.BAD_REQUEST).json(err.message || err);
            return res.status(_.OK).json(result);
        })
    );

    /**
     * Deletes the note with the given id.
     */
    notesRouter.delete('/:id', (req, res) =>
        notesService.deleteNote(_.getToken(req), req.params.id, (err, result) => {
            if (err) return res.status(err.status || _.BAD_REQUEST).json(err.message || err);
            return res.status(_.OK).json(result);
        })
    );

    module.exports = notesRouter;
})();