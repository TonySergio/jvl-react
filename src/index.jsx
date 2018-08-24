import React from 'react';
import { render } from 'react-dom';

import configureStore from './store/configureStore';

import Root from './containers/Root';

const store = configureStore();

render(
  <AppContainer>
    <Root
      store={ store }
    />
  </AppContainer>,
  document.getElementById('root')
);
