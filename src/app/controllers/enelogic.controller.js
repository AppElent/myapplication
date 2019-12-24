import express from 'express';
const router = express.Router();
import Enelogic from 'enelogic';

import { basicAuthentication } from '../middleware/authentication';
import cacheMiddleware from 'express-caching-middleware';
import Cache from 'simple-cache-js';

import asyncHandler from 'express-async-handler';

const enelogicCache = new Cache();

const getMeasuringPoints = async (req, res) => {
    if (req.query.access_token === undefined)
        return res.send({ success: false, message: 'No query param access_token present' });
    const enelogic = new Enelogic(req.query.access_token);
    const measuringpoints = await enelogic.getMeasuringPoints();
    return res.send({ success: true, data: measuringpoints });
};

const getData = async (req, res) => {
    if (req.query.access_token === undefined)
        return res.send({ success: false, message: 'No query param access_token present' });
    const enelogic = new Enelogic(req.query.access_token);
    const options = {
        mpointelectra: req.query.mpointelectra,
    };
    const data = await enelogic.getFormattedData(
        req.params.start,
        req.params.end,
        req.params.period.toUpperCase(),
        options,
    );
    return res.send(data);
};

const getYearConsumption = async (req, res) => {
    if (req.query.access_token === undefined)
        return res.send({ success: false, message: 'No query param access_token present' });
    const enelogic = new Enelogic(req.query.access_token);
    const options = {
        mpointelectra: req.query.mpointelectra,
    };
    const data = await enelogic.getYearConsumption(options);
    return res.send(data);
};

router.get('/data/:period/:start/:end', basicAuthentication, cacheMiddleware(enelogicCache), asyncHandler(getData));
router.get('/measuringpoints', basicAuthentication, asyncHandler(getMeasuringPoints));
router.get('/consumption', basicAuthentication, asyncHandler(getYearConsumption));

module.exports = router;
