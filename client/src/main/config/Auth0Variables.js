/**
 * I think it is not the correct way of storing these variables.
 * The Auth0 credentials should be stored as environment variables.
 */

var AUTH0_CLIENT_ID = '5vs4pnDlh4ARaCySBu4m6EBnmA9YJiZV';
var AUTH0_DOMAIN = 'estacioneto.auth0.com';

var LOCK_CONFIG = {
    auth: {
        redirect: false
    },
    theme: {
        logo: 'img/icons/ms-icon-150x150.png',
        primaryColor: "#673AB7"
    },
    languageDictionary: {
        title: "Piton"
    },
    autoclose: true,
    additionalSignUpFields: [{
        name: 'given_name',
        placeholder: 'First name',
        // icon: 'http://fontawesome.io/icon/user-o/',
        validator: function(name) {
            return {
                valid: name.length > 0,
                hint: "Cannot be empty!" // optional
            };
        }
    },{
        name: 'family_name',
        placeholder: 'Last name',
        // icon: 'http://fontawesome.io/icon/user-o/',
        validator: function(name) {
            return {
                valid: name.length > 0,
                hint: "Cannot be empty!" // optional
            };
        }
    }]
};