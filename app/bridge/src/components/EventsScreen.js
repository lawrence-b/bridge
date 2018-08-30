import React from 'react';
import { Text, View } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/EvilIcons';

import HeaderWrapper from './HeaderWrapper'
import DatePicker from './DatePicker'
import EventsList from './EventsList'
import EventDetailsScreen from './EventDetailsScreen'
import HeaderStyles from './HeaderWrapper'
import CategoriesTray from './CategoriesTray'

import sendRequest from '../sendRequest'

class EventsScreen extends React.Component {
  static navigationOptions = {
    headerTitle: 'Events',
    headerRight: (
      <Icon name='search' size={26} color='#fff' style={{marginRight: 14}} />
    ),
    headerStyle: HeaderStyles.viewStyle,
    headerTitleStyle: HeaderStyles.textStyle
  }

  constructor(props) {
    super(props);

    this.state = {events: [], currentSecondaryBar: null};
    this.currentCategory = null;
    this.userData = this.props.screenProps.userData;
  }

  componentWillMount() {
    this.showDatePicker();
    this.getEventsForDate(new Date());
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#F18B35' }}>
        <CategoriesTray categoryType='event' user={this.userData} onCategorySelected={(category) => this.onCategorySelected(category)} />
        {this.state.currentSecondaryBar}
        <EventsList events={this.state.events} navigation={this.props.navigation} user={this.userData} />
      </View>
    );
  }

  showDatePicker() {
    this.setState({...this.state,
      currentSecondaryBar: <DatePicker dateUpdated={(newDate) => this.getEventsForDate(newDate)} />
    });
  }

  showSubCategoryBar(category) {
    this.setState({...this.state,
      currentSecondaryBar: <CategoriesTray categories={category.children} parentCategoryName={category.name} user={this.userData} onCategorySelected={(subcategory) => this.onSubCategorySelected(subcategory)} />
    });
  }

  onCategorySelected(category) {
    if (category.id === 0) {
      this.currentCategory = null;
      this.showDatePicker();
      this.getEventsForDate(new Date());
    }
    else {
      this.currentCategory = category;
      this.showSubCategoryBar(category);
      this.getEventsForCategory(category);
    }
  }

  onSubCategorySelected(subcategory) {
    if (subcategory.id === 0) {
      this.getEventsForCategory(this.currentCategory);
    }
    else {
      this.getEventsForCategory(subcategory);
    }
  }

  getEventsForCategory(category) {
    sendRequest({
      address: 'events/\?event_category=' + category.id
             + '&show_past=false',
      method: "GET",
      authorizationToken: this.userData.token,
      successHandler: (result) => {
        if (result.results !== null && result.results !== undefined) {
          this.setState({events: result.results});
        }
      }
    });
  }

  getEventsForDate(date) {

    var day   = date.getDate();
    var month = date.getMonth()+1;
    var year  = date.getFullYear();

    var url = 'events/\?'
                + '&year='  + encodeURIComponent(year)
                + '&month=' + encodeURIComponent(month)
                + '&day='   + encodeURIComponent(day)
                + '&show_past=true';

    sendRequest({
      address: url,
      method: "GET",
      authorizationToken: this.userData.token,
      successHandler: (result) => {
        if (result.results !== null && result.results !== undefined) {
          this.setState({events: result.results});
        }
      }
    });
  }

}

const EventsScreenWrapper = createStackNavigator(
  {
    Events: EventsScreen,
    SelectedEvent: EventDetailsScreen
  },
  {
    initialRouteName: 'Events'
  }
);

export default EventsScreenWrapper;
