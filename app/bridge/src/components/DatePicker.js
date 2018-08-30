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

        <TouchableOpacity onPress={() => {
          previousDay(this.state.date);
          this.props.dateUpdated(this.state.date);
          this.setState(this.state)}} >
          <Icon name='arrow-left'  size={26} color='#fff' style={{marginLeft: 14}}  />
        </TouchableOpacity>

        <Text style={styles.textStyle}>{formatDate(this.state.date)}</Text>

        <TouchableOpacity onPress={() => {
          nextDay(this.state.date);
          this.props.dateUpdated(this.state.date);
          this.setState(this.state)}} >
          <Icon name='arrow-right' size={26} color='#fff' style={{marginRight: 14}} />
        </TouchableOpacity>

      </View>
    );
  }
}

const nextDay     = date => {date.setDate(date.getDate() + 1);}
const previousDay = date => {date.setDate(date.getDate() - 1);}

const formatDate = date => {
  var day  = date.getDay();
  var dayNumber   = date.getDate();
  var monthNumber = date.getMonth();

  var daysOfTheWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return daysOfTheWeek[day] + ' ' + dayNumber + ' ' + months[monthNumber];
};

const styles = {
  viewStyle: {
    backgroundColor: '#00000020',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 35,
    elevation: 2
  },
  textStyle: {
    fontSize: 16,
    color: "#FFFFFF"
  }
};

export default DatePicker;
