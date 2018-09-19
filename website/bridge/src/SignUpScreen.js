import React, { Component } from 'react';
import Ionicon from 'react-ionicons';
import './LoginOrSignUpScreen.css';
import './CategoryDropdownMenu.css';

import sendRequest from './sendRequest.js';
import CategoryDropdownMenu from './CategoryDropdownMenu.js';

class SignUpScreen extends Component {

  constructor(props) {
    super(props);

    this.state = {
      currentScreenNumber: 1,
      firstName: '',
      lastName: '',
      currentUserCategory: {id: 1, name: 'Public', children: []},
      currentStudentCategory: defaultStudentCategory,
      currentMatriculationYear: defaultMatriculationYear,
      currentSubject: defaultSubject,
      emailAddress: '',
      password: '',
      confirmPassword: '',
      errorMessage: ''
    };
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
      <div className="LoginOrSignUpScreen">
        <div className="LoginOrSignUpScreen-input-pane" onKeyPress={(e) => e.key === 'Enter' ? this.goToPersonalDetailsScreen() : null}>
          <label className="LoginOrSignUpScreen-input-pane-title">Sign Up</label>

          <input type="text" className="LoginOrSignUpScreen-input-pane-text-field" placeholder="Email"
            onChange={(textField) => this.setState({...this.state, emailAddress: textField.target.value})}
            value={this.state.emailAddress} />

          <input type="password" className="LoginOrSignUpScreen-input-pane-text-field" placeholder="Password"
            onChange={(textField) => this.setState({...this.state, password: textField.target.value})}
            value={this.state.password}
            style={{marginTop: 15}} />

          <input type="password" className="LoginOrSignUpScreen-input-pane-text-field" placeholder="Confirm Password"
            onChange={(textField) => this.setState({...this.state, confirmPassword: textField.target.value})}
            value={this.state.confirmPassword} />

          <label className="LoginOrSignUpScreen-input-pane-label" style={{color: '#E00'}}>{this.state.errorMessage}</label>

          <button className="LoginOrSignUpScreen-button"
            onClick={() => this.goToPersonalDetailsScreen()}>
            <span className="LoginOrSignUpScreen-button-span" style={{backgroundColor: '#157efb', width: 140, marginTop: 30}}>
              Next
            </span>
          </button>

          <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
            <label className="LoginOrSignUpScreen-input-pane-label">Already have an account?</label>
            <label className="LoginOrSignUpScreen-input-pane-label"
                   style={{fontSize: 12, color: '#E00', cursor: 'pointer', marginLeft: 10}}
                   onClick={() => this.props.displayLoginScreen()}>
              LOG IN
            </label>
          </div>
        </div>
      </div>
    );
  }

  generateSignupScreen2() {
    return (
      <div className="LoginOrSignUpScreen">
        <div className="LoginOrSignUpScreen-input-pane" onKeyPress={(e) => e.key === 'Enter' ? this.signUp() : null}>
          <label className="LoginOrSignUpScreen-input-pane-title">More about you</label>

          <input type="text" className="LoginOrSignUpScreen-input-pane-text-field" placeholder="First Name"
            onChange={(textField) => this.setState({...this.state, firstName: textField.target.value})}
            value={this.state.firstName} />
          <input type="text" className="LoginOrSignUpScreen-input-pane-text-field" placeholder="Last Name"
            onChange={(textField) => this.setState({...this.state, lastName: textField.target.value})}
            value={this.state.lastName}
            style={{marginBottom: 26}} />

          <CategoryDropdownMenu categoryTypeString="user-categories"
            bonusDivStyle={{width: 254, borderRadius: 20}}
            bonusSelectTagStyle={{fontSize: 12, height: 30}}
            onCategoryChanged={(category) => this.onUserCategoryChanged(category)} />

          {this.state.currentUserCategory !== null && this.state.currentUserCategory.id !== 1
            ? <StudentTypeDropdown
                userCategory={this.state.currentUserCategory}
                categoryChanged={(category) => this.onStudentCategoryChanged(category)} />
            : null}

          {this.state.currentStudentCategory === 'Undergraduate'
          && this.state.currentUserCategory !== null && this.state.currentUserCategory.id !== 1
            ? <MatriculationYearDropdown
                userCategory={this.state.currentUserCategory}
                yearChanged={(year) => this.onMatriculationYearChanged(year)} />
            : null}

          {this.state.currentStudentCategory === 'Undergraduate'
          && this.state.currentUserCategory !== null && this.state.currentUserCategory.id !== 1
            ? <SubjectDropdown
                userCategory={this.state.currentUserCategory}
                subjectChanged={(subject) => this.onSubjectChanged(subject)} />
            : null}

          <label className="LoginOrSignUpScreen-input-pane-label" style={{color: '#E00', marginTop: 30}}>
            {this.state.errorMessage}
          </label>

          <button className="LoginOrSignUpScreen-button"
            onClick={() => this.signUp()}>
            <span className="LoginOrSignUpScreen-button-span" style={{backgroundColor: '#157efb', width: 140, marginTop: 30}}>
              Next
            </span>
          </button>

          <label className="LoginOrSignUpScreen-input-pane-label"
                 style={{fontSize: 12, color: '#157efb', cursor: 'pointer'}}
                 onClick={() => this.setState({...this.state, currentScreenNumber: 1, errorMessage: ''})}>
            BACK
          </label>
        </div>
      </div>
    );
  }

  generateAfterSignupScreen() {
    return (
      <div className="LoginOrSignUpScreen">
        <div className="LoginOrSignUpScreen-input-pane">
          <label className="LoginOrSignUpScreen-input-pane-title">Almost there...</label>

          <div style={{display: 'flex', flexDirection: 'row'}}>
            <label>{"We've sent you an email on: "}</label>
            <label style={{fontWeight: 'bold', marginLeft: 5}}>{this.state.emailAddress}</label>
          </div>

          <p>Click the link in the email to confirm your account.</p>
          <p>You can close this page now.</p>

        </div>
      </div>
    );
  }

  onUserCategoryChanged(category) {
    this.setState({...this.state,
      currentUserCategory: category,
      currentStudentCategory: category.id === 1 ? defaultStudentCategory : this.state.currentStudentCategory,
      currentMatriculationYear: category.id === 1 ? defaultMatriculationYear : this.state.currentMatriculationYear,
      currentSubject: category.id === 1 ? defaultSubject : this.state.currentSubject
    });
  }

  onStudentCategoryChanged(category) {
    this.setState({...this.state,
      currentStudentCategory: category,
      currentMatriculationYear: defaultMatriculationYear,
      currentSubject: defaultSubject
    });
  }

  onMatriculationYearChanged(year) {
    this.setState({...this.state, currentMatriculationYear: year});
  }

  onSubjectChanged(subject) {
    this.setState({...this.state, currentSubject: subject});
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

    var body = {
      email: this.state.emailAddress,
      password: this.state.password,
      user_category: this.state.currentUserCategory.id,
      first_name: this.state.firstName,
      last_name: this.state.lastName,
    };

    if (this.state.currentUserCategory.id !== 1) {
      body.university_age_category = this.state.currentStudentCategory;

      if (this.state.currentStudentCategory === 'Undergraduate') {
        body.matriculation_year = parseInt(this.state.currentMatriculationYear, 10);;
        body.subject = this.state.currentSubject;
      }
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
                this.setState({...this.state, currentScreenNumber: 1, errorMessage: 'Password too weak: ' + result.password[0]});
              }
              else {
                this.setState({...this.state, currentScreenNumber: 1, errorMessage: 'Password too weak'});
              }
            },
            (error) => {
              this.setState({...this.state, currentScreenNumber: 1, errorMessage: 'Password too weak'});
            }
          );
        }
      }
    });
  }

}

