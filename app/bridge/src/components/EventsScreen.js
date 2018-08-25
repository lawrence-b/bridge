import React from 'react';
import { Text, View } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/EvilIcons';

import HeaderWrapper from './HeaderWrapper'
import DatePicker from './DatePicker'
import EventsList from './EventsList'
import EventDetailsScreen from './EventDetailsScreen'
import HeaderStyles from './HeaderWrapper'

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
    this.date = new Date();
  }

  componentWillMount() {
    this.userData = this.props.screenProps.userData;

    this.getEvents();
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#F18B35' }}>
        <DatePicker delegate={this} />
        <EventsList events={this.state != null ? this.state.events : []} navigation={this.props.navigation} />
      </View>
    );
  }

  getEvents() {

    var day   = this.date.getDate();
    var month = this.date.getMonth()+1;
    var year  = this.date.getFullYear();

    var url = 'events/\?'
                + '&year='  + encodeURIComponent(year)
                + '&month=' + encodeURIComponent(month)
                + '&day='   + encodeURIComponent(day);

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

  dateUpdated(newDate) {
    this.date = newDate;
    this.getEvents();
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
