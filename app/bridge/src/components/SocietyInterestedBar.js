import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';


const SocietyInterestedBar = (props) => {
  var bgCol = props.isInterested ? '#ff5555': '#5555ff';

  return (
    <View style={styles.viewStyle} >
      <TouchableOpacity style={[styles.buttonStyle, { backgroundColor: bgCol }]} onPress={props.onPress} >
        <Text style={styles.textStyle}>{props.isInterested ? "Unfollow" : "Follow"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = {
  viewStyle: {
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8
  },
  buttonStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    padding: 12,
    borderRadius: 6
  },
  textStyle: {
    fontSize: 20,
    color: '#fff'
  }
};

export default SocietyInterestedBar;