const universityOfCambridgeUserCategoryId = 2;

const defaultStudentCategory = 'Undergraduate';
const defaultMatriculationYear = '2015';
const defaultSubject = 'Anglo-Saxon, Norse, and Celtic';

const StudentTypeDropdown = (props) => {
  return (
    <div className="CategoryDropdownMenu-select-div" style={{width: 254, borderRadius: 20, marginTop: 10}}>
      <select className="CategoryDropdownMenu-select-tag" style={{fontSize: 12, height: 30}}
        onChange={(e) => props.categoryChanged(e.target.value)}>
        {['Undergraduate', 'Postgraduate', 'Faculty and staff'].map((category, index) => (
          (props.userCategory.id === universityOfCambridgeUserCategoryId
            ? <option key={index} value={category}>{category}</option>
            : <option key={index} value={category}>&nbsp;&nbsp;{category}</option>)
        ))}
      </select>
      <Ionicon icon="md-arrow-dropdown" fontSize="22px" color="#aaa" style={{marginRight: 5}} />
    </div>
  );
}

const MatriculationYearDropdown = (props) => {
  return (
    <div className="CategoryDropdownMenu-select-div" style={{width: 254, borderRadius: 20, marginTop: 20}}>
      <select className="CategoryDropdownMenu-select-tag" style={{fontSize: 12, height: 30}}
        onChange={(e) => props.yearChanged(e.target.value)}>
        {["2015", "2016", "2017", "2018", "2019", "2020"].map((category, index) => (
          (props.userCategory.id === universityOfCambridgeUserCategoryId
            ? <option key={index} value={category}>{category}</option>
            : <option key={index} value={category}>&nbsp;&nbsp;{category}</option>)
        ))}
      </select>
      <Ionicon icon="md-arrow-dropdown" fontSize="22px" color="#aaa" style={{marginRight: 5}} />
    </div>
  );
}

const SubjectDropdown = (props) => {
  return (
    <div className="CategoryDropdownMenu-select-div" style={{width: 254, borderRadius: 20, marginTop: 10}}>
      <select className="CategoryDropdownMenu-select-tag" style={{fontSize: 12, height: 30}}
        onChange={(e) => props.subjectChanged(e.target.value)}>
        {[
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
      ].map((category, index) => (
          (props.userCategory.id === universityOfCambridgeUserCategoryId
            ? <option key={index} value={category}>{category}</option>
            : <option key={index} value={category}>&nbsp;&nbsp;{category}</option>)
        ))}
      </select>
      <Ionicon icon="md-arrow-dropdown" fontSize="22px" color="#aaa" style={{marginRight: 5}} />
    </div>
  );
}

export default SignUpScreen;
