import React, { Component } from 'react';
import { Text, View, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import ModalDropdown from 'react-native-modal-dropdown';

import sendRequest from '../sendRequest.js';

class SignUpScreen extends Component {

  constructor(props) {
    super(props);

    this.state = {
      currentScreenNumber: 1,
      firstName: '',
      lastName: '',
      currentUserCategory: null,
      currentStudentCategory: '',
      currentMatriculationYear: '',
      currentSubject: '',
      emailAddress: '',
      password: '',
      confirmPassword: '',
      errorMessage: '',
      userCategories: []
    };

    sendRequest({
      address: 'user-categories/',
      method: 'GET',
      successHandler: (result) => {
        this.setState({...this.state, userCategories: result});
      }
    });
  }

  render() {
    if (this.state.currentScreenNumber === 1) {
      return this.generateSignupScreen1();
    }
    else if (this.state.currentScreenNumber === 2) {
      return this.generateSignupScreen2();
    }
    else if (this.state.currentScreenNumber === 3) {
      return this.generateAfterSignupScreen();
    }

    return null;
  }

  generateSignupScreen1() {
    return (
      <KeyboardAvoidingView style={styles.viewStyle} behavior={Platform.OS === "ios" ? "padding" : undefined} enabled>
        <View style={styles.panelViewStyle}>
          <Text style={styles.titleStyle}>Sign Up</Text>

          <TextInput style={styles.textFieldStyle} placeholder='Email' autoCapitalize='none' underlineColorAndroid="transparent"
          onChangeText={(text) => this.setState({...this.state, emailAddress: text})}
          autoCorrect={false}
          value={this.state.emailAddress} />

          <TextInput style={styles.textFieldStyle} placeholder='Password' autoCapitalize='none' secureTextEntry={true} underlineColorAndroid="transparent"
          onChangeText={(text) => this.setState({...this.state, password: text})}
          value={this.state.password} />
          <TextInput style={{...styles.textFieldStyle, marginTop: 0}} placeholder='Confirm password' autoCapitalize='none' secureTextEntry={true} underlineColorAndroid="transparent"
          onChangeText={(text) => this.setState({...this.state, confirmPassword: text})}
          value={this.state.confirmPassword} />

          <Text style={{color: '#E00', marginTop: 20}}>{this.state.errorMessage}</Text>

          <View style={styles.buttonsViewStyle}>
            <TouchableOpacity style={styles.cancelButtonStyle}  onPress={() => this.props.navigation.goBack()}>
              <Text style={styles.buttonTextStyle}>Back</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.nextButtonStyle} onPress={() => this.goToPersonalDetailsScreen()}>
              <Text style={styles.buttonTextStyle}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }

  generateSignupScreen2() {
    return (
      <KeyboardAvoidingView style={styles.viewStyle} behavior={Platform.OS === "ios" ? "padding" : undefined} enabled>
        <View style={styles.panelViewStyle}>
          <Text style={styles.titleStyle}>Sign Up</Text>

          <TextInput style={styles.textFieldStyle} placeholder='First Name' secureTextEntry={false} underlineColorAndroid="transparent"
          onChangeText={(text) => this.setState({...this.state, firstName: text})}
          autoCorrect={false}
          value={this.state.firstName} />

          <TextInput style={{...styles.textFieldStyle, marginTop: 0, marginBottom: 20}} placeholder='Last Name' secureTextEntry={false} underlineColorAndroid="transparent"
          onChangeText={(text) => this.setState({...this.state, lastName: text})}
          autoCorrect={false}
          value={this.state.lastName} />

          <UserCategoryPicker categories={this.state.userCategories}
            onUserCategoryChanged={(category) => this.setState({...this.state, currentUserCategory: category, currentStudentCategory: '', currentMatriculationYear: '', currentSubject: ''})} />

          {this.state.currentUserCategory !== null
           ? <StudentTypeDropdown onStudentTypeChanged={(category) => this.setState({...this.state, currentStudentCategory: category, currentMatriculationYear: '', currentSubject: ''})} />
           : null}

          {this.state.currentStudentCategory === 'Undergraduate'
           ? <SubjectDropdown onSubjectChanged={(subject) => this.setState({...this.state, currentSubject: subject})} />
           : null}

          {this.state.currentStudentCategory === 'Undergraduate'
           ? <MatriculationYearDropdown onMatriculationYearChanged={(year) => this.setState({...this.state, currentMatriculationYear: year})} />
           : null}

          <Text style={{color: '#E00', marginTop: 20}}>{this.state.errorMessage}</Text>

          <View style={styles.buttonsViewStyle}>
            <TouchableOpacity style={styles.cancelButtonStyle}  onPress={() => this.goToStartScreen('')}>
              <Text style={styles.buttonTextStyle}>Back</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.nextButtonStyle} onPress={() => this.signUp()}>
              <Text style={styles.buttonTextStyle}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }

  generateAfterSignupScreen() {
    return (
      <View style={styles.viewStyle}>
        <View style={{...styles.panelViewStyle, alignSelf: 'stretch', marginLeft: 40, marginRight: 40}}>
          <Text style={styles.titleStyle}>All done!</Text>

          <Text style={{marginBottom:  8, textAlign: 'center'}}>We have sent an email to:</Text>
          <Text style={{marginBottom: 30, textAlign: 'center', fontWeight: 'bold'}}>{this.state.emailAddress}</Text>
          <Text style={{marginBottom: 40, textAlign: 'center'}}>Follow the instructions to activate your account.</Text>

          <TouchableOpacity style={styles.nextButtonStyle} onPress={() => this.props.navigation.goBack()}>
            <Text style={styles.buttonTextStyle}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  goToStartScreen(errorMessage) {
    this.setState({...this.state,
      currentScreenNumber: 1,
      errorMessage: errorMessage,
      currentUserCategory: null,
      currentStudentCategory: '',
      currentSubject: '',
      currentMatriculationYear: ''
    });
  }

  goToPersonalDetailsScreen() {
    if (this.state.emailAddress.length <= 0 || this.state.password.length <= 0 || this.state.confirmPassword.length <= 0) {
      this.setState({...this.state, errorMessage: 'Details not entered'});
      return;
    }
    else if (this.state.password !== this.state.confirmPassword) {
      this.setState({...this.state, errorMessage: 'Passwords must match'});
      return;
    }

    this.setState({...this.state, currentScreenNumber: 2, errorMessage: ''});
  }

  signUp() {
    if (this.state.firstName.length <= 0 || this.state.lastName.length <= 0) {
      this.setState({...this.state, errorMessage: 'Details not entered'});
      return;
    }
    else if (this.state.userCategories.length <= 0) {
      this.setState({...this.state, errorMessage: 'Check your internet connection'});
      return;
    }
    else if (this.state.currentUserCategory === null) {
      this.setState({...this.state, errorMessage: 'Please select a college'});
      return;
    }

    var body = {
      email: this.state.emailAddress,
      password: this.state.password,
      user_category: this.state.currentUserCategory.id,
      first_name: this.state.firstName,
      last_name: this.state.lastName,
    };

    if (this.state.currentStudentCategory === '') {
      this.setState({...this.state, errorMessage: 'Please select an academic level'});
      return;
    }

    body.university_age_category = this.state.currentStudentCategory;

    if (this.state.currentStudentCategory === 'Undergraduate') {
      if (this.state.currentMatriculationYear === '') {
        this.setState({...this.state, errorMessage: 'Please select a matriculation year'});
        return;
      }
      if (this.state.currentSubject === '') {
        this.setState({...this.state, errorMessage: 'Please select a subject'});
        return;
      }

      body.matriculation_year = parseInt(this.state.currentMatriculationYear, 10);
      body.subject = this.state.currentSubject;
    }

    sendRequest({
      address: 'users/',
      method: 'POST',
      body: body,
      responseHandlerNoJson: (response) => {
        if (response.status < 400) {
          this.setState({...this.state, currentScreenNumber: 3});
        }
        else {
          response.json().then(
            (result) => {
              if (result.password !== undefined && result.password !== null && result.password.length > 0) {
                this.goToStartScreen('Password too weak: ' + result.password[0]);
              }
              else {
                this.goToStartScreen('Password too weak.');
              }
            },
            (error) => {
              this.goToStartScreen('Password too weak');
            }
          );
        }
      }
    });
  }

}

const universityOfCambridgeUserCategoryId = 2;

const flattenCategories = (inputCategories) => {
  var categories = [];

  inputCategories.forEach((category) => {
    categories.push({...category, displayName: category.name});
    category.children.forEach((subCategory) => {
      categories.push({...subCategory, displayName: '   ' + subCategory.name});
      subCategory.children.forEach((subSubCategory) => {
        categories.push({...subSubCategory, displayName: '      ' + subSubCategory.name});
      });
    });
  });

  return categories;
}

const UserCategoryPicker = (props) => {
  var categories = flattenCategories(props.categories);

  return (
    <ModalDropdown
      style={styles.pickerStyle}
      textStyle={styles.pickerTextStyle}
      defaultValue={'College...'}
      disabled={props.categories.length <= 0}
      options={categories}
      onSelect={(index, category) => props.onUserCategoryChanged(category)}
      renderRow={(option) => {
        return (
          <View style={{padding: 3, paddingLeft: 0}}>
            <Text style={styles.dropdownOptionTextStyle}>{option.displayName}</Text>
          </View>
        );
      }}
      renderButtonText={(option) => {
        return option.name;
      }} />
  );
}

const StudentTypeDropdown = (props) => {
  return (
    <ModalDropdown
      style={styles.pickerStyle}
      textStyle={styles.pickerTextStyle}
      defaultValue={'Academic level...'}
      options={['Undergraduate', 'Postgraduate', 'Faculty and staff']}
      onSelect={(index, type) => props.onStudentTypeChanged(type)}
      renderRow={(option) => {
        return (
          <View style={{padding: 3, paddingLeft: 0}}>
            <Text style={styles.dropdownOptionTextStyle}>{option}</Text>
          </View>
        );
      }}
      renderButtonText={(option) => {
        return option;
      }} />
  );
}

const MatriculationYearDropdown = (props) => {
  return (
    <ModalDropdown
      style={styles.pickerStyle}
      textStyle={styles.pickerTextStyle}
      defaultValue={'Matriculation year...'}
      options={["2015", "2016", "2017", "2018", "2019", "2020"]}
      onSelect={(index, year) => props.onMatriculationYearChanged(year)}
      renderRow={(option) => {
        return (
          <View style={{padding: 3, paddingLeft: 0}}>
            <Text style={styles.dropdownOptionTextStyle}>{option}</Text>
          </View>
        );
      }}
      renderButtonText={(option) => {
        return option;
      }} />
  );
}

const SubjectDropdown = (props) => {
  return (
    <ModalDropdown
      style={styles.pickerStyle}
      textStyle={styles.pickerTextStyle}
      defaultValue={'Subject...'}
      options={[
        "Anglo-Saxon, Norse, and Celtic",
        "Archaeology",
        "Architecture",
        "Asian and Middle Eastern Studies",
        "Chemical Engineering",
        "Classics",
        "Computer Science",
        "Economics",
        "Education",
        "Engineering",
        "English",
        "Geography",
        "History",
        "History and Modern Languages",
        "History and Politics",
        "History of Art",
        "Human, Social, and Political Sciences",
        "Land Economy",
        "Law",
        "Linguistics",
        "Management Studies",
        "Manufacturing Engineering",
        "Mathematics",
        "Medicine",
        "Modern and Medieval Languages",
        "Music",
        "Natural Sciences",
        "Philosophy",
        "Psychological and Behavioural Sciences",
        "Theology",
        "Veterinary Medicine",
    ]}
      onSelect={(index, subject) => props.onSubjectChanged(subject)}
      renderRow={(option) => {
        return (
          <View style={{padding: 3, paddingLeft: 0}}>
            <Text style={styles.dropdownOptionTextStyle}>{option}</Text>
          </View>
        );
      }}
      renderButtonText={(option) => {
        return option;
      }} />
  );
}

const styles = {
  viewStyle: {
    backgroundColor: '#F18B35',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  panelViewStyle: {
    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,

    marginHorizontal: 40
  },
  titleStyle: {
    color: '#666',
    fontSize: 26,
    fontWeight: '300',

    marginBottom: 30
  },
  textFieldStyle: {
    backgroundColor: '#fff',
    color: '#333',
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 13,
    paddingRight: 13,
    margin: 10,
    borderRadius: 18,
    borderColor: '#ccc',
    borderWidth: 1,

    width: 200
  },
  buttonsViewStyle: {
    flexDirection: 'row',
    marginTop: 20
  },
  nextButtonStyle: {
    backgroundColor: '#6c6',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 14,
    paddingRight: 14,
    borderRadius: 20,
    marginLeft: 10
  },
  cancelButtonStyle: {
    backgroundColor: '#f66',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 14,
    paddingRight: 14,
    borderRadius: 20,
    marginRight: 20
  },
  buttonTextStyle: {
    color: '#fff',
    fontSize: 16,
  },
  pickerStyle: {
    backgroundColor: '#fff',
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 13,
    paddingRight: 13,
    margin: 10,
    marginBottom: 0,
    borderRadius: 26,
    borderColor: '#ccc',
    borderWidth: 1,

    width: 200,
    justifyContent: 'flex-start',
  },
  pickerTextStyle: {
    color: '#333',
    fontSize: 14
  },
  dropdownOptionTextStyle: {
    fontSize: 16
  }
}

export default SignUpScreen;
