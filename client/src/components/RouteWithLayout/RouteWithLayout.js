import React from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import useSession from '../../hooks/useSession';
import Login from '../../views/Login';

const RouteWithLayout = props => {
  const {user} = useSession();


  
  const { layout: Layout, component: Component, protectedRoute, ...rest } = props;
  const FinalComponent = user === null && protectedRoute ? Login : Component;
  return (
    <Route
      {...rest}
      render={matchProps => (
        <Layout>
          <FinalComponent {...matchProps} />
        </Layout>
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
