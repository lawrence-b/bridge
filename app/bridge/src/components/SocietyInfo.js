import React from 'react';
import { Text, View, Image } from 'react-native';
import { Header } from 'react-native-elements';
import Icon from 'react-native-vector-icons/EvilIcons';


const SocietyInfo = (props) => {
  return (
    <View style={styles.viewStyle}>
      {props.host.image === undefined || props.host.image === null
      ? null
      : <Image
          style={{flex: 1, height: 200, borderRadius: 6}}
          source={{uri: props.host.image}}
        />}

      <View style={styles.textViewStyle}>
        <Text style={{fontSize: 22, fontWeight: 'bold', marginTop: 8}}>{props.host.name}</Text>
      </View>

      <View style={styles.textViewStyle}>
        <Text style={{fontSize: 14, fontWeight: 'bold'}}>Category: </Text>
        <Text style={{fontSize: 14}}>{props.host.category.name + (props.host.category.parent !== null ? ", " + props.host.category.parent.name : "")}</Text>
      </View>

      <View style={styles.textViewStyle}>
        <Text style={{fontSize: 14, fontWeight: 'bold'}}>Open to: </Text>
        <Text style={{fontSize: 14}}>{props.host.open_to.name}</Text>
      </View>

      <View style={{...styles.textViewStyle, flexDirection: 'column', alignItems: 'flex-start', borderBottomWidth: 0}}>
        <Text style={{fontSize: 18, marginBottom: 10}}>Description</Text>
        <Text style={{fontSize: 15, color: '#444'}}>{props.host.description}</Text>
      </View>
    </View>
  );
}

/*
const getCategoriesString = (category) => {
  if (category.parent !== null) {
    return category.name + (category.parent.parent === null ? "" : ", ") + getCategoriesString(category.parent);
  }

  return "";
}
*/

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
