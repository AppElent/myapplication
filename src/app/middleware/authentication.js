import admin, { db } from '../modules/Firebase';

const checkAuthenticated = async (req, res, options = {}) => {
    //Checken of er een custom token is
    //const token = "homebridge-authenticated"
    const authHeader = req.headers.authorization || '';
    //console.log(req.headers);
    const apimatch = authHeader.match(/Apitoken (.+)/);
    const remoteIP = req.socket.remoteAddress;
    if (!apimatch && options.token !== undefined) return { result: false, reason: 'No API token given' };
    if (apimatch && options.token) {
        const accessToken = apimatch[1];
        console.log(accessToken, remoteIP, remoteIP.endsWith('192.168.178.1'));
        const localaddress = remoteIP.endsWith('192.168.178.1') ? true : false;
        if (localaddress === false) return { result: false, reason: 'No local address' };
        if (accessToken !== token) return { result: false, reason: 'Token doesnt match' };
        return { result: true, jwt: false };
        //return res.status(401).end();
    }

    //Checken of er Firebase authenticatie is
    const firebasematch = authHeader.match(/Firebase (.+)/);
    if (firebasematch) {
        const firebase_token = firebasematch[1];
        try {
            const decodedToken = await admin.auth().verifyIdToken(firebase_token);
            console.log(decodedToken);
            //if(decodedToken.uid === 'p1ezZHQBsyWQDYm9BrCm2wlpP1o1'){
            //decodedToken.uid = "00uaz3xmdoobfWWnY356"
            //}
            return { result: true, jwt: decodedToken };
        } catch (err) {
            return { result: false, reason: err };
        }
    }

    if (!firebasematch && req.query.api_key !== undefined) {
        console.log('Authenticatie op basis van apikey');
        const userdoc = await db
            .collection('env')
            .doc(process.env.REACT_APP_FIRESTORE_ENVIRONMENT)
            .collection('users')
            .where('api.key', '=', req.query.api_key)
            .limit(1)
            .get();
        if (userdoc.empty)
            return { result: false, reason: 'API key was given with query param but not found in database' };
        const doc = userdoc.docs[0];
        return { result: true, jwt: { claims: { uid: doc.id } } };
    } else if (!firebasematch && process.env.NODE_ENV === 'development') {
        let user = 'p1ezZHQBsyWQDYm9BrCm2wlpP1o1';
        if (req.query.user !== undefined) user = req.query.user;
        console.log('Authentication passed, env=DEV, user=' + user);
        return { result: true, jwt: { claims: { uid: user } } };
    } else {
        return { result: false, message: 'No authentication' };
    }

    /*
	const bearermatch = authHeader.match(/Bearer (.+)/);
	if (!bearermatch) return {result: false, reason: 'Bearer does not match'}
	const accessToken = bearermatch[1];
	try{
		const jwt = await oktaJwtVerifier.verifyAccessToken(accessToken, 'api://default');
		try{
		    if(options.group !== undefined){
			const groupMember = await isMemberOfGroup(req, options.group);
			if(groupMember === false){
			  return {result: false, reason: 'Not member of specified group (' + options.group + ')'}
			}
		    }
		}catch(grouperror){
		    console.log(grouperror);
		    return {result: false, reason: 'Not member of specified group (' + options.group + ')'}
		}
		return {result: true, jwt: jwt}
	}catch(error){
		console.log(error);
		return {result: false, reason: 'Accesstoken incorrect'}
	}
	*/
};
/*
module.exports.epilogueAuthenticationRequired = async (req, res, context, options) => {
    const authenticated = await checkAuthenticated(req, res, options);
    console.log('Authentication result ' + authenticated.result);
    if(authenticated.result === true){
	    req.jwt = authenticated.jwt;
	    if(authenticated.jwt !== false){
	      req.uid = req.jwt.claims.uid;
	    }
	    
	    return context.continue;
    }
    console.log("Error = " + authenticated.reason);
    return context.stop;
}
* */

const authenticationRequired = options => (req, res, next) => {
    checkAuthenticated(req, res, options).then(authenticated => {
        console.log('Authentication result ', authenticated);
        if (authenticated.result === true) {
            req.jwt = authenticated.jwt;
            if (authenticated.jwt !== false) {
                const uid = req.jwt.claims === undefined ? req.jwt.uid : req.jwt.claims.uid;
                console.log('User ' + uid + ' successfully authenticated');
                req.uid = uid;
            }
            next();
        } else {
            return res.status(401).send(authenticated.reason);
        }
    });
};

export default authenticationRequired;
export const basicAuthentication = authenticationRequired();
export const adminAuthentication = authenticationRequired({ group: 'Admins' });
