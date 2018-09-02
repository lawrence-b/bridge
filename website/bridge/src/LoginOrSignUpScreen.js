import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import './LoginOrSignUpScreen.css';

import sendRequest from './sendRequest.js';
import CategoryDropdownMenu from './CategoryDropdownMenu.js';
import SignUpScreen from './SignUpScreen.js';
import ResetPasswordScreen from './ResetPasswordScreen.js';

class LoginOrSignUpScreen extends Component {

  constructor(props) {
    super(props);

    this.state = {currentScreen: this.generateTitleScreen()};
  }

  render() {
    return this.state.currentScreen;
  }

  generateTitleScreen() {
    return (
      <div className="LoginOrSignUpScreen">
        <div className="LoginOrSignUpScreen-title-and-subtitle">
          <img src={require('./images/bridge_logo.png')} style={{width: 160, height: 80, marginBottom: 20}} />

          <label className="LoginOrSignUpScreen-title">Bridge</label>
        </div>

        <div className="LoginOrSignUpScreen-buttons">
          <button className="LoginOrSignUpScreen-button" onClick={() => this.displayLoginScreen('')}>
            <span className="LoginOrSignUpScreen-button-span" style={{background: 'linear-gradient(to right, #ee982f, #fc5a5b)'}}>
              Log In
            </span>
          </button>

          <button className="LoginOrSignUpScreen-button" onClick={() => this.displaySignupScreen()}>
            <span className="LoginOrSignUpScreen-button-span" style={{background: 'linear-gradient(to right, #70e19a, #75bdde)'}}>
              Sign Up
            </span>
          </button>

          <label className="LoginOrSignUpScreen-terms-text"
            style={{backgroundColor: '#555c', borderRadius: 30, padding: 10, marginTop: 20}}>Read Terms & Conditions</label>
        </div>
      </div>
    );
  }

  generateLoginScreen(errorMessage) {
    return (
      <div className="LoginOrSignUpScreen">
        <div className="LoginOrSignUpScreen-input-pane" onKeyPress={(e) => e.key === 'Enter' ? this.logIn() : null} >
          <label className="LoginOrSignUpScreen-input-pane-title">Log In</label>
          <input type="text" className="LoginOrSignUpScreen-input-pane-text-field" placeholder="Email"
          ref={(textInput) => {this.loginEmailTextInput = textInput}} />
          <input type="password" className="LoginOrSignUpScreen-input-pane-text-field" placeholder="Password"
          ref={(textInput) => {this.loginPasswordTextInput = textInput}} />

          <label className="LoginOrSignUpScreen-input-pane-label" style={{color: '#E00'}}>{errorMessage}</label>

          <button className="LoginOrSignUpScreen-button" onClick={() => this.logIn()}>
            <span className="LoginOrSignUpScreen-button-span" style={{backgroundColor: '#157efb', width: 140, marginTop: 30}}>
              Log In
            </span>
          </button>

          <label className="LoginOrSignUpScreen-input-pane-label"
            style={{cursor: 'pointer'}}
            onClick={() => this.forgottenPassword()}>
            Forgot your password?
          </label>
          <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
            <label className="LoginOrSignUpScreen-input-pane-label">{'Don\'t have an account?'}</label>
            <label className="LoginOrSignUpScreen-input-pane-label"
                   style={{fontSize: 12, color: '#E00', cursor: 'pointer', marginLeft: 10}}
                   onClick={() => this.displaySignupScreen()}>
              SIGN UP
            </label>
          </div>
        </div>
      </div>
    );
  }

  generateSignupScreen() {
    return <SignUpScreen displayLoginScreen={() => this.displayLoginScreen('')} />;
  }

  logIn() {
    if (this.loginEmailTextInput.value.length <= 0 ||  this.loginPasswordTextInput.value <= 0) {
      this.displayLoginScreen('Details not entered');
      return;
    }

    sendRequest({
      address: "auth/token/login/",
      method: "POST",
      body: {email: this.loginEmailTextInput.value, password: this.loginPasswordTextInput.value},
      failureHandler: () => {this.displayLoginScreen('Email or password incorrect')},
      successHandler: (result) => this.canEnterApp({email: this.loginEmailTextInput.value, token: result.auth_token}),
      errorHandler: null
    })
  }

  displayLoginScreen(errorMessage) {
    this.setState({currentScreen: this.generateLoginScreen(errorMessage)});
  }

  displaySignupScreen() {
    if (this.loginEmailTextInput    !== undefined
     && this.loginEmailTextInput    !== null) this.loginEmailTextInput.value           = "";
    if (this.loginPasswordTextInput !== undefined
     && this.loginPasswordTextInput !== null) this.loginPasswordTextInput.value        = "";

    this.setState({currentScreen: this.generateSignupScreen()});
  }

  forgottenPassword() {
    if (this.loginEmailTextInput    !== undefined
     && this.loginEmailTextInput    !== null) this.loginEmailTextInput.value           = "";
    if (this.loginPasswordTextInput !== undefined
     && this.loginPasswordTextInput !== null) this.loginPasswordTextInput.value        = "";

     this.setState({currentScreen: <ResetPasswordScreen />})
  }

  canEnterApp(userData) {
    const cookies = new Cookies();

    cookies.set('bridge_user_data', userData, { path: '/' });
    this.props.onLogin(userData);
  }
}

export default LoginOrSignUpScreen;
