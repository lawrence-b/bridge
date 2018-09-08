import React, { Component } from 'react';
import { Text, View, TouchableOpacity, TextInput, KeyboardAvoidingView, AsyncStorage, Platform } from 'react-native';
import { createStackNavigator } from 'react-navigation';

import sendRequest from '../sendRequest'

class ForgottenPasswordScreen extends Component {

  constructor(props) {
    super(props);

    this.email = '';
    this.state = {errorMessage: '', hasReset: false};
  }

  render() {
    return this.state.hasReset ? this.generateScreen2() : this.generateScreen1();
  }

  generateScreen1() {
    return(
      <KeyboardAvoidingView style={styles.viewStyle} behavior={Platform.OS === "ios" ? "padding" : undefined} enabled>
          <View style={styles.panelViewStyle}>
            <Text style={styles.titleStyle}>Forgot your password?</Text>
            <Text style={styles.labelStyle}>Enter the email address you used to sign up</Text>

            <TextInput style={styles.textFieldStyle} placeholder='Email' autoCapitalize='none' underlineColorAndroid="transparent"
            onChangeText={(text) => this.email = text}
            ref={textInput => this.focusOnEmail(textInput)}
            autoCorrect={false} />

            {this.state.errorMessage !== ''
              ? <Text style={{fontSize: 14, textAlign: 'center', color: '#d33'}}>{this.state.errorMessage}</Text>
              : null}

            <View style={styles.buttonsViewStyle}>
              <TouchableOpacity style={styles.cancelButtonStyle}  onPress={() => this.props.navigation.goBack()}>
                <Text style={styles.buttonTextStyle}>Back</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.loginButtonStyle} onPress={() => this.done()}>
                <Text style={styles.buttonTextStyle}>Submit</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => this.forgotPassword()}>
              <Text style={{fontSize: 12, color: '#fff', marginTop: 22}}>Forgot your password?</Text>
            </TouchableOpacity>
          </View>
      </KeyboardAvoidingView>
    );
  }

  generateScreen2() {
    return(
      <View style={styles.viewStyle}>
          <View style={styles.panelViewStyle}>
            <Text style={styles.titleStyle}>Reset email sent</Text>
            <Text style={styles.labelStyle}>We have sent you an email.</Text>
            <Text style={styles.labelStyle}>Follow the instructions in it to reset your password.</Text>

            <Text style={styles.labelStyle}>Then go back and try logging in again.</Text>

            <TouchableOpacity style={{...styles.cancelButtonStyle, marginBottom: 20, marginRight: 0, marginTop: 12}}  onPress={() => this.props.navigation.goBack()}>
              <Text style={styles.buttonTextStyle}>Back</Text>
            </TouchableOpacity>
          </View>
      </View>
    );
  }

  focusOnEmail(textInput) {
    if (textInput !== null) {
      textInput.focus();
    }
  }

  done() {
    if (this.email.length <= 0) {
      this.setState({...this.state, errorMessage: 'No email address entered'});
      return;
    }

    sendRequest({
      address: 'password/reset/',
      method: 'POST',
      body: {email: this.email},
      responseHandlerNoJson: (response) => {
        if (response.status < 400) {
          this.setState({...this.state, errorMessage: '', hasReset: true});
        }
        else {
          this.setState({...this.state, errorMessage: 'Please enter a valid email address'});
        }
      }
    });
  }
}

const styles={
  viewStyle: {
    backgroundColor: '#F18B35',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  panelViewStyle: {
    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    paddingBottom: 0,

    marginLeft: 46,
    marginRight: 46
  },
  titleStyle: {
    color: '#666',
    fontSize: 26,
    fontWeight: '300',

    marginBottom: 30
  },
  textFieldStyle: {
    backgroundColor: '#fff',
    color: '#333',
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 13,
    paddingRight: 13,
    margin: 10,
    borderRadius: 18,
    borderColor: '#ccc',
    borderWidth: 1,

    width: 200
  },
  labelStyle: {
    color: '#666',
    fontSize: 14,

    marginBottom: 20,
    marginLeft: 20,
    marginRight: 20,
    textAlign: 'center'
  },
  buttonsViewStyle: {
    flexDirection: 'row',
    marginTop: 20
  },
  loginButtonStyle: {
    backgroundColor: '#f66',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 14,
    paddingRight: 14,
    borderRadius: 20,
    marginLeft: 10
  },
  cancelButtonStyle: {
    backgroundColor: '#888',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 14,
    paddingRight: 14,
    borderRadius: 20,
    marginRight: 20
  },
  buttonTextStyle: {
    color: '#fff',
    fontSize: 16,
  }
}

export default ForgottenPasswordScreen;
