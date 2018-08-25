import React, { Component } from 'react';
import { Text, View, ScrollView, ListView, Dimensions } from 'react-native';

import EventTile from './EventTile';

class EventsList extends Component {

  renderTiles() {
    var { size, margin } = getTileDims(Dimensions.get('window').width, 2);

    return this.props.events.map((event, index) =>
      <EventTile
        key={index}
        event={event}
        size={size}
        margin={margin}
        onPress={() => this.props.navigation.navigate('SelectedEvent', {event: event})} />
    );
  }

  render() {
    return (
      <ScrollView contentContainerStyle={styles.viewStyle}>
        {this.renderTiles()}
      </ScrollView>
    );
  }
};

const getTileDims = (deviceWidth, tpr) => {
  const margin = deviceWidth / (tpr * 10);
  const size = (deviceWidth - margin * (tpr * 2)) / tpr;
  return { size, margin };
};

const styles = {
  viewStyle: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap'
  }
};

export default EventsList;
