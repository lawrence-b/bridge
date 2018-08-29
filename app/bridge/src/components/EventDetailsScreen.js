import React, { Component } from 'react';
import { Text, View, ScrollView } from 'react-native';
import { Header } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';

import EventInfo from './EventInfo';
import EventInterestedBar from './EventInterestedBar';
import HeaderStyles from './HeaderWrapper';

import sendRequest from '../sendRequest';

class EventDetailsScreen extends Component {
  static navigationOptions = {
    headerRight: (
      <Icon name='share' size={26} color='#fff' style={{marginRight: 14}} />
    ),
    headerStyle: {...HeaderStyles.viewStyle, shadowOpacity: 0},
    headerTintColor: '#fff'
  };

  constructor(props) {
    super(props);
    this.refreshed = false;
  }

  componentWillMount() {
    this.setState({event: this.props.navigation.getParam('event')});
  }

  render() {
    var user = this.props.navigation.getParam('user');

    if (user !== null && user !== undefined && this.refreshed == false) {
      this.refreshEvent(user);
    }

    return (
      <View style={{ flex: 1, backgroundColor: '#F18B35' }}>
        <ScrollView>
          <EventInfo
            event={this.state.event} />
        </ScrollView>
        <EventInterestedBar onPress={() => this.toggleInterested()} isInterested={this.state.event.interested_in_check} />
      </View>
    );
  }

  refreshEvent(user) {
    sendRequest({
      address: "events/" + this.state.event.id + "/",
      method: "GET",
      authorizationToken: user.token,
      successHandler: (result) => {
        this.setState({event: result});
        this.refreshed = true;
      }
    });
  }

  toggleInterested() {
    var shouldUnsubscribe = this.state.event.interested_in_check;

    sendRequest({
      address: 'users/me/',
      method: 'PATCH',
      authorizationToken: this.props.navigation.getParam('user').token,
      body: (shouldUnsubscribe ? {remove_interested_in: [this.state.event.id]} : {add_interested_in: [this.state.event.id]}),
      responseHandlerNoJson: (response) => {
        this.state.event.interested_in_check = !this.state.event.interested_in_check;
        this.setState(this.state);
      }
    });
  }
}

const styles = {
  viewStyle: {
    backgroundColor: '#F18B35',
    paddingTop: 25,
    paddingBottom: 10,
    elevation: 2,
    position: 'relative',
    borderBottomWidth: 0
  },
  textStyle: {
    fontSize: 18,
    color: "#FFFFFF",
    fontFamily: 'arial'
  }
};

export default EventDetailsScreen;
