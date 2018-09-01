import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import './LoginOrSignUpScreen.css';

import sendRequest from './sendRequest.js';
import CategoryDropdownMenu from './CategoryDropdownMenu.js';

class LoginOrSignUpScreen extends Component {

  constructor(props) {
    super(props);

    this.incorrectUsernamePassword = false;
    this.currentUserCategoryId = 1;
    this.state = {currentScreen: this.generateTitleScreen()};
  }

  render() {
    return this.state.currentScreen;
  }

  generateTitleScreen() {
    return (
      <div className="LoginOrSignUpScreen">
        <div className="LoginOrSignUpScreen-title-and-subtitle">
          <label className="LoginOrSignUpScreen-title">Bridge</label>
          <label className="LoginOrSignUpScreen-subtitle">Events made simple</label>
        </div>

        <div className="LoginOrSignUpScreen-buttons">
          <button className="LoginOrSignUpScreen-button" onClick={() => this.displayLoginScreen()}>
            <span className="LoginOrSignUpScreen-button-span" style={{background: 'linear-gradient(to right, #ee982f, #fc5a5b)'}}>
              Log In
            </span>
          </button>

          <button className="LoginOrSignUpScreen-button" onClick={() => this.displaySignupScreen()}>
            <span className="LoginOrSignUpScreen-button-span" style={{background: 'linear-gradient(to right, #70e19a, #75bdde)'}}>
              Sign Up
            </span>
          </button>

          <label className="LoginOrSignUpScreen-terms-text">Read Terms & Conditions</label>
        </div>
      </div>
    );
  }

