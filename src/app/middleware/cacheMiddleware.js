

const cacheMiddleware = (cache, userSpecific = true) => async (req, res, next) => {
    let key = req.originalUrl || req.url;
    if(userSpecific) key = req.uid + '_' + key;
    const cachedata = await cache.simpleGet(key);
    if (cachedata) {
        return res.send(cachedata)
    } else {
        res.sendResponse = res.send
        res.send = (body) => {
            cache.save(key, body);
            res.sendResponse(body)
        }
        next()
    }
}

export default cacheMiddleware;