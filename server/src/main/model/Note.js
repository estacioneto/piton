(function () {
    'use strict';
    let mongoose = require('mongoose');
    let _ = require('../util/util');

    let Schema = mongoose.Schema;

    /**
     * The note's Schema. A note can have both text content and todos.
     *
     * @author Estácio Pereira.
     */
    let noteSchema = new Schema({
        userEmail: { // Or userEmail?? I think it would be easier
            type: String,
            required: [true, 'The note must have an owner'],
            validate: {
                validator: function (email) {
                    // http://emailregex.com/
                    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
                },
                message: 'E-mail should be valid! Invalid e-mail: {VALUE}'
            }
        },
        userId: {
            type: String
        },
        title: {
            type: String,
            required: [true, 'The note must have a title!']
        },
        textContent: {
            type: String
        },
        todos: [{
            title: {
                type: String,
                required: [true, 'The note cannot have an empty todo!']
            },
            done: {
                type: Boolean,
                default: false
            }
        }],
        createDate: {
            type: Number,
            default: Date.now()
        },
        editDate: {
            type: Number,
            default: Date.now()
        },
        scheduling: {
            type: Date
        },
        active: {
            type: Boolean,
            default: true
        },
        tags: [{
            type: String
        }],
        color: {
            type: String,
            required: [true, 'The note needs a color']
        }
    });

    /**
     * Middleware to handle pre-save.
     */
    noteSchema.pre('save', function (next) {
        // http://stackoverflow.com/questions/7327296/how-do-i-extract-the-created-date-out-of-a-mongo-objectid
        this.createDate = this._id.getTimestamp().getTime();
        this.editDate = Date.now();
        next();
    });

    noteSchema.post('save', (err, doc, next) => {
        if (err.name === 'ValidationError') {
            _.handleValidationError(err, next);
        }
        return next(err);
    });

    noteSchema.static('findByUsersEmail', function (email, callback) {
        return this.find({userEmail: email}, callback);
    });

    noteSchema.static('findById', function (email, id, callback) {
        return this.find({userEmail: email, _id: id}, (err, result) => {
            if (err) return callback(err, null);
            if (_.isEmpty(result)) return callback('The user has no note with this id', null);
            return callback(err, _.first(result));
        });
    });

    // http://mongoosejs.com/docs/validation.html
    // Construir validação em cima do que o Mongoose já providencia

    module.exports = mongoose.model('Note', noteSchema);
})();