import React from 'react';
import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/EvilIcons';

import sendRequest from '../sendRequest'

class CategoriesTray extends React.Component {

  constructor(props) {
    super(props);
    this.state = {categories: [], selectedIndex: 0};
    this.colors = ['#2faef7', '#ff51c5', '#9a72ff', '#ff5c59', '#588efb'];
  }

  componentWillMount() {
    if (this.props.categories !== null && this.props.categories !== undefined) {
      var categories = this.props.categories.slice(0);
      var name = (this.props.parentCategoryName !== null && this.props.parentCategoryName !== undefined
                  ? 'All ' + this.props.parentCategoryName
                  : 'All');
      categories.unshift({id: 0, name: name});
      this.setState({categories: categories, selectedIndex: 0});
    }
    else {
      sendRequest({
        address: 'event-categories/',
        method: 'GET',
        authorizationToken: this.props.user.token,
        successHandler: (result) => {
          var categories = result;
          categories.unshift({id: 0, name: 'All'});
          this.setState({categories: categories});
        }
      });
    }
  }

  regenerateCategories() {
    var categories = this.props.categories.slice(0);
    var name = (this.props.parentCategoryName !== null && this.props.parentCategoryName !== undefined
                ? 'All ' + this.props.parentCategoryName
                : 'All');
    categories.unshift({id: 0, name: name});
    this.state.categories = categories;
  }

  generateCategoryTiles() {
    if (this.props.parentCategoryName !== null && this.props.parentCategoryName !== undefined) {
      this.regenerateCategories();
    }

    return (
      this.state.categories.map((category, index) => (
        <TouchableOpacity key={index} style={{...styles.categoryTileStyle,
                                                 marginRight: (index === this.state.categories.length-1 ? 16 : 0),
                                                 backgroundColor: (index !== this.state.selectedIndex
                                                                ? this.colors[index % this.colors.length]
                                                                : '#fff')}} onPress={() => this.onCategorySelected(category, index)}>
          <Text style={index !== this.state.selectedIndex
                     ? styles.textStyle
                     : {...styles.textStyle, color: '#F18B35'}}>
            {category.name}
          </Text>
        </TouchableOpacity>
      ))
    );
  }

  render() {
    if (this.props.currentCategory !== null && this.props.currentCategory !== undefined) {
      for (var i = 0; i < this.state.categories.length; ++i) {
        if (this.props.currentCategory.id === this.state.categories[i].id) {
          this.state.selectedIndex = i;
          break;
        }
      }
    }

    return (
      <View style={{height: 35, marginTop: 6, marginBottom: 6, alignSelf: 'stretch'}}>
        <ScrollView contentContainerStyle={styles.scrollViewStyle} horizontal={true} showsHorizontalScrollIndicator={false}>
          {this.generateCategoryTiles()}
        </ScrollView>
      </View>
    );
  }

  onCategorySelected(category, index) {
    this.props.onCategorySelected(category);
    this.setState({...this.state, selectedIndex: index});
  }

}

const styles = {
  scrollViewStyle: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  categoryTileStyle: {
    marginLeft: 16,
    borderRadius: 30,
    backgroundColor: '#55d',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 3,
    paddingBottom: 3,

    shadowOffset: {width: 0, height: 2},
    shadowColor: '#000',
    shadowOpacity: 0.2
  },
  textStyle: {
    fontSize: 16,
    color: "#FFFFFF"
  }
}

export default CategoriesTray;
