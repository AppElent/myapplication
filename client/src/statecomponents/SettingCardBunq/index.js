import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Typography,
  CircularProgress
} from '@material-ui/core';

import { useSession } from 'hooks';
import { fetchBackend } from 'helpers';
import { Button, OauthAuthorize } from 'components';
import { deleteBunqSettings } from 'modules/Bunq';



const useStyles = makeStyles(theme => ({
  deleteButton: {
    color: 'red'
  }
}));


const SettingCardBunq = ({}) => {
  const classes = useStyles();
  const { user, userInfo, ref } = useSession();
  const { t } = useTranslation();

  const [loadingToken, setLoadingToken] = useState(false);

  const createBunqSandbox = async () => {
    setLoadingToken(true);
    const data = await fetchBackend('/api/bunq/sandbox', {user});
    console.log(data);
    await ref.update({bunq: {'success': true, 'environment': 'SANDBOX'}})
    setLoadingToken(false);
  }

  
  if(loadingToken) return <CircularProgress className={classes.progress} />

  return (
    <Card>
      <CardHeader
        subheader="Connect"
        title="Bunq"
      />
      <Divider />
      <CardContent>
        <Typography>{userInfo.bunq.success ? 'Connectie succesvol' : 'Bunq connectie is niet gemaakt. Deze is nodig om de data op te kunnen halen.'}</Typography>
      </CardContent>
      <Divider />
      <CardActions>
        <OauthAuthorize
          formatUrl="/api/oauth/formaturl/bunq"
          title={t('buttons.connect') + ' bunq'}
        />
        <Button
          className={classes.button}
          color ="primary"
          onClick={createBunqSandbox}
          variant="contained"
        >
          {t('buttons.delete') + ' bunq sandbox'}
        </Button>
        <Button
          className={classes.deleteButton}
          onClick={() => {deleteBunqSettings(ref)}}
          variant="outlined"
        >
          {t('buttons.delete')}
        </Button>
      </CardActions>
    </Card>
  );
};


export default SettingCardBunq;
