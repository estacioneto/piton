(function () {
    'use strict';

    let bodyParser = require('body-parser');
    let jwt = require('express-jwt');
    let cors = require('cors');
    let http = require("http");

    let usersRouter = require('../router/usersRouter'),
        notesRouter = require('../router/notesRouter');
    let routesMiddleware = {};

    /*
     * TODO: They should be environment variables... Just saying...
     * @author: Estácio Pereira
     */
    let authCheck = jwt({
        secret: process.env.PITON_SECRET,
        audience: '5vs4pnDlh4ARaCySBu4m6EBnmA9YJiZV'
    });

    /**
     * Configura a aplicação para as rotas de requisições
     *
     * @param {Object} app - Objeto que encapsula a aplicação Express
     */
    routesMiddleware.set = (app) => {
        app.use(cors());
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({
            extended: true
        }));
        app.authMiddleware = authCheck;

        app.use('/api/users', app.authMiddleware, usersRouter);
        app.use('/api/notes', app.authMiddleware, notesRouter);
    };

    // Avoid heroku sleep
    (() => setInterval(() => http.get("http://piton-es.herokuapp.com"), 300000))();

    module.exports = routesMiddleware;
})();