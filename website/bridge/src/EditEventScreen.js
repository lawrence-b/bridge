import React, { Component } from 'react';
import Ionicon from 'react-ionicons';
import DateTimePicker from 'react-datetime-picker';
import './EditEventScreen.css';

import Button from './Button.js';
import sendRequest from './sendRequest.js';
import CategoryDropdownMenu from './CategoryDropdownMenu.js';

class EditEventScreen extends Component {

  constructor(props) {
    super(props);

    this.imageFile = null;
    this.imageFilePreview = null;

    if (this.props.creating) {
      this.state = {event: {title: '', hosts_id: [this.props.host.id], category_id: 1, open_to_id: 1, location: '', start_time: null, end_time: null, description: ''}};
    }
    else {
      this.state = {event: this.props.event};
      this.state.event.start_time = null;
      this.state.event.end_time = null;

      sendRequest({
        address: "events/" + this.state.event.id + "/",
        method: "GET",
        authorizationToken: this.props.user.token,
        successHandler: (result) => {
          result.start_time = new Date(result.start_time);
          result.end_time   = new Date(result.end_time);
          this.setState({event: result});
        },
      });
    }
  }

  render() {
    var bonusButtonStyle = {
      marginTop: 30,
      marginBottom: 5,
      marginLeft: 15,
      marginRight: 15
    };

    return (
      <div className="EditEventScreen">
        <div className="EditEventScreen-top-bar">
          <label className="EditEventScreen-header">{this.props.creating ? 'Create' : 'Edit'} Event</label>
        </div>

        <div className="EditEventScreen-main">
          <div className="EditEventScreen-row">
            <label className="EditEventScreen-label">Title: </label>
            <input type="text" placeholder="Title" onChange={(e) => {this.state.event.title = e.target.value; this.setState(this.state);}} className="EditEventScreen-text-field" value={this.state.event.title} />
          </div>

          <div className="EditEventScreen-row">
            <label className="EditEventScreen-label">Location: </label>
            <input type="text" placeholder="Location" onChange={(e) => {this.state.event.location = e.target.value; this.setState(this.state);}} className="EditEventScreen-text-field" value={this.state.event.location} />
          </div>

          <div className="EditEventScreen-row">
            <label className="EditEventScreen-label">Start time: </label>
            <DateTimePicker className="EditEventScreen-text-field" onChange={(date) => {this.state.event.start_time = date; this.setState(this.state)}} value={this.state.event.start_time} />
          </div>

          <div className="EditEventScreen-row">
            <label className="EditEventScreen-label">End time: </label>
            <DateTimePicker className="EditEventScreen-text-field" onChange={(date) => {this.state.event.end_time = date; this.setState(this.state)}} value={this.state.event.end_time} />
          </div>

          <div className="EditEventScreen-row">
             <label className="EditEventScreen-label">Category: </label>
             <CategoryDropdownMenu categoryTypeString="event-categories" user={this.props.user} initialCategory={this.props.creating ? null : this.state.event.category} onCategoryChanged={(category) => this.onEventCategoryChanged(category)} />
          </div>

          <div className="EditEventScreen-row">
             <label className="EditEventScreen-label">Open to: </label>
             <CategoryDropdownMenu categoryTypeString="user-categories" user={this.props.user} initialCategory={this.props.creating ? null : this.state.event.open_to} onCategoryChanged={(category) => this.onUserCategoryChanged(category)} />
          </div>

          <div className="EditEventScreen-row">
             <label className="EditEventScreen-label">Image: </label>
             <div style={this.getImageData() === null ? {} : {marginLeft: 40}}>
               {this.getImageData() === null
                 ? null
                 : <img src={this.getImageData()}
                      width={100}
                      height={100}
                      style={{marginRight: 20, objectFit: 'cover'}} />}
             </div>
             <input type="file"
               accept="image/png, image/jpeg"
               onChange={(e) => this.fileChanged(e.target.files)} />
          </div>

          <div className="EditEventScreen-row">
            <label className="EditEventScreen-label">Description: </label>
            <textarea placeholder="Description" onChange={(e) => {this.state.event.description = e.target.value; this.setState(this.state);}} className="EditEventScreen-text-field" value={this.state.event.description} />
          </div>

          <label style={{alignSelf: 'center', alignText: 'center', color: '#d55'}}>{this.state.warningMessage}</label>

          <div className="EditEventScreen-buttons">
            <Button positive={false} text="Cancel" onClick={() => this.props.onExit()} style={bonusButtonStyle} />

            <Button positive={true} text="Submit" onClick={() => this.props.creating ? this.newEvent() : this.updateEvent()} style={bonusButtonStyle} />
          </div>
        </div>
      </div>
    );
  }

