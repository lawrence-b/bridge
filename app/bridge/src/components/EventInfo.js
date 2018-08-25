import React from 'react';
import { Text, View } from 'react-native';
import { Header } from 'react-native-elements';
import Icon from 'react-native-vector-icons/EvilIcons';


const EventInfo = (props) => {
  return (
    <View style={styles.viewStyle}>
      <View style={styles.textViewStyle}>
        <Text style={{fontSize: 22}}>{props.title}</Text>
      </View>

      <View style={styles.textViewStyle}>
        <Text style={{fontSize: 14, fontWeight: 'bold'}}>Host: </Text>
        <Text style={{fontSize: 14}}>{props.host.name}</Text>
      </View>

      <View style={styles.textViewStyle}>
        <Icon name='clock' size={22} color='#000' style={{ marginTop: 2, marginLeft: -2 }} />
        <Text style={{fontSize: 14, marginLeft: 6}}>{formatTime(props.start_time)}</Text>
      </View>

      <View style={styles.textViewStyle}>
        <Icon name='location' size={22} color='#000' style={{ marginTop: 3, marginLeft: -2 }} />
        <Text style={{fontSize: 14, marginLeft: 6}}>{props.location}</Text>
      </View>

      <View style={{...styles.textViewStyle, flexDirection: 'column', alignItems: 'flex-start', borderBottomWidth: 0}}>
        <Text style={{fontSize: 18, marginBottom: 10}}>Description</Text>
        <Text style={{fontSize: 15, color: '#444'}}>{props.description}</Text>
      </View>
    </View>
  );
}

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

export default EventInfo;
