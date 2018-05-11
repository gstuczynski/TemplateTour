import React from 'react';

const getStoreListeners = (stores, storeConnectors, containerComponent) =>
  stores.reduce((listeners, store) => {
    const storeName = store.displayName;
    const connector = storeConnectors[storeName];
    const listenerRecord = {
      [storeName]: () => containerComponent.setState(connector(store, containerComponent.props)),
    };
    return Object.assign(listeners, listenerRecord);
  }, {});

const validateStoreConnectors = (stores, storeConnectorsMap) => {
  if (storeConnectorsMap == null) {
    throw Error('No storeConnector was provided!');
  }
  const storesWithoutConnectors = stores.reduce((acc, store) => {
    const storeName = store.displayName;
    const hasValidConnector = typeof storeConnectorsMap[storeName] === 'function';
    if (hasValidConnector) return acc;
    return acc.concat(storeName);
  }, []);

  if (storesWithoutConnectors.length === 0) return;
  throw Error(`Valid storeConnector(s) missing: check storeConnector(s) for
    ${storesWithoutConnectors.join(', ')}
  `);
};

const connectStores = (Component, stores, storeConnectorsMap) => {
  const storesArr = [].concat(stores);
  validateStoreConnectors(storesArr, storeConnectorsMap);

  return class StoreConnectorComponent extends React.Component {
    constructor(props) {
      super(props);
      this.state = storesArr.reduce((accState, store) =>
        Object.assign(accState, storeConnectorsMap[store.displayName](store, props))
      , {});
    }

    componentWillMount() {
      this.storeListeners = getStoreListeners(storesArr, storeConnectorsMap, this);
      storesArr.forEach(store => store.listen(this.storeListeners[store.displayName]));
    }

    componentWillUnmount() {
      storesArr.forEach(store => store.unlisten(this.storeListeners[store.displayName]));
      this.storeListeners = null;
    }

    render() {
      return (<Component {...this.props} {...this.state} />);
    }
  };
};

export default connectStores;
