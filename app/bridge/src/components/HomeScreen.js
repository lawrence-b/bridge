import React from 'react';
import { Text, View, ScrollView } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/EvilIcons';

import HeaderWrapper from './HeaderWrapper'
import EventDetailsScreen from './EventDetailsScreen'
import HeaderStyles from './HeaderWrapper'
import EventTile from './EventTile'

import sendRequest from '../sendRequest'

class HomeScreen extends React.Component {
  static navigationOptions = {
    headerTitle: 'Home',
    headerStyle: HeaderStyles.viewStyle,
    headerTitleStyle: HeaderStyles.textStyle
  }

  constructor(props) {
    super(props);

    this.state = {featuredEvents: [], happeningTodayEvents: [], interestedInEvents: []};
  }

  componentWillMount() {
    this.userData = this.props.screenProps.userData;

    this.props.navigation.addListener('willFocus', () => this.getEvents());
  }

  renderTiles(events) {
    if (events.length <= 0) {
      return <Text style={{...styles.textStyle, marginLeft: 14, fontSize: 16, marginBottom: 15}}>Nothing to display</Text>
    }
    else {
      return events.map(event =>
        <EventTile
          key={event.id}
          event={event}
          size={150}
          margin={15}
          onPress={() => this.props.navigation.navigate('SelectedEvent', {event: event, user: this.userData})} />
      );
    }
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#F18B35' }}>
        <ScrollView>
          <View style={styles.textViewStyle}>
            <Text style={styles.textStyle}>Featured: </Text>
          </View>

          <ScrollView contentContainerStyle={styles.eventsViewStyle} horizontal={true}>
            {this.renderTiles(this.state.featuredEvents)}
          </ScrollView>

          <View style={styles.textViewStyle}>
            <Text style={styles.textStyle}>{"Events you're interested in: "}</Text>
          </View>

          <ScrollView contentContainerStyle={styles.eventsViewStyle} horizontal={true}>
            {this.renderTiles(this.state.interestedInEvents)}
          </ScrollView>

          <View style={styles.textViewStyle}>
            <Text style={styles.textStyle}>Happening today: </Text>
          </View>

          <ScrollView contentContainerStyle={styles.eventsViewStyle} horizontal={true}>
            {this.renderTiles(this.state.happeningTodayEvents)}
          </ScrollView>

        </ScrollView>
      </View>
    );
  }

  getEvents() {
    sendRequest({
      address: "events/?ordering=start_time&show_past=false&featured=true",
      method: "GET",
      authorizationToken: this.userData.token,
      successHandler: (result) => this.setState({...this.state, featuredEvents: result.results})
    });

    sendRequest({
      address: "events/?ordering=start_time&show_past=false&interested_in=true",
      method: "GET",
      authorizationToken: this.userData.token,
      successHandler: (result) => this.setState({...this.state, interestedInEvents: result.results})
    });

    var date = new Date();

    var day   = date.getDate();
    var month = date.getMonth()+1;
    var year  = date.getFullYear();

    var happeningTodayUrl = 'events/\?ordering=start_time'
                + '&year='  + encodeURIComponent(year)
                + '&month=' + encodeURIComponent(month)
                + '&day='   + encodeURIComponent(day)
                + '&show_past=true';

    sendRequest({
      address: happeningTodayUrl,
      method: "GET",
      authorizationToken: this.userData.token,
      successHandler: (result) => this.setState({...this.state, happeningTodayEvents: result.results})
    });
  }

}

const styles = {
  textViewStyle: {
    marginLeft: 14,
    marginTop: 15,
    marginBottom: 20,

    paddingBottom: 10,

    borderBottomWidth: 1,
    borderColor: '#fff'
  },
  textStyle: {
    fontSize: 22,
    color: "#FFFFFF",
    fontFamily: 'arial'
  },
  eventsViewStyle: {
    flexDirection: 'row'
  }
};

const HomeScreenWrapper = createStackNavigator(
  {
    Home: HomeScreen,
    SelectedEvent: EventDetailsScreen
  },
  {
    initialRouteName: 'Home'
  }
);

export default HomeScreenWrapper;
