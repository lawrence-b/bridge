import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/EvilIcons';

class LoginOrSignUpScreen extends Component {

  render() {
    return (
      <ImageBackground source={require('../../assets/bridge_login_background.png')} style={styles.viewStyle}>
        <View style={{alignItems: 'center', alignSelf: 'stretch', marginBottom: 80}}>
          <Image source={require('../../assets/bridge_logo.png')} style={{width: 120, height: 60}} />
          <Text style={styles.titleStyle}>Bridge</Text>
        </View>

        <View style={{alignItems: 'center', alignSelf: 'stretch'}}>
          <TouchableOpacity style={styles.button1Style} onPress={() => this.props.navigation.navigate('LogIn')}>
            <Text style={styles.text1Style}>Log In</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button2Style} onPress={() => this.props.navigation.navigate('SignUp')}>
            <Text style={styles.text2Style}>Sign Up</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.termsTextViewStyle}>
            <Text style={styles.termsTextStyle}>Read Terms & Conditions</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }
}

const styles = {
  viewStyle: {
    backgroundColor: '#F18B35',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  titleStyle: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '300',
    marginTop: 22
  },
  button1Style: {
    backgroundColor: '#f85c5e',
    alignItems: 'center',
    alignSelf:  'stretch',
    marginLeft:  40,
    marginRight: 40,
    marginBottom: 8,
    padding: 8,
    borderRadius: 20,
    justifyContent: 'flex-end'
  },
  text1Style: {
    color: '#fff',
    fontSize: 16,
  },
  button2Style: {
    backgroundColor: '#77bdc9',
    alignItems: 'center',
    alignSelf:  'stretch',
    marginLeft:  40,
    marginRight: 40,
    marginTop: 8,
    marginBottom: 10,
    padding: 8,
    borderRadius: 20,
    justifyContent: 'flex-end'
  },
  text2Style: {
    color: '#fff',
    fontSize: 16,
  },
  termsTextStyle: {
    color: '#fff',
    fontSize: 15,
  },
  termsTextViewStyle: {
    backgroundColor: '#555c',
    borderRadius: 30,
    padding: 12,
    marginTop: 20,
    marginBottom: 20,
  }
}

export default LoginOrSignUpScreen;
