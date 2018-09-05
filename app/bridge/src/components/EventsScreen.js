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
    headerStyle: HeaderStyles.viewStyle,
    headerTitleStyle: HeaderStyles.textStyle
  }

  constructor(props) {
    super(props);

    this.state = {events: []};
    this.currentDate = new Date();
    this.currentCategory = null;
    this.currentSubCategory = null;
    this.userData = this.props.screenProps.userData;
  }

  componentWillMount() {
    this.getEventsForDate();

    this.props.navigation.addListener('willFocus', () => this.refreshEvents());
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#F18B35' }}>
        {this.currentDate === null ? null : <DatePicker currentDate={this.currentDate} dateUpdated={(newDate) => this.onDateUpdated(newDate)} />}
        <CategoriesTray user={this.userData} onCategorySelected={(category) => this.onCategorySelected(category)} />
        {this.currentCategory === null ? null : <CategoriesTray currentCategory={this.currentSubCategory} categories={this.currentCategory.children} parentCategoryName={this.currentCategory.name} onCategorySelected={(subcategory) => this.onSubCategorySelected(subcategory)} />}
        <EventsList events={this.state.events} navigation={this.props.navigation} />
      </View>
    );
  }

  refreshEvents() {
    if (this.currentCategory === null) {
      this.getEventsForDate();
    }
    else {
      if (this.currentSubCategory !== null) {
        this.getEventsForCategory(this.currentSubCategory);
      }
      else {
        this.getEventsForCategory(this.currentCategory);
      }
    }
  }

  onDateUpdated(newDate) {
    this.currentDate = newDate;
    this.currentCategory = null;
    this.currentSubCategory = null;
    this.setState(this.state);
    this.getEventsForDate();
  }

  onCategorySelected(category) {
    if (category.id === 0) {
      this.currentCategory = null;
      this.currentSubCategory = null;
      this.currentDate = new Date();
      this.setState(this.state);
      this.getEventsForDate();
    }
    else {
      this.currentCategory = category;
      this.currentSubCategory = null;
      this.currentDate = null;
      this.setState(this.state);
      this.getEventsForCategory(category);
    }
  }

  onSubCategorySelected(subcategory) {
    if (subcategory.id === 0) {
      this.currentSubCategory = null;
      this.setState(this.state);
      this.getEventsForCategory(this.currentCategory);
    }
    else {
      this.currentSubCategory = subcategory;
      this.setState(this.state);
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

  getEventsForDate() {
    var date = this.currentDate;

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
