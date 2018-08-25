import React, { Component } from 'react';
import { Text, View, ScrollView, ListView, Dimensions } from 'react-native';

import SocietyTile from './SocietyTile';

class SocietiesList extends Component {

  renderTiles() {
    return this.props.societies.map(society =>
      <SocietyTile
        key={society.name}
        society={society}
        onPress={() => this.props.navigation.navigate('SelectedSociety', {society: society, user: this.props.user})} />
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

const styles = {
  viewStyle: {
    flex: 1,
    marginTop: 20,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch'
  }
};

export default SocietiesList;
