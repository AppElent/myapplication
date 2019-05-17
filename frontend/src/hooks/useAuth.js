

export const useAuth = auth => {
  /*
  const [object, setObject] = useState({authenticated: null, user: null, sub: null});
  
  console.log("useAuth hook loopt");
  
  const loadAuthentication = async () => {
    let authenticated = await auth.isAuthenticated();
    let user = null;
    let sub = null;
    let found = null;
    if(authenticated){
        user = await auth.getUser();
        const groups = await makeAPICall('/api/okta/groups', 'GET', null, await auth.getAccessToken())
        found = groups.find((element) => {
          return element.profile.name === 'Admins'; 
        }); 
        console.log(groups, found);
    }

    setObject({...object, authenticated: authenticated, user: user, sub: (user !== null ? user.sub : ''), admin: (found !== null)});
  }
  
  useEffect(() => {
    loadAuthentication();
  }, []);
  
  console.log(object);
  * */
  return [null, null, null, null];//object.authenticated, object.user, object.sub, object.admin];
};

export default useAuth;
