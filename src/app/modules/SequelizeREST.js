
import fetch from 'node-fetch';
import moment from 'moment';
import Cache from './Cache';
const defaultCache = new Cache(60*60*1);

const getOptions = (options) => {
    if(options === undefined) options = {}
    if(options.idColumnName === undefined) options.idColumnName = 'id';
    if(options.userColumnName === undefined) options.userColumnName = 'userId';
    return options;
}

export const get = (model, options) =>  async (req, res) => {
    try{
        //If no UID property on request object then return with forbidden error
        if(req.uid === undefined) return res.status(401).send({success: false, message: 'No token given'});
        
        options = getOptions(options);
        const entry = await model.findByPk(req.params[options.idColumnName]);
        if(!entry) return res.status(404).send({success: false, message: 'Niets gevonden'})
        if(options.userColumnName !== null){
            if(entry[options.userColumnName] === undefined) return res.status(401).send({success: false, message: 'Geen user op model'});
            if(entry[options.userColumnName] !== req.uid) return res.status(401).send({success: false, message: 'Niet toegestaan'})
        }
        return res.send({success: true, data: entry});
    }catch(err){
        return res.status(500).send({success: false, message: err})
    }

}

export const find = (model, options) => async (req, res) => {
    
    try{
        //If no UID property on request object then return with forbidden error
        if(req.uid === undefined) return res.status(401).send({success: false, message: 'No token given'})
        
        options = getOptions(options);
        const conditions = { where: {[req.params.column]: req.params.value} }
        if(options.userColumnName !== null) conditions.where[options.userColumnName] = req.uid;
        const entry = await model.findOne(conditions)
        if(!entry) return res.status(404).send({success: false, message: 'Niets gevonden'})
        return res.send({success: true, data: entry});
    }catch(err){
        return res.status(500).send({success: false, message: err})
    }

}

export const list = (model, options) => async (req, res) => {
    
    try{
        //If no UID property on request object then return with forbidden error
        if(req.uid === undefined) return res.status(401).send({success: false, message: 'No token given'})
        
        options = getOptions(options);
        const conditions = { where: {[options.userColumnName]: req.uid} }
        
        let entries = []
        if(options.cache !== undefined){
            entries = await (options.cache.get(req.uid + '_all', async () => {return await model.findAll(conditions)}))
        }else{
            entries = await model.findAll(conditions);
            
        }
        return res.send({success: true, data: entries});
    }catch(err){
        return res.status(500).send({success: false, message: err})
    }

}

export const create = (model, options) => async (req, res) => {
    try{
        //If no UID property on request object then return with forbidden error
        if(req.uid === undefined) return res.status(401).send({success: false, message: 'No token given'})
        
        options = getOptions(options);
        const body = req.body;
        body[options.userColumnName] = req.uid;
        console.log(body);
        const entry = await model.create(body)

        return res.send({success: true, data: entry});
    }catch(err){
        return res.status(500).send({success: false, message: err})
    }

}

export const update = (model, options) => async (req, res) => {
    try{
        //If no UID property on request object then return with forbidden error
        if(req.uid === undefined) return res.status(401).send({success: false, message: 'No token given'})
        
        options = getOptions(options);
        const body = req.body;
        
        body[options.userColumnName] = req.uid;
        const entry = await model.update(body, {where: {[options.idColumnName]: req.params[options.idColumnName]}})

        return res.send({success: true, data: entry});
    }catch(err){
        return res.status(500).send({success: false, message: err})
    }

}

export const createOrUpdate = (model, options) => async (req, res) => {
    try{
        //If no UID property on request object then return with forbidden error
        if(req.uid === undefined) return res.status(401).send({success: false, message: 'No token given'})
        
        options = getOptions(options);

        const conditions = req.body.conditions;
        const body = req.body.body;
        conditions[options.userColumnName] = req.uid;
        body[options.userColumnName] = req.uid;
        let entry = await model.findOne(conditions)
        if(entry){
            entry = await entry.update(body)
        }else{
            entry = await model.create(body);
        }
        return res.send({success: true, data: entry});
    }catch(err){
        return res.status(500).send({success: false, message: err})
    }

}

export const destroy = (model, options) => async (req, res) => {
    //If no UID property on request object then return with forbidden error
    if(req.uid === undefined) return res.status(401).send({success: false, message: 'No token given'})
    
    options = getOptions(options);
    model.destroy({ where: { [options.idColumnName]: req.params[options.idColumnName]  } })
    .then(success => res.send({success: true}))
    .catch(err => res.status(500).send({success: false, message: err}))
}
