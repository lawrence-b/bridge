import React, { Component } from 'react';
import { Text, View, ScrollView } from 'react-native';
import { Header } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';

import SocietyInfo from './SocietyInfo';
import SocietyInterestedBar from './SocietyInterestedBar';
import EventTile from './EventTile';
import HeaderStyles from './HeaderWrapper';

import sendRequest from '../sendRequest';

class SocietyDetailsScreen extends Component {
  static navigationOptions = {
    headerStyle: {...HeaderStyles.viewStyle, shadowOpacity: 0},
    headerTintColor: '#fff'
  };

  componentWillMount() {
    this.setState({host: this.props.navigation.getParam('society')});
  }

  renderTiles() {
    return this.state.host.events_hosting_in_future.map(event =>
      <EventTile
        key={event.id}
        event={{...event, hosts: [this.state.host]}}
        size={150}
        margin={15}
        onPress={() => this.props.navigation.navigate('SelectedEvent', {event: {...event, hosts: [this.state.host]}, user: this.props.navigation.getParam('user')})} />
    );
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#F18B35' }}>
        <ScrollView>
          <SocietyInfo
            host={this.state.host} />

          <View style={styles.textViewStyle}>
            <Text style={styles.textStyle}>Upcoming events: </Text>
          </View>

          <ScrollView contentContainerStyle={styles.eventsViewStyle} horizontal={true}>
            {this.renderTiles()}
          </ScrollView>
        </ScrollView>

        <SocietyInterestedBar onPress={() => this.toggleSignUp()} isInterested={this.state.host.subscribed_to_check} />
      </View>
    );
  }

  toggleSignUp() {
    var shouldUnsubscribe = this.state.host.subscribed_to_check;

    sendRequest({
      address: 'users/me/',
      method: 'GET',
      authorizationToken: this.props.navigation.getParam('user').token,
      successHandler: (result) => {
        var subscribedToIds = result.subscribed_to.map(host => host.id);

        if (shouldUnsubscribe) {
          var index = subscribedToIds.indexOf(this.state.host.id);

          if (index > -1) {
            subscribedToIds.splice(index, 1);
          }
          else {
            console.log("Index not found when removing admin");
            return;
          }
        }
        else {
          subscribedToIds.push(this.state.host.id);
        }

        sendRequest({
          address: 'users/me/',
          method: 'PATCH',
          authorizationToken: this.props.navigation.getParam('user').token,
          body: {subscribed_to_id: subscribedToIds},
          successHandler: (result) => {
            this.state.host.subscribed_to_check = !this.state.host.subscribed_to_check;
            this.setState(this.state);
          }
        });
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

export default SocietyDetailsScreen;
