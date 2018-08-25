import React from 'react';
import { Text, View } from 'react-native';
import { Header } from 'react-native-elements';
import Icon from 'react-native-vector-icons/EvilIcons';


const SocietyInfo = (props) => {
  return (
    <View style={styles.viewStyle}>
      <View style={styles.textViewStyle}>
        <Text style={{fontSize: 22, fontWeight: 'bold'}}>{props.name}</Text>
      </View>

      <View style={styles.textViewStyle}>
        <Text style={{fontSize: 14, fontWeight: 'bold'}}>Category: </Text>
        <Text style={{fontSize: 14}}>{props.category.parent === null ? props.category.name : getCategoriesString(props.category)}</Text>
      </View>

      <View style={{...styles.textViewStyle, flexDirection: 'column', alignItems: 'flex-start', borderBottomWidth: 0}}>
        <Text style={{fontSize: 18, marginBottom: 10}}>Description</Text>
        <Text style={{fontSize: 15, color: '#444'}}>{props.description}</Text>
      </View>
    </View>
  );
}

const getCategoriesString = (category) => {
  if (category.parent !== null) {
    return category.name + (category.parent.parent === null ? "" : ", ") + getCategoriesString(category.parent);
  }

  return "";
}

const styles = {
  viewStyle: {
    backgroundColor: '#fff',

    borderRadius: 6,

    margin: 10,
    padding: 15
  },
  textViewStyle: {
    borderColor: '#ddd',
    borderBottomWidth: 1,
    paddingTop: 12,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center'
  }
}

export default SocietyInfo;