  getImageData() {
    if (this.imageFilePreview !== null && this.imageFilePreview !== undefined) {
      return this.imageFilePreview;
    }
    else if (this.state.event.image !== null && this.state.event.image !== undefined) {
      return this.state.event.image;
    }
    else if (this.props.host.image !== null && this.props.host.image !== null) {
      return this.props.host.image;
    }

    return null;
  }

  fileChanged(files) {
    if (files === null || files === undefined) {
      return;
    }
    if (files.length <= 0) {
      return;
    }

    this.imageFile = files[0];

    if (FileReader) {
      var fr = new FileReader();
      fr.onload = () =>  {
          this.imageFilePreview = fr.result;
          this.setState(this.state);
      }
      fr.readAsDataURL(this.imageFile);
    }
  }

  onEventCategoryChanged(category) {
    if (this.props.creating) {
      this.state.event.category_id = category.id;
    }
    else {
      this.state.event.category = category;
    }
  }

  onUserCategoryChanged(category) {
    if (this.props.creating) {
      this.state.event.open_to_id = category.id;
    }
    else {
      this.state.event.open_to = category;
    }
  }

  checkIfEventValid() {
    if (this.state.event.title.length <= 0) {
      this.setState({...this.state, warningMessage: "Event needs a title"});
      return false;
    }
    else if (this.state.event.start_time === null) {
      this.setState({...this.state, warningMessage: "Event needs a start time"});
      return false;
    }
    else if (this.state.event.end_time === null) {
      this.setState({...this.state, warningMessage: "Event needs an end time"});
      return false;
    }
    else if (this.state.event.start_time >= this.state.event.end_time) {
      this.setState({...this.state, warningMessage: "End time must be after start time"});
      return false;
    }
    else if (this.state.event.end_time <= (new Date())) {
      this.setState({...this.state, warningMessage: "End time must be in the future"});
      return false;
    }

    return true;
  }

  newEvent() {
    if (!this.checkIfEventValid()) {
      return;
    }

    var form = new FormData();
    form.append('title', this.state.event.title);
    form.append('hosts_id', this.state.event.hosts_id);
    form.append('category_id', this.state.event.category_id);
    form.append('open_to_id', this.state.event.open_to_id);
    if (this.state.event.start_time !== null && this.state.event.start_time !== undefined) {
      form.append('start_time', this.state.event.start_time.toISOString());
    }
    if (this.state.event.end_time !== null && this.state.event.end_time !== undefined) {
      form.append('end_time', this.state.event.end_time.toISOString());
    }
    form.append('location', this.state.event.location);
    form.append('description', this.state.event.description);
    if (this.imageFile !== null) {
      form.append('image', this.imageFile);
    }

    sendRequest({
      address: "events/",
      method: "POST",
      authorizationToken: this.props.user.token,
      body: form,
      successHandler: (result) => this.props.onExit(),
      failureHandler: () => this.props.onExit(),
      errorHandler: (error) => this.props.onExit()
    });
  }

  updateEvent() {
    if (!this.checkIfEventValid()) {
      return;
    }

    var form = new FormData();
    form.append('title', this.state.event.title);
    form.append('category_id', this.state.event.category.id);
    form.append('open_to_id', this.state.event.open_to.id);
    if (this.state.event.start_time !== null && this.state.event.start_time !== undefined) {
      form.append('start_time', this.state.event.start_time.toISOString());
    }
    if (this.state.event.end_time !== null && this.state.event.end_time !== undefined) {
      form.append('end_time', this.state.event.end_time.toISOString());
    }
    form.append('location', this.state.event.location);
    form.append('description', this.state.event.description);
    if (this.imageFile !== null) {
      form.append('image', this.imageFile);
    }

    sendRequest({
      address: "events/" + this.state.event.id + "/",
      method: "PATCH",
      authorizationToken: this.props.user.token,
      body: form,
      successHandler: (result) => this.props.onExit(),
      failureHandler: () => this.props.onExit(),
      errorHandler: (error) => this.props.onExit()
    });
  }

}

export default EditEventScreen;
