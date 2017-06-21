(function () {
    'use strict';

    var mocksModule = angular.module('Mocks', ['userModule']);

    mocksModule
        .factory('NoteMock', ['Note', function (Note) {
            this.get = function () {
                return new Note({
                    "_id": 1,
                    "userId": 1,
                    "title": "Generico",
                    "textContent": "Hum, muito bom",
                    "todos": [{
                        "title": "Primeiro todo",
                        "textContent": "Terminar isto",
                        "done": false
                    }, {
                            "title": "Segundo todo",
                            "textContent": "Criar suite de testes",
                            "done": true
                        }],
                    "creatDate": "1482845418",
                    "editDate": "1482845418",
                    "scheduling": "",
                    "active": true,
                    "tags": ["teste", "hmm", "muito bom mesmo"],
                    "color": 'teal'
                });
            };

            return {
                get: this.get
            };
        }]);

    mocksModule.factory('UserMock', ['User', function (User) {
        this.get = function () {
            return new User({
                clientID: AUTH0_CLIENT_ID,
                created_at: "2016-11-11T22:07:49.974Z",
                email: "test-email@test.email",
                email_verified: false,
                global_client_id: "Bf7bnZtJH6CP6AlOXibuSTwguliKrymD",
                identities: [{
                    connection: "Username-Password-Authentication",
                    isSocial: false,
                    provider: "auth0",
                    user_id: "58264135c8c5c2816298f466"
                }],
                name: "test-email@test.email",
                nickname: "test-email",
                // picture:"https://s.gravatar.com/avatar/94d62398e573e6bbe23f9b3926e33be6?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fte.png",
                updated_at: "2017-01-01T16:01:10.061Z",
                user_id: "auth0|58264135c8c5c2816298f466",
                user_metadata: {
                    given_name: "Piton",
                    family_name: "Breno"
                }
            });
        };
        return {
            get: this.get
        };
    }]);
})();
