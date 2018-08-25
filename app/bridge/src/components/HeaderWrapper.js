import React from 'react';
import { Text, View } from 'react-native';

import { Header } from 'react-native-elements';

const HeaderWrapper = (props) => {
  const { textStyle, viewStyle } = styles;

  return (
    /*
    <View style={viewStyle}>
      <Text style={textStyle}>{props.headerText}</Text>
    </View>
    */

    <Header
      outerContainerStyles={viewStyle}
      centerComponent={{ text: props.text, style: textStyle }}
      rightComponent={{ icon: props.icon, color: '#fff' }}
    />

  );
};

const HeaderStyles = {
  viewStyle: {
    backgroundColor: '#F18B35',
    paddingTop: 25,
    paddingBottom: 7,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.11,
    elevation: 2,
    position: 'relative',
    borderBottomWidth: 0
  },
  textStyle: {
    fontSize: 18,
    color: "#FFFFFF",
    fontFamily: 'avenir'
  }
};

export default HeaderStyles;
