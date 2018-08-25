import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import Ionicon from 'react-ionicons';
import './App.css';

import MainScreen from './MainScreen.js';
import LoginOrSignUpScreen from './LoginOrSignUpScreen.js';

class App extends Component {

  componentWillMount() {
    this.displayLoginOrSignupScreen();

    const cookies = new Cookies();

    const userData = cookies.get('bridge_user_data');

    if (userData !== undefined) {
      this.displayMainScreen(userData);
    }
  }

  render() {
    return (
      <div>
        {this.state.currentScreen}

        
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

        <Ionicon icon="md-close" fontSize="22px" color="#fff" style={{margin: 10, cursor: 'pointer'}} />
      </div>
    );
  }

  displayMainScreen(userData) {
    this.setState({currentScreen: <MainScreen userData={userData} logOut={() => this.onLogout()}/>});
  }

  displayLoginOrSignupScreen() {
    this.setState({currentScreen: <LoginOrSignUpScreen onLogin={(userData) => this.onLogin(userData)} />});
  }

  onLogin(userData) {
    this.displayMainScreen(userData);
  }

  onLogout() {
    const cookies = new Cookies();
    cookies.remove('bridge_user_data');

    this.displayLoginOrSignupScreen();
  }
}

export default App;
