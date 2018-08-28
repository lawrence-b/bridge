import React, { Component } from 'react';
import './EditSocietyPanel.css';

import Button from './Button.js';
import Ionicon from 'react-ionicons';
import CategoryDropdownMenu from './CategoryDropdownMenu.js';
import sendRequest from './sendRequest.js';

class EditSocietyPanel extends Component {

  constructor(props) {
    super(props);

    this.imageFile = null;
    this.imageFilePreview = null;

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
               <label className="EditSocietyPanel-new-host-label">Image: </label>
               <div>
                 {this.getImageData() === null
                   ? null
                   : <img src={this.getImageData()}
                        width={100}
                        height={100}
                        style={{marginTop: 4, marginBottom: 10}} />}
               </div>
               <input type="file"
                 accept="image/png, image/jpeg"
                 onChange={(e) => this.fileChanged(e.target.files)} />
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

  getImageData() {
    if (this.imageFilePreview !== null && this.imageFilePreview !== undefined) {
      return this.imageFilePreview;
    }
    else if (this.props.host !== null && this.props.host !== undefined
          && this.props.host.image !== null && this.props.host.image !== undefined) {
      return this.props.host.image.medium_square_crop;
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

  onHostCategoryChanged(category) {
    this.state.newHost.category_id = category.id;
  }

  onUserCategoryChanged(category) {
    this.state.newHost.open_to_id = category.id;
  }

  createHost() {
    sendRequest({
      address: "users/me/",
      method: "GET",
      authorizationToken: this.props.user.token,
      successHandler: (result) => {
        var form = new FormData();
        form.append('name', this.state.newHost.name);
        form.append('category_id', this.state.newHost.category_id);
        form.append('open_to_id', this.state.newHost.open_to_id);
        form.append('description', this.state.newHost.description);
        form.append('admins_id', [result.id]);
        if (this.imageFile !== null) {
          form.append('image', this.imageFile);
        }

        sendRequest({
          address: "hosts/",
          method: "POST",
          authorizationToken: this.props.user.token,
          body: form,
          responseHandlerNoJson: (response) => {
            this.setState({newHost: {name: '', category_id: 1, open_to_id: 1, description: ''}});
            this.props.onCreate();
          },
        });
      }
    })
  }

  editHost() {
    var form = new FormData();
    form.append('name', this.state.newHost.name);
    form.append('category_id', this.state.newHost.category_id);
    form.append('open_to_id', this.state.newHost.open_to_id);
    form.append('description', this.state.newHost.description);
    if (this.imageFile !== null) {
      form.append('image', this.imageFile);
    }

    sendRequest({
      address: "hosts/" + this.props.host.id + "/",
      method: "PATCH",
      authorizationToken: this.props.user.token,
      body: form,
      responseHandlerNoJson: (response) => {this.props.onEdit();},
    });
  }
}

export default EditSocietyPanel;