  generateLoginScreen() {
    return (
      <div className="LoginOrSignUpScreen">
        <div className="LoginOrSignUpScreen-input-pane" onKeyPress={(e) => e.key === 'Enter' ? this.logIn() : null} >
          <label className="LoginOrSignUpScreen-input-pane-title">Log In</label>
          <input type="text" className="LoginOrSignUpScreen-input-pane-text-field" placeholder="Email"
          ref={(textInput) => {this.loginEmailTextInput = textInput}} />
          <input type="password" className="LoginOrSignUpScreen-input-pane-text-field" placeholder="Password"
          ref={(textInput) => {this.loginPasswordTextInput = textInput}} />

          {this.incorrectUsernamePassword
            ? <label className="LoginOrSignUpScreen-input-pane-label" style={{color: '#E00'}}>Email or password incorrect</label>
            : null}

          <button className="LoginOrSignUpScreen-button" onClick={() => this.logIn()}>
            <span className="LoginOrSignUpScreen-button-span" style={{backgroundColor: '#157efb', width: 140, marginTop: 30}}>
              Log In
            </span>
          </button>

          <label className="LoginOrSignUpScreen-input-pane-label" style={{cursor: 'pointer'}}>Forgot your password?</label>
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
    return (
      <div className="LoginOrSignUpScreen">
        <div className="LoginOrSignUpScreen-input-pane">
          <label className="LoginOrSignUpScreen-input-pane-title">Sign Up</label>

          <input type="text" className="LoginOrSignUpScreen-input-pane-text-field" placeholder="Email"
          ref={(textInput) => {this.signupEmailTextInput = textInput}} />

          <CategoryDropdownMenu categoryTypeString="user-categories"
            bonusDivStyle={{width: 254, borderRadius: 20}}
            bonusSelectTagStyle={{fontSize: 12, height: 30}}
            onCategoryChanged={(category) => this.onUserCategoryChanged(category)} />

          <input type="password" className="LoginOrSignUpScreen-input-pane-text-field" placeholder="Password"
          ref={(textInput) => {this.signupPasswordTextInput = textInput}} style={{marginTop: 30}} />
          <input type="password" className="LoginOrSignUpScreen-input-pane-text-field" placeholder="Confirm Password"
          ref={(textInput) => {this.signupConfirmPasswordTextInput = textInput}} />

          <button className="LoginOrSignUpScreen-button" onClick={() => this.signUp()}>
            <span className="LoginOrSignUpScreen-button-span" style={{backgroundColor: '#157efb', width: 140, marginTop: 30}}>
              Next
            </span>
          </button>

          <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
            <label className="LoginOrSignUpScreen-input-pane-label">Already have an account?</label>
            <label className="LoginOrSignUpScreen-input-pane-label"
                   style={{fontSize: 12, color: '#E00', cursor: 'pointer', marginLeft: 10}}
                   onClick={() => this.displayLoginScreen()}>
              LOG IN
            </label>
          </div>
        </div>
      </div>
    );
  }

  generateAfterSignupScreen(emailAddress) {
    return (
      <div className="LoginOrSignUpScreen">
        <div className="LoginOrSignUpScreen-input-pane">
          <label className="LoginOrSignUpScreen-input-pane-title">Almost there...</label>

          <label>{"We've sent you an email on: " + emailAddress}</label>
          <p>Click the link in the email to confirm your account,
          <br/>and then click {'"Log In"'} below.
          <br/>
          <br/>(Or from the main page, just click {'"Log In"'})</p>

          <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
            <label className="LoginOrSignUpScreen-input-pane-label"
                   style={{fontSize: 15, color: '#E00', cursor: 'pointer'}}
                   onClick={() => this.displayLoginScreen()}>
              LOG IN
            </label>
          </div>
        </div>
      </div>
    );
  }

  onUserCategoryChanged(category) {
    this.currentUserCategoryId = category.id;
  }

  logIn() {
    if (this.loginEmailTextInput.value.length <= 0 ||  this.loginPasswordTextInput.value <= 0) {
      // TODO: Tell user they need to enter details
      console.log("Details not entered");
      return;
    }

    sendRequest({
      address: "auth/token/login/",
      method: "POST",
      body: {email: this.loginEmailTextInput.value, password: this.loginPasswordTextInput.value},
      failureHandler: () => {this.incorrectUsernamePassword = true; this.setState({currentScreen: this.generateLoginScreen()})},
      successHandler: (result) => this.canEnterApp({email: this.loginEmailTextInput.value, token: result.auth_token}),
      errorHandler: null
    })
  }

  signUp() {
    console.log(this.signupEmailTextInput.value);
    console.log(this.currentUserCategoryId);
    console.log(this.signupPasswordTextInput.value);
    console.log(this.signupConfirmPasswordTextInput.value);

    this.setState({currentScreen: this.generateAfterSignupScreen(this.signupEmailTextInput.value)});
  }

  displayLoginScreen() {
    if (this.signupNameTextInput            !== undefined
     && this.signupNameTextInput            !== null) this.signupNameTextInput.value            = "";
    if (this.signupEmailTextInput           !== undefined
     && this.signupEmailTextInput           !== null) this.signupEmailTextInput.value           = "";
    if (this.signupPasswordTextInput        !== undefined
     && this.signupPasswordTextInput        !== null) this.signupPasswordTextInput.value        = "";
    if (this.signupConfirmPasswordTextInput !== undefined
     && this.signupConfirmPasswordTextInput !== null) this.signupConfirmPasswordTextInput.value = "";

    this.setState({currentScreen: this.generateLoginScreen()});
  }

  displaySignupScreen() {
    if (this.loginEmailTextInput    !== undefined
     && this.loginEmailTextInput    !== null) this.loginEmailTextInput.value           = "";
    if (this.loginPasswordTextInput !== undefined
     && this.loginPasswordTextInput !== null) this.loginPasswordTextInput.value        = "";

    this.incorrectUsernamePassword = false;

    this.setState({currentScreen: this.generateSignupScreen()});
  }

  canEnterApp(userData) {
    const cookies = new Cookies();

    cookies.set('bridge_user_data', userData, { path: '/' });
    this.props.onLogin(userData);
  }
}

export default LoginOrSignUpScreen;
