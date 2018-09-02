import React, { Component } from 'react';
import './ForgottenPasswordScreen.css';

import sendRequest from './sendRequest.js';

class ConfirmSignUpScreen extends Component {

  constructor(props) {
    super(props);

    this.state = {confirmationText: ''};
  }

  componentWillMount() {
    sendRequest({
      address: 'users/confirm/',
      method: 'POST',
      body: {uid: this.props.match.params.uid, token: this.props.match.params.token},
      responseHandlerNoJson: (response) => {
        if (response.status < 400) {
          this.setState({confirmationText: 'Account confirmed successfully'});
        }
        else {
          this.setState({confirmationText: 'Oops! Something went wrong.'});
        }
      }
    });
  }

  render() {
    return (
      <div className="ForgottenPasswordScreen">
        <div className="ForgottenPasswordScreen-input-pane">
          <label className="ForgottenPasswordScreen-input-pane-title">Confirm your account</label>

          <label className="LoginOrSignUpScreen-input-pane-label">{this.state.confirmationText}</label>

          {this.state.confirmationText !== ''
           ? <button className="ForgottenPasswordScreen-button" onClick={() => this.props.history.push('/')}>
             <span className="ForgottenPasswordScreen-button-span" style={{backgroundColor: '#157efb', width: 140, marginTop: 40}}>
               Done
             </span>
           </button>
           : null}
        </div>
      </div>
    );
  }

}

export default ConfirmSignUpScreen;
