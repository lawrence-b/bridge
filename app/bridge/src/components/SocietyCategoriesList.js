import React, { Component } from 'react';
import { Text, View, ScrollView, ListView, Dimensions, TouchableOpacity, Image } from 'react-native';

class SocietyCategoriesList extends Component {

  renderTiles() {
    var { size, margin } = getTileDims(Dimensions.get('window').width, 3);

    return this.props.categories.map((category, index) =>
      <TouchableOpacity
            style={[styles.tileViewStyle, {width: size, height: size, marginHorizontal: margin}]}
            onPress={() => this.props.onCategorySelected(category)}
            key={index} >
        {category.thumbnail === undefined || category.thumbnail === null
        ? null
        : <Image
            style={{flex: 1, width: size-12, borderRadius: 6}}
            source={{uri: category.thumbnail}}
          />}

        <Text style={styles.nameTextStyle} numberOfLines={1}>{category.name}</Text>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <ScrollView contentContainerStyle={styles.scrollViewStyle}>
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
  scrollViewStyle: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap'
  },
  tileViewStyle: {
    backgroundColor: '#FFFFFF',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    alignSelf: 'flex-start',
    marginBottom: 20,
    elevation: 2,

    padding: 6,

    borderRadius: 6,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  nameTextStyle: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000000'
  },
  timeTextStyle: {
    fontSize: 12,
    color: '#000000'
  }
};

export default SocietyCategoriesList;
