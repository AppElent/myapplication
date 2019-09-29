const NodeCache = require('node-cache');

module.exports = class Cache {

  constructor(ttlSeconds = null) {
    if(ttlSeconds === null) ttlSeconds = 9999999;
    this.cache = new NodeCache({ stdTTL: ttlSeconds, checkperiod: ttlSeconds * 0.2, useClones: false });
  }

  get(key, storeFunction) {
    const value = this.cache.get(key);
    if (value) {
      console.log('Getting value from cache with key ' + key);
      return Promise.resolve(value);
    }

    return storeFunction().then((result) => {
      this.cache.set(key, result);
      return result;
    });
  }
  
  simpleGet(key) {
    const value = this.cache.get(key);
    if (value) {
      console.log('Getting value from cache with key ' + key);
      return Promise.resolve(value);
    }
    return null;
  }
  
  save(key, data) {
    this.cache.set(key, data);
  }

  del(keys) {
    this.cache.del(keys);
  }

  delStartWith(startStr = '') {
    if (!startStr) {
      return;
    }

    const keys = this.cache.keys();
    for (const key of keys) {
      if (key.indexOf(startStr) === 0) {
        this.del(key);
      }
    }
  }

  flush() {
    this.cache.flushAll();
  }
}

