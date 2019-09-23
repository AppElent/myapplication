require('dotenv').config()
const firebase = require('../../../dist/app/modules/Firebase');

firebase.db.doc('/env/local/users/p1ezZHQBsyWQDYm9BrCm2wlpP1o1/rekeningen/Spotify').get().then(spotifydoc => {
  const data = spotifydoc.data();
  firebase.db.doc('/env/development/users/p1ezZHQBsyWQDYm9BrCm2wlpP1o1/rekeningen/Spotify').set(data);
  firebase.db.doc('/env/staging/users/p1ezZHQBsyWQDYm9BrCm2wlpP1o1/rekeningen/Spotify').set(data);
  firebase.db.doc('/env/production/users/p1ezZHQBsyWQDYm9BrCm2wlpP1o1/rekeningen/Spotify').set(data);

})


