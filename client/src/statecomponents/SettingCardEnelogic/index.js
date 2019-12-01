import React from 'react';
import { makeStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Typography
} from '@material-ui/core';

import { useSession } from 'hooks';
import { deleteEnelogicSettings } from 'modules/Enelogic';
import { Button, OauthAuthorize } from 'components';



const useStyles = makeStyles(theme => ({
  deleteButton: {
    color: 'red'
  }
}));

const SettingCardEnelogic = ({}) => {
  const classes = useStyles();
  const {userInfo, ref} = useSession();
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader
        subheader="Connect"
        title="Enelogic"
      />
      <Divider />
      <CardContent>
        <Typography>{userInfo.enelogic.success ? `Registratie vanaf: ${userInfo.enelogic.measuringpoints.electra.dayMin}` : 'Enelogic connectie is niet gemaakt. Deze is nodig om de meterstanden op te kunnen halen.'}</Typography>
      </CardContent>
      <Divider />
      <CardActions>
        <OauthAuthorize
          formatUrl="/api/oauth/formaturl/enelogic"
          title={t('buttons.connect') + ' Enelogic'}
        />
        <Button
          className={classes.deleteButton}
          onClick={() => {deleteEnelogicSettings(ref)}}
          variant="outlined"
        >
          {t('buttons.delete')}
        </Button>
      </CardActions>
    </Card>
  );
};

SettingCardEnelogic.propTypes = {
  config: PropTypes.object
};

export default SettingCardEnelogic;
