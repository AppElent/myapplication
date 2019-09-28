import moment from 'moment';
import fetchBackend from 'helpers/fetchBackend';

export const refresh = async (user, url, accesstoken) => {
  const momentexpires = moment(accesstoken.expires_at);
  console.log(momentexpires, accesstoken);
  if(momentexpires.add(-2, 'minutes').isBefore(moment())) return null;
  console.log('Refresh is nodig want expires is verlopen (expires, current)', momentexpires.format('YYYY-MM-DD HH:mm'), moment().format('YYYY-MM-DD HH:mm'))
  const refreshedToken = await fetchBackend(url, {user, method: 'POST', body: accesstoken});
  return refreshedToken;
}
