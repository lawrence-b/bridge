import React, { Component } from 'react';
import { Text, View, ScrollView } from 'react-native';
import { Header } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';

import SocietyInfo from './SocietyInfo';
import SocietyInterestedBar from './SocietyInterestedBar';
import EventTile from './EventTile';
import HeaderStyles from './HeaderWrapper';

class SocietyDetailsScreen extends Component {
  static navigationOptions = {
    headerRight: (
      <Icon name='share' size={26} color='#fff' style={{marginRight: 14}} />
    ),
    headerStyle: {...HeaderStyles.viewStyle, shadowOpacity: 0},
    headerTintColor: '#fff'
  };

  renderTiles() {
    var society = this.props.navigation.getParam('society', {});
    if (society === null) return;

    return society.events_hosting_in_future.map(event =>
      <EventTile
        key={event.id}
        event={event}
        size={150}
        margin={15}
        onPress={() => this.props.navigation.navigate('SelectedEvent', {event: {...event, hosts: [society]}, user: this.props.navigation.getParam('user')})} />
    );
  }

  render() {
    var society = this.props.navigation.getParam('society', {});
    console.log(society);

    return (
      <View style={{ flex: 1, backgroundColor: '#F18B35' }}>
        <ScrollView>
          <SocietyInfo
            host={society} />

          <View style={styles.textViewStyle}>
            <Text style={styles.textStyle}>Upcoming events: </Text>
          </View>

          <ScrollView contentContainerStyle={styles.eventsViewStyle} horizontal={true}>
            {this.renderTiles()}
          </ScrollView>
        </ScrollView>
        <SocietyInterestedBar onPress={() => this.toggleSignUp()} isInterested={society.subscribed_to_check} />
      </View>
    );
  }

  toggleSignUp() {

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
