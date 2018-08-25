import React from 'react';
import { Text, View } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/EvilIcons';

import HeaderWrapper from './HeaderWrapper'
import DatePicker from './DatePicker'
import EventsList from './EventsList'
import EventDetailsScreen from './EventDetailsScreen'
import HeaderStyles from './HeaderWrapper'

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
    /*
    this.setState({ events: [
      {
        descriptionBrief: {
          title: "Emma June Event",
          time: "17 Jun, 21:00"
        },
        descriptionExtended: {
          title: 'Emmanuel College June Event',
          host: 'Emmanuel College',
          time: 'Sun 17th Jun, 21:00-03:00',
          location: 'Emmanuel College',
          description: 'Emma June Event presents "Twist and Shout!"'
        },
        interested: true
      },
      {
        descriptionBrief: {
          title: "Christ's May Ball",
          time: "19 Jun, 21:00"
        },
        descriptionExtended: {
          title: "Christ's College May Ball",
          host: "Christ's College",
          time: "Tue 19th Jun, 21:00-06:00",
          location: "Christ's College",
          description: "Come along to Christ's May Ball for a good time! We have great food, and Toploader will be performing..."
        },
        interested: false
      },
      {
        descriptionBrief: {
          title: "L2 M2 Games",
          time: "21 Jun, 11:00"
        },
        interested: false
      }
    ]});*/

    var day   = this.date.getDate();
    var month = this.date.getMonth()+1;
    var year  = this.date.getFullYear();

    day = 3;
    month = 10;

    var url = 'http://localhost:8000/events/\?'
                + '&year='  + encodeURIComponent(year)
                + '&month=' + encodeURIComponent(month)
                + '&day='   + encodeURIComponent(day);

    console.log(url);

    fetch(url, {
        method: "GET", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, cors, *same-origin
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": ("Token " + this.userData.token)
        }
    }).then(res => res.status === 400 ? null : res.json())
      .then(
        (result) => {
          console.log("Got result:");
          console.log(result);

          if (result === null || result === undefined) {
            // TODO: Tell user incorrect username/password
            console.log("Access denied");
            return;
          }

          if (result.results !== null && result.results !== undefined) {
            this.setState({events: result.results});
          }
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          console.log("Got error:");
          console.log(error);

          // TODO: Handle error
        }
    )
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
