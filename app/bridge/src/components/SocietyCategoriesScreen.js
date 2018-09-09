import React from 'react';
import { Text, View } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/EvilIcons';

import HeaderWrapper from './HeaderWrapper'
import SocietiesList from './SocietiesList'
import SocietiesScreen from './SocietiesScreen'
import SocietyDetailsScreen from './SocietyDetailsScreen'
import EventDetailsScreen from './EventDetailsScreen'
import HeaderStyles from './HeaderWrapper'
import SocietyCategoriesList from './SocietyCategoriesList'

import sendRequest from '../sendRequest'

class SocietyCategoriesScreen extends React.Component {
  static navigationOptions = {
    headerTitle: 'Societies',
    headerStyle: HeaderStyles.viewStyle,
    headerTitleStyle: HeaderStyles.textStyle,
    headerTintColor: '#fff'
  }

  constructor(props) {
    super(props);

    this.state = {categories: []};
  }

  componentWillMount() {
    this.userData = this.props.screenProps.userData;

    this.getSocietyCategories();
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#F18B35' }}>
        {this.state.categories.length <= 0
         ? <Text style={{fontSize: 18, color: '#fff', alignSelf: 'center', marginTop: 30}}>
             Loading categories...
           </Text>
         : <SocietyCategoriesList
           categories={this.state.categories}
           onCategorySelected={(category) => this.onCategorySelected(category)} />}
      </View>
    );
  }

  getSocietyCategories() {
    sendRequest({
      address: "host-categories/",
      method: "GET",
      authorizationToken: this.userData.token,
      successHandler: (result) => this.setState({categories: result[1].children})
    })
  }

  onCategorySelected(category) {
    this.props.navigation.navigate('Societies', {category: category, user: this.userData});
  }
}

const SocietiesScreenWrapper = createStackNavigator(
  {
    SocietyCategories: SocietyCategoriesScreen,
    Societies: SocietiesScreen,
    SelectedSociety: SocietyDetailsScreen,
    SelectedEvent: EventDetailsScreen
  },
  {
    initialRouteName: 'SocietyCategories'
  }
);

export default SocietiesScreenWrapper;
