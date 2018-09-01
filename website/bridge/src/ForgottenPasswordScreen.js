import React, { Component } from 'react';
import './ForgottenPasswordScreen.css';

import sendRequest from './sendRequest.js';

class ForgottenPasswordScreen extends Component {

  constructor(props) {
    super(props);

    this.state = {hasReset: false, errorMessage: ''};
  }

  render() {
    console.log(this.state);

    return (
      <div className="ForgottenPasswordScreen">
        <div className="ForgottenPasswordScreen-input-pane">
          <label className="ForgottenPasswordScreen-input-pane-title">Reset your password</label>

          {this.generatePaneContents()}
        </div>
      </div>
    );
  }

  generatePaneContents() {
    if (this.state.hasReset) {
      return (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <label className="LoginOrSignUpScreen-input-pane-label">Password reset successfully.</label>
          <label className="LoginOrSignUpScreen-input-pane-label">Now click the button below and log in as usual.</label>

          <button className="ForgottenPasswordScreen-button" onClick={() => this.props.history.push('/')}>
            <span className="ForgottenPasswordScreen-button-span" style={{backgroundColor: '#157efb', width: 140, marginTop: 40}}>
              Done
            </span>
          </button>
        </div>
      );
    }
    else {
      return (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}} onKeyPress={(e) => e.key === 'Enter' ? this.submitNewPassword() : null}>
          <input type="password" className="ForgottenPasswordScreen-input-pane-text-field" placeholder="New password"
          ref={(textInput) => {this.newPassword = textInput}} />
          <input type="password" className="ForgottenPasswordScreen-input-pane-text-field" placeholder="Confirm password"
          ref={(textInput) => {this.confirmPassword = textInput}} />

          <label className="LoginOrSignUpScreen-input-pane-label" style={{color: '#E00'}}>{this.state.errorMessage}</label>

          <button className="ForgottenPasswordScreen-button" onClick={() => this.submitNewPassword()}>
            <span className="ForgottenPasswordScreen-button-span" style={{backgroundColor: '#157efb', width: 140, marginTop: 15}}>
              Submit
            </span>
          </button>
        </div>
      );
    }
  }

  submitNewPassword() {
    if (this.newPassword.value.length <= 0 || this.confirmPassword.value.length <= 0) {
      this.setState({...this.state, errorMessage: 'Please enter a new password'});
      return;
    }
    else if (this.newPassword.value !== this.confirmPassword.value) {
      this.setState({...this.state, errorMessage: 'Passwords don\'t match'});
      return;
    }

    sendRequest({
      address: 'password/reset/confirm/',
      method: 'POST',
      body: {uid: this.props.match.params.uid, token: this.props.match.params.token, new_password: this.newPassword.value},
      responseHandlerNoJson: (response) => {
        if (response.status !== 204) {
          this.setState({...this.state, errorMessage: 'Password too weak'});
        }
        else {
          this.setState({errorMessage: '', hasReset: true});
        }
      }
    });
  }

}

export default ForgottenPasswordScreen;
