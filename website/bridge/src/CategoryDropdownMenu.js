import React, { Component } from 'react';
import Ionicon from 'react-ionicons';
import './CategoryDropdownMenu.css';

import sendRequest from './sendRequest.js';

class CategoryDropdownMenu extends Component {

  constructor(props) {
    super(props);

    this.currentCategoryIndex = 0;

    this.state = {categories: []};

    sendRequest({
      address: this.props.categoryTypeString + "/",
      method: "GET",
      authorizationToken: this.props.user !== null && this.props.user !== undefined ? this.props.user.token : null,
      successHandler: (result) => {
        this.setState({categories: result});
        this.matchCategoryIndex();
        if (this.props.initialCategory === null) {
          this.props.onCategoryChanged(result[this.currentCategoryIndex]);
        }
        this.setState({categories: result});
      }
    });
  }

  render() {
    this.matchCategoryIndex();

    return (this.state.categories.length <= 0
       ? null
       : <div className="CategoryDropdownMenu-select-div" style={this.props.bonusDivStyle !== null && this.props.bonusDivStyle !== undefined ? this.props.bonusDivStyle : null}>
           <select className="CategoryDropdownMenu-select-tag" style={this.props.bonusSelectTagStyle !== null && this.props.bonusSelectTagStyle !== undefined ? this.props.bonusSelectTagStyle : null}
            ref={(select) => {if (select !== null) {select.selectedIndex = this.currentCategoryIndex;}}} onChange={(e) => this.categoryChanged(e)}>
             {this.generateCategoryOptions()}
           </select>
           <Ionicon icon="md-arrow-dropdown" fontSize="22px" color="#aaa" style={{marginRight: 5}} />
         </div>
    );
  }

  matchCategoryIndex() {
    if (this.props.initialCategory === null || this.props.initialCategory === undefined) {
      return;
    }

    var index = 0;

    for (var i = 0; i < this.state.categories.length; ++i) {
      var category = this.state.categories[i];

      if (this.props.initialCategory.id === category.id) {
        this.currentCategoryIndex = index;
        return;
      }
      else {
        ++index;

        for (var j = 0; j < category.children.length; ++j) {
          var subCategory = category.children[j];

          if (this.props.initialCategory.id === subCategory.id) {
            this.currentCategoryIndex = index;
            return;
          }
          else {
            ++index;

            for (var k = 0; k < subCategory.children.length; ++k) {
              var subSubCategory = subCategory.children[k];

              if (this.props.initialCategory.id === subSubCategory.id) {
                this.currentCategoryIndex = index;
                return;
              }
              ++index;
            }
          }
        }
      }
    }

    return;
  }

  flattenCategories() {
    var categories = [];

    this.state.categories.forEach((category) => {
      categories.push(category);
      category.children.forEach((subCategory) => {
        categories.push(subCategory);
        subCategory.children.forEach((subSubCategory) => {
          categories.push(subSubCategory);
        });
      });
    });

    return categories;
  }

  generateCategoryOptions() {
    var options = [];
    var index = 0;

    for (var i = 0; i < this.state.categories.length; ++i) {
      var category = this.state.categories[i];

      options.push(<option key={index} value={index}>{category.name}</option>);
      index++;

      for (var j = 0; j < category.children.length; ++j) {
        var subCategory = category.children[j];

        options.push(<option key={index} value={index}>&nbsp;&nbsp;{subCategory.name}</option>);
        index++;

        for (var k = 0; k < subCategory.children.length; ++k) {
          var subSubCategory = subCategory.children[k];

          options.push(<option key={index} value={index}>&nbsp;&nbsp;&nbsp;&nbsp;{subSubCategory.name}</option>);
          index++;
        }
      }
    }

    return options;
  }

  categoryChanged(e) {
    this.currentCategoryIndex = e.target.value;
    var currentCategory = this.flattenCategories()[this.currentCategoryIndex];

    this.props.onCategoryChanged(currentCategory);
  }

}

export default CategoryDropdownMenu;
