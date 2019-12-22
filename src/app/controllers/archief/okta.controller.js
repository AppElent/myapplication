//
const router = require('express').Router();
const auth = require('../middleware/authentication');

const fetch = require('node-fetch');
const okta_api_key = process.env.OKTA_API_KEY;
const OKTA_ORG_URL = 'https://dev-810647.okta.com';
const Cache = require('../modules/Cache');
const oktaCache = new Cache(9999999);

const createUser = async (req, res) => {
    const result = await fetch(OKTA_ORG_URL + '/api/v1/users?activate=false', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'SSWS ' + okta_api_key,
        },
        body: JSON.stringify(req.body),
    }).catch(err => console.log(err));
    const data = await result.json();
    res.send(data);
};

const getGroups = async (req, res) => {
    if (req.jwt === undefined) return res.status(401).send('Not authorized');
    const cachekey = req.uid + '_groups';
    const response = await oktaCache.get(cachekey, async () => {
        const result = await fetch(OKTA_ORG_URL + '/api/v1/users/' + req.uid + '/groups', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: 'SSWS ' + okta_api_key,
            },
        }).catch(err => console.log(err));
        const data = await result.json();
        return data;
    });
    res.send(response);
};

router.post('/create', auth.adminAuthentication, createUser);
router.get('/groups', auth.basicAuthentication, getGroups);
module.exports = router;
