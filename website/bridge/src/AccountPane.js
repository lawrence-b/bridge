import React, { Component } from 'react';
import './AccountPane.css';

import Button from './Button.js';
import sendRequest from './sendRequest.js';

class AccountPane extends Component {

  constructor(props) {
    super(props);

    this.state = {
      user: this.props.user,
      extendedUserData: {first_name: '', last_name: '', user_category: null, university_age_category: '', matriculation_year: '', subject: ''},
      oldPassword:  '',
      newPassword1: '',
      newPassword2: ''
    };
  }

  componentWillMount() {
    sendRequest({
      address: 'users/me/',
      method: 'GET',
      authorizationToken: this.props.user.token,
      successHandler: (result) => {
        if (result.matriculation_year !== null && result.matriculation_year !== undefined) {
          result.matriculation_year = result.matriculation_year.toString();
        }

        this.setState({...this.state, extendedUserData: result})
      }
    })
  }

  render() {
    var bonusButtonStyle = {
      marginTop: 10,
      marginBottom: 5,
      marginLeft: 0,
      marginRight: 30
    };

    return (
      <div className="AccountPane">
        <div className="AccountPane-top-bar">
          <label className="AccountPane-header">Account</label>
          <Button positive={true} text="Log out" onClick={() => this.logOut()}
            style={{marginTop: 0, marginBottom: 10, marginRight: 4, backgroundColor: '#d44', borderColor: '#b22'}} />
        </div>

        <div className="AccountPane-main">
          <div className="AccountPane-panel" style={{alignSelf: 'flex-start', maxWidth: '35%'}}>
            <label className="AccountPane-panel-title">Details</label>

            <div className="AccountPane-row" style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
              <label className="AccountPane-label">Email: </label>
              <label className="AccountPane-text-field" style={{border: 'none'}}>{this.state.user.email}</label>
            </div>

            {this.generateExtendedUserDataComponents()}

            <p>You can change your password on the right-hand side. To manage your host, click the "Manage" link on the left menu bar.</p>
          </div>

          <div className="AccountPane-panel">
            <label className="AccountPane-panel-title">Password</label>

            <div className="AccountPane-row" style={{borderBottom: 'none'}}>
              <label className="AccountPane-label">Old password: </label>
              <input type="password" onChange={(e) => {this.state.oldPassword = e.target.value; this.setState(this.state);}} className="AccountPane-text-field" value={this.state.oldPassword} />
            </div>

            <div className="AccountPane-row" style={{borderBottom: 'none'}}>
              <label className="AccountPane-label">New password: </label>
              <input type="password" onChange={(e) => {this.state.newPassword1 = e.target.value; this.setState(this.state);}} className="AccountPane-text-field" value={this.state.newPassword1} />
            </div>

            <div className="AccountPane-row" style={{borderBottom: 'none'}}>
              <label className="AccountPane-label">Confirm new password: </label>
              <input type="password" onChange={(e) => {this.state.newPassword2 = e.target.value; this.setState(this.state);}} className="AccountPane-text-field" value={this.state.newPassword2} />
            </div>

            <label style={{color: '#d55', marginBottom: 12, fontSize: 14}}>
              {this.state.warningMessage}
            </label>
            <label style={{color: '#5d5', marginBottom: 12, fontSize: 14}}>
              {this.state.successMessage}
            </label>

            <div className="AccountPane-buttons">
              <Button positive={true} text="Submit" onClick={() => this.changePassword()} style={bonusButtonStyle} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  generateExtendedUserDataComponents() {
    return (
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <div className="AccountPane-row" style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
          <label className="AccountPane-label">Name: </label>
          <label className="AccountPane-text-field" style={{border: 'none'}}>
            {this.state.extendedUserData.first_name + ' ' + this.state.extendedUserData.last_name}
          </label>
        </div>

        <div className="AccountPane-row" style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
          <label className="AccountPane-label">User category: </label>
          <label className="AccountPane-text-field" style={{border: 'none'}}>
            {this.state.extendedUserData.user_category !== null ? this.state.extendedUserData.user_category.name : null}
          </label>
        </div>

        {this.state.extendedUserData.university_age_category !== null && this.state.extendedUserData.university_age_category !== undefined
         ?  <div className="AccountPane-row" style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
              <label className="AccountPane-label">University age category: </label>
              <label className="AccountPane-text-field" style={{border: 'none'}}>
                {this.state.extendedUserData.university_age_category}
              </label>
            </div>
         : null}

        {this.state.extendedUserData.matriculation_year !== null && this.state.extendedUserData.matriculation_year !== undefined
         ?  <div className="AccountPane-row" style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
              <label className="AccountPane-label">Matriculation year: </label>
              <label className="AccountPane-text-field" style={{border: 'none'}}>
                {this.state.extendedUserData.matriculation_year}
              </label>
            </div>
         : null}

        {this.state.extendedUserData.subject !== null && this.state.extendedUserData.subject !== undefined
         ?  <div className="AccountPane-row" style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
              <label className="AccountPane-label">Subject: </label>
              <label className="AccountPane-text-field" style={{border: 'none'}}>
                {this.state.extendedUserData.subject}
              </label>
            </div>
         : null}
      </div>
    );
  }

  changePassword() {
    if (this.state.oldPassword.length <= 0) {
      this.setState({...this.state, warningMessage: "Must enter your old password", successMessage: null});
      return;
    }
    else if (this.state.newPassword1.length <= 0 || this.state.newPassword2.length <= 0) {
      this.setState({...this.state, warningMessage: "Must enter a new password", successMessage: null});
      return;
    }
    else if (this.state.newPassword1 !== this.state.newPassword2) {
      this.setState({...this.state, warningMessage: 'The "new" and "confirm" password fields must match', successMessage: null});
      return;
    }

    sendRequest({
      address: "password/",
      method: "POST",
      authorizationToken: this.props.user.token,
      body: {current_password: this.state.oldPassword, new_password: this.state.newPassword1},
      responseHandlerNoJson: (response) => {
        if (response.status < 400) {
          this.setState({...this.state, warningMessage: null, successMessage: "Password changed successfully"});
        }
        else {
          this.setState({...this.state, warningMessage: "Incorrect old password, or new password too weak", successMessage: null});
        }
      },
      errorHandler: (error) => {
        this.setState({...this.state, warningMessage: "There was an error processing your request", successMessage: null});
        console.log("There was an error...");
        console.log(error);
      }
    });
  }

  logOut() {
    this.props.logOut();
  }
}

export default AccountPane;
