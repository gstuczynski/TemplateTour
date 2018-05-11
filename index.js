import React from 'react';
import { Text, AppRegistry } from 'react-360';
import TourActions from './actions/tourActions';
import TourStore from './stores/tourStore';
import config from './tour_config/config.json';
import TourStep from './TourStep';
import connectToStores from './connectToStores';

const storeConnector = {
  TourStore(Store) {
    return {
      isFetching: Store.isFetching()
    };
  }
};

class TemplateTour extends React.Component {
  componentDidMount() {
    TourActions.navigateTo(config.firstStep);
  }

  render() {
    const { isFetching } = this.props;
    if (isFetching) return <Text>Loading...</Text>;
    return <TourStep />;
  }
}

TemplateTourWithStores = connectToStores(
  TemplateTour, [TourStore], storeConnector
);

AppRegistry.registerComponent('TemplateTour', () => TemplateTourWithStores);
module.exports = TemplateTourWithStores;
