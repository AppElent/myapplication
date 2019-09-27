import moment from 'moment';

export const refresh = async (url, accesstoken) => {
  const momentexpires = moment(accesstoken.expires_at);
  console.log(momentexpires, accesstoken);
  //const refreshedToken = await fetch(url, {method: 'POST', body: accesstoken})
  //return refreshedToken;
}
