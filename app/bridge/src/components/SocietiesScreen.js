import React from 'react';
import { Text, View } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/EvilIcons';

import HeaderWrapper from './HeaderWrapper'
import SocietiesList from './SocietiesList'
import SocietyDetailsScreen from './SocietyDetailsScreen'
import EventDetailsScreen from './EventDetailsScreen'
import HeaderStyles from './HeaderWrapper'
import CategoriesTray from './CategoriesTray'

import sendRequest from '../sendRequest'

class SocietiesScreen extends React.Component {
  static navigationOptions = {
    headerTitle: 'Societies',
    headerRight: (
      <Icon name='search' size={26} color='#fff' style={{marginRight: 14}} />
    ),
    headerStyle: HeaderStyles.viewStyle,
    headerTitleStyle: HeaderStyles.textStyle
  }

  componentWillMount() {
    this.userData = this.props.screenProps.userData;

    this.getSocieties(studentSocietyCategoryId);
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#F18B35' }}>
        <CategoriesTray categoryType='host' user={this.userData} onCategorySelected={(id) => this.onCategorySelected(id)} />
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

  onCategorySelected(id) {
    if (id === 0) {
      this.getSocieties(studentSocietyCategoryId);
    }
    else {
      this.getSocieties(id);
    }
  }
}

const studentSocietyCategoryId = 1;

const SocietiesScreenWrapper = createStackNavigator(
  {
    Societies: SocietiesScreen,
    SelectedSociety: SocietyDetailsScreen,
    SelectedEvent: EventDetailsScreen
  },
  {
    initialRouteName: 'Societies'
  }
);

export default SocietiesScreenWrapper;
