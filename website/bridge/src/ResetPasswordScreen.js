import React, { Component } from 'react';
import './LoginOrSignUpScreen.css';

import sendRequest from './sendRequest.js';

class ResetPasswordScreen extends Component {

  constructor(props) {
    super(props);

    this.state = {emailAddress: '', hasReset: false, errorMessage: ''};
  }

  render() {
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
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}} onKeyPress={(e) => e.key === 'Enter' ? this.resetPassword() : null}>
          <label className="LoginOrSignUpScreen-input-pane-label">We have sent you an email.</label>

          <label className="LoginOrSignUpScreen-input-pane-label" style={{marginBottom: 20}}>
            Please follow the instructions to reset your password.
          </label>
        </div>
      );
    }
    else {
      return (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}} onKeyPress={(e) => e.key === 'Enter' ? this.resetPassword() : null}>
          <label className="LoginOrSignUpScreen-input-pane-label" style={{marginBottom: 20}}>Please enter your email address.</label>

          <input type="text" className="LoginOrSignUpScreen-input-pane-text-field" placeholder="Email"
            onChange={(e) => this.setState({...this.state, emailAddress: e.target.value})} value={this.state.emailAddress} />

          <label className="LoginOrSignUpScreen-input-pane-label" style={{color: '#E00'}}>{this.state.errorMessage}</label>

          <button className="LoginOrSignUpScreen-button" onClick={() => this.resetPassword()}>
            <span className="LoginOrSignUpScreen-button-span" style={{backgroundColor: '#157efb', width: 140, marginTop: 15}}>
              Submit
            </span>
          </button>
        </div>
      );
    }
  }

  resetPassword() {
    if (this.state.emailAddress.length <= 0) {
      this.setState({...this.state, errorMessage: 'No email address entered'});
      return;
    }

    sendRequest({
      address: 'password/reset/',
      method: 'POST',
      body: {email: this.state.emailAddress},
      responseHandlerNoJson: (response) => {
        if (response.status < 400) {
          this.setState({...this.state, errorMessage: '', hasReset: true});
        }
        else {
          this.setState({...this.state, errorMessage: 'Please enter a valid email address'});
        }
      }
    })
  }

}

export default ResetPasswordScreen;
