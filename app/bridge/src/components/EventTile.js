import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/EvilIcons';

const EventTile = (props) => {

  return (
    <TouchableOpacity style={[styles.viewStyle, {width: props.size, height: props.size, marginHorizontal: props.margin}]}
          onPress={props.onPress} >
      <Text style={styles.titleTextStyle}>{props.event.title}</Text>

      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
        <Icon name='clock' size={22} color='#000' style={{ marginLeft: -3, marginRight: 5, marginTop: 2 }} />
        <Text style={styles.timeTextStyle}>{formatTime(props.event.start_time)}</Text>
      </View>
    </TouchableOpacity>
  );
};

const formatTime = (timeString) => {
  var time = new Date(timeString);

  var paddingZero1 = time.getHours()   < 10 ? "0" : "";
  var paddingZero2 = time.getMinutes() < 10 ? "0" : "";
  var paddingZero3 = time.getDate() < 10 ? "0" : "";
  var paddingZero4 = (time.getMonth()+1) < 10 ? "0" : "";

  return paddingZero1 + time.getHours() + ":" + paddingZero2 + time.getMinutes()
    + " " + paddingZero3 + time.getDate() + "/" + paddingZero4 + (time.getMonth()+1) + "/" + time.getFullYear();
}

const styles = {
  viewStyle: {
    backgroundColor: '#FFFFFF',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    alignSelf: 'flex-start',
    marginBottom: 20,
    elevation: 2,

    padding: 10,

    borderRadius: 6,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  titleTextStyle: {
    marginTop: 20,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000'
  },
  timeTextStyle: {
    fontSize: 12,
    color: '#000000'
  }
};

export default EventTile;
