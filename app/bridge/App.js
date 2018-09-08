import React, { Component } from 'react';
import { View, AsyncStorage } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';

import HomeScreenWrapper from './src/components/HomeScreen';
import EventsScreenWrapper from './src/components/EventsScreen';
import SocietiesScreenWrapper from './src/components/SocietyCategoriesScreen';
import SettingsScreen from './src/components/SettingsScreen';

import LoginOrSignUpScreen from './src/components/LoginOrSignUpScreen';
import LoginScreen from './src/components/LoginScreen';
import SignUpScreen from './src/components/SignUpScreen';
import ForgottenPasswordScreen from './src/components/ForgottenPasswordScreen';

const AppWrapper =  createBottomTabNavigator(
  {
    Home: HomeScreenWrapper,
    Societies: SocietiesScreenWrapper,
    Events: EventsScreenWrapper,
    Settings: SettingsScreen
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === 'Home') {
          iconName = `ios-home${focused ? '' : '-outline'}`;
        }
        else if (routeName === 'Societies') {
          iconName = `ios-contacts${focused ? '' : '-outline'}`;
        } else if (routeName === 'Events') {
          iconName = `ios-bowtie${focused ? '' : '-outline'}`;
        } else if (routeName === 'Settings') {
          iconName = `ios-settings${focused ? '' : '-outline'}`;
        }

        return <Ionicons name={iconName} size={30} color={tintColor} />;
      },
    }),
    tabBarOptions: {
      activeTintColor: 'tomato',
      inactiveTintColor: 'gray',
      labelStyle: {
        marginTop: -4,
        marginBottom: 3
      }
    }
  });

class ActualApp extends Component {
  render() {
    return <AppWrapper screenProps={{userData: this.props.userData, logout: () => this.props.logout()}} />;
  }
}

const LoginStack = createStackNavigator(
  {
    Home: LoginOrSignUpScreen,
    LogIn: LoginScreen,
    SignUp: SignUpScreen,
    ForgottenPassword: ForgottenPasswordScreen
  },
  {
    initialRouteName: 'Home',
    headerMode: 'none',

    navigationOptions: {
        headerVisible: false,
    }
  }
);

class App extends Component {

  componentWillMount() {
    this.setState({mainComponent: <View style={{flex: 1, backgroundColor: '#F18B35'}} />});

    try {
      const promise = AsyncStorage.getItem('@Bridge:user_data');
      if (promise !== null) {
        promise.then((val) => {
          if (val === null) {
            console.log("User data is null. Proposing login screen instead.");
            this.showLoginScreen();
            return;
          }

          var userData = JSON.parse(val);
          this.showActualApp(userData);
          console.log("User data found. Proceeding...");
        });
      }
      else {
        this.showLoginScreen();
        console.log("No user data found.");
      }
    }
    catch (error) {
      console.log("We have an error: " + error);
    }
  }

  render() {
    return this.state.mainComponent;
  }

  onLogin(userData) {
    this.showActualApp(userData);
  }

  logout() {
    this.showLoginScreen();
  }

  showLoginScreen() {
    this.setState({mainComponent: <LoginStack screenProps={{onLogin: (userData) => this.onLogin(userData)}} />});
  }

  showActualApp(userData) {
    this.setState({mainComponent: <ActualApp userData={userData} logout={() => this.logout()} />});
  }
}

export default App;
