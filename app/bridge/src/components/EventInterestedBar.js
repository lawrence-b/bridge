import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';


const EventInterestedBar = (props) => {
  var bgCol = props.isInterested ? '#888': '#ff5555';

  return (
    <View style={styles.viewStyle} >
      <TouchableOpacity style={[styles.buttonStyle, { backgroundColor: bgCol }]} onPress={props.onPress} >
        <Text style={styles.textStyle}>{props.isInterested ? "Not interested" : "Interested"}</Text>
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

export default EventInterestedBar;
