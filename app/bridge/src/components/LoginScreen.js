import React, { Component } from 'react';
import { Text, View, TouchableOpacity, TextInput, KeyboardAvoidingView, AsyncStorage } from 'react-native';
import { createStackNavigator } from 'react-navigation';


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
    console.log("Username: " + this.username);
    console.log("Password: " + this.password);

    fetch("http://localhost:8000/auth/token/login/", {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, cors, *same-origin
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({email: this.username, password: this.password})
    }).then(res => res.status === 400 ? null : res.json())
      .then(
        (result) => {
          console.log("Got result:");
          console.log(result);

          if (result === null || result === undefined) {
            // TODO: Tell user incorrect username/password
            console.log("Access denied");
            return;
          }

          this.enterApp({email: "mpozzi@hotmail.co.uk", token: result.auth_token});
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          console.log("Got error:");
          console.log(error);

          // TODO: Handle error
        }
    )
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
