import React, { Component } from 'react';
import { Text, View, TouchableOpacity, TextInput, KeyboardAvoidingView, AsyncStorage, Platform } from 'react-native';
import { createStackNavigator } from 'react-navigation';

import sendRequest from '../sendRequest'

class LoginScreen extends Component {

  constructor(props) {
    super(props);

    this.email = '';
    this.password = '';

    this.state = {errorMessage: null};
  }

  render() {
    return(
      <KeyboardAvoidingView style={styles.viewStyle} behavior={Platform.OS === "ios" ? "padding" : undefined} enabled>
          <View style={styles.panelViewStyle}>
            <Text style={styles.titleStyle}>Log In</Text>

            <TextInput style={styles.textFieldStyle} placeholder='Email' autoCapitalize='none' underlineColorAndroid="transparent"
            onChangeText={(text) => this.email = text}
            ref={textInput => this.focusOnEmail(textInput)}
            autoCorrect={false} />
            <TextInput style={styles.textFieldStyle} placeholder='Password' autoCapitalize='none' secureTextEntry={true} underlineColorAndroid="transparent"
            onChangeText={(text) => this.password = text} />

            <Text style={{color: '#E00', marginTop: 20}}>{this.state.errorMessage}</Text>

            <View style={styles.buttonsViewStyle}>
              <TouchableOpacity style={styles.cancelButtonStyle}  onPress={() => this.props.navigation.goBack()}>
                <Text style={styles.buttonTextStyle}>Back</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.loginButtonStyle} onPress={() => this.done()}>
                <Text style={styles.buttonTextStyle}>Log In</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => this.forgotPassword()}>
              <Text style={{fontSize: 12, color: '#333', marginTop: 22, marginBottom: 20}}>Forgot your password?</Text>
            </TouchableOpacity>
          </View>
      </KeyboardAvoidingView>
    );
  }

  focusOnEmail(textInput) {
    if (textInput !== null) {
      textInput.focus();
    }
  }

  forgotPassword() {
    this.state.errorMessage = null;
    this.props.navigation.navigate('ForgottenPassword');
  }

  done() {
    sendRequest({
      address: "auth/token/login/",
      method: "POST",
      body: {email: this.email, password: this.password},
      successHandler: (result) => this.enterApp({email: this.email, token: result.auth_token}),
      failureHandler: () => this.setState({...this.state, errorMessage: 'Incorrect email/password'})
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
  panelViewStyle: {
    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    paddingBottom: 0
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
  buttonsViewStyle: {
    flexDirection: 'row',
    marginTop: 20
  },
  loginButtonStyle: {
    backgroundColor: '#6c6',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 14,
    paddingRight: 14,
    borderRadius: 20,
    marginLeft: 10
  },
  cancelButtonStyle: {
    backgroundColor: '#f66',
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
