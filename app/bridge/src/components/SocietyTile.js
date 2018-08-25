import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/EvilIcons';

const SocietyTile = (props) => {

  return (
    <TouchableOpacity style={styles.viewStyle} onPress={props.onPress} >
      <Text style={styles.nameTextStyle}>{props.society.name}</Text>
      <Text style={styles.typeTextStyle}>{props.society.type}</Text>
    </TouchableOpacity>
  );
};

const styles = {
  viewStyle: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 20,
    elevation: 2,

    padding: 10,

    borderRadius: 6,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  nameTextStyle: {
    margin: 5,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000'
  },
  typeTextStyle: {
    margin: 5,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000'
  }
};

export default SocietyTile;
