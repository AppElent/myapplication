import express from 'express';
const router = express.Router();

const fetching = require('../utils/fetching');

const home = '113447';

// Set the configuration settings
const credentials = {
    client: {
        id: 'tado-web-app',
        secret: 'wZaRN7rpjn3FoNyF5IFuxg9uMzYJcvOoQ8QWiIqS3hfk6gLhVlG57j5YNoZL2Rtc',
    },
    auth: {
        tokenHost: 'https://auth.tado.com',
        tokenPath: '/oauth/token',
    },
};

const tokenConfig = {
    username: 'ericjansen@live.nl',
    password: process.env.TADO_PASSWORD,
    scope: 'home.user', // also can be an array of multiple scopes, ex. ['<scope1>, '<scope2>', '...']
};

// Initialize the OAuth2 Library
const tado_oauth = require('simple-oauth2').create(credentials);

async function getAccessToken(tado_oauth, tokenConfig) {
    try {
        const result = await tado_oauth.ownerPassword.getToken(tokenConfig);
        return await tado_oauth.accessToken.create(result);
    } catch (error) {
        console.log('Access Token Error', error.message);
        return undefined;
    }
}

async function refreshAccessToken() {
    // Check if the token is expired. If expired it is refreshed.
    if (accessToken.expired()) {
        try {
            accessToken = await accessToken.refresh();
        } catch (error) {
            console.log('Error refreshing access token: ', error.message);
        }
    }
}

var accessToken = '';
//getAccessToken(tado_oauth, tokenConfig).then(data => {accessToken = data;});

const test = async (req, res) => {
    const url = 'https://my.tado.com/api/v1/me';
    await refreshAccessToken();
    const data = await fetching.makeAPICall(url, 'GET', null, accessToken.token.access_token);

    res.send({ data, accessToken });
};

const homes = async (req, res) => {
    const url = 'https://my.tado.com/api/v2/homes/' + home;
    await refreshAccessToken();
    const data = await fetching.makeAPICall(url, 'GET', null, accessToken.token.access_token);

    res.send({ data });
};

const zones = async (req, res) => {
    const url = 'https://my.tado.com/api/v2/homes/' + home + '/zones';
    await refreshAccessToken();
    const data = await fetching.makeAPICall(url, 'GET', null, accessToken.token.access_token);

    res.send({ data });
};

const state = async (req, res) => {
    const url = 'https://my.tado.com/api/v2/homes/' + home + '/zones/' + req.params.zone + '/state';
    await refreshAccessToken();
    const data = await fetching.makeAPICall(url, 'GET', null, accessToken.token.access_token);

    res.send({ data });
};

const report = async (req, res) => {
    const url =
        'https://my.tado.com/api/v2/homes/' +
        home +
        '/zones/' +
        req.params.zone +
        '/dayReport/?date=' +
        req.params.date;
    await refreshAccessToken();
    const data = await fetching.makeAPICall(url, 'GET', null, accessToken.token.access_token);

    res.send({ data });
};

router.get('/test', test);
router.get('/homes', homes);
router.get('/zones', zones);
router.get('/report/:zone/:date', report);
router.get('/state/:zone/', state);

module.exports = router;
