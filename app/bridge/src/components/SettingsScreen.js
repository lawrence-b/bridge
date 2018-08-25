import React from 'react';
import { Text, View, TextInput, ScrollView, TouchableOpacity, AsyncStorage } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/EvilIcons';

import HeaderWrapper from './HeaderWrapper'
import HeaderStyles from './HeaderWrapper'

class SettingsScreen extends React.Component {
  static navigationOptions = {
    headerTitle: 'Settings',
    headerStyle: HeaderStyles.viewStyle,
    headerTitleStyle: HeaderStyles.textStyle
  }

  componentWillMount() {
    var userData = this.props.screenProps.userData;

    this.setState({
      user: this.props.screenProps.userData,
      password: {oldPassword: "", newPassword: "", confirmPassword: ""}
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
                onChangeText={(text) => this.setState({text})}
                value={this.state.password.oldPassword}
                placeholder="Old password"
                secureTextEntry={true}
              />
            </View>

            <View style={styles.textViewStyle}>
              <TextInput
                style={{flex: 1}}
                onChangeText={(text) => this.setState({text})}
                value={this.state.password.newPassword}
                placeholder="New password"
                secureTextEntry={true}
              />
            </View>

            <View style={styles.textViewStyle}>
              <TextInput
                style={{flex: 1}}
                onChangeText={(text) => this.setState({text})}
                value={this.state.password.confirmPassword}
                placeholder="Confirm password"
                secureTextEntry={true}
              />
            </View>

            <View style={styles.infoTextViewStyle}>
              <Text style={{fontSize: 12, fontWeight: 'bold', color: '#888'}}>Tap Submit to confirm</Text>
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
