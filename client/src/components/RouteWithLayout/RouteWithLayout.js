import React from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';

const RouteWithLayout = props => {
  const { layout: Layout, component: Component, routeComponent: RouteComponent, ...rest } = props;
  return (
    <RouteComponent
      {...rest}
      render={matchProps => (
        <Layout>
          <Component {...matchProps} />
        </Layout>
      )}
    />
  );
};

RouteWithLayout.propTypes = {
  component: PropTypes.any.isRequired,
  layout: PropTypes.any.isRequired,
  path: PropTypes.string,
  routeComponent: PropTypes.any
};

RouteWithLayout.defaultProps = {
  routeComponent: Route
};

export default RouteWithLayout;
