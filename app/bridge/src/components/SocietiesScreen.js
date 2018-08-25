import React from 'react';
import { Text, View } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/EvilIcons';

import HeaderWrapper from './HeaderWrapper'
import SocietiesList from './SocietiesList'
import SocietyDetailsScreen from './SocietyDetailsScreen'
import EventDetailsScreen from './EventDetailsScreen'
import HeaderStyles from './HeaderWrapper'

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

    this.getSocieties();
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#F18B35' }}>
        <SocietiesList societies={this.state != null ? this.state.societies : []} navigation={this.props.navigation} user={this.userData} />
      </View>
    );
  }

  getSocieties() {
    /*
    this.setState({ societies: [
      {
        descriptionBrief: {
          name: "Emma AFC",
          type: "Sport"
        },
        descriptionExtended: {
          name: "Emmanuel College Association Football Club",
          type: "Sport",
          description: "This is the football society at Emma. We play matches against other Colleges, and train from time to time, depending on what team you're in."
        },
        followed: true
      },
      {
        descriptionBrief: {
          name: "Queens AFC",
          type: "Sport"
        },
        descriptionExtended: {
          name: "Queen's College Association Football Club",
          type: "Sport",
          description: "This is the football society at Queens. We play matches against other Colleges, and train from time to time, depending on what team you're in."
        },
        followed: false
      },
      {
        descriptionBrief: {
          name: "CUES",
          type: "Subject"
        },
        descriptionExtended: {
          name: "Cambridge University Engineering Society",
          type: "Subject",
          description: "This is the University-wide engineering society. We put on lots of events, from talks to hackathons."
        },
        followed: false
      }
    ]});*/

    fetch("http://localhost:8000/hosts/?host_category=1", {
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

          this.setState({societies: result.results});
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
}

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
