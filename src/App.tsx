import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';

import Home from 'pages/Home/Home';

import 'styles/style.scss';

export default class App extends React.Component<any> {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Router>
    );
  }
}
