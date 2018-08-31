import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/EvilIcons';

class DatePicker extends React.Component {

  componentWillMount() {
    var newDate = new Date();
    this.setState({ date: newDate });
  }

  render() {
    return (
      <View style={styles.viewStyle}>

        {this.generateDateTile(-3)}
        {this.generateDateTile(-2)}
        {this.generateDateTile(-1)}
        {this.generateDateTile( 0)}
        {this.generateDateTile(+1)}
        {this.generateDateTile(+2)}
        {this.generateDateTile(+3)}

      </View>
    );
  }

  generateDateTile(offset) {
    var textStyle = {...styles.textStyle, color: (offset === 0 ? '#000' : styles.textStyle.color)};
    var textViewStyle = (offset === 0
                         ? {...styles.textViewStyle,
                            backgroundColor: '#fff',
                            borderRadius: 100,
                            shadowOffset: {width: 0, height: 2},
                            shadowColor: '#000',
                            shadowOpacity: 0.2}
                         : styles.textViewStyle);

    var newDate = new Date(this.state.date.getTime());
    newDate.setDate(newDate.getDate() + offset);

    return (
      <TouchableOpacity onPress={() => {
          shiftDate(this.state.date, offset);
          this.props.dateUpdated(this.state.date);
          this.setState(this.state)}} >

        <View style={textViewStyle}>
          <Text style={textStyle}>{getDayString(newDate)}</Text>
          <Text style={textStyle}>{newDate.getDate()}</Text>
        </View>

      </TouchableOpacity>
    )
  }

}

const shiftDate = (date, offset) => {console.log(date); date.setDate(date.getDate() + offset);}

const getDayString = date => {
  var dayNumber = date.getDay();

  var daysOfTheWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return daysOfTheWeek[dayNumber];
};

const styles = {
  viewStyle: {
    backgroundColor: '#00000020',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 40,
    elevation: 2
  },
  textViewStyle: {
    width: 42,
    height: 42,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  textStyle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: "#FFFFFF"
  }
};

export default DatePicker;
