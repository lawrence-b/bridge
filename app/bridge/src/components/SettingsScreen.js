import React from 'react';
import { Text, View, TextInput, ScrollView, TouchableOpacity, AsyncStorage } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/EvilIcons';

import HeaderWrapper from './HeaderWrapper'
import HeaderStyles from './HeaderWrapper'

import sendRequest from '../sendRequest'

class SettingsScreen extends React.Component {
  static navigationOptions = {
    headerTitle: 'Settings',
    headerStyle: HeaderStyles.viewStyle,
    headerTitleStyle: HeaderStyles.textStyle
  }

  componentWillMount() {
    this.setState({
      user: this.props.screenProps.userData,
      password: {oldPassword: "", newPassword: "", confirmPassword: ""},
      warningMessage: "Tap Submit to confirm",
      isWarning: false
    });

    this.props.navigation.addListener('willFocus', (playload) => {
      this.setState({
        user: this.props.screenProps.userData,
        password: {oldPassword: "", newPassword: "", confirmPassword: ""},
        warningMessage: "Tap Submit to confirm",
        isWarning: false
      });
    });
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#F18B35' }}>
        <ScrollView>
          <View style={styles.viewStyle}>

            <View style={styles.titleViewStyle}>
              <Text style={{fontSize: 16, fontWeight: 'bold'}}>Account info</Text>
            </View>

            <View style={styles.textViewStyle}>
              <Text style={{fontSize: 14, fontWeight: 'bold'}}>Email: </Text>
              <Text style={{fontSize: 14}}>{this.state.user.email}</Text>
            </View>

            <View style={{...styles.titleViewStyle, marginTop: 20}}>
              <Text style={{fontSize: 16, fontWeight: 'bold'}}>Password</Text>
            </View>

            <View style={styles.textViewStyle}>
              <TextInput
                style={{flex: 1}}
                onChangeText={(text) => this.setState({
                  user: this.state.user,
                  password: {...this.state.password, oldPassword: text}
                })}
                value={this.state.password.oldPassword}
                placeholder="Old password"
                secureTextEntry={true}
              />
            </View>

            <View style={styles.textViewStyle}>
              <TextInput
                style={{flex: 1}}
                onChangeText={(text) => this.setState({
                  user: this.state.user,
                  password: {...this.state.password, newPassword: text}
                })}
                value={this.state.password.newPassword}
                placeholder="New password"
                secureTextEntry={true}
              />
            </View>

            <View style={styles.textViewStyle}>
              <TextInput
                style={{flex: 1}}
                onChangeText={(text) => this.setState({
                  user: this.state.user,
                  password: {...this.state.password, confirmPassword: text}
                })}
                value={this.state.password.confirmPassword}
                placeholder="Confirm password"
                secureTextEntry={true}
              />
            </View>

            <View style={styles.infoTextViewStyle}>
              <Text style={{fontSize: 12, fontWeight: 'bold',
                            color: this.state.isWarning ? '#d55' : '#888'}}>{this.state.warningMessage}</Text>
            </View>

            <TouchableOpacity style={{...styles.buttonStyle, backgroundColor: '#5555ff'}}
              onPress={() => this.submitNewAccountInfo()} >
              <Text style={{fontSize: 14, color: '#fff'}}>Submit</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{...styles.buttonStyle, backgroundColor: '#ff5555'}}
              onPress={() => this.logOut()} >
              <Text style={{fontSize: 14, color: '#fff'}}>Logout</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  submitNewAccountInfo() {
    if (this.state.password.oldPassword.length <= 0) {
      this.setState({...this.state, warningMessage: "Must enter your old password", isWarning: true});
      return;
    }
    else if (this.state.password.newPassword.length <= 0 || this.state.password.confirmPassword.length <= 0) {
      this.setState({...this.state, warningMessage: "Must enter a new password", isWarning: true});
      return;
    }
    else if (this.state.password.newPassword !== this.state.password.confirmPassword) {
      this.setState({...this.state, warningMessage: 'The "new" and "confirm" password fields must match', isWarning: true});
      return;
    }

    sendRequest({
      address: "password/",
      method: "POST",
      authorizationToken: this.state.user.token,
      body: {current_password: this.state.password.oldPassword, new_password: this.state.password.newPassword},
      responseHandlerNoJson: (response) => {
        if (response.status < 400) {
          this.setState({...this.state, warningMessage: "Password changed successfully", isWarning: false});
        }
        else {
          this.setState({...this.state, warningMessage: "Incorrect old password, or new password too weak", isWarning: true});
        }
      },
      errorHandler: (error) => {
        this.setState({...this.state, warningMessage: "There was an error processing your request", isWarning: true});
        console.log("There was an error...");
        console.log(error);
      }
    });
  }

  logOut() {
    AsyncStorage.removeItem('@Bridge:user_data');
    this.props.screenProps.logout();
  }

}

const styles = {
  viewStyle: {
    backgroundColor: '#fff',

    borderRadius: 6,

    margin: 10,
    padding: 15
  },
  textViewStyle: {
    borderColor: '#ddd',
    borderBottomWidth: 1,
    paddingTop: 12,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center'
  },
  titleViewStyle: {
    borderColor: '#ddd',
    borderBottomWidth: 1,
    paddingTop: 12,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center'
  },
  infoTextViewStyle: {
    paddingTop: 12,
    paddingBottom: 12,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    padding: 12,
    borderRadius: 8,
    marginTop: 20
  }
}

const SettingsScreenWrapper = createStackNavigator(
  {
    Settings: SettingsScreen
  },
  {
    initialRouteName: 'Settings'
  }
);

export default SettingsScreenWrapper;
