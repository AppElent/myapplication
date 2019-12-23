import express from 'express';
const router = express.Router();

import fetch from 'node-fetch';
import moment from 'moment';

const darksky_api_key = '09cbbe0257a566a4aa20e1c8e0be4757';
const darksky_location = '52.21860580000001, 5.280716600000005';
const darksky_host = 'https://api.darksky.net';
const darksky_region_settings = '?units=auto&lang=nl';

const getCurrentData = async (req, res) => {
    const url = darksky_host + '/forecast/' + darksky_api_key + '/' + darksky_location + darksky_region_settings;
    console.log(url);
    const data = await fetch(url);
    res.send(await data.json());
};

const getDateData = async (req, res) => {
    const date = moment(req.params.date);
    const url =
        darksky_host +
        '/forecast/' +
        darksky_api_key +
        '/' +
        darksky_location +
        ', ' +
        date / 1000 +
        darksky_region_settings;
    console.log(url);
    const data = await fetch(url);
    res.send(await data.json());
};

router.get('/current', getCurrentData);
router.get('/:date', getDateData);

module.exports = router;
