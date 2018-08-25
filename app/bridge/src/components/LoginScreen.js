import React, { Component } from 'react';
import { Text, View, TouchableOpacity, TextInput, KeyboardAvoidingView, AsyncStorage } from 'react-native';
import { createStackNavigator } from 'react-navigation';

import sendRequest from '../sendRequest'

class LoginScreen extends Component {

  constructor(props) {
    super(props);

    this.emailTextInput = null;

    this.username = '';
    this.password = '';
  }

  render() {
    return(
      <KeyboardAvoidingView style={styles.viewStyle} behavior="padding" enabled>
          <Text style={styles.titleStyle}>Log In</Text>

          <TextInput style={styles.textFieldStyle} placeholder='Email' autoCapitalize='none'
          onChangeText={(text) => this.username = text}
          ref={textInput => this.focusOnEmail(textInput)} />
          <TextInput style={styles.textFieldStyle} placeholder='Password' autoCapitalize='none' secureTextEntry={true}
          onChangeText={(text) => this.password = text} />

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
      </KeyboardAvoidingView>
    );
  }

  focusOnEmail(textInput) {
    this.emailTextInput = textInput;
    if (this.emailTextInput != null) {
      this.emailTextInput.focus();
    }
  }

  forgotPassword() {

  }

  done() {
    sendRequest({
      address: "auth/token/login/",
      method: "POST",
      body: {email: this.username, password: this.password},
      successHandler: (result) => this.enterApp({email: this.username, token: result.auth_token})
    });
  }

  enterApp(user) {
    const saveUser = async (user) => {
      try {
        await AsyncStorage.setItem('@Bridge:user_data', JSON.stringify(user));
      } catch (error) {
        console.log("Error saving user token. " + error);
      }
    }
    saveUser(user);
    this.props.screenProps.onLogin(user);
  }
}

const styles={
  viewStyle: {
    backgroundColor: '#F18B35',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  titleStyle: {
    color: '#fff',
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

    width: 200
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

export default LoginScreen;
