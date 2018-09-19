import React from 'react';
import { Text, View, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/EvilIcons';

const EventTile = (props) => {

  return (
    <TouchableOpacity style={[styles.viewStyle, {width: props.size, height: props.size, marginHorizontal: props.margin}]}
          onPress={props.onPress} >
      {props.event.image === undefined || props.event.image === null
      ? null
      : <Image
          style={{flex: 1, width: props.size-20, borderRadius: 6}}
          source={{uri: props.event.image}}
        />}

      <Text style={styles.titleTextStyle} numberOfLines={1}>{props.event.title}</Text>

      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 3 }}>
        <Icon name='user' size={22} color='#000' style={{ marginLeft: -3, marginRight: 5, marginTop: 2 }} />
        <Text style={styles.timeTextStyle} numberOfLines={1}>{props.event.hosts[0].name}</Text>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Icon name='clock' size={22} color='#000' style={{ marginLeft: -3, marginRight: 5, marginTop: 2 }} />
        <Text style={styles.timeTextStyle} numberOfLines={1}>{formatTime(props.event.start_time)}</Text>
      </View>
    </TouchableOpacity>
  );
};

const formatTime = (timeString) => {
  var time = new Date(timeString);

  var paddingZero1 = time.getHours()   < 10 ? "0" : "";
  var paddingZero2 = time.getMinutes() < 10 ? "0" : "";
  var paddingZero3 = time.getDate() < 10 ? "0" : "";

  var monthStrings = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  var month = monthStrings[time.getMonth()];

  return paddingZero3 + time.getDate() + " " + month + ", "
    + paddingZero1 + time.getHours() + ":" + paddingZero2 + time.getMinutes();
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
    marginTop: 6,
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
