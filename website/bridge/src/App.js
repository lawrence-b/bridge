import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Switch, Redirect } from 'react-router-dom';
import Cookies from 'universal-cookie';
import Ionicon from 'react-ionicons';
import './App.css';

import MainScreen from './MainScreen.js';
import LoginOrSignUpScreen from './LoginOrSignUpScreen.js';
import ForgottenPasswordScreen from './ForgottenPasswordScreen.js';
import ConfirmSignUpScreen from './ConfirmSignUpScreen.js';

class App extends Component {

  constructor(props) {
    super(props);

    this.userData = null;
    this.state = {cookieBanner: this.generateCookieBanner()};
  }

  componentWillMount() {
    const cookies = new Cookies();

    const userData = cookies.get('bridge_user_data');
    const cookiePermissions = cookies.get('bridge_cookie_permissions');

    if (cookiePermissions !== undefined) {
      this.setState({cookieBanner: null});
    }

    if (userData !== undefined) {
      this.userData = userData;
    }
  }

  render() {
    return (
      <div>
          <Router>
            <div>
              {this.generateMainRoute()}
              <Route path="/login" exact render={({ history }) => this.generateLoginOrSignupScreen(history)} />
              <Route path="/password/reset/confirm/:uid/:token" exact component={ForgottenPasswordScreen} />
              <Route path="/activate/:uid/:token" exact component={ConfirmSignUpScreen} />
            </div>
          </Router>

          {this.state.cookieBanner}
      </div>
    );
  }

  generateCookieBanner() {
    return (
      <div className="App-cookie-banner">
        <p style={{color: '#fff', marginLeft: 20, alignSelf: 'center', width: '80%'}}>
          This website uses cookies.
          By using this website, you consent to cookies being stored
          on your machine. Read our Terms and Conditions.
        </p>

        <Ionicon icon="md-close" fontSize="22px" color="#fff" style={{margin: 10, cursor: 'pointer'}}
          onClick={() => this.cookiesExplicitPermission()} />
      </div>
    );
  }

  cookiesExplicitPermission() {
    const cookies = new Cookies();
    cookies.set('bridge_cookie_permissions', {dismissed: true}, { path: '/' });
    this.setState({cookieBanner: null});
  }

  generateMainRoute() {
    return <Route path='/' exact render={({ history }) => {
      if (this.userData !== null && this.userData !== undefined) {
        return this.generateMainScreen(this.userData, history);
      }
      else {
        return <Redirect to='/login' />;
      }
    }} />;
  }

  generateMainScreen(userData, history) {
    return <MainScreen userData={userData} logOut={() => this.onLogout(history)} />;
  }

  generateLoginOrSignupScreen(history) {
    const cookies = new Cookies();
    cookies.remove('bridge_user_data');

    this.userData = null;

    return <LoginOrSignUpScreen onLogin={(userData) => this.onLogin(userData, history)} />;
  }

  onLogin(userData, history) {
    this.userData = userData;
    history.push('/');
  }

  onLogout(history) {
    const cookies = new Cookies();
    cookies.remove('bridge_user_data');

    this.userData = null;
    history.push('/');
  }
}

export default App;
