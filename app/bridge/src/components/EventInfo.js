import React from 'react';
import { Text, View, Image } from 'react-native';
import { Header } from 'react-native-elements';
import Icon from 'react-native-vector-icons/EvilIcons';


const EventInfo = (props) => {
  return (
    <View style={styles.viewStyle}>
      {props.event.image === undefined
      ? null
      : <Image
          style={{flex: 1, height: 200, borderRadius: 6}}
          source={{uri: props.event.image.full_size}}
        />}

      <View style={styles.textViewStyle}>
        <Text style={{fontSize: 22, fontWeight: 'bold', marginTop: 8}}>{props.event.title}</Text>
      </View>

      <View style={styles.textViewStyle}>
        <Text style={{fontSize: 14, fontWeight: 'bold'}}>Host: </Text>
        <Text style={{fontSize: 14}}>{props.event.hosts[0].name}</Text>
      </View>

      <View style={styles.textViewStyle}>
        <Text style={{fontSize: 14, fontWeight: 'bold'}}>Category: </Text>
        <Text style={{fontSize: 14}}>{props.event.category.name}</Text>
      </View>

      <View style={styles.textViewStyle}>
        <Text style={{fontSize: 14, fontWeight: 'bold'}}>Open to: </Text>
        <Text style={{fontSize: 14}}>{props.event.open_to.name}</Text>
      </View>

      <View style={styles.textViewStyle}>
        <Icon name='clock' size={22} color='#000' style={{ marginTop: 2, marginLeft: -2 }} />
        <Text style={{fontSize: 14, marginLeft: 6}}>{formatTime(props.event.start_time)}</Text>
      </View>

      <View style={styles.textViewStyle}>
        <Icon name='clock' size={22} color='#000' style={{ marginTop: 2, marginLeft: -2 }} />
        <Text style={{fontSize: 14, marginLeft: 6}}>{formatDuration(props.event.duration)}</Text>
      </View>

      <View style={styles.textViewStyle}>
        <Icon name='location' size={22} color='#000' style={{ marginTop: 3, marginLeft: -2 }} />
        <Text style={{fontSize: 14, marginLeft: 6}}>{props.event.location}</Text>
      </View>

      <View style={{...styles.textViewStyle, flexDirection: 'column', alignItems: 'flex-start', borderBottomWidth: 0}}>
        <Text style={{fontSize: 18, marginBottom: 10}}>Description</Text>
        <Text style={{fontSize: 15, color: '#444'}}>{props.event.description}</Text>
      </View>
    </View>
  );
}

const formatTime = (timeString) => {
  var time = new Date(timeString);

  var paddingZero1 = time.getHours()     < 10 ? "0" : "";
  var paddingZero2 = time.getMinutes()   < 10 ? "0" : "";
  var paddingZero3 = time.getDate()      < 10 ? "0" : "";
  var paddingZero4 = (time.getMonth()+1) < 10 ? "0" : "";

  return paddingZero1 + time.getHours() + ":" + paddingZero2 + time.getMinutes()
    + " " + paddingZero3 + time.getDate() + "/" + paddingZero4 + (time.getMonth()+1) + "/" + time.getFullYear();
}

const formatDuration = (timeString) => {
  var hours   = timeString[0] === '0' ? timeString[1] : timeString.substring(0,2);
  var minutes = timeString[3] === '0' ? timeString[4] : timeString.substring(3,5);

  return hours + "hr " + minutes + "min";
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
