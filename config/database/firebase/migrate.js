require('dotenv').config()
const firebase = require('../../../dist/app/modules/Firebase');

firebase.db.collection('/env/local/users/p1ezZHQBsyWQDYm9BrCm2wlpP1o1/rekeningen').get().then(rekeningen => {
    rekeningen.forEach(async rekening => {
      const data = rekening.data();
      //console.log(rekening.id, data);
      await firebase.db.doc('/env/development/users/p1ezZHQBsyWQDYm9BrCm2wlpP1o1/rekeningen/' + rekening.id).set(data);
      await firebase.db.doc('/env/staging/users/p1ezZHQBsyWQDYm9BrCm2wlpP1o1/rekeningen/' + rekening.id).set(data);
      await firebase.db.doc('/env/production/users/p1ezZHQBsyWQDYm9BrCm2wlpP1o1/rekeningen/' + rekening.id).set(data);
    })
  })