import React, { Component } from 'react';
import { connect } from 'react-redux';
import { loggedIn } from '../actions';

import AuthenticationContext from '../adal';
import adalConfig from '../config';

class App extends Component {
  componentWillMount() {

    var authContext = new AuthenticationContext(adalConfig);

    if (authContext.isCallback(window.location.hash) && !authContext.getLoginError()) {
      console.log("Was a callback from AAD. Get the token returned by AAD.");
      authContext.handleWindowCallback();
      var user = authContext.getCachedUser();
      var token = authContext.acquireToken(adalConfig.clientId, (err, token) => {
        if (err) {
          console.log(err);
          return;
        }

        if (!token) {
          console.log("There wasn't an error but no token was provided!");
          return;
        }

        console.log("user was --> ", user.userName);

        //let React know the user is logged in
        this.props.loggedIn(user.userName, token);
      });
    } else {
      console.log("Was not a callback.");
    }
  }

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

export default connect(null, { loggedIn })(App);

