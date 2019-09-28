import moment from 'moment';
import fetchBackend from 'helpers/fetchBackend';

export const refresh = async (user, url, accesstoken) => {
  const momentexpires = moment(accesstoken.expires_at);
  console.log(momentexpires, accesstoken);
  if(momentexpires.add(-2, 'minutes').isBefore(moment())) return null;
  const refreshedToken = await fetchBackend(url, {user, method: 'POST', body: accesstoken});
  console.log(refreshedToken);
  return refreshedToken;
}
