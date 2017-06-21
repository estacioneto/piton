(function () {
    'use strict';
    let clone = require('clone');

    /**
     * NotesMock deals with the mocks related to notes used on our tests.
     *
     * @author Estácio Pereira
     */
    let notesMock = {};

    let validNote = {
        title: "Piton",
        textContent: "Everything on life is about how much you want to organize yourself.",
        todos: [{
            title: "First todo",
            textContent: "Create Mock",
            done: false
        }, {
            title: "Second todo",
            textContent: "Create the whole project",
            done: true
        }],
        active: true,
        color: 'teal'
    };

    /**
     * Returns a valid note.
     *
     * @returns {Object} Valid note.
     */
    notesMock.getValidNote = () => clone(validNote);

    module.exports = notesMock;
})();
