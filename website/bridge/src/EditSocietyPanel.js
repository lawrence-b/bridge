import React, { Component } from 'react';
import './EditSocietyPanel.css';

import Button from './Button.js';
import Ionicon from 'react-ionicons';
import CategoryDropdownMenu from './CategoryDropdownMenu.js';
import sendRequest from './sendRequest.js';

class EditSocietyPanel extends Component {

  constructor(props) {
    super(props);

    if (this.props.creating) {
      this.state = {newHost: {name: '', category_id: 1, open_to_id: 1, description: ''}};
    }
    else {
      this.state = {newHost: {name: this.props.host.name, category_id: this.props.host.category.id, open_to_id: this.props.host.open_to.id, description: this.props.host.description}};
    }
  }

  render() {
    return (
      <div className="EditSocietyPanel">
        <label className="EditSocietyPanel-title-text">{this.props.creating ? "Create a host" : "Edit your host"}</label>
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <div className="EditSocietyPanel-new-host-row">
              <label className="EditSocietyPanel-new-host-label">Name: </label>
              <input type="text" onChange={(e) => {this.state.newHost.name = e.target.value; this.setState(this.state);}}
                     className="EditSocietyPanel-text-field" value={this.state.newHost.name} />
            </div>

            <div className="EditSocietyPanel-new-host-row">
              <label className="EditSocietyPanel-new-host-label">Category: </label>
              <CategoryDropdownMenu categoryTypeString="host-categories" user={this.props.user} initialCategory={this.props.creating ? null : this.props.host.category} onCategoryChanged={(category) => this.onHostCategoryChanged(category)} />
            </div>

            <div className="EditSocietyPanel-new-host-row">
              <label className="EditSocietyPanel-new-host-label">Open to: </label>
              <CategoryDropdownMenu categoryTypeString="user-categories" user={this.props.user} initialCategory={this.props.creating ? null : this.props.host.open_to} onCategoryChanged={(category) => this.onUserCategoryChanged(category)} />
            </div>

            <div className="EditSocietyPanel-new-host-row">
              <label className="EditSocietyPanel-new-host-label">Description: </label>
              <textarea type="text" onChange={(e) => {this.state.newHost.description = e.target.value; this.setState(this.state);}}
                        className="EditSocietyPanel-text-field" value={this.state.newHost.description} style={{maxWidth: 330}} />
            </div>

            <Button positive={true} text={this.props.creating ? "Create" : "Submit"} onClick={() => this.props.creating ? this.createHost() : this.editHost()}
              style={{marginTop: 30, marginLeft: 0}} />
        </div>
      </div>
    );
  }

  onHostCategoryChanged(category) {
    this.state.newHost.category_id = category.id;
  }

  onUserCategoryChanged(category) {
    this.state.newHost.open_to_id = category.id;
  }

  createHost() {
    console.log(this.state.newHost);

    sendRequest({
      address: "users/me/",
      method: "GET",
      authorizationToken: this.props.user.token,
      successHandler: (result) => {
        sendRequest({
          address: "hosts/",
          method: "POST",
          authorizationToken: this.props.user.token,
          body: {...this.state.newHost, admins_id: [result.id]},
          responseHandlerNoJson: (response) => {
            this.setState({newHost: {name: '', category_id: 1, open_to_id: 1, description: ''}});
            this.props.onCreate();
          },
        });
      }
    })
  }

  editHost() {
    console.log(this.state.newHost);
    sendRequest({
      address: "hosts/" + this.props.host.id + "/",
      method: "PATCH",
      authorizationToken: this.props.user.token,
      body: {
        name: this.state.newHost.name,
        category_id: this.state.newHost.category_id,
        open_to_id: this.state.newHost.open_to_id,
        description: this.state.newHost.description},
      responseHandlerNoJson: (response) => {this.props.onEdit();},
    });
  }
}

export default EditSocietyPanel;
