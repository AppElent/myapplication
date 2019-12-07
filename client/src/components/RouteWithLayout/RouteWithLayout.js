import React from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useSession } from 'hooks';
import SignIn from 'views/SignIn';
import { Minimal as MinimalLayout } from 'layouts';

const RouteWithLayout = props => {
  const {user} = useSession();
  
  const { layout: Layout, component: Component, protectedRoute, ...rest } = props;
  const FinalComponent = user === null && protectedRoute ? SignIn : Component;
  const FinalLayout = user === null && protectedRoute ? MinimalLayout : Layout;
  return (
    <Route
      {...rest}
      render={matchProps => (
        <FinalLayout>
          <FinalComponent {...matchProps} />
        </FinalLayout>
      )}
    />
  );
};

RouteWithLayout.propTypes = {
  component: PropTypes.any.isRequired,
  layout: PropTypes.any.isRequired,
  path: PropTypes.string,
  protectedRoute: PropTypes.bool
};

RouteWithLayout.defaultProps = {
  protectedRoute: false
};


export default RouteWithLayout;
