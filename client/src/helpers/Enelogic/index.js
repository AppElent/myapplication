import fetchBackend from 'helpers/fetchBackend';

export const getEnelogicData = async (url, accesstoken) => {
  
}

export const saveEnelogicSettings = (user, ref, enelogicConfig) => async (accesstoken) => {
  if(enelogicConfig === undefined) enelogicConfig = {}
  if(!accesstoken.success){
    enelogicConfig.success = false
    await ref.set(enelogicConfig);
    return;
  }
  enelogicConfig['token'] = accesstoken.data;
  try{
    const measuringpoints = await fetchBackend('/api/enelogic/measuringpoints?access_token=' + accesstoken.data.access_token, {user});
    enelogicConfig.measuringpoints = {}
    const mpointelectra = measuringpoints.data.find(item => (item.active === true && item.unitType === 0))
    if(mpointelectra !== undefined) enelogicConfig.measuringpoints.electra = mpointelectra;
    const mpointgas = measuringpoints.data.find(item => (item.active === true && item.unitType === 1))
    if(mpointgas !== undefined) enelogicConfig.measuringpoints.gas = mpointgas;
    enelogicConfig.success = true;
  }catch(err){
    enelogicConfig.success = false;
  }
  await ref.set(enelogicConfig);
}

export const updateEnelogicSettings = (ref, enelogicConfig) => async (accesstoken) => {
  if(enelogicConfig === undefined) enelogicConfig = {}
  if(!accesstoken.success){
    enelogicConfig.success = false
    await ref.set(enelogicConfig);
    return;
  }
  enelogicConfig['token'] = accesstoken.data;
  enelogicConfig['success'] = true;
  await ref.set(enelogicConfig);
}

export const getMeasuringPoints = async () => {

}
