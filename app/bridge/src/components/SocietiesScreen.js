import React from 'react';
import { Text, View } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/EvilIcons';

import HeaderWrapper from './HeaderWrapper'
import SocietiesList from './SocietiesList'
import HeaderStyles from './HeaderWrapper'
import CategoriesTray from './CategoriesTray'

import sendRequest from '../sendRequest'

class SocietiesScreen extends React.Component {
  static navigationOptions = ({navigation}) => ({
    headerTitle: navigation.getParam('category').name,
    headerStyle: HeaderStyles.viewStyle,
    headerTitleStyle: HeaderStyles.textStyle,
    headerTintColor: '#fff'
  });

  componentWillMount() {
    this.userData = this.props.navigation.getParam('user');

    this.getSocieties(this.props.navigation.getParam('category').id);
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#F18B35' }}>
        <SocietiesList societies={this.state != null ? this.state.societies : []} navigation={this.props.navigation} user={this.userData} />
      </View>
    );
  }

  getSocieties(categoryId) {
    sendRequest({
      address: "hosts/?ordering=name&host_category=" + categoryId,
      method: "GET",
      authorizationToken: this.userData.token,
      successHandler: (result) => this.setState({societies: result.results})
    })
  }
}

export default SocietiesScreen;
